import React from "react";
import { trackEvent } from "../content/analytics";
import { landingPageContent } from "../content/landingPage";
import styles from "./FinalCtaSection.module.css";

/**
 * The final call to action.
 *
 * The primary destination is the document lab, so this is an anchor to `/lab`
 * rather than a button that opens a calendar. The secondary action is an
 * in-page anchor and is unchanged.
 */
export const FinalCtaSection = (): React.JSX.Element => {
  const content = landingPageContent.finalCta;

  const handlePrimaryClick = () => {
    trackEvent("demo_cta_clicked", "final_cta_primary", content.primaryCta);
  };

  const handleSecondaryClick = () => {
    trackEvent("workflow_viewed", "final_cta_secondary", content.secondaryCta);
  };

  return (
    <section id="cta" className={styles.ctaSection} aria-labelledby="cta-title">
      <div className={styles.documentContainer}>
        <div className={styles.content}>
          <span className={styles.kicker}>See it on your case flow</span>
          <h2 id="cta-title" className={styles.title}>
            {content.headline}
          </h2>
          <p className={styles.subline}>{content.body}</p>

          <div className={styles.actionRow}>
            <a
              className={`btn btn-primary ${styles.primaryButton}`}
              href={content.primaryHref}
              onClick={handlePrimaryClick}
            >
              {content.primaryCta}
            </a>
          </div>

          <a
            className={styles.secondaryLink}
            href={content.secondaryHref}
            onClick={handleSecondaryClick}
          >
            {content.secondaryCta}
          </a>

          <p className={styles.microCopy}>{content.micro}</p>
        </div>
      </div>
    </section>
  );
};
