import React from "react";
import AlphaMark from "../AlphaMark";
import { trackEvent } from "../content/analytics";
import { DEMO_URL, landingPageContent } from "../content/landingPage";
import styles from "./Header.module.css";

export const Header = (): React.JSX.Element => {
  const handleDemoClick = () => {
    trackEvent("demo_cta_clicked", "header", "Book a Demo");
    window.open(DEMO_URL, "_blank", "noreferrer");
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <a className={styles.logoRow} href="/" aria-label="AlphaTensor home">
          <AlphaMark className={styles.logoIcon} />
          <span className={styles.companyName}>AlphaTensor</span>
        </a>

        <nav className={styles.nav} aria-label="Primary">
          {landingPageContent.nav.map((item) => (
            <a key={item.href} className={styles.navLink} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <button
          type="button"
          className={`btn btn-primary ${styles.demoButton}`}
          onClick={handleDemoClick}
        >
          Book a Demo
        </button>
      </div>
    </header>
  );
};
