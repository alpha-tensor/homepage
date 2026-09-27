import React from "react";
import AlphaMark from "../AlphaMark";
import { DEMO_URL, landingPageContent } from "../content/landingPage";
import styles from "./TaglineLab.module.css";
import { LabHeroMatrix } from "./LabHeroMatrix";

/** The panel is referenced by the toggle, so the id has exactly one definition. */
const NAV_ID = "lab-tagline-nav";
/**
 * Standalone hero and tagline experiment at `/lab/tagline`.
 *
 * This is not the homepage. The lab keeps its own softer matrix behind the
 * left side of the desktop headline, away from the CTA, without changing the live hero.
 *
 * Reference: the1.amsterdam. Its character comes from proportions rather than
 * decoration, so those are the parts borrowed.
 *   - One weight at a very large size. Hierarchy from scale and space, not bold.
 *   - Line height below 1, negative tracking, so the block reads as one mass.
 *   - Restrained surface, generous quiet, and a collapsed menu.
 *   - A display line set flush right at desktop, with the supporting copy hung
 *     off that same right edge in a narrow column rather than run underneath a
 *     left-aligned headline. Below the reference's own desktop breakpoint it
 *     goes back to the leading edge.
 *   - Body copy that does not scale with the viewport. The reference holds it at
 *     flat 18px with 1.1 leading and -0.03em tracking from the phone width up.
 *     Only the display line changes size.
 * The neutral grey and near-black are a lab-only colour test. Body copy remains
 * muted rather than adopting the reference's full-strength ink.
 *
 * The header is local to this page rather than the shared one, because the
 * reference opens its navigation as a disc that grows from the toggle to fill the
 * screen and the production header does not. The fixed overlay, the inverting
 * toggle and the two column panel are that arrangement, ported. The mark keeps the
 * production face and weight: a wordmark is a brand asset, and re-setting it here
 * would add a third variable to an experiment about display scale and dot density.
 *
 * The rotating word. A word that changes every few seconds only works if the
 * line does not move, so the words share a single grid cell and the cell sizes
 * to the widest one. The line is therefore laid out once, at the widest word,
 * and the loop is pure CSS. `clarity, action, progress` also has to read as a
 * sequence rather than three unrelated synonyms, which is why the order is
 * understand, then act, then move the work forward.
 *
 * The three things this page is meant to settle, in order:
 *   1. Does 176px work on desktop and 75px at the reference tablet width?
 *   2. Which density level in the rail should the motif use? The clean swatch is
 *      the control: a field that does not beat plain cream should not ship.
 *   3. Do 52px buttons hold up next to type that size, against the current 40px?
 *
 * Analytics is deliberately not wired here. The whole `/lab` subtree is excluded
 * from Google tags in the consent bootstrap in `index.html`, so a tracked event
 * on this route would be a no-op that only makes the experiment harder to read.
 */

/** The rotating tail of the headline, in the order it should be read. */
const ROTATING = ["clarity", "action", "progress"] as const;

/** Three seconds per word, matched to `--lab-cycle` in the stylesheet. */
const WORD_SECONDS = 3;

interface DensityLevel {
  key: string;
  label: string;
  ink: string;
  note: string;
}

/* Identical geometry at three inks. Same pitch, same dot, same profile, so the
 * only thing a reader is judging is loudness. */
const DENSITY: DensityLevel[] = [
  {
    key: "clean",
    label: "Clean",
    ink: "0%",
    note: "No motif. The control every other level has to beat.",
  },
  {
    key: "faint",
    label: "Faint",
    ink: "5.5%",
    note: "Reads as the tooth of the paper. Hard to find unless you look.",
  },
  {
    key: "present",
    label: "Present",
    ink: "11%",
    note: "Reads as a field. The loudest this should ever be outside the hero.",
  },
];

export const TaglineLab = (): React.JSX.Element => {
  /* The menu is a full screen panel, so background scrolling has to stop while it
   * is open or the page slides around behind a fixed layer. The overlay is inert
   * until it is open, so the closed state costs the page nothing but the identity
   * and the toggle. */
  const [menuOpen, setMenuOpen] = React.useState(false);

  const toggleRef = React.useRef<HTMLButtonElement>(null);
  const backdropRef = React.useRef<HTMLSpanElement>(null);

  /* The disc that becomes the menu background has to reach the furthest corner of
   * the viewport from wherever the toggle sits. That distance depends on the display
   * size, so it is measured rather than hardcoded: a fixed factor is either too
   * small on a large monitor or needlessly slow on a phone. */
  const measureDisc = React.useCallback(() => {
    const toggle = toggleRef.current;
    const backdrop = backdropRef.current;
    if (!toggle || !backdrop) return;
    const rect = toggle.getBoundingClientRect();
    const centreX = rect.left + rect.width / 2;
    const centreY = rect.top + rect.height / 2;
    /* offsetWidth rather than the rect: the disc is scaled while open, and reading
     * the transformed box would compound the factor on every reopen. */
    const size = backdrop.offsetWidth || rect.width;
    const corners: Array<[number, number]> = [
      [0, 0],
      [window.innerWidth, 0],
      [0, window.innerHeight],
      [window.innerWidth, window.innerHeight],
    ];
    let furthest = 0;
    for (const [x, y] of corners) {
      furthest = Math.max(furthest, Math.hypot(x - centreX, y - centreY));
    }
    backdrop.style.setProperty(
      "--lab-disc-scale",
      (((furthest * 2) / size) * 1.06).toFixed(3),
    );
  }, []);

  React.useEffect(() => {
    document.documentElement.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [menuOpen]);

  React.useEffect(() => {
    if (menuOpen) {
      measureDisc();
      return;
    }
    backdropRef.current?.style.setProperty("--lab-disc-scale", "1");
  }, [menuOpen, measureDisc]);

  /* A rotation or a resize while the panel is open changes the furthest corner, so
   * the factor has to be re-measured rather than left at whatever it was on open. */
  React.useEffect(() => {
    if (!menuOpen) return;
    const onResize = () => measureDisc();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [menuOpen, measureDisc]);

  React.useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <article className={styles.page}>
      <header
        className={styles.labHeader}
        data-open={menuOpen ? "true" : "false"}
      >
        <div className={styles.topbar}>
          <a className={styles.brand} href="/" aria-label="AlphaTensor home">
            <AlphaMark className={styles.brandMark} />
            <span>AlphaTensor</span>
          </a>

          <button
            type="button"
            className={styles.menuToggle}
            ref={toggleRef}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls={NAV_ID}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span
              className={styles.menuBackdrop}
              ref={backdropRef}
              aria-hidden="true"
            />
            <span className={styles.menuDisc} aria-hidden="true">
              <span className={styles.iconBar} />
              <span className={styles.iconBar} />
            </span>
          </button>
        </div>

        <nav
          className={styles.navigation}
          id={NAV_ID}
          aria-label="Experiment navigation"
        >
          <div className={styles.navColumns}>
            <ul className={styles.navList}>
              <li>
                <a href="/" onClick={closeMenu}>
                  Home
                </a>
              </li>
              <li>
                <a href="/#product" onClick={closeMenu}>
                  Product
                </a>
              </li>
              <li>
                <a href="/#how-it-works" onClick={closeMenu}>
                  How it works
                </a>
              </li>
            </ul>
            <ul className={styles.navList}>
              <li>
                <a href="/lab" onClick={closeMenu}>
                  Document lab
                </a>
              </li>
              <li>
                <a href="#density" onClick={closeMenu}>
                  Compare the motif
                </a>
              </li>
              <li>
                <a
                  href={landingPageContent.finalCta.primaryHref}
                  onClick={closeMenu}
                >
                  Get in touch
                </a>
              </li>
            </ul>
          </div>

          {/* The reference puts an address and a contact list here. This carries the
           * proof line and the demo link instead, because inventing an address for a
           * lab route would be copy that has to be maintained twice. */}
          <div className={styles.footerInfo}>
            <section>
              <p className={styles.infoLabel}>Currently</p>
              <p className={styles.infoValue}>
                {landingPageContent.hero.proof}
              </p>
            </section>
            <section>
              <p className={styles.infoLabel}>Contact</p>
              <div className={styles.contactList}>
                <a className={styles.contactLink} href={DEMO_URL}>
                  <span className={styles.contactLinkInner}>
                    <span
                      className={styles.contactLinkDot}
                      aria-hidden="true"
                    />
                    <span>Book a demo</span>
                  </span>
                </a>
              </div>
            </section>
          </div>
        </nav>
      </header>
      <section
        className={styles.stage}
        aria-labelledby="lab-headline"
        /* The panel is opaque and full bleed, so anything under it is both
         * unreachable and unreadable. `inert` takes the covered content out of
         * the tab order and the accessibility tree in one attribute, which is
         * the cheap version of the focus management a modal would need. */
        inert={menuOpen}
      >
        {/* Mobile keeps the quiet dot field. Desktop uses the separate matrix below
         * the headline, clear of the glyphs. Both are purely decorative. */}
        <span className={styles.field} aria-hidden="true" />
        <LabHeroMatrix />

        <div className={styles.inner}>
          <h1
            className={styles.display}
            id="lab-headline"
            aria-label="From documents to clarity, action, or progress"
          >
            <span className={styles.line} aria-hidden="true">
              From documents
            </span>
            <span className={styles.line} aria-hidden="true">
              to
            </span>
            <span className={styles.line} aria-hidden="true">
              <span className={styles.rotator}>
                {ROTATING.map((word, index) => (
                  <span
                    key={word}
                    className={styles.word}
                    style={{
                      animationDelay: `${index * WORD_SECONDS}s`,
                    }}
                  >
                    {word}
                  </span>
                ))}
              </span>
            </span>
          </h1>

          <div className={styles.aside}>
            <p className={styles.lede}>
              Alpha Tensor turns a folder of documents into structured case
              data, clear requirements, and the next action your team can take.
            </p>

            <div className={styles.actions}>
              <a
                className="btn btn-primary"
                href={landingPageContent.finalCta.primaryHref}
              >
                {landingPageContent.hero.primaryCta}
              </a>
              <a className="btn btn-outline" href="#density">
                Compare the motif
              </a>
            </div>

            <p className={styles.proof}>
              <span className={styles.mark} aria-hidden="true" />
              {landingPageContent.hero.proof}
            </p>
          </div>
        </div>
      </section>

      <section
        className={styles.rail}
        id="density"
        aria-labelledby="density-heading"
        inert={menuOpen}
      >
        <div className={styles.railInner}>
          <h2 className={styles.railHead} id="density-heading">
            <span className={styles.mark} aria-hidden="true" />
            Motif density, 6px pitch, identical geometry
          </h2>

          <div className={styles.swatches}>
            {DENSITY.map((level) => (
              <div className={styles.swatch} key={level.key}>
                <div
                  className={styles.swatchScreen}
                  data-level={level.key}
                  aria-hidden="true"
                />
                <div className={styles.swatchMeta}>
                  <div className={styles.swatchLabel}>
                    {level.label} · {level.ink}
                  </div>
                  <p className={styles.swatchNote}>{level.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </article>
  );
};
