/**
 * Types for the public document lab at `/lab`.
 *
 * These mirror the public API contract exactly, so the contract is stated in
 * one place rather than inferred from whatever the components happen to use.
 * See `src/lab/api.ts` for the requests that produce them.
 */

/** A single rung of the identity ladder, in the order the API returned it. */
export interface Rung {
  key: string;
  label: string;
  value: string | null;
  status: "identified" | "unknown";
}

/** What was established about page one of the uploaded document. */
export interface DocumentIdentity {
  page_count: number | null;
  has_text_layer: boolean | null;
  pages_processed: number;
  confidence: number | null;
  rungs: Rung[];
}

/** The result of `POST /sessions/{id}/documents`. */
export interface UploadResult {
  document_id: string;
  status: "uploaded" | "preview_ready" | "failed";
  identity: DocumentIdentity;
  /**
   * The named fields carried on page one of the document itself. Present for a
   * fillable form, empty for a scan or image. Optional so this client still
   * works against an API that predates the field payload.
   */
  fields?: PublicFormField[];
}

/** One field carried on page one of the document's own form. */
export interface PublicFormField {
  /** The form's own field name, e.g. `Line1a_FamilyName[0]`. */
  name: string;
  /** The form's own label where it carries one, else a humanized name. */
  label: string;
  /** The form's control: text, checkbox, radio, select, signature, button, unknown. */
  field_type: string;
  /** The value already in the file, or an empty string. */
  value: string;
  /** The part of the document the field lies on, e.g. `Part 1. Information About You`. */
  section: string;
  /** A sub-heading within the section, e.g. `Your Full Name`, when the form has one. */
  subsection?: string | null;
  /** Choices for a radio or select field. */
  options?: string[] | null;
  /**
   * The shared question of a single-choice item drawn as one box per option,
   * e.g. `Are you fluent in English?`. The boxes carry their own answers and
   * this is stated once, as their legend.
   */
  question?: string | null;
  /** The form marks this a multiline text box, so it should render as a text area. */
  multiline?: boolean;
  /** Reserved fields, such as a USCIS PDF417 barcode, are not user fields. */
  reserved?: boolean;
}

/** The session credential. Held in memory only, never in storage. */
export interface Session {
  session_id: string;
  session_token: string;
  expires_at: string;
}

/** The exact set of options the contact form's intent select accepts. */
export type ContactIntent =
  | "for_a_client"
  | "for_myself"
  | "for_my_organization"
  | "evaluating"
  | "research_or_other";

export interface ContactPayload {
  email: string;
  phone?: string;
  intent: ContactIntent;
  note?: string;
}

export interface ContactResult {
  session_id: string;
  recorded: boolean;
}

/** Where the reading stage is in the upload and ladder sequence. */
export type LabStatus = "empty" | "starting" | "reading" | "ready" | "failed";
