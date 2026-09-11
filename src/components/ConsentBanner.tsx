import React, {
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { landingPageContent } from "../content/landingPage";
import {
  CONSENT_OPEN_EVENT,
  CONSENT_UNKNOWN,
  getConsent,
  getConsentSignature,
  setConsent,
  subscribeConsent,
} from "../consent";
import styles from "./ConsentBanner.module.css";

/**
 * First-party GDPR consent banner.
 *
 * Gating of Google Tag Manager and Analytics lives in index.html, not here.
 * This component only collects and stores the visitor's choice.
 *
 * The stored choice is read through useSyncExternalStore, whose server snapshot
 * is CONSENT_UNKNOWN. That keeps the prerendered HTML free of the banner and
 * makes hydration safe, then the banner appears after mount when no choice is
 * stored yet.
 */
export const ConsentBanner = (): React.JSX.Element | null => {
  const copy = landingPageContent.consent;
  const signature = useSyncExternalStore(
    subscribeConsent,
    getConsentSignature,
    () => CONSENT_UNKNOWN,
  );
  const [opened, setOpened] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const bannerRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  const hasDecision = signature !== null && signature !== CONSENT_UNKNOWN;
  // Show on first visit, or when the visitor reopens it from the footer.
  const visible = opened || signature === null;

  // The footer "Cookie settings" control reopens the banner in detail view.
  useEffect(() => {
    const handleOpen = () => {
      const stored = getConsent();
      setAnalytics(stored ? stored.analytics : false);
      setMarketing(stored ? stored.marketing : false);
      setShowDetails(true);
      setOpened(true);
    };
    window.addEventListener(CONSENT_OPEN_EVENT, handleOpen);
    return () => window.removeEventListener(CONSENT_OPEN_EVENT, handleOpen);
  }, []);

  // Only move focus once a choice exists. On a first visit the banner should
  // not steal focus from the page.
  useEffect(() => {
    if (visible && hasDecision) bannerRef.current?.focus();
  }, [visible, hasDecision]);

  // Escape dismisses the banner, but only after a choice exists. A first-time
  // visitor has to accept or reject.
  useEffect(() => {
    if (!visible) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && hasDecision) setOpened(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [visible, hasDecision]);

  const handleAcceptAll = () => {
    setConsent({ analytics: true, marketing: true });
    setOpened(false);
  };

  const handleRejectAll = () => {
    setConsent({ analytics: false, marketing: false });
    setOpened(false);
  };

  const handleSavePreferences = () => {
    setConsent({ analytics, marketing });
    setOpened(false);
  };

  if (!visible) return null;

  return (
    <div className={styles.wrap}>
      <div
        ref={bannerRef}
        className={styles.banner}
        role="dialog"
        aria-labelledby={titleId}
        tabIndex={-1}
      >
        <div className={styles.top}>
          <span className={styles.label}>{copy.label}</span>
          <h2 id={titleId} className={styles.title}>
            {copy.title}
          </h2>
        </div>

        <p className={styles.body}>{copy.body}</p>

        {showDetails && (
          <div className={styles.details}>
            <div className={styles.row}>
              <div className={styles.rowText}>
                <span className={styles.rowTitle}>
                  {copy.categories.necessary.title}
                </span>
                <p className={styles.rowDesc}>
                  {copy.categories.necessary.description}
                </p>
              </div>
              <span className={styles.switch}>
                <input type="checkbox" checked disabled aria-hidden="true" />
                <span className={styles.track} />
              </span>
            </div>

            <div className={styles.row}>
              <div className={styles.rowText}>
                <label className={styles.rowTitle} htmlFor="consent-analytics">
                  {copy.categories.analytics.title}
                </label>
                <p className={styles.rowDesc}>
                  {copy.categories.analytics.description}
                </p>
              </div>
              <span className={styles.switch}>
                <input
                  id="consent-analytics"
                  type="checkbox"
                  checked={analytics}
                  onChange={(event) => setAnalytics(event.target.checked)}
                />
                <span className={styles.track} />
              </span>
            </div>

            <div className={styles.row}>
              <div className={styles.rowText}>
                <label className={styles.rowTitle} htmlFor="consent-marketing">
                  {copy.categories.marketing.title}
                </label>
                <p className={styles.rowDesc}>
                  {copy.categories.marketing.description}
                </p>
              </div>
              <span className={styles.switch}>
                <input
                  id="consent-marketing"
                  type="checkbox"
                  checked={marketing}
                  onChange={(event) => setMarketing(event.target.checked)}
                />
                <span className={styles.track} />
              </span>
            </div>
          </div>
        )}

        <div className={styles.actions}>
          <button
            type="button"
            className={`btn btn-outline ${styles.actionButton}`}
            onClick={handleRejectAll}
          >
            {copy.rejectAll}
          </button>
          {showDetails ? (
            <button
              type="button"
              className={`btn btn-primary ${styles.actionButton}`}
              onClick={handleSavePreferences}
            >
              {copy.save}
            </button>
          ) : (
            <button
              type="button"
              className={`btn btn-outline ${styles.actionButton}`}
              onClick={() => setShowDetails(true)}
            >
              {copy.manage}
            </button>
          )}
          <button
            type="button"
            className={`btn btn-primary ${styles.actionButton}`}
            onClick={handleAcceptAll}
          >
            {copy.acceptAll}
          </button>
        </div>

        <p className={styles.policy}>
          <a href={copy.policyHref}>{copy.policyLabel}</a>
        </p>
      </div>
    </div>
  );
};
