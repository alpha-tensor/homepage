/**
 * First-party cookie consent.
 *
 * The single source of truth is the bootstrap script inline in index.html
 * (window.__AT_CONSENT). It sets Google Consent Mode v2 to denied before any
 * tag loads, persists the visitor's choice, and only injects Google Tag Manager
 * and Google Analytics once analytics or marketing consent is granted.
 *
 * This module wraps that API with types so React can read, change, and reopen
 * consent. It never duplicates the gtag logic, so the head script stays the one
 * place that decides when a tag is allowed to load.
 */

export const CONSENT_CHANGE_EVENT = "at:consent-change";
export const CONSENT_OPEN_EVENT = "at:consent-open";

/**
 * Server snapshot sentinel. During hydration the banner reads this, so nothing
 * is rendered into the prerendered HTML and the client can decide after mount.
 */
export const CONSENT_UNKNOWN = "__unknown__";

export interface ConsentState {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  version: 1;
  updatedAt?: string;
}

export interface ConsentChoice {
  analytics: boolean;
  marketing: boolean;
}

interface ConsentApi {
  read(): unknown;
  normalize(input: unknown): ConsentState;
  set(input: ConsentChoice): ConsentState;
  open(): void;
}

declare global {
  interface Window {
    __AT_CONSENT?: ConsentApi;
  }
}

/** The stored choice, or null when the visitor has not decided yet. */
export const getConsent = (): ConsentState | null => {
  if (typeof window === "undefined") return null;
  const api = window.__AT_CONSENT;
  if (!api) return null;
  const stored = api.read();
  return stored ? api.normalize(stored) : null;
};

/**
 * A stable, comparable snapshot for useSyncExternalStore. Returning a string
 * keeps the snapshot referentially stable, so React does not loop.
 */
export const getConsentSignature = (): string | null => {
  const consent = getConsent();
  if (!consent) return null;
  return `${consent.analytics ? "1" : "0"}${consent.marketing ? "1" : "0"}`;
};

/** Subscribe to consent changes pushed by the head script. */
export const subscribeConsent = (onChange: () => void): (() => void) => {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(CONSENT_CHANGE_EVENT, onChange);
  return () => window.removeEventListener(CONSENT_CHANGE_EVENT, onChange);
};

/** Persist a choice and immediately apply it to Consent Mode and tag loading. */
export const setConsent = (choice: ConsentChoice): void => {
  if (typeof window === "undefined") return;
  window.__AT_CONSENT?.set(choice);
};

/** Reopen the banner so the visitor can change or withdraw consent. */
export const openConsentPreferences = (): void => {
  if (typeof window === "undefined") return;
  window.__AT_CONSENT?.open();
};
