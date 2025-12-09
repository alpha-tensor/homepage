// Hero.tsx
import { motion } from "framer-motion";
import React from "react";
import styles from "./Hero.module.css";

interface HeroProps {
  onCtaClick?: () => void;
}

const SCENARIOS = {
  immigration: {
    name: "Immigration packet",
    packet: "I-130 client packet",
    schema: "Immigration intake v4",
    rules: ["Income check", "Household size", "Country caps"],
    outcome: "USCIS forms ready",
    json: `{
  "case_id": "IMM-2024-0318-42",
  "status": "ready_for_review",
  "manual_minutes_saved": 45,
  "rules_flagged": 1
}`,
  },
  hr: {
    name: "HR onboarding",
    packet: "New hire packet",
    schema: "Onboarding flow v2",
    rules: ["Work eligibility", "Role risk tier"],
    outcome: "HRIS prefilled",
    json: `{
  "case_id": "HR-2024-1027-09",
  "status": "auto_approved",
  "manual_minutes_saved": 20,
  "systems_synced": ["HRIS"]
}`,
  },
  compliance: {
    name: "Compliance review",
    packet: "Vendor due diligence",
    schema: "Vendor risk v3",
    rules: ["Sanctions check", "Completeness"],
    outcome: "Risk report created",
    json: `{
  "case_id": "COMP-2024-0711-03",
  "status": "needs_review",
  "manual_minutes_saved": 60,
  "risk_score": "medium"
}`,
  },
} as const;

type ScenarioKey = keyof typeof SCENARIOS;

export const Hero = ({ onCtaClick }: HeroProps): React.JSX.Element => {
  const [scenarioKey, setScenarioKey] = React.useState<ScenarioKey>("immigration");
  const scenario = SCENARIOS[scenarioKey];

  const handleCtaClick = () => {
    if (onCtaClick) onCtaClick();
    else window.open("https://cal.com/", "_blank");
  };

  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <p className={styles.eyebrow}>DOCUMENT SYSTEMS STUDIO</p>
            <h1 className={styles.headline}>
              Document intelligence for serious workflows.
            </h1>
            <p className={styles.subhead}>
              <strong style={{ color: "#ffffff", fontWeight: 600 }}>
                For legal, compliance, and operations teams that live in PDFs.
              </strong>
              <br />
              AlphaTensor takes your PDFs, forms, and policies and turns them
              into versioned templates, autofill, and rules driven decisions you
              can audit.
            </p>
            <ul className={styles.bullets}>
              <li className={styles.bullet}>
                Cut manual packet review time by 50 percent within the first
                workflow.
              </li>
              <li className={styles.bullet}>
                Pre-built for immigration and claims style packets, no blank
                slate setup.
              </li>
              <li className={styles.bullet}>
                Every decision is traceable for auditors, not just for demos.
              </li>
            </ul>
          </motion.div>

          {/* Right panel */}
          <motion.aside
            className={styles.panel}
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          >
            <div className={styles.panelHeader}>
              <span className={styles.panelLabel}>
                Working session, not a pitch
              </span>
              <div className={styles.scenarioChips}>
                {(Object.keys(SCENARIOS) as ScenarioKey[]).map((key) => (
                  <button
                    key={key}
                    type="button"
                    className={`${styles.scenarioChip} ${
                      scenarioKey === key ? styles.scenarioChipActive : ""
                    }`}
                    onClick={() => setScenarioKey(key)}
                    aria-pressed={scenarioKey === key}
                  >
                    {SCENARIOS[key].name}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.visualFrame}>
              <motion.div
                key={scenarioKey}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className={styles.flowList}
              >
                <div className={styles.flowRow}>
                  <span className={styles.flowLabel}>Packet in</span>
                  <span className={styles.flowValue}>{scenario.packet}</span>
                </div>
                <div className={styles.flowRow}>
                  <span className={styles.flowLabel}>Schema</span>
                  <span className={styles.flowValue}>{scenario.schema}</span>
                </div>
                <div className={styles.flowRow}>
                  <span className={styles.flowLabel}>Rules</span>
                  <div className={styles.flowRules}>
                    {scenario.rules.map((rule) => (
                      <span key={rule} className={styles.flowRuleChip}>
                        {rule}
                      </span>
                    ))}
                  </div>
                </div>
                <div className={styles.flowRow}>
                  <span className={styles.flowLabel}>Output</span>
                  <span className={styles.flowValue}>{scenario.outcome}</span>
                </div>
              </motion.div>
            </div>

            <pre className={styles.jsonPreview}>{scenario.json}</pre>

            <button
              type="button"
              className={`btn ${styles.ctaButton}`}
              onClick={handleCtaClick}
            >
              Book a working session
            </button>
            <p className={styles.microCopy}>
              Bring a real packet. We map the schemas, rules, and versions live.
            </p>
          </motion.aside>
        </div>
      </div>
    </section>
  );
};
