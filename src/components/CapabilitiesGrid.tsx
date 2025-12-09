import { FileText, GitBranch, Zap } from "lucide-react";
import React from "react";
import styles from "./CapabilitiesGrid.module.css";

export const CapabilitiesGrid = (): React.JSX.Element => {
	const capabilities = [
		{
			title: "See the documents",
			text: "Ingest PDFs, forms, scanned packets, and knowledge bases. AlphaTensor detects structures, fields, and relationships automatically.",
			icon: <FileText size={20} />,
		},
		{
			title: "Understand the rules",
			text: "Map business rules, eligibility criteria, and routing logic into explicit graphs. Rules can be inspected, changed, and versioned without touching prompt text.",
			icon: <GitBranch size={20} />,
		},
		{
			title: "Ship automation that sticks",
			text: "Versioned templates, autofill, and rules engines wired into your stack. Every decision is traceable back to the source document.",
			icon: <Zap size={20} />,
		},
	];

	return (
		<section className={styles.section}>
			<div className={styles.container}>
				<div className={styles.grid}>
					{capabilities.map((cap) => (
						<div key={cap.title} className={styles.card}>
							<div className={styles.iconWrapper}>{cap.icon}</div>
							<h3 className={styles.title}>{cap.title}</h3>
							<p className={styles.text}>{cap.text}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
};
