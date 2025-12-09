import React from "react";

export default function AlphaMark({
	className = "",
}: { className?: string }): React.JSX.Element {
	return (
		<svg
			viewBox="0 0 40 40"
			xmlns="http://www.w3.org/2000/svg"
			className={className}
			role="img"
			aria-label="AlphaTensor Mark"
		>
			<text
				x="0"
				y="28"
				fontFamily="Inter, sans-serif"
				fontWeight="bold"
				fontSize="28"
				fill="currentColor"
			>
				α
			</text>
		</svg>
	);
}
