import React from "react";
import { openConsentPreferences } from "../consent";
import {
  LEGAL_CONTACT_EMAIL,
  LEGAL_LAST_UPDATED,
  privacyPolicy,
} from "../content/legal";
import styles from "./PrivacyPolicy.module.css";

export const PrivacyPolicy = (): React.JSX.Element => {
  return (
    <section className={styles.section} aria-labelledby="privacy-title">
      <div className={styles.documentContainer}>
        <header className={styles.header}>
          <span className={styles.label}>Legal</span>
          <h1 id="privacy-title" className={styles.title}>
            {privacyPolicy.title}
          </h1>
          <p className={styles.updated}>
            Last updated {LEGAL_LAST_UPDATED}
          </p>
        </header>

        <p className={styles.intro}>{privacyPolicy.intro}</p>

        {privacyPolicy.sections.map((section) => (
          <article key={section.heading} className={styles.block}>
            <h2 className={styles.heading}>{section.heading}</h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph} className={styles.paragraph}>
                {paragraph}
              </p>
            ))}
            {section.list && (
              <ul className={styles.list}>
                {section.list.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
          </article>
        ))}

        <article className={styles.block}>
          <h2 className={styles.heading}>Cookies we use</h2>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Category</th>
                  <th scope="col">Purpose</th>
                  <th scope="col">Duration</th>
                </tr>
              </thead>
              <tbody>
                {privacyPolicy.cookies.map((cookie) => (
                  <tr key={cookie.name}>
                    <td className={styles.mono}>{cookie.name}</td>
                    <td>{cookie.category}</td>
                    <td>{cookie.purpose}</td>
                    <td>{cookie.duration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className={styles.block}>
          <h2 className={styles.heading}>Change your choice</h2>
          <p className={styles.paragraph}>
            You can review or withdraw your consent at any time. Withdrawing
            turns analytics and marketing off and clears the cookies we set.
          </p>
          <button
            type="button"
            className="btn btn-outline"
            onClick={openConsentPreferences}
          >
            Open cookie settings
          </button>
          <p className={styles.paragraph}>
            Questions about this policy can be sent to{" "}
            <a className={styles.link} href={`mailto:${LEGAL_CONTACT_EMAIL}`}>
              {LEGAL_CONTACT_EMAIL}
            </a>
            .
          </p>
        </article>
      </div>
    </section>
  );
};
