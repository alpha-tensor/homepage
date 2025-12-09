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
							Run fully managed or in your own cloud environment. Private data
							is not used to train foundation models.
						</p>
					</div>
					<div className={styles.block}>
						<h3 className={styles.blockHeading}>Security</h3>
						<p className={styles.blockText}>
							Encryption in transit and at rest. Role based access and clear
							separation between environments.
						</p>
					</div>
					<div className={styles.block}>
						<h3 className={styles.blockHeading}>Explainability</h3>
						<p className={styles.blockText}>
							Every automated action links back to original documents and
							explicit rules. No decisions that rely on the model alone
							without a clear record.
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
