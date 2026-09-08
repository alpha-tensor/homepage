import React, { useEffect, useRef, useState } from "react";
import { landingPageContent } from "../content/landingPage";
import styles from "./ExistingSystems.module.css";

/**
 * One continuous environment, not separate cards.
 *
 * The strip reads as a single operational flow: files stay in the systems the
 * firm already uses, and Alpha Tensor is the processing layer between incoming
 * case material and the structured record the team works from. When the strip
 * enters the viewport the steps activate once, in order, then stop.
 */
export const ExistingSystems = (): React.JSX.Element => {
  const content = landingPageContent.existingSystems;
  const sectionRef = useRef<HTMLElement | null>(null);
  const [activated, setActivated] = useState(false);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setActivated(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`${styles.section} ${activated ? styles.activated : ""}`}
      aria-labelledby="systems-title"
    >
      <div className={styles.documentContainer}>
        <div className={styles.textBlock}>
          <span className={styles.kicker}>{content.kicker}</span>
          <h2 id="systems-title" className={styles.headline}>
            {content.headline}
          </h2>
          <p className={styles.body}>{content.body}</p>
        </div>

        <div className={styles.stripWrap}>
          <div className={styles.stripLabel}>{content.diagram.title}</div>
          <div className={styles.strip}>
            {content.diagram.steps.map((step, index) => (
              <React.Fragment key={step.label}>
                {index > 0 && (
                  <span className={styles.stripArrow} aria-hidden="true">
                    →
                  </span>
                )}
                <div
                  className={`${styles.stripStep} ${index === 2 ? styles.stripStepEngine : ""}`}
                >
                  <span className={styles.stripStepLabel}>{step.label}</span>
                  <p className={styles.stripStepText}>{step.text}</p>
                </div>
              </React.Fragment>
            ))}
          </div>
          <p className={styles.disclaimer}>
            Files stay in Google Drive. Case state, classification, and review
            flags live in Alpha Tensor. No new document silo, no forced
            migration.
          </p>
        </div>
      </div>
    </section>
  );
};
