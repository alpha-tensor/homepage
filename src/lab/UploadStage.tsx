import React, { useCallback, useRef, useState } from "react";
import styles from "./UploadStage.module.css";

interface UploadStageProps {
  /** Called only with a file that passed the client-side gate. */
  onSelect: (file: File) => void;
}

/** The accepted types, matching the allow-list in the API contract. */
const ACCEPTED_MIME = new Set([
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/webp",
]);

/** Some systems hand over an empty MIME type, so fall back to the extension. */
const ACCEPTED_EXTENSION = /\.(pdf|png|jpe?g|webp)$/i;

const MAX_BYTES = 20 * 1024 * 1024;

/** The value for the file input's `accept` attribute. */
const ACCEPT_ATTRIBUTE = "application/pdf,image/png,image/jpeg,image/webp";

/** A client-side reason to refuse the file, or null when it is acceptable. */
const rejection = (file: File): string | null => {
  const typeOk =
    ACCEPTED_MIME.has(file.type) ||
    (file.type === "" && ACCEPTED_EXTENSION.test(file.name));
  if (!typeOk) {
    return "That file type is not supported. Use a PDF, PNG, JPEG, or WebP.";
  }
  if (file.size > MAX_BYTES) {
    return "That file is too large. The limit is 20 MB.";
  }
  return null;
};

/**
 * Stage A: the drop zone and file picker.
 *
 * The whole zone is a label, so a click opens the picker and the keyboard
 * reaches the input directly. Validation happens here, before any request, so
 * the visitor sees the reason inline instead of a round trip failing.
 */
export const UploadStage = ({ onSelect }: UploadStageProps): React.JSX.Element => {
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const accept = useCallback(
    (candidate: File | undefined) => {
      if (!candidate) return;
      const reason = rejection(candidate);
      if (reason) {
        setError(reason);
        return;
      }
      setError(null);
      onSelect(candidate);
    },
    [onSelect],
  );

  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setDragging(false);
    accept(event.dataTransfer.files[0]);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    accept(event.target.files?.[0]);
    // Clear the value so choosing the same file twice fires a change again.
    event.target.value = "";
  };

  return (
    <div className={styles.wrap}>
      <label
        className={`${styles.dropzone} ${dragging ? styles.dragging : ""}`}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          className={styles.input}
          type="file"
          accept={ACCEPT_ATTRIBUTE}
          onChange={handleChange}
        />
        <span className={styles.mark} aria-hidden="true" />
        <span className={styles.prompt}>
          Drop a document here, or choose a file.
        </span>
        <span className={styles.hint}>
          PDF, PNG, JPEG, or WebP. Up to 20 MB. One file.
        </span>
        <span className={`btn btn-primary ${styles.cta}`}>Choose a file</span>
      </label>

      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
    </div>
  );
};
