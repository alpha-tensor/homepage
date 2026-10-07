import React from "react";
import { StatusChip } from "../components/ui/StatusChip";
import { landingPageContent } from "../content/landingPage";
import styles from "./ProcessAccordion.module.css";

/** One id root, so the toggle and its panel cannot drift apart. */
const ID = "lab-process";

const { steps } = landingPageContent.caseJourney;

/**
 * The process section: five steps in a single-open accordion.
 *
 * Ported from the "Accordion in Motion" build. The measurements are in the
 * stylesheet; what matters here is the behaviour and the semantics.
 *
 * One row open at a time. Opening a row closes the previous one, and the two run
 * together rather than in sequence, which is what the reference does and what makes
 * the list feel like one object moving rather than two animations queued. The state
 * is a single index for that reason: two booleans would allow both and would let the
 * `aria-expanded` attributes disagree.
 *
 * The open row is the only one with a fill. Closed rows are transparent, so the five
 * labels read as a list and the open one reads as a panel, which is the whole
 * economy of the reference. There is no hover state on the label: the reference has
 * a `color` transition on its button and never changes the colour, and inventing one
 * would make five rows compete for attention on a page that is trying to be quiet.
 *
 * Semantics are a real accordion rather than a styled list. Each row is a `button`
 * with `aria-expanded` and `aria-controls`, and the panel is a `region` labelled by
 * its own button. The collapsed panels are `inert`, because the height collapse is
 * visual only and without it a screen reader would read all five panels in sequence
 * and report five steps where one is showing. Tab moves between rows, which is the
 * accordion pattern's own guidance, so there is no arrow-key handling.
 *
 * The first step is open at rest. The reference opens its middle step instead, which
 * is a presentation choice with no behaviour in it, and on a five step process the
 * first one is where a reader starts.
 *
 * The visual column holds the active step's number at display scale. The reference
 * fills that column with a stack of per-step images that swap on the active row, and
 * this page has no per-step assets. For the real section that column should carry the
 * per-step stage graphics, which already exist inside `CaseJourney` on the homepage
 * and need extracting rather than rebuilding. It is `aria-hidden` because the number
 * is already announced by the row it belongs to.
 */
export const ProcessAccordion = (): React.JSX.Element => {
  const [openIndex, setOpenIndex] = React.useState(0);
  const { kicker, headline, body } = landingPageContent.caseJourney;
  const active = steps[openIndex];

  return (
    <section
      className={styles.section}
      id="process"
      aria-labelledby={`${ID}-heading`}
    >
      <div className={styles.inner}>
        <p className={styles.kicker}>
          <span className={styles.mark} aria-hidden="true" />
          {kicker}
        </p>
        <h2 className={styles.headline} id={`${ID}-heading`}>
          {headline}
        </h2>
        <p className={styles.body}>{body}</p>

        <div className={styles.pair}>
          <ul className={styles.list}>
            {steps.map((step, index) => {
              const isOpen = index === openIndex;

              return (
                <li
                  className={styles.row}
                  data-open={isOpen ? "true" : "false"}
                  key={step.num}
                >
                  <h3 className={styles.rowHeading}>
                    <button
                      type="button"
                      className={styles.rowButton}
                      id={`${ID}-button-${index}`}
                      aria-expanded={isOpen}
                      aria-controls={`${ID}-panel-${index}`}
                      onClick={() => setOpenIndex(index)}
                    >
                      {/* Decorative: the number is already in the heading's own
                       * text for a screen reader, and it is repeated visually in
                       * the badge. */}
                      <span className={styles.badge} aria-hidden="true">
                        {step.num}
                      </span>
                      <span className={styles.title}>{step.title}</span>
                      <svg
                        className={styles.chevron}
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                        focusable="false"
                      >
                        <path d="M5 8l5 5 5-5" />
                      </svg>
                    </button>
                  </h3>

                  <div className={styles.panelWrap}>
                    <div
                      className={styles.panel}
                      id={`${ID}-panel-${index}`}
                      role="region"
                      aria-labelledby={`${ID}-button-${index}`}
                      inert={!isOpen}
                    >
                      <div className={styles.panelInner}>
                        <p className={styles.panelText}>{step.text}</p>
                        <StatusChip tone={step.tone}>{step.tag}</StatusChip>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className={styles.visual} aria-hidden="true">
            {/* Keyed on the number so React remounts the node and the fade replays
             * when the open row changes. */}
            <span className={styles.visualNumber} key={active.num}>
              {active.num}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
