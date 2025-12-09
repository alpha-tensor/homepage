import React from "react";
import styles from "./UseCasesGrid.module.css";

interface UseCase {
	title: string;
	text: string;
}

export const UseCasesGrid = (): React.JSX.Element => {
	const useCases: UseCase[] = [
		{
			title: "Immigration and legal packets",
			text: "Turn long client packets into structured cases you can route and audit.",
		},
		{
			title: "Claims and benefits",
			text: "Normalize messy submissions into a single schema. Automate eligibility with full audit trails.",
		},
		{
			title: "Onboarding and compliance",
			text: "Collect documents once and reuse them everywhere. Track exactly what was accepted and when.",
		},
		{
			title: "Internal knowledge operations",
			text: "Link policies directly to automated decisions. Show staff the exact reason behind every outcome.",
		},
	];

	return (
		<section className={styles.section}>
			<div className={styles.container}>
				<div className={styles.header}>
					<h2 className={styles.title}>
						Where AlphaTensor delivers the most impact first.
					</h2>
				</div>
				<div className={styles.grid}>
					{useCases.map((useCase) => (
						<div key={useCase.title} className={styles.card}>
							<h3 className={styles.cardTitle}>{useCase.title}</h3>
							<p className={styles.cardText}>{useCase.text}</p>
						</div>
					))}
				</div>
				<p className={styles.closingLine}>
					If your work lives in PDFs packets and policies, AlphaTensor is built
					for you.
				</p>
			</div>
		</section>
	);
};
