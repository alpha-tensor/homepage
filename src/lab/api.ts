/**
 * Client for the public lab API.
 *
 * Same origin, no base URL variable: the Cloudflare Worker serving the site
 * proxies `/api/public/v1/*` to FastAPI, so a relative path is the whole
 * configuration. See `src/worker.ts` for the proxy.
 *
 * The session token is the only credential and it lives in memory, in React
 * state. Nothing here writes to localStorage.
 */

import type {
  ContactPayload,
  ContactResult,
  Session,
  UploadResult,
} from "./types";

const SESSIONS_PATH = "/api/public/v1/sessions";

/** The documented failure codes, in the visitor's language. */
const STATUS_MESSAGES: Record<number, string> = {
  401: "The session is no longer valid. Start again and upload the document.",
  404: "This session has expired. Start again and upload the document.",
  413: "That file is too large. The limit is 20 MB.",
  415: "That file type is not supported. Use a PDF, PNG, JPEG, or WebP.",
  422: "The server could not accept that file. Check it and try again.",
};

/** A failed request carrying the HTTP status that caused it. */
export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

/** Turn a non-2xx response into an error with a usable message. */
const readError = async (response: Response): Promise<ApiError> => {
  const fallback =
    STATUS_MESSAGES[response.status] ??
    `Something went wrong (${response.status}). Try again.`;
  let message = fallback;
  try {
    const body = (await response.json()) as {
      detail?: unknown;
      message?: unknown;
    };
    const detail = typeof body.detail === "string" ? body.detail : body.message;
    if (typeof detail === "string" && detail.trim() !== "") {
      message = detail.trim();
    }
  } catch {
    /* Not JSON: keep the status-based message. */
  }
  return new ApiError(response.status, message);
};

/** `POST /sessions` with an empty body. Anonymous, no account. */
export const createSession = async (): Promise<Session> => {
  const response = await fetch(SESSIONS_PATH, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "{}",
  });
  if (!response.ok) throw await readError(response);
  return (await response.json()) as Session;
};

/** `POST /sessions/{id}/documents` as multipart, the file under `file`. */
export const uploadDocument = async (
  session: Session,
  file: File,
): Promise<UploadResult> => {
  const form = new FormData();
  form.append("file", file, file.name);

  // No Content-Type header: the browser sets it with the multipart boundary.
  const response = await fetch(
    `${SESSIONS_PATH}/${session.session_id}/documents`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${session.session_token}` },
      body: form,
    },
  );
  if (!response.ok) throw await readError(response);
  return (await response.json()) as UploadResult;
};

/** `POST /sessions/{id}/contact` with the same bearer token. */
export const submitContact = async (
  session: Session,
  payload: ContactPayload,
): Promise<ContactResult> => {
  const response = await fetch(
    `${SESSIONS_PATH}/${session.session_id}/contact`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.session_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
  );
  if (!response.ok) throw await readError(response);
  return (await response.json()) as ContactResult;
};

/**
 * A message suitable for showing inline, whether the failure was HTTP or the
 * network itself.
 */
export const describeError = (error: unknown): string => {
  if (error instanceof ApiError) return error.message;
  return "Could not reach the server. Check your connection and try again.";
};
