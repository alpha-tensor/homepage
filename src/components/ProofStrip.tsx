import React from "react";
import styles from "./ProofStrip.module.css";

export const ProofStrip = (): React.JSX.Element => {
	const proofs = [
		"Federal claims workflows",
		"Immigration case automation",
		"Internal knowledge tools for consulting teams",
	];

	return (
		<section className={styles.section}>
			<div className={styles.container}>
				<span className={styles.label}>PREVIOUSLY DEPLOYED IN</span>
				<ul className={styles.list}>
					{proofs.map((proof) => (
						<li key={proof} className={styles.pill}>
							{proof}
						</li>
					))}
				</ul>
			</div>
		</section>
	);
};
