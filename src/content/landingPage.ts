/**
 * Central copy for the AlphaTensor marketing homepage.
 *
 * Positioning source of truth: ALPHATENSOR_LANDING_PAGE_REDESIGN_IMPLEMENTATION.md
 *
 * Rules this file must respect.
 * - One outcome: more case capacity without more headcount.
 * - Three anchor examples: document sorting, data capture, routine review.
 * - Alpha Tensor does not replace the case management system.
 * - Every quantitative claim is verified. No invented metrics.
 * - No autonomous legal judgment claims. Use "Ready for Review" style states,
 *   never "Ready for filing".
 */

export interface CtaLink {
  label: string;
  href: string;
}

export const DEMO_URL = "https://cal.com/alphatensor";

export const landingPageContent = {
  nav: [
    { label: "Product", href: "#product" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Security", href: "#trust" },
  ] as CtaLink[],

  hero: {
    eyebrow: "Operational automation for immigration firms",
    headline: "Handle more immigration cases without adding staff.",
    body: "Alpha Tensor removes repetitive case work, from document sorting and data capture to routine review, so your team can spend more time moving cases forward.",
    proof: "Used across more than 1,100 immigration cases.",
    primaryCta: "See Alpha Tensor in Action",
    secondaryCta: "See the Workflow",
  },

  proofStrip: {
    number: "1,100+",
    statement: "immigration cases processed with Alpha Tensor.",
    caption: "Built from real case operations, not a synthetic demo workflow.",
  },

  positioning: {
    kicker: "Not a replacement. An operational layer.",
    headline: "Keep your case management system. Lose the manual work.",
    objection:
      "We do not replace your case management system. We remove the manual work around it.",
    body: "Alpha Tensor handles the repetitive processing around each case: sorting documents, capturing data, and routine review.",
  },

  caseJourney: {
    kicker: "One case, from arrival to next action",
    headline: "Alpha Tensor handles the processing between intake and review.",
    body: "Five moments in one case. The manual middle — sorting, data entry, and routine review — disappears.",
    steps: [
      {
        num: "01",
        title: "Documents arrive",
        text: "Scans, PDFs, intake packets, and supporting evidence land in the case folder.",
        tag: "Incoming",
        tone: "neutral",
      },
      {
        num: "02",
        title: "Alpha Tensor classifies them",
        text: "Each document is identified and associated with the right case record.",
        tag: "Classified",
        tone: "neutral",
      },
      {
        num: "03",
        title: "Case information becomes structured",
        text: "Facts are extracted from the source documents into structured case data, with the source attached.",
        tag: "Data captured",
        tone: "done",
      },
      {
        num: "04",
        title: "Exceptions are flagged for review",
        text: "Missing evidence, conflicting dates, and uncertain values surface for a person to check.",
        tag: "Needs review",
        tone: "review",
      },
      {
        num: "05",
        title: "Your team gets the next action",
        text: "The case resolves into one clear next step for the person handling it.",
        tag: "Next step",
        tone: "done",
      },
    ] as Array<{
      num: string;
      title: string;
      text: string;
      tag: string;
      tone: "neutral" | "review" | "done";
    }>,
    humanNote: "People stay in the loop where review matters.",
  },

  platform: {
    kicker: "More of your operation",
    headline: "More than document intake.",
    body: "The same platform that processes incoming material also keeps the rest of the case moving.",
    items: [
      {
        label: "Case operations",
        title: "See what is blocking every matter.",
        text: "Status, blockers, assignments, and next actions stay visible across the firm's active cases.",
      },
      {
        label: "Evidence and document intelligence",
        title: "Documents become usable case data.",
        text: "Incoming documents are classified and captured, and missing or conflicting evidence is surfaced.",
      },
      {
        label: "Workflow automation",
        title: "Work is tracked, not remembered.",
        text: "Case events, notes, missing items, and review states become actionable work instead of staff memory.",
      },
      {
        label: "Form and document preparation",
        title: "Facts are entered once.",
        text: "Structured case information is reused across forms and generated documents instead of being retyped.",
      },
    ] as Array<{ label: string; title: string; text: string }>,
  },

  product: {
    kicker: "From the product",
    headline: "What your team sees after the repetitive work is handled.",
    body: "Focused operational surfaces from Alpha Tensor, on real immigration case work.",
    fragments: [
      {
        id: "blockers",
        label: "01 / CASE STATUS",
        headline: "Know what is blocking every case.",
        body: "One view shows the client, case state, what is missing, and the next action.",
      },
      {
        id: "documents",
        label: "02 / DOCUMENT PROCESSING",
        headline: "Turn incoming documents into usable case data.",
        body: "A scan arrives, Alpha Tensor identifies the type, captures the fields, and associates it with the right case.",
      },
      {
        id: "exceptions",
        label: "03 / REVIEW AND EXCEPTIONS",
        headline: "Put exceptions in front of your team, not repetitive work.",
        body: "Missing evidence, inconsistent dates, and low-confidence fields surface for review.",
      },
    ] as Array<{ id: string; label: string; headline: string; body: string }>,
  },

  existingSystems: {
    kicker: "Fits your workflow",
    headline:
      "Keep the systems your firm already uses. Add the processing layer they are missing.",
    body: "Alpha Tensor is designed to work alongside existing case operations instead of forcing a complete migration before your team sees value.",
    diagram: {
      title: "One continuous environment",
      steps: [
        {
          label: "GOOGLE DRIVE",
          text: "Files stay in the document home your team already trusts.",
        },
        {
          label: "INCOMING CASE MATERIAL",
          text: "Scans, PDFs, intake packets, and supporting evidence.",
        },
        {
          label: "ALPHA TENSOR",
          text: "Classifies documents, captures data, and flags exceptions.",
        },
        {
          label: "STRUCTURED CASE RECORD",
          text: "Clean case data and review flags your team can act on.",
        },
        {
          label: "YOUR CASE WORKFLOW",
          text: "Staff, attorneys, and the systems they already use.",
        },
      ],
    },
  },

  trust: {
    kicker: "Trust and operational depth",
    headline: "Speed without losing traceability.",
    body: "Removing repetitive work cannot mean removing control. Your team can see what happened, who reviewed it, and where every document came from.",
    items: [
      {
        label: "Human review",
        title: "Judgment stays with people.",
        text: "Low-confidence or uncertain results are surfaced for review rather than silently accepted.",
      },
      {
        label: "Auditability",
        title: "Every change is traceable.",
        text: "Case activity is attributable, so nothing moves without a record of who did what.",
      },
      {
        label: "Structured records",
        title: "Facts are not trapped in files.",
        text: "Case information lives in structured records, not only PDFs, spreadsheets, or staff memory.",
      },
      {
        label: "Document history",
        title: "Documents stay traceable.",
        text: "Documents and versions keep a history tied back to the case they belong to.",
      },
      {
        label: "Existing workflows",
        title: "Files stay where your team knows.",
        text: "Files remain in systems the firm already understands, like Google Drive.",
      },
      {
        label: "Deterministic rules",
        title: "Not every task needs a model.",
        text: "Where structure supports it, deterministic extraction and validation does the work.",
      },
    ] as Array<{ label: string; title: string; text: string }>,
  },

  finalCta: {
    headline: "Find the manual steps your firm can stop repeating.",
    body: "Upload a form and see what Alpha Tensor reads from it, item by item, on the page itself. No account, no working session, no slide deck.",
    primaryCta: "Try the document lab",
    primaryHref: "/lab",
    secondaryCta: "Review the workflow",
    secondaryHref: "#how-it-works",
    micro: "Only the first page is processed. No account needed.",
  },

  footer: {
    tagline: "Operational automation for immigration law firms.",
    copyright: "AlphaTensor",
    links: [
      { label: "Product", href: "#product" },
      { label: "How It Works", href: "#how-it-works" },
      { label: "Security", href: "#trust" },
      { label: "Privacy", href: "/privacy" },
      { label: "Book a Demo", href: DEMO_URL },
    ] as CtaLink[],
  },

  consent: {
    label: "Privacy",
    title: "We use cookies",
    body: "We use strictly necessary storage to run this site and to remember your choice. Analytics and marketing tags stay off until you allow them. You can change your choice at any time.",
    acceptAll: "Accept all",
    rejectAll: "Reject all",
    manage: "Manage preferences",
    save: "Save preferences",
    policyLabel: "Privacy and cookie policy",
    policyHref: "/privacy",
    categories: {
      necessary: {
        title: "Strictly necessary",
        description:
          "Required for the site to work and to remember your privacy choice. Always on.",
      },
      analytics: {
        title: "Analytics",
        description:
          "Google Analytics measures how visitors use the site. Off until you allow it.",
      },
      marketing: {
        title: "Marketing",
        description:
          "Used to measure advertising and remarketing. No marketing tags run today. Off until you allow it.",
      },
    },
  },
} as const;
