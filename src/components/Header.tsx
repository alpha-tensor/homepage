import React from "react";
import AlphaMark from "../AlphaMark";
import styles from "./Header.module.css";

export const Header = (): React.JSX.Element => {
	return (
		<header className={styles.header}>
			<div className={styles.container}>
				<a href="/" className={styles.logoLink}>
					<AlphaMark className={styles.logoIcon} />
					<span className={styles.companyName}>AlphaTensor</span>
				</a>
			</div>
		</header>
	);
};
