import type React from "react";
import styles from "./LabHeroMatrix.module.css";

/** A static, lower-contrast study of the homepage matrix, scoped to the tagline lab. */
export const LabHeroMatrix = (): React.JSX.Element => (
  <span className={styles.field} data-motif="lab-hero-field" aria-hidden="true">
    <span className={styles.atmosphere} />
    <span className={styles.core} />
  </span>
);
