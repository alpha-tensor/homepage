import React from "react";
import { landingPageContent } from "../content/landingPage";
import { MatrixGrid } from "./ui/MatrixGrid";
import styles from "./TrustSection.module.css";

/**
 * Trust as one object: a case ledger.
 *
 * Six trust concepts are communicated through a single operational record
 * instead of six equal feature boxes. The ledger is the audit trail; the
 * index beside it names what each guarantee means in practice.
 */

type LedgerState = "neutral" | "review" | "done";

interface LedgerRow {
  time: string;
  actor: string;
  text: string;
  state: string;
  tone: LedgerState;
}

const LEDGER_ROWS: LedgerRow[] = [
  {
    time: "10:42:01",
    actor: "Alpha Tensor",
    text: "Document received — Tax Return 2024.pdf",
    state: "Document received",
    tone: "neutral",
  },
  {
    time: "10:42:06",
    actor: "Alpha Tensor",
    text: "Classification completed",
    state: "Classified",
    tone: "neutral",
  },
  {
    time: "10:42:11",
    actor: "Alpha Tensor",
    text: "Three fields extracted into the case record",
    state: "Data captured",
    tone: "done",
  },
  {
    time: "10:42:14",
    actor: "Alpha Tensor",
    text: "Receipt number below confidence threshold",
    state: "Flagged",
    tone: "review",
  },
  {
    time: "10:42:16",
    actor: "Alpha Tensor",
    text: "Sent to the staff review queue",
    state: "Needs review",
    tone: "review",
  },
  {
    time: "10:47:03",
    actor: "Paralegal",
    text: "Confirmed receipt number against the scan",
    state: "Staff approved",
    tone: "done",
  },
  {
    time: "10:47:05",
    actor: "Alpha Tensor",
    text: "Case record updated",
    state: "Case updated",
    tone: "done",
  },
] as const;

export const TrustSection = (): React.JSX.Element => {
  const trust = landingPageContent.trust;

  return (
    <section
      id="trust"
      className={styles.section}
      aria-labelledby="trust-title"
    >
      <div className={styles.documentContainer}>
        <MatrixGrid
          rows={3}
          cols={7}
          exception={20}
          tone="onDark"
          className={styles.sectionGrid}
        />
        <div className={styles.header}>
          <span className={styles.kicker}>{trust.kicker}</span>
          <h2 id="trust-title" className={styles.headline}>
            {trust.headline}
          </h2>
          <p className={styles.body}>{trust.body}</p>
        </div>

        <div className={styles.grid}>
          <div
            className={styles.ledger}
            aria-label="Operations ledger for case PAD-0427"
          >
            <span className={styles.ledgerWord} aria-hidden="true">
              LEDGER
            </span>
            <div className={styles.ledgerTop}>
              <div>
                <span className={styles.ledgerKicker}>Operations ledger</span>
                <span className={styles.ledgerCase}>
                  Case PAD-0427 · Adjustment of Status
                </span>
              </div>
              <span className={styles.ledgerStamp}>
                Every change attributable
              </span>
            </div>

            <ol className={styles.ledgerRows}>
              {LEDGER_ROWS.map((row) => (
                <li
                  key={`${row.time}-${row.text}`}
                  className={styles.ledgerRow}
                >
                  <span className={styles.rowTime}>{row.time}</span>
                  <span className={styles.rowText}>
                    {row.text}
                    <span className={styles.rowActor}> · {row.actor}</span>
                  </span>
                  <span
                    className={`${styles.rowState} ${row.tone === "review" ? styles.rowStateReview : row.tone === "done" ? styles.rowStateDone : styles.rowStateNeutral}`}
                  >
                    {row.state}
                  </span>
                </li>
              ))}
            </ol>
          </div>

          <div className={styles.index}>
            <span className={styles.indexLabel}>
              What that means in practice
            </span>
            <ol className={styles.indexList}>
              {trust.items.map((item, index) => (
                <li key={item.label} className={styles.indexRow}>
                  <span className={styles.indexNum}>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className={styles.indexText}>
                    <span className={styles.indexItemLabel}>{item.label}</span>
                    <span className={styles.indexTitle}>{item.title}</span>
                    <span className={styles.indexBody}>{item.text}</span>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
};
