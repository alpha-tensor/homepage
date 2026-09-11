/**
 * Legal copy for the public site.
 *
 * The cookie inventory below describes exactly what this site loads. Keep it in
 * step with index.html and src/consent.ts whenever a tag is added or removed.
 *
 * Before publication, confirm the entity details and the monitored inbox. They
 * are placeholders in the block below.
 */

// TODO(confirm): legal entity name, registered address, and a monitored inbox.
export const LEGAL_ENTITY = "AlphaTensor";
export const LEGAL_CONTACT_EMAIL = "privacy@alphatensor.com";
export const LEGAL_LAST_UPDATED = "11 September 2026";

export interface LegalSection {
  heading: string;
  paragraphs: string[];
  list?: string[];
}

export interface CookieRow {
  name: string;
  category: string;
  purpose: string;
  duration: string;
}

export const privacyPolicy = {
  title: "Privacy and cookie policy",
  intro:
    "This page explains what data AlphaTensor collects on this website, why we collect it, and the choices you have. It lists the cookies and similar technologies we use and how to change your mind at any time.",

  sections: [
    {
      heading: "Who we are",
      paragraphs: [
        `${LEGAL_ENTITY} operates this website. For the personal data described here, ${LEGAL_ENTITY} is the controller. You can reach us at ${LEGAL_CONTACT_EMAIL}.`,
      ],
    },
    {
      heading: "What we collect",
      paragraphs: [
        "We collect two kinds of data on this site. First, the details you give us when you book a demo, such as your name, work email, firm, and anything you choose to tell us. Booking is handled by our scheduling provider, and that exchange is governed by their own privacy terms.",
        "Second, if you allow analytics, we collect usage data about how visitors reach and move through the site. This includes pages viewed, approximate location derived from your IP address, device and browser type, and referring source. We do not use analytics to identify you.",
      ],
    },
    {
      heading: "Why we process it and our legal bases",
      paragraphs: [
        "We process demo requests to take steps before entering a contract with your firm and to answer your enquiry.",
        "We process analytics and marketing data only with your consent, which you give through the consent banner and can withdraw at any time.",
      ],
      list: [
        "Demo requests: performance of a contract and our legitimate interest in responding to business enquiries.",
        "Analytics: your consent.",
        "Marketing and advertising measurement: your consent.",
      ],
    },
    {
      heading: "Cookies and similar technologies",
      paragraphs: [
        "We keep the site deliberately light. We set no cookies before you choose.",
        "Strictly necessary storage remembers your privacy choice. Analytics and marketing tags load only after you allow them, and if you withdraw consent we stop them and clear the analytics cookies we set.",
      ],
    },
    {
      heading: "Who we share data with",
      paragraphs: [
        "We use Google Tag Manager and Google Analytics for measurement, and our scheduling provider for demo bookings. These providers process data on our behalf or as independent controllers for their own services.",
        "Some providers are based outside the European Economic Area. Where that is the case, transfers rely on appropriate safeguards such as the European Commission standard contractual clauses.",
      ],
    },
    {
      heading: "How long we keep it",
      paragraphs: [
        "Demo enquiry details are kept for as long as needed to handle your enquiry and to maintain business records. Analytics data is retained according to the retention settings of our analytics provider, currently up to 14 months.",
      ],
    },
    {
      heading: "Your rights",
      paragraphs: [
        "If you are in the European Economic Area, the United Kingdom, or another jurisdiction with similar laws, you have rights over your personal data.",
      ],
      list: [
        "Access the personal data we hold about you.",
        "Ask us to correct data that is inaccurate.",
        "Ask us to erase your data.",
        "Restrict or object to how we use your data.",
        "Receive your data in a portable format.",
        "Withdraw consent at any time, without affecting processing carried out before you withdrew.",
      ],
    },
    {
      heading: "Complaints",
      paragraphs: [
        "You can complain to your local supervisory authority. In France this is the Commission nationale de l'informatique et des libertes, the CNIL. We would appreciate the chance to resolve your concern first, so please contact us before you escalate.",
      ],
    },
    {
      heading: "Changes to this policy",
      paragraphs: [
        "We may update this policy as the site or the law changes. The date below shows when it was last revised.",
      ],
    },
  ] as LegalSection[],

  cookies: [
    {
      name: "at.consent.v1",
      category: "Strictly necessary",
      purpose:
        "Records your cookie choice. Stored in your browser's local storage, not sent to us.",
      duration: "Until you clear your browser storage.",
    },
    {
      name: "_ga",
      category: "Analytics",
      purpose:
        "Google Analytics. Distinguishes visitors so we can count visits. Set only with your consent.",
      duration: "Up to 2 years.",
    },
    {
      name: "_ga_*",
      category: "Analytics",
      purpose:
        "Google Analytics 4. Keeps session state for the property. Set only with your consent.",
      duration: "Up to 2 years.",
    },
    {
      name: "_gcl_au",
      category: "Marketing",
      purpose:
        "Google advertising. Measures ad conversions. No marketing tags run today, and this is set only if you grant marketing consent.",
      duration: "Up to 90 days.",
    },
  ] as CookieRow[],
};
