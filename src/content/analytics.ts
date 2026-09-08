/**
 * Minimal conversion analytics helper.
 *
 * Pushes a single event object to the GTM dataLayer when present. GTM is
 * embedded in index.html (GTM-PFLPC88K). Doc reference: implementation brief
 * section 32 (Analytics).
 *
 * Tracked conversions:
 * - demo_cta_clicked (hero, header, footer, final CTA)
 * - workflow_viewed (secondary CTA anchor)
 *
 * Do not over-instrument scroll position or hover state.
 */

export interface AnalyticsEvent {
  event: string;
  cta_location: string;
  cta_label?: string;
}

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

export const trackEvent = (eventName: string, location: string, label?: string): void => {
  if (typeof window === "undefined") return;
  if (!window.dataLayer) return;

  const payload: AnalyticsEvent = {
    event: eventName,
    cta_location: location,
  };
  if (label) payload.cta_label = label;

  window.dataLayer.push(payload);
};
