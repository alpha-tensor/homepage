import React from "react";
import { landingPageContent } from "../content/landingPage";
import { StatusChip } from "./ui/StatusChip";
import styles from "./ProductEvidence.module.css";

/* Fragment 1 UI data: case status and blockers. Distinct matters so the
 * section shows the firm-wide view rather than re-telling the Maria Lopez
 * story from the hero and journey. */
const CASE_ROWS = [
  {
    client: "Elena Marchetti",
    caseType: "Adjustment of Status",
    state: "Ready for Review",
    missing: "Beneficiary birth certificate translation",
    next: "Request translation",
    urgent: true,
  },
  {
    client: "James Whitfield",
    caseType: "I-130 Petition",
    state: "Missing Evidence",
    missing: "Prior marriage dissolution decree",
    next: "Request decree",
    urgent: false,
  },
] as const;

/* Fragment 2 UI data: document processing */
const PROCESSED_DOCUMENT = {
  file: "Tax Return 2023.pdf",
  classifiedAs: "Tax Return",
  caseRef: "Sofia Ramirez · Adjustment of Status",
  fields: [
    { label: "Tax year", value: "2023" },
    { label: "Filing status", value: "Single" },
    { label: "Adjusted gross income", value: "$58,900" },
  ],
  confidence: "High confidence",
} as const;

/* Fragment 3 UI data: review and exceptions */
const EXCEPTION_ROWS = [
  {
    flag: "Missing evidence",
    detail: "Birth certificate translation · requested 3 days ago",
    caseRef: "Elena Marchetti",
    level: "urgent" as const,
  },
  {
    flag: "Date inconsistency",
    detail: "DOB differs between I-485 and passport",
    caseRef: "Amara Okafor",
    level: "warning" as const,
  },
  {
    flag: "Low-confidence field",
    detail: "Receipt number on I-797C scan needs confirmation",
    caseRef: "Daniel Reyes",
    level: "warning" as const,
  },
];

export const ProductEvidence = (): React.JSX.Element => {
  const fragments = landingPageContent.product.fragments;

  return (
    <section
      id="product"
      className={styles.section}
      aria-label="Product evidence"
    >
      <div className={styles.documentContainer}>
        <div className={styles.header}>
          <span className={styles.kicker}>
            {landingPageContent.product.kicker}
          </span>
          <h2 className={styles.headline}>
            {landingPageContent.product.headline}
          </h2>
          <p className={styles.body}>{landingPageContent.product.body}</p>
        </div>

        {/* Fragment 1 */}
        <article className={styles.fragment}>
          <div className={styles.fragmentCopy}>
            <span className={styles.fragmentLabel}>{fragments[0].label}</span>
            <h3 className={styles.fragmentHeadline}>{fragments[0].headline}</h3>
            <p className={styles.fragmentBody}>{fragments[0].body}</p>
          </div>
          <div className={styles.fragmentVisual}>
            <div className={styles.uiCard}>
              <div className={styles.uiCardHeader}>
                <span className={styles.uiCardKicker}>Case status</span>
                <span className={styles.uiCardCount}>2 active</span>
              </div>
              {CASE_ROWS.map((row) => (
                <div
                  key={row.client}
                  className={`${styles.caseRow} ${row.urgent ? styles.caseRowUrgent : ""}`}
                >
                  <div className={styles.caseRowTop}>
                    <span className={styles.caseRowClient}>{row.client}</span>
                    <StatusChip
                      tone={
                        row.state === "Missing Evidence" ? "review" : "done"
                      }
                    >
                      {row.state}
                    </StatusChip>
                  </div>
                  <div className={styles.caseRowMeta}>
                    {row.caseType} · Missing: {row.missing}
                  </div>
                  <div className={styles.caseRowAction}>
                    <span className={styles.actionLabel}>Next step</span>
                    <span className={styles.actionValue}>{row.next}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </article>

        {/* Fragment 2 */}
        <article className={styles.fragment}>
          <div className={styles.fragmentCopy}>
            <span className={styles.fragmentLabel}>{fragments[1].label}</span>
            <h3 className={styles.fragmentHeadline}>{fragments[1].headline}</h3>
            <p className={styles.fragmentBody}>{fragments[1].body}</p>
          </div>
          <div className={styles.fragmentVisual}>
            <div className={styles.uiCard}>
              <div className={styles.uiCardHeader}>
                <span className={styles.uiCardKicker}>Document processing</span>
                <StatusChip tone="neutral">
                  {PROCESSED_DOCUMENT.confidence}
                </StatusChip>
              </div>
              <div className={styles.processGrid}>
                <div className={styles.fileSide}>
                  <span className={styles.sideLabel}>Incoming file</span>
                  <div className={styles.fileThumb}>
                    <span className={styles.fileName}>
                      {PROCESSED_DOCUMENT.file}
                    </span>
                    <span className={styles.fileLines} aria-hidden="true">
                      <span />
                      <span />
                      <span />
                      <span />
                    </span>
                  </div>
                  <span className={styles.classifiedRow}>
                    Classified as{" "}
                    <strong>{PROCESSED_DOCUMENT.classifiedAs}</strong>
                  </span>
                </div>
                <div className={styles.fieldsSide}>
                  <span className={styles.sideLabel}>Structured fields</span>
                  <ul className={styles.fieldsList}>
                    {PROCESSED_DOCUMENT.fields.map((field) => (
                      <li key={field.label} className={styles.fieldRow}>
                        <span className={styles.fieldLabel}>{field.label}</span>
                        <span className={styles.fieldValue}>{field.value}</span>
                      </li>
                    ))}
                  </ul>
                  <span className={styles.caseAssoc}>
                    {PROCESSED_DOCUMENT.caseRef}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* Fragment 3 */}
        <article className={styles.fragment}>
          <div className={styles.fragmentCopy}>
            <span className={styles.fragmentLabel}>{fragments[2].label}</span>
            <h3 className={styles.fragmentHeadline}>{fragments[2].headline}</h3>
            <p className={styles.fragmentBody}>{fragments[2].body}</p>
          </div>
          <div className={styles.fragmentVisual}>
            <div className={styles.uiCard}>
              <div className={styles.uiCardHeader}>
                <span className={styles.uiCardKicker}>Exception queue</span>
                <StatusChip tone="review">Needs review</StatusChip>
              </div>
              <ul className={styles.exceptionList}>
                {EXCEPTION_ROWS.map((item) => (
                  <li
                    key={item.flag}
                    className={`${styles.exceptionRow} ${item.level === "urgent" ? styles.exceptionRowUrgent : ""}`}
                  >
                    <div className={styles.exceptionTop}>
                      <span className={styles.exceptionFlag}>{item.flag}</span>
                      <span className={styles.exceptionCase}>
                        {item.caseRef}
                      </span>
                    </div>
                    <div className={styles.exceptionDetail}>{item.detail}</div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
};
