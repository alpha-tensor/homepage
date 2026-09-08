import React from "react";
import { DEMO_URL } from "../content/landingPage";
import styles from "./NotFoundPage.module.css";

export const NotFoundPage = (): React.JSX.Element => {
  return (
    <section className={styles.section} aria-labelledby="not-found-title">
      <div className={styles.documentContainer}>
        <div className={styles.content}>
          <span className={styles.label}>ERROR 404</span>
          <h1 id="not-found-title" className={styles.title}>
            Page not found.
          </h1>
          <p className={styles.body}>
            The page you requested does not exist. Return home to see how Alpha
            Tensor removes repetitive case work for immigration firms.
          </p>

          <div className={styles.actions}>
            <a className="btn btn-primary" href="/">
              Return home
            </a>
            <a
              className="btn btn-outline"
              href={DEMO_URL}
              target="_blank"
              rel="noreferrer"
            >
              Book a Demo
            </a>
          </div>

          <div className={styles.note}>Only the home route is available.</div>
        </div>
      </div>
    </section>
  );
};
