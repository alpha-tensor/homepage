import React from "react";
import styles from "./TrustSection.module.css";

export const TrustSection = (): React.JSX.Element => {
	return (
		<section className={styles.section}>
			<div className={styles.container}>
				<h2 className={styles.title}>
					Built for regulated teams not toy demos.
				</h2>
				<div className={styles.grid}>
					<div className={styles.block}>
						<h3 className={styles.blockHeading}>Deployment</h3>
						<p className={styles.blockText}>
							Runs in your cloud, no training on your data. Private instances
							available for strict data sovereignty requirements.
						</p>
					</div>
					<div className={styles.block}>
						<h3 className={styles.blockHeading}>Security</h3>
						<p className={styles.blockText}>
							Role based access and clear separation between environments.
							Enterprise grade security defaults at every layer.
						</p>
					</div>
					<div className={styles.block}>
						<h3 className={styles.blockHeading}>Explainability</h3>
						<p className={styles.blockText}>
							Every automated action links back to original pages. No black box
							decisions, only verifiable audit trails.
						</p>
					</div>
				</div>
				<div className={styles.footer}>
					<p className={styles.footerText}>
						AlphaTensor is comfortable working through security reviews
						procurement and compliance checks.
					</p>
				</div>
			</div>
		</section>
	);
};
