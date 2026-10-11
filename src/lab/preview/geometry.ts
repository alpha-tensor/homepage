/**
 * Pure geometry for the lab's annotated page preview.
 *
 * The backend reports each page-one widget as a normalized
 * `[x, y, width, height]` box with a top-left origin (see `PublicFormField.bbox`
 * in `padilla/routers/public_analysis/schemas.py`). A normalized box is a
 * percentage of whatever the renderer drew, so placing a box needs no PDF point
 * space and no page measurement. That is why this module is arithmetic only and
 * can be reasoned about without a layout engine.
 *
 * The connector is one cubic Bezier with horizontal tangents at both ends,
 * taken from the case-ops fill tool (`connectors.ts`), where it links a widget
 * to its inspector row. Here it links a widget on the page to its row in the
 * generated form. One curve, no bends, and none of the diagram machinery the
 * editor needs.
 */

/** An axis-aligned rectangle in CSS pixels, relative to one ancestor. */
export interface Rect {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

/** A routed connector: SVG path data and the two terminals it joins. */
export interface Connector {
  /** SVG path data for the curve. */
  d: string;
  /** Terminal at the widget, its right edge midpoint. */
  start: { x: number; y: number };
  /** Terminal at the form row, its left edge midpoint. */
  end: { x: number; y: number };
}

/** Horizontal room the two panes must leave for a connector to read cleanly. */
export const MIN_CONNECTOR_GAP = 24;

/**
 * Longest horizontal control handle.
 *
 * The handle is normally half the gap, which puts both control points at the
 * midpoint of the run. On a wide gap that stretches the horizontal tangents and
 * the curve reads as a flat run with all its vertical travel crammed into the
 * middle. Capping the handle keeps the bend in the gutter so the curve still
 * reads as a link.
 */
export const MAX_CONTROL_OFFSET = 128;

/** Endpoints must clear their viewport edge by this much to count as in view. */
export const VISIBLE_MARGIN = 4;

const round1 = (value: number): number => Math.round(value * 10) / 10;

/** The vertical centre of a rectangle. */
export const rectCenterY = (rect: Rect): number => (rect.top + rect.bottom) / 2;

/** True when a point sits inside the viewport, with the given edge margin. */
export const pointVisible = (
  x: number,
  y: number,
  viewport: Rect,
  margin: number = VISIBLE_MARGIN,
): boolean =>
  x >= viewport.left + margin &&
  x <= viewport.right - margin &&
  y >= viewport.top + margin &&
  y <= viewport.bottom - margin;

/**
 * Route one cubic Bezier from a widget's right edge to a form row's left edge.
 *
 * Both terminals keep a horizontal tangent, so the curve leaves the page box
 * perpendicular to the pane edge and arrives at the row the same way. Returns
 * null when the row does not sit to the right of the widget with a usable gap,
 * which is the honest answer when the two panes overlap or wrap to one column.
 *
 * @param from The widget box, in coordinates relative to the connector's root.
 * @param to The form row box, in the same coordinate space.
 * @returns The curve, or null when there is nothing worth drawing.
 */
export const connector = (from: Rect, to: Rect): Connector | null => {
  const startX = from.right;
  const startY = rectCenterY(from);
  const endX = to.left;
  const endY = rectCenterY(to);
  const gap = endX - startX;
  if (gap < MIN_CONNECTOR_GAP) return null;
  const handle = Math.min(gap / 2, MAX_CONTROL_OFFSET);
  const start = { x: round1(startX), y: round1(startY) };
  const end = { x: round1(endX), y: round1(endY) };
  return {
    d:
      `M ${start.x} ${start.y} ` +
      `C ${round1(startX + handle)} ${start.y}, ` +
      `${round1(endX - handle)} ${end.y}, ${end.x} ${end.y}`,
    start,
    end,
  };
};
