import React from "react";
import { landingPageContent } from "../content/landingPage";
import { MatrixGrid } from "./ui/MatrixGrid";
import styles from "./ProofStrip.module.css";

export const ProofStrip = (): React.JSX.Element => {
  const proof = landingPageContent.proofStrip;

  return (
    <section className={styles.strip} aria-label="Proof">
      <div className={styles.documentContainer}>
        <div className={styles.inner}>
          <div className={styles.numberBlock}>
            <span className={styles.number}>{proof.number}</span>
          </div>
          <div className={styles.textBlock}>
            <p className={styles.statement}>{proof.statement}</p>
            <p className={styles.caption}>{proof.caption}</p>
          </div>
          <div className={styles.matrixBox}>
            <MatrixGrid
              rows={4}
              cols={6}
              exception={21}
              tone="onDark"
              className={styles.stripGrid}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
