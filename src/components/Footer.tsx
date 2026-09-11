import React from "react";
import AlphaMark from "../AlphaMark";
import { trackEvent } from "../content/analytics";
import { landingPageContent } from "../content/landingPage";
import { openConsentPreferences } from "../consent";
import styles from "./Footer.module.css";

export const Footer = (): React.JSX.Element => {
  const currentYear = new Date().getFullYear();

  const handleExternalClick = (label: string) => {
    trackEvent("demo_cta_clicked", "footer", label);
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.documentContainer}>
        <div className={styles.topRow}>
          <div className={styles.brand}>
            <AlphaMark className={styles.logoIcon} />
            <span className={styles.companyName}>AlphaTensor</span>
          </div>
          <p className={styles.tagline}>{landingPageContent.footer.tagline}</p>
        </div>

        <div className={styles.bottomRow}>
          <ul className={styles.linkList}>
            {landingPageContent.footer.links.map((link) => (
              <li key={link.label}>
                {link.href.startsWith("http") ? (
                  <a
                    className={styles.link}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => handleExternalClick(link.label)}
                  >
                    {link.label}
                  </a>
                ) : (
                  <a className={styles.link} href={link.href}>
                    {link.label}
                  </a>
                )}
              </li>
            ))}
            <li>
              <button
                type="button"
                className={styles.linkButton}
                onClick={openConsentPreferences}
              >
                Cookie settings
              </button>
            </li>
          </ul>
          <p className={styles.copyright}>
            © {currentYear} {landingPageContent.footer.copyright}. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
