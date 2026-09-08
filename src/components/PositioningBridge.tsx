import React from "react";
import { landingPageContent } from "../content/landingPage";
import styles from "./PositioningBridge.module.css";

/**
 * Objection band: keep the case management system, remove the manual work.
 *
 * The old three-step diagram was folded into the CaseJourney stage, so this
 * section is now a short statement, not a second explanation of the mechanism.
 */
export const PositioningBridge = (): React.JSX.Element => {
  const positioning = landingPageContent.positioning;

  return (
    <section className={styles.section} aria-labelledby="positioning-title">
      <div className={styles.documentContainer}>
        <div className={styles.textBlock}>
          <span className={styles.kicker}>{positioning.kicker}</span>
          <h2 id="positioning-title" className={styles.headline}>
            {positioning.headline}
          </h2>
          <p className={styles.objection}>{positioning.objection}</p>
          <p className={styles.body}>{positioning.body}</p>
        </div>
      </div>
    </section>
  );
};
