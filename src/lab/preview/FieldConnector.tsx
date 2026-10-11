import type { RefObject } from "react";
import { useEffect, useState } from "react";
import { connector, pointVisible, type Rect } from "./geometry";
import styles from "./PdfPreview.module.css";

/**
 * The one link line between the active field's box on the page and its row in
 * the generated form.
 *
 * It measures on demand rather than on a timer: only the active field is ever
 * measured, so an idle page costs nothing and a 126 field form is no more work
 * than a 5 field form. Re-measurement is triggered by a scroll anywhere, a
 * window resize, and by the active field changing.
 *
 * A line is drawn only while both endpoints are inside the window, so it never
 * shoots off the top of the page to reach a row that has scrolled away. When it
 * cannot be drawn honestly, nothing is drawn.
 *
 * The curve is stored with the field it was measured for, and rendered only
 * while that field is still the active one. That is what keeps a stale curve
 * from appearing when the pointer moves, without clearing state in an effect.
 */

const BOX_SELECTOR = "[data-lab-box]";
const FIELD_SELECTOR = "[data-lab-field]";

interface FieldConnectorProps {
  /** The stage the connector overlays; all measurements are relative to it. */
  rootRef: RefObject<HTMLElement | null>;
  /** The field to link, or null when nothing is active. */
  activeField: string | null;
}

/** Convert a client rectangle into one relative to the overlay root. */
const toRootRect = (rect: DOMRect, origin: DOMRect): Rect => ({
  left: rect.left - origin.left,
  top: rect.top - origin.top,
  right: rect.right - origin.left,
  bottom: rect.bottom - origin.top,
});

/** Find a tagged element by its data value, avoiding attribute-selector escaping. */
const findByData = (
  root: HTMLElement,
  selector: string,
  key: string,
  value: string,
): HTMLElement | null => {
  for (const element of Array.from(
    root.querySelectorAll<HTMLElement>(selector),
  )) {
    if (element.dataset[key] === value) return element;
  }
  return null;
};

export const FieldConnector = ({
  rootRef,
  activeField,
}: FieldConnectorProps): React.JSX.Element => {
  const [curve, setCurve] = useState<{ field: string; d: string } | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !activeField) return;

    let frame: number | null = null;

    const measure = () => {
      frame = null;
      const rootElement = rootRef.current;
      if (!rootElement) return;

      const box = findByData(rootElement, BOX_SELECTOR, "labBox", activeField);
      const row = findByData(
        rootElement,
        FIELD_SELECTOR,
        "labField",
        activeField,
      );
      if (!box || !row) return;

      const origin = rootElement.getBoundingClientRect();
      const from = toRootRect(box.getBoundingClientRect(), origin);
      const to = toRootRect(row.getBoundingClientRect(), origin);
      if (from.right <= from.left || to.bottom <= to.top) return;

      // The window, expressed in root-relative coordinates. Both terminals must
      // be inside it, so a connector never crosses a scrolled-away edge.
      const viewport: Rect = {
        left: -origin.left,
        top: -origin.top,
        right: window.innerWidth - origin.left,
        bottom: window.innerHeight - origin.top,
      };
      const start = { x: from.right, y: (from.top + from.bottom) / 2 };
      const end = { x: to.left, y: (to.top + to.bottom) / 2 };
      if (!pointVisible(start.x, start.y, viewport)) return;
      if (!pointVisible(end.x, end.y, viewport)) return;

      const path = connector(from, to)?.d ?? null;
      setCurve(path ? { field: activeField, d: path } : null);
    };

    const schedule = () => {
      if (frame === null) frame = window.requestAnimationFrame(measure);
    };

    schedule();
    root.addEventListener("scroll", schedule, true);
    window.addEventListener("scroll", schedule, true);
    window.addEventListener("resize", schedule);
    return () => {
      if (frame !== null) window.cancelAnimationFrame(frame);
      root.removeEventListener("scroll", schedule, true);
      window.removeEventListener("scroll", schedule, true);
      window.removeEventListener("resize", schedule);
    };
  }, [rootRef, activeField]);

  const path = curve && curve.field === activeField ? curve.d : null;

  return (
    <svg className={styles.connectorLayer} aria-hidden="true" focusable="false">
      {path && <path className={styles.connectorPath} d={path} />}
    </svg>
  );
};
