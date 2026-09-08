import React from "react";
import styles from "./MatrixGrid.module.css";

interface MatrixGridProps {
  rows?: number;
  cols?: number;
  /** Row-major index of the offset orange dot (default: last dot). */
  exception?: number;
  tone?: "ink" | "onDark";
  className?: string;
}

/**
 * Recurring matrix motif: an aligned grid of neutral dots with one deliberately
 * offset orange exception. Static and deterministic so server rendering,
 * hydration, and no-JS views agree. Decorative only; rendered aria-hidden.
 *
 * The journey classification stage owns the animated scatter-to-align
 * sequence; this component is the settled form of the same grammar.
 */
export const MatrixGrid = ({
  rows = 3,
  cols = 7,
  exception,
  tone = "ink",
  className = "",
}: MatrixGridProps): React.JSX.Element => {
  const count = rows * cols;
  const exc = exception ?? count - 1;
  return (
    <span
      className={`${styles.matrix} ${tone === "onDark" ? styles.onDark : ""} ${className}`}
      style={
        {
          "--mx-cols": cols,
          gridTemplateColumns: `repeat(${cols}, var(--mx-size))`,
        } as React.CSSProperties
      }
      aria-hidden="true"
    >
      {Array.from({ length: count }, (_, i) => (
        <span key={i} className={i === exc ? styles.exc : undefined} />
      ))}
    </span>
  );
};
