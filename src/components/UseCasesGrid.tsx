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
			text: "Turn large client packets into structured cases. Autofill government forms, track every version, and surface edge cases to humans.",
		},
		{
			title: "Claims and benefits",
			text: "Normalize different submission formats into a single schema. Apply complex eligibility logic automatically with full audit trails.",
		},
		{
			title: "Onboarding and compliance",
			text: "Collect documents one time and reuse across forms and systems. Keep a living record of what was accepted and when it was accepted.",
		},
		{
			title: "Internal knowledge operations",
			text: "Attach policies and standard operating procedures directly to decisions so staff always see the reason behind an outcome.",
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
