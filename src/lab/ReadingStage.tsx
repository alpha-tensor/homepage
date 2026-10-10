import React, { useState } from "react";
import type { DerivedForm } from "./form/document";
import { LightFormView } from "./form/LightForm";
import { RungLadder } from "./RungLadder";
import styles from "./ReadingStage.module.css";
import type { DocumentIdentity, LabStatus } from "./types";

interface ReadingStageProps {
  fileName: string;
  fileSize: number;
  documentId: string | null;
  status: LabStatus;
  identity: DocumentIdentity | null;
  error: string | null;
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
 * Stage B: what AlphaTensor reads from page one, beside the form it implies.
 *
 * The left column is the identity ladder, filling in rung by rung. The right
 * column is the document's own page-one fields rendered as a form, which
 * replaces the file preview so the visitor reads what was read rather than the
 * file they already have.
 */
export const ReadingStage = ({
  fileName,
  fileSize,
  documentId,
  status,
  identity,
  error,
  form,
  onRetry,
  onStartOver,
  onLadderComplete,
}: ReadingStageProps): React.JSX.Element => {
  // The id of the document whose ladder has finished. Held as an id rather than
  // a boolean so a new document, or a retry, resets the reveal with no effect.
  const [revealedId, setRevealedId] = useState<string | null>(null);
  const revealed = documentId !== null && revealedId === documentId;

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
    <div className={styles.grid}>
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
          />
        ) : status === "ready" ? (
          <p className={styles.note}>
            This document carries no named page-one fields, so there is no form
            to show.
          </p>
        ) : null}
      </div>
    </div>
  );
};
