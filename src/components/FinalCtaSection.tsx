import React from "react";
import { trackEvent } from "../content/analytics";
import { DEMO_URL, landingPageContent } from "../content/landingPage";
import styles from "./FinalCtaSection.module.css";

interface FinalCtaSectionProps {
  onCtaClick?: () => void;
}

export const FinalCtaSection = ({
  onCtaClick,
}: FinalCtaSectionProps): React.JSX.Element => {
  const content = landingPageContent.finalCta;

  const handlePrimaryClick = () => {
    trackEvent("demo_cta_clicked", "final_cta_primary", content.primaryCta);
    if (onCtaClick) {
      onCtaClick();
    } else {
      window.open(DEMO_URL, "_blank", "noreferrer");
    }
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
            <button
              type="button"
              className={`btn btn-primary ${styles.primaryButton}`}
              onClick={handlePrimaryClick}
            >
              {content.primaryCta}
            </button>
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
