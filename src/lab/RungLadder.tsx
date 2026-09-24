import React, { useEffect, useRef, useState } from "react";
import styles from "./RungLadder.module.css";
import type { Rung } from "./types";

interface RungLadderProps {
  /** Rungs exactly as returned, in the order the API sent them. */
  rungs: Rung[];
  /** Called once the last rung has been revealed. */
  onComplete?: () => void;
}

/** Gap between one rung appearing and the next. */
const REVEAL_INTERVAL_MS = 320;

/** Fallback labels, used only if the API sends an empty label. */
const FALLBACK_LABELS: Record<string, string> = {
  document: "Document",
  jurisdiction: "Country or jurisdiction",
  agency: "Agency",
  form_type: "Form",
  edition: "Edition",
  language: "Language",
};

const prefersReducedMotion = (): boolean => {
  if (
    typeof window === "undefined" ||
    typeof window.matchMedia !== "function"
  ) {
    return false;
  }
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

/**
 * The identity ladder, revealed one rung at a time.
 *
 * Every row is rendered from the start so the panel keeps its height and never
 * shifts under the reader; only opacity turns on. A rung the server marked
 * unknown is shown as "Not identified" rather than being dropped or guessed.
 */
export const RungLadder = ({
  rungs,
  onComplete,
}: RungLadderProps): React.JSX.Element => {
  const [visible, setVisible] = useState(0);
  const completeRef = useRef(onComplete);

  useEffect(() => {
    completeRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (rungs.length === 0) {
      const timer = window.setTimeout(() => completeRef.current?.(), 0);
      return () => window.clearTimeout(timer);
    }

    // Reduced motion: skip the stagger and show the whole ladder at once.
    if (prefersReducedMotion()) {
      const timer = window.setTimeout(() => {
        setVisible(rungs.length);
        completeRef.current?.();
      }, 0);
      return () => window.clearTimeout(timer);
    }

    const timers: number[] = [];
    rungs.forEach((_, index) => {
      timers.push(
        window.setTimeout(
          () => setVisible(index + 1),
          REVEAL_INTERVAL_MS * (index + 1),
        ),
      );
    });
    timers.push(
      window.setTimeout(
        () => completeRef.current?.(),
        REVEAL_INTERVAL_MS * (rungs.length + 1),
      ),
    );

    return () => {
      for (const timer of timers) window.clearTimeout(timer);
    };
  }, [rungs]);

  return (
    <ol className={styles.ladder}>
      {rungs.map((rung, index) => {
        const shown = index < visible;
        const identified = rung.status === "identified" && rung.value !== null;
        return (
          <li
            key={rung.key}
            className={`${styles.row} ${shown ? styles.rowVisible : ""}`}
            aria-hidden={shown ? undefined : true}
          >
            <span className={styles.label}>
              {rung.label || FALLBACK_LABELS[rung.key] || rung.key}
            </span>
            <span className={identified ? styles.value : styles.unknown}>
              {identified ? rung.value : "Not identified"}
            </span>
          </li>
        );
      })}
    </ol>
  );
};
