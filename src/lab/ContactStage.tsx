import React, { useId, useState } from "react";
import styles from "./ContactStage.module.css";
import type { ContactIntent, ContactPayload } from "./types";

/** The submit result, so the caller decides success and the form owns display. */
export type ContactSubmission = { ok: true } | { ok: false; message: string };

interface ContactStageProps {
  onSubmit: (payload: ContactPayload) => Promise<ContactSubmission>;
}

const INTENT_OPTIONS: Array<{ value: ContactIntent; label: string }> = [
  { value: "for_a_client", label: "For a client" },
  { value: "for_myself", label: "For myself" },
  { value: "for_my_organization", label: "For my organization" },
  { value: "evaluating", label: "I'm evaluating AlphaTensor" },
  { value: "research_or_other", label: "Research or other" },
];

const NOTE_MAX = 300;

/**
 * Stage C: contact capture after the ladder finishes.
 *
 * Values are held here, so a failed submit leaves everything the visitor typed
 * in place. A confirmation is only shown when the request actually recorded.
 */
export const ContactStage = ({
  onSubmit,
}: ContactStageProps): React.JSX.Element => {
  const emailId = useId();
  const phoneId = useId();
  const intentId = useId();
  const noteId = useId();

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [intent, setIntent] = useState<ContactIntent | "">("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;

    if (intent === "") {
      setError("Choose what you are working on.");
      return;
    }

    setError(null);
    setSubmitting(true);

    const payload: ContactPayload = { email: email.trim(), intent };
    const trimmedPhone = phone.trim();
    if (trimmedPhone !== "") payload.phone = trimmedPhone;
    const trimmedNote = note.trim();
    if (trimmedNote !== "") payload.note = trimmedNote;

    const result = await onSubmit(payload);
    if (result.ok) {
      setDone(true);
      return;
    }
    setError(result.message);
    setSubmitting(false);
  };

  if (done) {
    return (
      <p className={styles.confirmation} role="status">
        Thanks. We have your details and will follow up about this document.
      </p>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate={false}>
      <div className={styles.field}>
        <label className={styles.label} htmlFor={emailId}>
          Email <span className={styles.required}>Required</span>
        </label>
        <input
          id={emailId}
          className={styles.control}
          type="email"
          name="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor={phoneId}>
          Phone <span className={styles.optional}>Optional</span>
        </label>
        <input
          id={phoneId}
          className={styles.control}
          type="tel"
          name="phone"
          autoComplete="tel"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor={intentId}>
          What are you working on?{" "}
          <span className={styles.required}>Required</span>
        </label>
        <select
          id={intentId}
          className={styles.control}
          name="intent"
          required
          value={intent}
          onChange={(event) =>
            setIntent(event.target.value as ContactIntent | "")
          }
        >
          <option value="" disabled>
            Select one
          </option>
          {INTENT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor={noteId}>
          Anything specific about this document?{" "}
          <span className={styles.optional}>Optional</span>
        </label>
        <textarea
          id={noteId}
          className={`${styles.control} ${styles.textarea}`}
          name="note"
          maxLength={NOTE_MAX}
          value={note}
          onChange={(event) => setNote(event.target.value)}
        />
        <span className={styles.counter}>
          {note.length} / {NOTE_MAX}
        </span>
      </div>

      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        className={`btn btn-primary ${styles.submit}`}
        disabled={submitting}
      >
        {submitting ? "Sending" : "Send"}
      </button>
    </form>
  );
};
