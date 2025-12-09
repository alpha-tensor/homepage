import { motion } from "framer-motion";
import { Database, FileJson, FileText } from "lucide-react";
import React from "react";
import styles from "./SystemView.module.css";

export const SystemView = (): React.JSX.Element => {
	const features = [
		"Template inference from real client packets.",
		"Field mapping and autofill with confidence scores.",
		"Rules graph for eligibility and routing.",
		"Human in the loop review queues.",
	];

	return (
		<section className={styles.section}>
			<div className={styles.container}>
				<div className={styles.grid}>
					{/* Left Content */}
					<div className={styles.content}>
						<span className={styles.label}>PRODUCT</span>
						<h2 className={styles.title}>
							One engine for documents, knowledge, and decisions.
						</h2>
						<p className={styles.body}>
							Under the hood AlphaTensor is a single model of your forms,
							fields, and rules. AlphaTensor builds a typed representation of
							your forms and documents. Every field rule and version is tracked.
							LLMs call into this layer instead of guessing structure. Inputs
							stay predictable and outputs stay reviewable.
						</p>
						<ul className={styles.featureList}>
							{features.map((feature) => (
								<li key={feature} className={styles.featureItem}>
									{feature}
								</li>
							))}
						</ul>
					</div>

					{/* Right Content - Visual */}
					<div className={styles.visualContainer}>
						<div className={styles.cardStack}>
							<Card
								icon={<FileText size={20} />}
								title="Form schema I-130 intake v4"
								subtitle="Last updated 2h ago"
								index={0}
							/>
							<Card
								icon={<Database size={20} />}
								title="Rule set income eligibility 2024-Q3"
								subtitle="Active • Version 1.2"
								index={1}
							/>
							<Card
								icon={<FileJson size={20} />}
								title="Packet view uploaded PDF to extracted fields"
								subtitle="Processing complete"
								index={2}
							/>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

interface CardProps {
	icon: React.ReactNode;
	title: string;
	subtitle: string;
	index: number;
}

const Card = ({ icon, title, subtitle, index }: CardProps) => {
	return (
   	<motion.div
      className={styles.card}
      style={{ left: "50%", x: "-50%" }}
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      whileInView={{
        opacity: 1,
        y: index * -60 + 40,
        scale: 1 - index * 0.05,
        zIndex: 3 - index,
      }}
      viewport={{ once: true, margin: "-50px" }}
      animate={{
        y: [index * -60 + 40, index * -60 + 35, index * -60 + 40],
      }}
      transition={{
        duration: 0.5,
        delay: index * 0.2,
        ease: "easeOut",
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse",
        repeatDelay: 2,
      }}
    >
			<div className={styles.cardIcon}>{icon}</div>
			<div className={styles.cardText}>
				<span className={styles.cardTitle}>{title}</span>
				<span className={styles.cardSubtitle}>{subtitle}</span>
			</div>
		</motion.div>
	);
};
