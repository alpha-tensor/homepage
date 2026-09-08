import React, { useEffect, useRef, useState } from "react";
import { landingPageContent } from "../content/landingPage";
import { StatusChip, type StatusTone } from "./ui/StatusChip";
import styles from "./CaseJourney.module.css";

/**
 * One scroll-driven case story.
 *
 * A single pinned stage on the right plays the document-to-next-action
 * sequence while the text column on the left advances step by step. The stage
 * consolidates the old demo timeline, the before/after workflow, and the three
 * automation scenes: the artifacts (raw documents, structured record, review
 * sheet) carry the message instead of separate sections.
 */

const CASE_ID = "PAD-0427";

/* Phase 1: imperfect documents arrive */
const ARRIVAL_DOCS = [
  { name: "scan_0427_1040.pdf", sub: "Tax return · 2024", cls: styles.docA },
  { name: "uscis_notice_i797.pdf", sub: "Receipt notice", cls: styles.docB },
  { name: "image_0112.jpg", sub: "Passport page", cls: styles.docC },
  { name: "mail_packet_03.pdf", sub: "Intake packet", cls: styles.docD },
] as const;

/* Phase 2: classification destinations appear */
const CLASSIFIED_DOCS = [
  { name: "scan_0427_1040.pdf", type: "Tax return" },
  { name: "uscis_notice_i797.pdf", type: "USCIS notice" },
  { name: "image_0112.jpg", type: "Passport page" },
  { name: "mail_packet_03.pdf", type: "Intake packet" },
] as const;

/* Phase 3: values move from the source document into the case record */
const RECORD_FIELDS = [
  { num: "1", label: "Filing status", value: "Married filing jointly" },
  { num: "2", label: "Adjusted gross income", value: "$82,400" },
] as const;

/* Phase 4: review sheet states */
const REVIEW_EVIDENCE = [
  { label: "Birth certificate", ok: true },
  { label: "Passport", ok: true },
  { label: "Tax return 2024", ok: true },
  { label: "Sponsor income letter", ok: false },
] as const;

/* Dot field for the classification stage: a scattered neutral field where a
 * subset aligns into two structured rows while one point stays orange as the
 * exception that later becomes the review flag. Deterministic coordinates. */
const ALIGN_DOTS = [
  { kind: "sel", x: 70, y: 16, fx: 14, fy: 30, delay: 0 },
  { kind: "sel", x: 26, y: 88, fx: 48, fy: 30, delay: 90 },
  { kind: "sel", x: 118, y: 34, fx: 82, fy: 30, delay: 180 },
  { kind: "sel", x: 44, y: 10, fx: 14, fy: 72, delay: 270 },
  { kind: "sel", x: 112, y: 84, fx: 48, fy: 72, delay: 360 },
  { kind: "sel", x: 86, y: 52, fx: 82, fy: 72, delay: 450 },
  { kind: "exc", x: 126, y: 18, fx: 126, fy: 18, delay: 0 },
  { kind: "keep", x: 20, y: 100, fx: 20, fy: 100, delay: 0 },
  { kind: "keep", x: 116, y: 96, fx: 116, fy: 96, delay: 0 },
] as const;

const FIELD_TOP = (index: number): string => `${26 + index * 24}%`;

const StageArrival = (): React.JSX.Element => (
  <div className={styles.layerInner} aria-hidden="true">
    <span className={styles.stageNote}>Incoming case material</span>
    {ARRIVAL_DOCS.map((doc) => (
      <span key={doc.name} className={`${styles.docSlip} ${doc.cls}`}>
        <span className={styles.docName}>{doc.name}</span>
        <span className={styles.docSub}>{doc.sub}</span>
        <span className={styles.docLines}>
          <span />
          <span />
        </span>
      </span>
    ))}
  </div>
);

const StageClassified = (): React.JSX.Element => (
  <>
    {/* Dots to structure: selected points align, one exception stays orange. */}
    <div className={styles.alignMotif} aria-hidden="true">
      <span className={styles.alignRail} />
      {ALIGN_DOTS.map((dot, index) => (
        <span
          key={index}
          className={`${styles.alignDot} ${dot.kind === "sel" ? styles.alignSel : dot.kind === "exc" ? styles.alignExc : styles.alignKeep}`}
          style={
            {
              "--sx": `${dot.x}px`,
              "--sy": `${dot.y}px`,
              "--fx": `${dot.fx}px`,
              "--fy": `${dot.fy}px`,
              "--d": `${dot.delay}ms`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
    <div className={styles.classifiedCard}>
      <div className={styles.classifiedHead}>
        <span>Document classification</span>
        <span className={styles.caseRef}>{CASE_ID}</span>
      </div>
      {CLASSIFIED_DOCS.map((doc) => (
        <div key={doc.name} className={styles.classifiedRow}>
          <span className={styles.classifiedName}>{doc.name}</span>
          <span className={styles.classifiedDest}>
            <StatusChip tone="neutral">{doc.type}</StatusChip>
            <span className={styles.classifiedArrow}>→</span>
            <span className={styles.classifiedCase}>{CASE_ID}</span>
          </span>
        </div>
      ))}
      <span className={styles.classifiedFoot}>
        <span className={styles.footMark} />
        Filed into the right case context
      </span>
    </div>
  </>
);

const StageStructured = (): React.JSX.Element => (
  <div className={styles.structStage} aria-hidden="true">
    {/* Registration marks: this document is the subject of capture. */}
    <span className={`${styles.regTick} ${styles.regTl}`} />
    <span className={`${styles.regTick} ${styles.regTr}`} />
    <span className={`${styles.regTick} ${styles.regBl}`} />
    <span className={`${styles.regTick} ${styles.regBr}`} />

    <div className={styles.sourcePaper}>
      <div className={styles.sourceHead}>
        <span>U.S. TAX RETURN</span>
        <span>2024 · 1040</span>
      </div>
      {RECORD_FIELDS.map((field, index) => (
        <div
          key={field.label}
          className={styles.sourceField}
          style={{ top: FIELD_TOP(index) }}
        >
          <span className={styles.sourceLabel}>{field.label}</span>
          <span className={styles.sourceValue}>
            <span className={styles.sourceHighlight}>{field.value}</span>
          </span>
          <span className={styles.sourceMark}>{field.num}</span>
        </div>
      ))}
    </div>

    {RECORD_FIELDS.map((field, index) => (
      <span
        key={`lead-${field.label}`}
        className={styles.structLeader}
        style={{ top: FIELD_TOP(index) }}
      />
    ))}

    <div className={styles.structCol}>
      {RECORD_FIELDS.map((field, index) => (
        <div
          key={field.label}
          className={styles.structRow}
          style={{ top: FIELD_TOP(index) }}
        >
          <span className={styles.structNum}>{field.num}</span>
          <span className={styles.structText}>
            <span className={styles.structLabel}>{field.label}</span>
            <span className={styles.structValue}>{field.value}</span>
          </span>
        </div>
      ))}
    </div>

    <span className={styles.structFoot}>
      <span className={styles.footMark} />
      Filed to case record
    </span>

    {/* Addressability note: coordinates are illustrative document-space refs. */}
    <span className={styles.scanMeta}>
      <span className={styles.footMark} />
      SRC 1040-2024 · F1-F2 · 300 DPI
    </span>
  </div>
);

interface ReviewProps {
  progress: number;
}

/**
 * The review sheet is the product thesis in one screen. It builds in one pass:
 * verified evidence, then the missing-evidence flip, the circled date and
 * margin note, the confidence resolution, and finally the review action.
 */
const StageReview = ({ progress }: ReviewProps): React.JSX.Element => (
  <div className={styles.sheetCard} aria-hidden="true">
    <div className={styles.sheetHead}>
      <span>Case review sheet</span>
      <span className={styles.caseRef}>{CASE_ID} · Adjustment of Status</span>
    </div>

    <div className={styles.sheetLabel}>Evidence</div>
    <div className={styles.sheetList}>
      {REVIEW_EVIDENCE.map((row) => {
        const isFlag = !row.ok;
        const flipped = isFlag && progress >= 1;
        return (
          <div
            key={row.label}
            className={`${styles.sheetRow} ${isFlag && progress >= 1 ? styles.sheetRowFlag : ""}`}
          >
            <span className={styles.sheetRowLabel}>{row.label}</span>
            <span className={styles.sheetRowState}>
              {flipped ? (
                <StatusChip tone="review">Missing evidence</StatusChip>
              ) : (
                <StatusChip tone="done">Verified</StatusChip>
              )}
            </span>
          </div>
        );
      })}
    </div>

    <div className={styles.sheetDateRow}>
      <span className={styles.sheetDateLabel}>DOB on I-130</span>
      <span className={styles.sheetDateValue}>
        04 / 12 / 1990
        <span
          className={`${styles.dateCircle} ${progress >= 2 ? styles.isShown : ""}`}
        />
      </span>
      <span
        className={`${styles.marginNote} ${progress >= 2 ? styles.isShown : ""}`}
      >
        differs from I-485 · confirm
      </span>
    </div>

    <div className={styles.confRow}>
      <span className={styles.confLabel}>Receipt no. (I-797)</span>
      <span className={styles.confSegs}>
        {Array.from({ length: 10 }, (_, i) => (
          <span
            key={i}
            className={`${styles.confSeg} ${i >= 6 ? styles.confSegEmpty : ""}`}
          />
        ))}
      </span>
      <span
        className={`${styles.confBracket} ${progress >= 3 ? styles.confBracketOn : ""}`}
      >
        0.61 · low
      </span>
    </div>

    <div
      className={`${styles.sheetAction} ${progress >= 4 ? styles.isShown : ""}`}
    >
      <StatusChip tone="review">Needs review</StatusChip>
      <span className={styles.sheetActionText}>
        Sent to the staff review queue
      </span>
    </div>
  </div>
);

const StageNextAction = (): React.JSX.Element => (
  <div className={styles.nextCard} aria-hidden="true">
    <div className={styles.nextMeta}>
      <span className={styles.nextMetaName}>Maria Lopez</span>
      <span className={styles.caseRef}>{CASE_ID} · Adjustment of Status</span>
    </div>

    <div className={styles.nextAction}>
      <span className={styles.nextActionLabel}>Next step</span>
      <span className={styles.nextActionText}>Request missing evidence</span>
    </div>

    <div className={styles.nextRows}>
      <div className={styles.nextRow}>
        <span className={styles.nextRowLabel}>Case state</span>
        <StatusChip tone="review">Needs review</StatusChip>
      </div>
      <div className={styles.nextRow}>
        <span className={styles.nextRowLabel}>Missing</span>
        <span className={styles.nextRowValue}>Sponsor income letter</span>
      </div>
      <div className={styles.nextRow}>
        <span className={styles.nextRowLabel}>Queue</span>
        <span className={styles.nextRowValue}>Paralegal review</span>
      </div>
    </div>

    <span className={styles.nextFoot}>
      <span className={styles.footMark} />
      The exception reaches a person. The case keeps moving.
    </span>
  </div>
);

export const CaseJourney = (): React.JSX.Element => {
  const journey = landingPageContent.caseJourney;
  const [active, setActive] = useState(0);
  const [sheetProgress, setSheetProgress] = useState(0);
  const stepEls = useRef<(HTMLLIElement | null)[]>([]);

  /* Scroll-driven step selection. The step whose center sits closest to the
   * reading line drives the stage; geometry is recomputed per animation frame
   * during scroll, so rapid jumps, anchor entries, and resize all settle on
   * the correct stage. On phones the stage pins over the copy, so the reading
   * line sits lower in the viewport where the next step is actually visible. */
  useEffect(() => {
    if (typeof window === "undefined") return;
    let frame = 0;
    const pick = () => {
      const readingLine =
        window.innerHeight * (window.innerWidth < 860 ? 0.62 : 0.38);
      let bestIndex = -1;
      let bestDist = Number.POSITIVE_INFINITY;
      for (let i = 0; i < stepEls.current.length; i += 1) {
        const el = stepEls.current[i];
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        const dist = Math.abs(rect.top + rect.height / 2 - readingLine);
        if (dist < bestDist) {
          bestDist = dist;
          bestIndex = i;
        }
      }
      if (bestIndex >= 0) setActive(bestIndex);
    };
    const schedule = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        pick();
      });
    };
    pick();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    const settle = window.setTimeout(pick, 350);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.clearTimeout(settle);
    };
  }, []);

  /* Review sheet build sequence: one pass per activation, no looping. All
   * progress updates happen in timer callbacks; leaving the phase masks the
   * stale value at render time instead of resetting state in an effect. */
  useEffect(() => {
    if (active !== 3) return;
    const reduceMotion =
      typeof window !== "undefined" &&
      (window.matchMedia("(prefers-reduced-motion: reduce)").matches ?? false);
    const delays = reduceMotion ? [0, 0, 0, 0] : [700, 1500, 2200, 2800];
    const timers = delays.map((delay, index) =>
      window.setTimeout(() => setSheetProgress(index + 1), delay),
    );
    return () => {
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, [active]);

  const currentStep = journey.steps[active];
  /* Progress only applies while the review phase is active. */
  const reviewProgress = active === 3 ? sheetProgress : 0;
  const layerClass = (index: number): string =>
    `${styles.layer} ${active === index ? styles.layerActive : ""}`;

  return (
    <section
      id="how-it-works"
      className={styles.section}
      aria-labelledby="journey-title"
    >
      <div className={styles.documentContainer}>
        <header className={styles.header}>
          <span className={styles.kicker}>{journey.kicker}</span>
          <h2 id="journey-title" className={styles.headline}>
            {journey.headline}
          </h2>
          <p className={styles.body}>{journey.body}</p>
        </header>

        <div className={styles.journey}>
          <div className={styles.stageWrap}>
            <div className={styles.stageTop}>
              <span className={styles.stageTopMark} aria-hidden="true" />
              <span className={styles.stageTopLabel}>
                {currentStep.num} · {currentStep.tag.toUpperCase()}
              </span>
            </div>
            <div className={styles.stage} data-active={active}>
              <div className={layerClass(0)} aria-hidden="true">
                <StageArrival />
              </div>
              <div className={layerClass(1)} aria-hidden="true">
                <StageClassified />
              </div>
              <div className={layerClass(2)} aria-hidden="true">
                <StageStructured />
              </div>
              <div className={layerClass(3)} aria-hidden="true">
                <StageReview progress={reviewProgress} />
              </div>
              <div className={layerClass(4)} aria-hidden="true">
                <StageNextAction />
              </div>
            </div>
          </div>

          <ol className={styles.stepList}>
            {journey.steps.map((step, index) => (
              <li
                key={step.num}
                ref={(el) => {
                  stepEls.current[index] = el;
                }}
                data-index={index}
                className={`${styles.step} ${active === index ? styles.stepActive : ""}`}
              >
                <div className={styles.stepRail} aria-hidden="true">
                  <span className={styles.stepDot} />
                </div>
                <span className={styles.stepIndex}>{step.num}</span>
                <div className={styles.stepCopy}>
                  <span className={styles.stepTitle}>{step.title}</span>
                  <span className={styles.stepText}>{step.text}</span>
                </div>
                <span className={styles.stepTag}>
                  <StatusChip tone={step.tone as StatusTone}>
                    {step.tag}
                  </StatusChip>
                </span>
              </li>
            ))}
            <li className={styles.humanNoteRow}>
              <span className={styles.humanMark} aria-hidden="true" />
              {journey.humanNote}
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
};
