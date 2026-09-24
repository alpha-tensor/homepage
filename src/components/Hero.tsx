import React, { useEffect, useState } from "react";
import { trackEvent } from "../content/analytics";
import { DEMO_URL, landingPageContent } from "../content/landingPage";
import { StatusChip, type StatusTone } from "./ui/StatusChip";
import styles from "./Hero.module.css";

interface HeroProps {
  onCtaClick?: () => void;
}

const HERO_CASE = {
  client: "Maria Lopez",
  caseType: "Adjustment of Status",
  caseId: "PAD-0427",
  status: "Ready for Review",
  documents: [
    { name: "Passport", outcome: "Classified" },
    { name: "Birth certificate", outcome: "Classified" },
    { name: "Tax return", outcome: "Data captured" },
    {
      name: "Sponsor income letter",
      outcome: "Missing evidence",
      missing: true,
    },
  ] as Array<{ name: string; outcome: string; missing?: boolean }>,
  flag: "Missing sponsor income document",
  nextAction: "Request missing evidence",
};

/** Map a document outcome to the shared status grammar. */
const outcomeTone = (doc: {
  outcome: string;
  missing?: boolean;
}): StatusTone => {
  if (doc.missing || doc.outcome === "Missing evidence") return "review";
  if (doc.outcome === "Data captured") return "done";
  return "neutral";
};

/* Operations queue: the rest of the firm's matters. The snapshot above
 * (Maria Lopez) is the selected case; the queue shows the others, so the
 * same client is not listed twice in one module. */
const CASE_QUEUE = [
  {
    id: "PAD-0436",
    client: "Luis Herrera",
    state: "Needs Attorney Review",
    next: "Review date discrepancy",
    urgent: true,
  },
  {
    id: "PAD-0411",
    client: "Amara Okafor",
    state: "Needs Attorney Review",
    next: "Review affidavit",
    urgent: false,
  },
  {
    id: "PAD-0398",
    client: "Daniel Reyes",
    state: "In Review",
    next: "Verify tax transcript",
    urgent: false,
  },
] as const;

export const Hero = ({ onCtaClick }: HeroProps): React.JSX.Element => {
  const [played, setPlayed] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setPlayed(true), 150);
    return () => window.clearTimeout(timer);
  }, []);

  const handlePrimaryClick = () => {
    trackEvent(
      "demo_cta_clicked",
      "hero_primary",
      landingPageContent.hero.primaryCta,
    );
    if (onCtaClick) onCtaClick();
    else window.open(DEMO_URL, "_blank", "noreferrer");
  };

  const handleSecondaryClick = () => {
    trackEvent(
      "workflow_viewed",
      "hero_secondary",
      landingPageContent.hero.secondaryCta,
    );
  };

  return (
    <section id="hero" className={styles.hero} aria-labelledby="hero-headline">
      <div className={styles.documentContainer}>
        <div className={styles.grid}>
          <div className={styles.copyColumn}>
            <span className={styles.eyebrow}>
              {landingPageContent.hero.eyebrow}
            </span>
            <h1 id="hero-headline" className={styles.headline}>
              {landingPageContent.hero.headline}
            </h1>
            <p className={styles.body}>{landingPageContent.hero.body}</p>

            <div className={styles.actions}>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handlePrimaryClick}
              >
                {landingPageContent.hero.primaryCta}
              </button>
              <a
                className="btn btn-outline"
                href="#how-it-works"
                onClick={handleSecondaryClick}
              >
                {landingPageContent.hero.secondaryCta}
              </a>
            </div>

            <p className={styles.proof}>
              <span className={styles.proofMark} aria-hidden="true" />
              {landingPageContent.hero.proof}
            </p>
          </div>

          <div
            className={`${styles.visualColumn} ${played ? styles.play : ""}`}
            aria-hidden="true"
          >
            <span className={styles.gridField} />
            <span className={styles.coordMark} />
            <div className={styles.evidenceDocRight}>
              <span className={styles.evidenceKicker}>USCIS Notice</span>
              <span className={styles.evidenceMeta}>
                I-797C · Receipt notice
              </span>
              <span className={styles.evidenceLine} />
              <span className={styles.evidenceLine} />
            </div>
            <div className={styles.evidenceDocLeft}>
              <span className={styles.evidenceKicker}>Tax Return</span>
              <span className={styles.evidenceMeta}>2024 · Form 1040</span>
              <span className={styles.evidenceLine} />
              <span className={styles.evidenceLine} />
              <span className={styles.evidenceLine} />
            </div>

            <div className={styles.visualFrame}>
              <div className={styles.frameTopRow}>
                <span className={styles.frameKicker}>CASE SNAPSHOT</span>
                <StatusChip tone="done">{HERO_CASE.status}</StatusChip>
              </div>

              <div className={styles.clientRow}>
                <div>
                  <div className={styles.clientName}>{HERO_CASE.client}</div>
                  <div className={styles.caseMeta}>
                    {HERO_CASE.caseType} · {HERO_CASE.caseId}
                  </div>
                </div>
              </div>

              <div className={styles.documentBlock}>
                <div className={styles.blockLabel}>Documents</div>
                <ul className={styles.documentList}>
                  {HERO_CASE.documents.map((doc) => (
                    <li key={doc.name} className={styles.documentRow}>
                      <span className={styles.documentName}>{doc.name}</span>
                      <StatusChip tone={outcomeTone(doc)}>
                        {doc.outcome}
                      </StatusChip>
                    </li>
                  ))}
                </ul>
              </div>

              <div className={styles.flagBlock}>
                <div className={styles.flagLabel}>Flag</div>
                <div className={styles.flagText}>{HERO_CASE.flag}</div>
              </div>

              <div className={styles.nextActionRow}>
                <span className={styles.nextActionLabel}>Next step</span>
                <span className={styles.nextActionValue}>
                  {HERO_CASE.nextAction}
                </span>
              </div>
            </div>

            <div className={styles.queueStub}>
              <div className={styles.queueStubLabel}>Operations queue</div>
              <ul className={styles.queueList}>
                {CASE_QUEUE.map((row) => (
                  <li key={row.id} className={styles.queueRow}>
                    <span className={styles.queueName}>{row.client}</span>
                    <span
                      className={`${styles.queueState} ${row.urgent ? styles.queueStateUrgent : ""}`}
                    >
                      {row.state}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
