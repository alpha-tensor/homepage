import type { ComponentType } from "react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import type { DerivedForm } from "./form/document";
import { LightFormView } from "./form/LightForm";
import { FieldConnector } from "./preview/FieldConnector";
import type { NormalizedBox, PdfPreviewProps } from "./preview/PdfPreview";
import { RungLadder } from "./RungLadder";
import styles from "./ReadingStage.module.css";
import type { DocumentIdentity, LabStatus, PublicFormField } from "./types";

interface ReadingStageProps {
  /** The visitor's own file, rendered locally in the page preview. */
  file: File | null;
  fileName: string;
  fileSize: number;
  documentId: string | null;
  status: LabStatus;
  identity: DocumentIdentity | null;
  error: string | null;
  /** The named page-one fields, straight from the upload response. */
  fields: PublicFormField[];
  form: DerivedForm | null;
  onRetry: () => void;
  onStartOver: () => void;
  onLadderComplete: () => void;
}

const formatBytes = (bytes: number): string => {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  if (bytes >= 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${bytes} B`;
};

/**
 * Stage B: what AlphaTensor reads from page one.
 *
 * Three parts. The identity ladder fills in rung by rung. The page preview
 * shows the visitor's own first page with a box on every field that was read,
 * and a single curved link from the field being pointed at to its row in the
 * form below. And the form itself is the document's own page-one fields.
 *
 * The preview is loaded by dynamic import and rendered only in the browser.
 * `/lab` is prerendered, and `pdfjs` touches browser globals on import, so the
 * preview must never be part of the server render.
 */
export const ReadingStage = ({
  file,
  fileName,
  fileSize,
  documentId,
  status,
  identity,
  error,
  fields,
  form,
  onRetry,
  onStartOver,
  onLadderComplete,
}: ReadingStageProps): React.JSX.Element => {
  // The id of the document whose ladder has finished. Held as an id rather than
  // a boolean so a new document, or a retry, resets the reveal with no effect.
  const [revealedId, setRevealedId] = useState<string | null>(null);
  const revealed = documentId !== null && revealedId === documentId;

  // The field the page preview and the form agree is active. Null is the rest
  // state, so an untouched page draws no link line.
  const [activeField, setActiveField] = useState<string | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);

  // The preview module, resolved in the browser only. Until it arrives there is
  // simply no preview, which is the correct server-rendered state.
  const [Preview, setPreview] = useState<ComponentType<PdfPreviewProps> | null>(
    null,
  );

  useEffect(() => {
    let alive = true;
    void import("./preview/PdfPreview").then((module) => {
      if (alive) setPreview(() => module.PdfPreview);
    });
    return () => {
      alive = false;
    };
  }, []);

  // A new document starts with nothing pointed at.
  useEffect(() => {
    setActiveField(null);
  }, [documentId]);

  // Geometry per field name. Reserved machine fields are skipped, and a field
  // with no drawable box is left out rather than given a guessed one.
  const boxes = useMemo(() => {
    const map: Record<string, NormalizedBox> = {};
    for (const field of fields) {
      const bbox = field.bbox;
      if (field.reserved || !bbox || bbox.length !== 4) continue;
      map[field.name] = [bbox[0], bbox[1], bbox[2], bbox[3]];
    }
    return map;
  }, [fields]);

  const showPreview =
    file !== null && Preview !== null && Object.keys(boxes).length > 0;

  const failed = status === "failed";
  const statusText = revealed
    ? "Page one processed."
    : status === "starting"
      ? "Starting a session."
      : "Reading the document.";

  const handleComplete = () => {
    setRevealedId(documentId);
    onLadderComplete();
  };

  return (
    <div
      className={
        showPreview ? `${styles.grid} ${styles.gridWithPreview}` : styles.grid
      }
      ref={rootRef}
    >
      <div className={styles.analysis}>
        {!failed && (
          <p className={styles.status} role="status">
            {!revealed && <span className={styles.dot} aria-hidden="true" />}
            <span>{statusText}</span>
          </p>
        )}

        {!identity && !failed && (
          <p className={styles.note}>
            Your file is shown here immediately. Only the first page is read.
          </p>
        )}

        {identity && identity.rungs.length > 0 && (
          <>
            <p className={styles.meta}>
              Page {identity.pages_processed}
              {identity.page_count ? ` of ${identity.page_count}` : ""}{" "}
              processed.
            </p>
            {identity.has_text_layer === false && (
              <p className={styles.note}>
                This looks like a scan. This version reads the text layer on the
                first page, so a scan is not identified yet.
              </p>
            )}
            <RungLadder
              key={documentId ?? "document"}
              rungs={identity.rungs}
              onComplete={handleComplete}
            />
          </>
        )}

        {failed && (
          <div className={styles.errorBox} role="alert">
            <p className={styles.errorText}>
              {error ?? "Something went wrong."}
            </p>
            <div className={styles.actions}>
              <button
                type="button"
                className="btn btn-primary"
                onClick={onRetry}
              >
                Try again
              </button>
              <button
                type="button"
                className="btn btn-outline"
                onClick={onStartOver}
              >
                Choose another document
              </button>
            </div>
          </div>
        )}
      </div>

      {showPreview && file && Preview && (
        <div className={styles.previewColumn}>
          <p className={styles.previewHead}>Page 1, with the fields we read</p>
          <Preview
            file={file}
            boxes={boxes}
            activeField={activeField}
            onActivateField={setActiveField}
          />
        </div>
      )}

      <div className={styles.pane}>
        <div className={styles.paneHead}>
          <span className={styles.fileName}>{fileName}</span>
          <span className={styles.fileSize}>{formatBytes(fileSize)}</span>
        </div>
        {form ? (
          <LightFormView
            key={form.template.id}
            template={form.template}
            initialValues={form.values}
            activeField={activeField}
            onActivateField={setActiveField}
          />
        ) : status === "ready" ? (
          <p className={styles.note}>
            This document carries no named page-one fields, so there is no form
            to show.
          </p>
        ) : null}
      </div>

      {showPreview && (
        <FieldConnector rootRef={rootRef} activeField={activeField} />
      )}
    </div>
  );
};
