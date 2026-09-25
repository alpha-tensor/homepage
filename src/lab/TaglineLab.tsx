import React from "react";
import AlphaMark from "../AlphaMark";
import { landingPageContent } from "../content/landingPage";
import styles from "./TaglineLab.module.css";

/**
 * Standalone hero and tagline experiment at `/lab/tagline`.
 *
 * This is not the homepage and does not import from it. The homepage hero is a
 * two column composition with the chromatic matrix behind the product evidence,
 * and judging a type scale against that backdrop is hard. This page drops the
 * product composition, the colour fields and the dark substrate, and keeps only
 * the things a tagline decision actually depends on: the display scale, the
 * rotating word, the button size, and a dot field that is far quieter than the
 * hero matrix.
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
 * The palette stays AlphaTensor's. Nothing here adopts the reference's colours,
 * and the body keeps the muted ink rather than the reference's full-strength
 * near-black, because that is a design-system token and not a type decision.
 *
 * The header is local to this page rather than the shared one, because the
 * reference collapses its navigation and the production header does not. The
 * mark keeps the production face and weight: a wordmark is a brand asset, and
 * re-setting it here would add a third variable to an experiment about display
 * scale and dot density. It centres on a narrow viewport and leads on a wide
 * one, where a mid-bar identity reads as a hero rather than as navigation.
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
   * is open or the page slides around behind a fixed layer. `<details>` keeps the
   * disclosure semantics; React only mirrors the open state so the scroll lock
   * and the Escape key have something to act on. */
  const [menuOpen, setMenuOpen] = React.useState(false);

  React.useEffect(() => {
    document.documentElement.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <article className={styles.page}>
      <header className={styles.labHeader}>
        <a className={styles.brand} href="/" aria-label="AlphaTensor home">
          <AlphaMark className={styles.brandMark} />
          <span>AlphaTensor</span>
        </a>
        <details
          className={styles.menu}
          open={menuOpen}
          onToggle={(event) => setMenuOpen(event.currentTarget.open)}
          onKeyDown={(event) => {
            if (event.key === "Escape" && menuOpen) {
              closeMenu();
              event.currentTarget.querySelector("summary")?.focus();
            }
          }}
        >
          <summary aria-label="Toggle navigation menu">
            <span aria-hidden="true" />
          </summary>
          <div className={styles.menuPanel}>
            <nav
              className={styles.menuLinks}
              aria-label="Experiment navigation"
            >
              <a href="/" onClick={closeMenu}>
                Home
              </a>
              <a href="/#product" onClick={closeMenu}>
                Product
              </a>
              <a href="/#how-it-works" onClick={closeMenu}>
                How it works
              </a>
              <a href="/lab" onClick={closeMenu}>
                Document lab
              </a>
              <a href="#density" onClick={closeMenu}>
                Compare the motif
              </a>
              <a
                href={landingPageContent.finalCta.primaryHref}
                onClick={closeMenu}
              >
                Get in touch
              </a>
            </nav>
            <p className={styles.menuNote}>
              <span className={styles.menuNoteLabel}>Currently</span>
              {landingPageContent.hero.proof}
            </p>
          </div>
        </details>
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
        {/* Decorative only. The field carries no information, so it is hidden
         * from assistive tech rather than described. */}
        <span className={styles.field} aria-hidden="true" />
        <span className={styles.orbit} aria-hidden="true" />

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
