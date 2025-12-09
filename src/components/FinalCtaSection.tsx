import React from "react";
import styles from "./FinalCtaSection.module.css";

interface FinalCtaSectionProps {
	onCtaClick?: () => void;
}

export const FinalCtaSection = ({
	onCtaClick,
}: FinalCtaSectionProps): React.JSX.Element => {
	const handleCtaClick = () => {
		if (onCtaClick) {
			onCtaClick();
		} else {
			window.open("https://cal.com/", "_blank");
		}
	};

	return (
		<section className={styles.section}>
			<div className={styles.container}>
				<h2 className={styles.title}>
					Bring one messy workflow and map it in thirty minutes.
				</h2>
				<p className={styles.subline}>
					Book a working session. Bring a real packet or process. See exactly
					how AlphaTensor would structure and automate it.
				</p>
				<button
					type="button"
					className={`btn ${styles.ctaButton}`}
					onClick={handleCtaClick}
				>
					Schedule a working session
				</button>
				<p className={styles.microCopy}>
					No sales theater. Live architecture and honest feasibility.
				</p>
			</div>
		</section>
	);
};
