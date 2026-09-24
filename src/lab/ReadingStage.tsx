import React, { useState } from "react";
import { RungLadder } from "./RungLadder";
import styles from "./ReadingStage.module.css";
import type { DocumentIdentity, DocumentKind, LabStatus } from "./types";

interface ReadingStageProps {
  fileName: string;
  fileSize: number;
  kind: DocumentKind;
  previewUrl: string;
  documentId: string | null;
  status: LabStatus;
  identity: DocumentIdentity | null;
  error: string | null;
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
 * Stage B: the visitor's own file, and what AlphaTensor reads from page one.
 *
 * The file is shown from a browser object URL the moment it is chosen, before
 * any request resolves, so the page never waits on the server to show the
 * document. The ladder then fills in rung by rung.
 */
export const ReadingStage = ({
  fileName,
  fileSize,
  kind,
  previewUrl,
  documentId,
  status,
  identity,
  error,
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

      <figure className={styles.viewer}>
        <figcaption className={styles.fileMeta}>
          <span className={styles.fileName}>{fileName}</span>
          <span className={styles.fileSize}>{formatBytes(fileSize)}</span>
        </figcaption>
        <div className={styles.frameWrap}>
          {kind === "pdf" ? (
            <iframe
              className={styles.frame}
              title="Your document, first page"
              src={`${previewUrl}#page=1&view=FitH`}
            />
          ) : (
            <img
              className={styles.image}
              src={previewUrl}
              alt="Your uploaded document"
            />
          )}
        </div>
      </figure>
    </div>
  );
};
