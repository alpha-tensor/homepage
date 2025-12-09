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
    packet: "I-130 client packet.pdf",
    schema: "Immigration_Intake_v4",
    rules: ["Income check", "Household size", "Country caps"],
    outcome: "USCIS forms ready for review",
    json: `{
  "case_id": "IMM-2024-0318-42",
  "template": "I130_Intake_v4",
  "status": "ready_for_review",
  "rules_passed": 12,
  "rules_flagged": 1
}`,
  },
  hr: {
    name: "HR onboarding",
    packet: "New hire packet.zip",
    schema: "Employee_Onboarding_v2",
    rules: ["Work eligibility", "Role risk tier"],
    outcome: "HRIS and payroll prefilled",
    json: `{
  "case_id": "HR-2024-1027-09",
  "template": "Onboarding_v2",
  "status": "auto_approved",
  "systems_synced": ["HRIS", "Payroll"]
}`,
  },
  compliance: {
    name: "Compliance review",
    packet: "Vendor due diligence.pdf",
    schema: "Vendor_Risk_v3",
    rules: ["Sanctions check", "Document completeness"],
    outcome: "Risk report and tasks created",
    json: `{
  "case_id": "COMP-2024-0711-03",
  "template": "Vendor_Risk_v3",
  "status": "needs_review",
  "rules_flagged": 3
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
              AlphaTensor ingests your PDFs, forms, and policies, learns the
              structure, and ships automation that survives production.
              Versioned templates, autofill, and rules based decisions built on
              LLMs, not run by them.
            </p>
            <ul className={styles.bullets}>
              <li className={styles.bullet}>
                From unstructured PDFs to typed schemas in days.
              </li>
              <li className={styles.bullet}>
                Proven on real immigration claims and agency workflows.
              </li>
              <li className={styles.bullet}>
                Designed for auditors, not only for demos.
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
              <span className={styles.panelLabel}>Working session</span>
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
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className={styles.flow}
              >
                <div className={styles.flowColumn}>
                  <span className={styles.flowLabel}>Packet in</span>
                  <span className={styles.flowValue}>{scenario.packet}</span>
                </div>
                <div className={styles.flowColumn}>
                  <span className={styles.flowLabel}>Schema and rules</span>
                  <span className={styles.flowValue}>{scenario.schema}</span>
                  <div className={styles.flowTags}>
                    {scenario.rules.map((rule) => (
                      <span key={rule} className={styles.flowTag}>
                        {rule}
                      </span>
                    ))}
                  </div>
                </div>
                <div className={styles.flowColumn}>
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
