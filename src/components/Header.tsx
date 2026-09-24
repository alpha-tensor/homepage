import React from "react";
import AlphaMark from "../AlphaMark";
import { trackEvent } from "../content/analytics";
import { landingPageContent } from "../content/landingPage";
import styles from "./Header.module.css";

export const Header = (): React.JSX.Element => {
  const handleLabClick = () => {
    trackEvent(
      "demo_cta_clicked",
      "header",
      landingPageContent.finalCta.primaryCta,
    );
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

        {/* Plain anchor, not a button: there is no router, so the header
         * primary action is a real navigation to the lab route. */}
        <a
          className={`btn btn-primary ${styles.demoButton}`}
          href="/lab"
          onClick={handleLabClick}
        >
          {landingPageContent.finalCta.primaryCta}
        </a>
      </div>
    </header>
  );
};
