import React from "react";
import styles from "./StatusChip.module.css";

/**
 * Shared status grammar for the page's case-file motif.
 *
 * Every state a document, field, or case can be in is shown as one of three
 * tones, so the page reads with one consistent vocabulary instead of each
 * section improvising its own chips.
 *
 * Vocabulary the copy should use with each tone:
 * - neutral: "Document received", "Classified", "In progress", "Manual"
 * - review (orange): "Missing evidence", "Needs review", "Low confidence" —
 *   orange is the attention signal; nothing else on the page uses it as a
 *   status color.
 * - done (ink): "Data captured", "Structured", "Ready for review",
 *   "Automated", "Complete"
 */
export type StatusTone = "neutral" | "review" | "done";

export interface StatusChipProps {
  children: React.ReactNode;
  tone?: StatusTone;
  className?: string;
}

export const StatusChip = ({
  children,
  tone = "neutral",
  className = "",
}: StatusChipProps): React.JSX.Element => {
  const toneClass =
    tone === "review" ? styles.review : tone === "done" ? styles.done : styles.neutral;

  return (
    <span className={`${styles.chip} ${toneClass} ${className}`.trim()}>
      {tone === "review" && (
        <span className={styles.marker} aria-hidden="true" />
      )}
      {children}
    </span>
  );
};
