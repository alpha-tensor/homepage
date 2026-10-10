import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  createSession,
  describeError,
  submitContact,
  uploadDocument,
} from "./api";
import { ContactStage } from "./ContactStage";
import type { ContactSubmission } from "./ContactStage";
import { buildLightFormFromDocument } from "./form/document";
import { LightFormView } from "./form/LightForm";
import styles from "./LabPage.module.css";
import { ReadingStage } from "./ReadingStage";
import type {
  ContactPayload,
  DocumentIdentity,
  DocumentKind,
  LabStatus,
  PublicFormField,
  Session,
} from "./types";
import { UploadStage } from "./UploadStage";

/**
 * The public document lab at `/lab`.
 *
 * Up to four stages on one page: upload, read the document, render the
 * document's own page-one fields as a form, and capture contact. The form
 * stage appears only when the file carries named fields, so a scan skips it.
 * The session credential lives in memory for the life of the tab, never in
 * storage, and the file is shown from a browser object URL that is revoked
 * when the page unmounts.
 *
 * This component must render on the server (the build prerenders `/lab`), so
 * there is no `window` access at module scope or during render. Everything
 * browser-only happens inside effects or event handlers.
 */
export const LabPage = (): React.JSX.Element => {
  const [file, setFile] = useState<File | null>(null);
  const [kind, setKind] = useState<DocumentKind>("pdf");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [documentId, setDocumentId] = useState<string | null>(null);
  const [identity, setIdentity] = useState<DocumentIdentity | null>(null);
  const [fields, setFields] = useState<PublicFormField[]>([]);
  const [status, setStatus] = useState<LabStatus>("empty");
  const [error, setError] = useState<string | null>(null);
  const [contactVisible, setContactVisible] = useState(false);
  const previewUrlRef = useRef<string | null>(null);

  const releasePreview = useCallback(() => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
    setPreviewUrl(null);
  }, []);

  // Revoke the last object URL on unmount. The ref is still null when React
  // runs the simulated unmount in StrictMode, so this cannot revoke a live URL.
  useEffect(() => releasePreview, [releasePreview]);

  const run = useCallback(
    async (nextFile: File, activeSession: Session | null) => {
      setStatus("starting");
      setError(null);
      setIdentity(null);
      setFields([]);
      setDocumentId(null);
      setContactVisible(false);

      try {
        let current = activeSession;
        if (!current) {
          current = await createSession();
          setSession(current);
        }

        setStatus("reading");
        const result = await uploadDocument(current, nextFile);
        if (result.status === "failed" || !result.identity) {
          setError(
            "We could not read this document. It may be protected, or it may not be a supported form.",
          );
          setStatus("failed");
          return;
        }

        setDocumentId(result.document_id);
        setIdentity(result.identity);
        setFields(result.fields ?? []);
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
      releasePreview();
      const url = URL.createObjectURL(nextFile);
      previewUrlRef.current = url;
      setPreviewUrl(url);
      setKind(nextFile.type === "application/pdf" ? "pdf" : "image");
      setFile(nextFile);
      setSession(null);
      void run(nextFile, null);
    },
    [releasePreview, run],
  );

  const handleRetry = useCallback(() => {
    if (file) void run(file, session);
  }, [file, session, run]);

  const handleStartOver = useCallback(() => {
    releasePreview();
    setFile(null);
    setSession(null);
    setDocumentId(null);
    setIdentity(null);
    setFields([]);
    setError(null);
    setStatus("empty");
    setContactVisible(false);
  }, [releasePreview]);

  const handleLadderComplete = useCallback(() => {
    setContactVisible(true);
  }, []);

  // The document's own page-one fields, rendered as a form. Null for a scan,
  // a flattened form, or an image, none of which carry named fields.
  const form = useMemo(() => {
    if (!file || !documentId) return null;
    return buildLightFormFromDocument({
      documentId,
      filename: file.name,
      identity,
      fields,
    });
  }, [file, documentId, identity, fields]);

  const handleContactSubmit = useCallback(
    async (payload: ContactPayload): Promise<ContactSubmission> => {
      if (!session) {
        return {
          ok: false,
          message:
            "This session has expired. Start again to upload the document.",
        };
      }
      try {
        const result = await submitContact(session, payload);
        if (!result.recorded) {
          return { ok: false, message: "We could not record that. Try again." };
        }
        return { ok: true };
      } catch (caught) {
        return { ok: false, message: describeError(caught) };
      }
    },
    [session],
  );

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {!file && (
          <section className={styles.stage} aria-labelledby="lab-title">
            <span className={styles.eyebrow}>AlphaTensor Labs</span>
            <h1 id="lab-title" className={styles.headline}>
              See what AlphaTensor reads from a document.
            </h1>
            <p className={styles.lead}>
              Upload a PDF or image and AlphaTensor shows what it identifies,
              item by item. Only the first page is processed, and no account is
              needed.
            </p>
            <UploadStage onSelect={handleFile} />
          </section>
        )}

        {file && previewUrl && (
          <section className={styles.stage} aria-labelledby="lab-reading">
            <header className={styles.stageHead}>
              <span className={styles.stageLabel}>
                02 / Reading the document
              </span>
              <h2 id="lab-reading" className={styles.stageTitle}>
                What AlphaTensor reads
              </h2>
            </header>
            <ReadingStage
              fileName={file.name}
              fileSize={file.size}
              kind={kind}
              previewUrl={previewUrl}
              documentId={documentId}
              status={status}
              identity={identity}
              error={error}
              onRetry={handleRetry}
              onStartOver={handleStartOver}
              onLadderComplete={handleLadderComplete}
            />
          </section>
        )}

        {form && (
          <section className={styles.stage} aria-labelledby="lab-form">
            <header className={styles.stageHead}>
              <span className={styles.stageLabel}>03 / The form</span>
              <h2 id="lab-form" className={styles.stageTitle}>
                {form.template.title}
              </h2>
              <p className={styles.stageLead}>{form.template.description}</p>
            </header>
            <LightFormView
              key={form.template.id}
              template={form.template}
              initialValues={form.values}
            />
          </section>
        )}

        {contactVisible && session && (
          <section className={styles.stage} aria-labelledby="lab-contact">
            <header className={styles.stageHead}>
              <span className={styles.stageLabel}>
                {form ? "04 / Contact" : "03 / Contact"}
              </span>
              <h2 id="lab-contact" className={styles.stageTitle}>
                Where should we follow up?
              </h2>
              <p className={styles.stageLead}>
                Leave an email and we will get back to you about this document.
              </p>
            </header>
            <ContactStage onSubmit={handleContactSubmit} />
          </section>
        )}
      </div>
    </div>
  );
};
