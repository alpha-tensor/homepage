import React, { useCallback, useState } from "react";
import { createSession, describeError, uploadDocument } from "../api";
import type {
  DocumentIdentity,
  LabStatus,
  PublicFormField,
  Session,
  UploadResult,
} from "../types";
import { UploadStage } from "../UploadStage";
import { buildLightFormFromDocument } from "./document";
import styles from "./FormLabPage.module.css";
import { LightFormView } from "./LightForm";
import { FORM_SAMPLES } from "./samples";

/**
 * The generated-form experiment at `/lab/form`.
 *
 * Same idea as the tagline lab: a standalone page under `/lab`, kept out of the
 * main funnel and free of Google tags, to settle one question before any of it
 * reaches a real surface. The question is whether the sections, field names and
 * values read off a document are enough to render a usable form, using the same
 * renderer the sample templates use.
 *
 * The path is: drop a PDF or image, it is identified as on `/lab`, and the
 * document's own page-one fields become a form. The shape comes from the upload
 * response; the renderer is `LightFormView`. A fillable form yields fields, and
 * a scan yields none, which the page states rather than disguising.
 */

/** A one-line summary of what the ladder established, for the header. */
const summarize = (identity: DocumentIdentity | null): string => {
  if (!identity) return "Reading the document.";
  const identified = identity.rungs.filter(
    (rung) => rung.status === "identified" && rung.value,
  );
  if (identified.length === 0) return "No identity signals were established.";
  return identified
    .map((rung) => `${rung.label}: ${rung.value}`)
    .join(" \u00b7 ");
};

const formatBytes = (bytes: number): string => {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  if (bytes >= 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${bytes} B`;
};

export const FormLabPage = (): React.JSX.Element => {
  const [file, setFile] = useState<File | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [documentId, setDocumentId] = useState<string | null>(null);
  const [identity, setIdentity] = useState<DocumentIdentity | null>(null);
  const [fields, setFields] = useState<PublicFormField[]>([]);
  const [status, setStatus] = useState<LabStatus>("empty");
  const [error, setError] = useState<string | null>(null);
  const [sampleId, setSampleId] = useState<string>(FORM_SAMPLES[0].id);

  const fallback =
    FORM_SAMPLES.find((sample) => sample.id === sampleId) ?? FORM_SAMPLES[0];

  const run = useCallback(
    async (nextFile: File, activeSession: Session | null) => {
      setStatus("starting");
      setError(null);
      setIdentity(null);
      setFields([]);
      setDocumentId(null);

      try {
        let current = activeSession;
        if (!current) {
          current = await createSession();
          setSession(current);
        }

        setStatus("reading");
        const uploaded: UploadResult = await uploadDocument(current, nextFile);

        if (uploaded.status === "failed" || !uploaded.identity) {
          setError(
            "We could not read this document. It may be protected, or it may not be a supported form.",
          );
          setStatus("failed");
          return;
        }

        setDocumentId(uploaded.document_id);
        setIdentity(uploaded.identity);
        setFields(uploaded.fields ?? []);
        setStatus("ready");
      } catch (caught) {
        setError(describeError(caught));
        setStatus("failed");
      }
    },
    [],
  );

  const handleFile = useCallback(
    (nextFile: File) => {
      setFile(nextFile);
      setSession(null);
      void run(nextFile, null);
    },
    [run],
  );

  const handleRetry = useCallback(() => {
    if (file) void run(file, session);
  }, [file, session, run]);

  const handleStartOver = useCallback(() => {
    setFile(null);
    setSession(null);
    setDocumentId(null);
    setIdentity(null);
    setFields([]);
    setError(null);
    setStatus("empty");
  }, []);

  // The document's own form, once fields were read off page one.
  const derived =
    documentId && file
      ? buildLightFormFromDocument({
          documentId,
          filename: file.name,
          identity,
          fields,
        })
      : null;

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <section className={styles.stage} aria-labelledby="form-lab-title">
          <span className={styles.eyebrow}>AlphaTensor Labs</span>
          <h1 id="form-lab-title" className={styles.headline}>
            A form from the fields a document carries.
          </h1>
          <p className={styles.lead}>
            Drop a PDF or image. AlphaTensor identifies it, and its sections,
            field names and values are rendered straight as a form, using the
            same renderer as the sample templates below. Nothing is stored and
            no account is needed.
          </p>

          {!file && <UploadStage onSelect={handleFile} />}
        </section>

        {file && (
          <section className={styles.stage} aria-labelledby="form-lab-result">
            <header className={styles.stageHead}>
              <span className={styles.stageLabel}>
                {file.name} · {formatBytes(file.size)}
              </span>
              <h2 id="form-lab-result" className={styles.stageTitle}>
                {derived
                  ? derived.template.title
                  : status === "failed"
                    ? "We could not read this document"
                    : "Reading the document"}
              </h2>
              <p className={styles.stageLead}>
                {status === "failed" ? (error ?? "") : summarize(identity)}
              </p>
            </header>

            {status === "failed" && (
              <div className={styles.actions}>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleRetry}
                >
                  Try again
                </button>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={handleStartOver}
                >
                  Choose another document
                </button>
              </div>
            )}

            {derived && (
              <LightFormView
                key={derived.template.id}
                template={derived.template}
                initialValues={derived.values}
              />
            )}

            {!derived && status === "ready" && (
              <p className={styles.note}>
                No page-one fields were found in this document. A flattened scan
                or a form with no fillable fields has none to read. The renderer
                below runs on a sample template so it can still be judged.
              </p>
            )}

            {!derived && status === "ready" && (
              <>
                <div className={styles.picker}>
                  <label
                    className={styles.pickerLabel}
                    htmlFor="form-lab-sample"
                  >
                    Sample template
                  </label>
                  <select
                    id="form-lab-sample"
                    className={styles.pickerSelect}
                    value={sampleId}
                    onChange={(event) => setSampleId(event.target.value)}
                  >
                    {FORM_SAMPLES.map((sample) => (
                      <option key={sample.id} value={sample.id}>
                        {sample.document}
                      </option>
                    ))}
                  </select>
                </div>
                <LightFormView key={fallback.id} template={fallback} />
              </>
            )}

            {derived && (
              <div className={styles.actions}>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={handleStartOver}
                >
                  Choose another document
                </button>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
};
