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

/** A preview is either the browser's PDF viewer or an image. */
export type DocumentKind = "pdf" | "image";

/** Where the reading stage is in the upload and ladder sequence. */
export type LabStatus = "empty" | "starting" | "reading" | "ready" | "failed";
