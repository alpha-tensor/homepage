import React from "react";
import styles from "./AboutSection.module.css";

export const AboutSection = (): React.JSX.Element => {
	return (
		<section className={styles.section}>
			<div className={styles.container}>
				<div className={styles.grid}>
					<div className={styles.content}>
						<h2 className={styles.title}>
							AlphaTensor comes from the operations floor, not from a slide
							deck.
						</h2>
						<p className={styles.body}>
							AlphaTensor grew inside real law and government workflows where
							delays and errors are measured in lives, not vanity metrics. The
							first tools were built to survive federal audits, shifting rules,
							and messy packets. The platform is a product of that work, not a
							pitch-first experiment.
						</p>
						<p className={styles.location}>
							Based in Atlanta and Albuquerque, serving teams across the United
							States.
						</p>
					</div>
					<ul className={styles.bulletList}>
						<li className={styles.bulletItem}>
							More than fifteen years building production systems for government
							and healthcare.
						</li>
						<li className={styles.bulletItem}>
							Direct experience automating hundreds of thousands of claims and
							packets.
						</li>
						<li className={styles.bulletItem}>
							Able to work both with operations leads and technical teams.
						</li>
					</ul>
				</div>
			</div>
		</section>
	);
};
