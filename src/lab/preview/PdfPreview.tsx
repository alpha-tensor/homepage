import workerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import type { CSSProperties } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import styles from "./PdfPreview.module.css";

// Configure the PDF.js worker for Vite. Safe at module scope because this
// module is only ever reached through a dynamic import in the browser.
pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;

/**
 * Page one of the visitor's own document, with the fields AlphaTensor read
 * drawn over it.
 *
 * This module is loaded by dynamic `import()` from an effect, so it never runs
 * during the prerender. That is why the worker is configured at module scope:
 * `pdfjs` touches browser globals on import, and a module that only ever loads
 * in the browser can do that safely. Do not import it statically from a
 * component the server renders, or `/lab` stops building.
 *
 * The file is the visitor's own `File` object, rendered in their browser. The
 * bytes are never re-fetched, so the image costs no request and no storage.
 *
 * Every box is a percentage of the rendered page, because the backend's
 * geometry is already normalized. Nothing here needs the page's point size, so
 * a rotated or cropped page simply has no boxes rather than misplaced ones.
 */

/** A normalized `[x, y, width, height]` box, top-left origin, 0..1. */
export type NormalizedBox = readonly [number, number, number, number];

export interface PdfPreviewProps {
  /** The visitor's own file. Rendered locally; never uploaded again. */
  file: File;
  /** Geometry per field name, from the upload response. */
  boxes: Record<string, NormalizedBox>;
  /** The field the form and the page agree is active, if any. */
  activeField: string | null;
  /** Called with a field name, or null, when a box is hovered. */
  onActivateField: (name: string | null) => void;
}

const percent = (value: number): string => `${value * 100}%`;

export const PdfPreview = ({
  file,
  boxes,
  activeField,
  onActivateField,
}: PdfPreviewProps): React.JSX.Element => {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState(0);

  // Fit the page to the column. Measured rather than guessed so the overlay
  // percentages and the canvas stay in step at every width.
  useEffect(() => {
    const element = wrapRef.current;
    if (!element) return;
    const measure = () => setWidth(element.clientWidth);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const entries = useMemo(() => Object.entries(boxes), [boxes]);

  return (
    <div className={styles.preview} ref={wrapRef}>
      <div className={styles.page}>
        <Document
          file={file}
          loading={<p className={styles.state}>Rendering page one.</p>}
          error={<p className={styles.state}>This page could not be shown.</p>}
        >
          {width > 0 && (
            <Page
              pageNumber={1}
              width={width}
              renderAnnotationLayer={false}
              renderTextLayer={false}
            />
          )}
        </Document>

        {width > 0 && entries.length > 0 && (
          <div className={styles.overlay} aria-hidden="true">
            {entries.map(([name, box]) => {
              const [x, y, w, h] = box;
              if (!(w > 0) || !(h > 0)) return null;
              const style: CSSProperties = {
                left: percent(x),
                top: percent(y),
                width: percent(w),
                height: percent(h),
              };
              return (
                <span
                  key={name}
                  data-lab-box={name}
                  style={style}
                  className={
                    activeField === name
                      ? `${styles.box} ${styles.boxActive}`
                      : styles.box
                  }
                  onMouseEnter={() => onActivateField(name)}
                  onMouseLeave={() => onActivateField(null)}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
