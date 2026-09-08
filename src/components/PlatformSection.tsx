import React from "react";
import { landingPageContent } from "../content/landingPage";
import { MatrixGrid } from "./ui/MatrixGrid";
import styles from "./PlatformSection.module.css";

/**
 * Second-half platform reveal.
 *
 * The wedge story sells the immediate problem; this section widens the scope
 * to case operations, evidence intelligence, workflow, and documents without
 * turning the page into a feature inventory.
 */
export const PlatformSection = (): React.JSX.Element => {
  const platform = landingPageContent.platform;

  return (
    <section className={styles.section} aria-labelledby="platform-title">
      <div className={styles.documentContainer}>
        <MatrixGrid
          rows={3}
          cols={7}
          exception={20}
          tone="ink"
          className={styles.sectionGrid}
        />
        <header className={styles.header}>
          <span className={styles.kicker}>{platform.kicker}</span>
          <h2 id="platform-title" className={styles.headline}>
            {platform.headline}
          </h2>
          <p className={styles.body}>{platform.body}</p>
        </header>

        <ol className={styles.list}>
          {platform.items.map((item, index) => (
            <li key={item.label} className={styles.row}>
              <span className={styles.rowNum} aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className={styles.rowText}>
                <span className={styles.rowLabel}>{item.label}</span>
                <span className={styles.rowTitle}>{item.title}</span>
                <span className={styles.rowBody}>{item.text}</span>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};
