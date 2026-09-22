/**
 * Public website policy adapted from privacy.txt.
 * Keep the service and storage disclosures aligned with index.html.
 * Pioneer product controls require their own verified service notice.
 */
export const LEGAL_ENTITY = "AlphaTensor, Inc.";
export const LEGAL_CONTACT_EMAIL = "support@alphatensor.com";
export const LEGAL_EFFECTIVE_DATE = "6 August 2026";
export const LEGAL_LAST_UPDATED = "21 September 2026";

export interface LegalSection {
  heading: string;
  paragraphs: string[];
  list?: string[];
  links?: { label: string; href: string }[];
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
    "This policy explains how AlphaTensor, Inc. collects, uses, discloses, and protects personal information when you visit alphatensor.com, contact us, or arrange a demonstration. It also explains your privacy rights and your choices about cookies and similar technologies.",
  sections: [
    {
      heading: "Who we are and what this policy covers",
      paragraphs: [
        `${LEGAL_ENTITY} operates this website and is the controller of the personal information processed for the website and our own business enquiries. Contact us at ${LEGAL_CONTACT_EMAIL} about this policy or your personal information.`,
        "This website introduces our services. It is not the Pioneer account or inference platform. Account credentials, uploaded datasets, models, prompts, completions, and customer case files processed within a product are subject to the applicable product privacy notice and customer agreement, including any data processing agreement. This website policy does not replace those documents.",
        "Where we process personal information solely on a business customer's instructions, that customer determines the purposes of processing and is generally the controller. Requests about that information should be directed to the customer. You may also contact us for help identifying the appropriate contact.",
      ],
    },
    {
      heading: "Information we collect",
      paragraphs: [
        "We receive information directly from you, from the browser that connects to the website, and from providers that help handle your enquiries or measure website use.",
      ],
      list: [
        "Contact and enquiry information. Your name, work email, company or firm, booking details, and the information you include in an email, demo request, or other communication.",
        "Technical information. Your IP address, browser and operating system, requested pages, request times, and information needed to deliver the website and investigate security incidents. Hosting infrastructure and external font services can receive technical information even if you reject optional cookies.",
        "Optional analytics information. If you permit analytics, Google Analytics can process browser and device information, page views, interactions, referral information, approximate location, and cookie identifiers. These identifiers and usage records can constitute personal information even when we do not know your name.",
        "Privacy preferences. Your analytics and marketing choices, the consent format version, and the time you saved your choice, stored in your browser.",
      ],
    },
    {
      heading: "How we use information and our legal bases",
      paragraphs: [
        "Where the GDPR or similar laws apply, the legal basis depends on the purpose of the processing. We do not treat visiting the website, scrolling, or continuing to browse as consent to optional tracking.",
      ],
      list: [
        "Answering enquiries and arranging demonstrations. Our legitimate interest in responding to business contacts. Where you personally request steps toward a contract with us, processing necessary for those steps is based on that request.",
        "Delivering and securing the website. Our legitimate interests in operating a reliable website, diagnosing problems, preventing abuse, and protecting our systems and users, balanced against your rights and interests.",
        "Remembering privacy choices. Our legitimate interest in respecting your choices and, where applicable, compliance with legal obligations relating to consent.",
        "Optional analytics and advertising technologies. Your consent for the relevant category. Website cookie consent is not consent to receive promotional email or to use product content for model training.",
        "Business records, legal requests, and disputes. Compliance with applicable legal obligations, or our legitimate interest in establishing, exercising, or defending legal claims, as appropriate.",
      ],
    },
    {
      heading: "Information you choose to provide",
      paragraphs: [
        "You do not have to provide contact details or accept optional cookies to read this website. If you request a reply or a demonstration, we need sufficient contact information to respond. Without it, we may not be able to handle your request.",
        "Please do not send passwords, payment details, immigration documents, medical information, or other sensitive client or case information through a general enquiry or demo booking. If a service requires such information, use the agreed service channel instead.",
      ],
    },
    {
      heading: "Cookies and your choices",
      paragraphs: [
        "We use a first party consent banner. Optional analytics and marketing choices are off by default. You can accept all, reject all, or save individual category preferences. Rejecting optional cookies does not prevent access to the website.",
        "Our website code does not load Google Tag Manager or Google Analytics until you permit analytics or marketing. The separate Google Analytics script is requested when analytics is permitted. Google consent signals reflect the categories you choose. Google Tag Manager manages tags and is not itself a guarantee that every tag in its container respects consent.",
        "You can reopen Cookie settings in the footer or use the button below to change or withdraw your choice. Withdrawal updates Google's consent signals and, when both optional categories are off, the site attempts to delete accessible Google measurement cookies. Already loaded third party code is not unloaded by that update. Reloading after rejecting both categories prevents our website code from loading those tags again. Withdrawal does not undo processing that already occurred or delete data already held by providers.",
        "Your choice is stored on this browser and is not automatically shared with your other browsers or devices. Clearing local storage removes the saved choice and causes the banner to appear again. If browser storage is unavailable, your selection applies to the current page but may not persist.",
        "The inventory below distinguishes browser storage from analytics cookies. Cookie lifetimes are separate from the length of time a provider retains information on its servers. Browser restrictions or provider configuration may shorten the listed cookie lifetimes.",
      ],
    },
    {
      heading: "Service providers and external websites",
      paragraphs: [
        "Providers involved in this website include our hosting infrastructure, Google for font delivery and consent based measurement, and Cal.com for demonstration bookings. They receive the information needed for the relevant service. Their role as a processor or an independent controller depends on the service and applicable terms.",
        "Google Fonts is loaded from Google servers when the page loads, independently of the optional cookie choice. This exposes technical request information, including your IP address and browser information, to Google. Rejecting analytics does not block these font requests.",
        "The demo button opens Cal.com rather than an embedded booking form. If you follow that link, Cal.com receives your request and any booking information you submit. Its privacy notice and cookie controls apply on its website. We also process the booking information we receive to arrange and follow up on your demonstration.",
        "Links to product sites and other external websites do not extend this website's cookie choice to those services. Review the notice and settings on each service you use.",
      ],
      links: [
        {
          label: "Google privacy policy",
          href: "https://policies.google.com/privacy",
        },
        {
          label: "Google Fonts privacy information",
          href: "https://developers.google.com/fonts/faq/privacy",
        },
        { label: "Cal.com privacy policy", href: "https://cal.com/privacy" },
      ],
    },
    {
      heading: "Other disclosures of information",
      paragraphs: [
        "We do not sell your personal information or provide enquiry content to third parties for their own advertising or marketing. We do not use prompts, inputs, or datasets submitted as part of a customer service to serve advertising on this website.",
        "We may disclose relevant information where required by law, in response to a valid legal request, or where necessary to protect rights, investigate fraud or abuse, and protect safety. We may also disclose information in connection with a proposed or completed merger, acquisition, financing, or sale of business assets, subject to applicable confidentiality and data protection requirements.",
      ],
    },
    {
      heading: "International processing",
      paragraphs: [
        "Using this website and its providers can involve processing outside your country, including in the United States. Privacy laws in those locations may differ from those where you live.",
        "Transfers subject to European or United Kingdom data protection law require an applicable transfer mechanism, such as a relevant adequacy decision or contractual safeguards with any additional measures required by law. A provider's location alone does not establish that a transfer is protected. Contact us for information about the destinations and safeguards applicable to your information, or to request a copy of relevant safeguards where available under applicable law.",
      ],
    },
    {
      heading: "How long information is kept",
      paragraphs: [
        "We retain personal information for the purpose for which it was collected, taking into account the nature of the information, our relationship with you, applicable recordkeeping duties, and the need to resolve disputes or investigate security incidents.",
        "Enquiries and booking correspondence are retained as needed to answer your request, manage related business discussions, and maintain records required for legal obligations or claims. Technical records are retained as needed for website operation, security, and incident investigation. We do not specify a fixed period here that has not been verified for the relevant system.",
        "Google Analytics server retention depends on the settings of our analytics property and Google's applicable service rules. The cookie lifetimes below are not a statement of those server retention settings. Contact us for the period or retention criteria applicable to a particular record.",
        "Deleting information from an active system may not immediately remove copies in backups. Any retained copies remain subject to applicable safeguards and deletion processes. Information may need to be retained longer where a legal obligation or a legal claim requires it.",
      ],
    },
    {
      heading: "Pioneer, inference data, and model training",
      paragraphs: [
        "Cookie settings on this website do not enable Zero Data Retention, delete a Pioneer account, or change model training preferences. Those are separate product and contractual matters.",
        "Before sending prompts, completions, datasets, models, or customer documents to a product, consult its applicable privacy notice, service terms, and data processing agreement for retention rules, inference providers, training purposes, and available controls. Do not assume that a Zero Data Retention option or a training opt out is available for a particular plan, model, or upstream provider based on this website policy.",
        `For product data deletion requests or questions about available privacy controls and subprocessors, contact ${LEGAL_CONTACT_EMAIL}. If your organisation manages your account, its administrator may also need to handle your request.`,
      ],
    },
    {
      heading: "Security",
      paragraphs: [
        "Protecting personal information requires technical and organisational measures appropriate to the information and the risks of processing. No website, transmission method, or storage system can guarantee absolute security. Contact us if you believe personal information connected with this website has been exposed or misused.",
      ],
    },
    {
      heading: "Your privacy rights",
      paragraphs: [
        "Depending on the law that applies and the circumstances, you may have the following rights. These rights are not absolute, and legal exceptions can apply.",
      ],
      list: [
        "Request access to your personal information and a copy of it.",
        "Ask for inaccurate information to be corrected and incomplete information to be completed.",
        "Request deletion, or ask us to restrict processing in applicable circumstances.",
        "Object, on grounds relating to your situation, to processing based on legitimate interests. You may object to direct marketing at any time.",
        "Receive information you provided in a structured, commonly used, machine readable format, and request its transfer where processing is automated and based on consent or a contract.",
        "Withdraw consent at any time, as easily as giving it, without affecting the lawfulness of earlier processing.",
        "Lodge a complaint with a competent data protection authority.",
      ],
    },
    {
      heading: "How to exercise your rights or make a complaint",
      paragraphs: [
        `Email ${LEGAL_CONTACT_EMAIL} with your request and enough context to locate the relevant information. We may ask for proportionate information to verify your identity or authority, but please do not send identity documents unless we request them through an appropriate channel.`,
        "For requests covered by the GDPR, we normally respond within one month of receipt. If a permitted extension of up to two further months is necessary because of complexity or the number of requests, we will explain the extension within the first month. Requests are normally free. Where the law permits a fee or refusal, we will explain why.",
        "You can complain directly to the supervisory authority in the European country where you habitually live, work, or believe an infringement occurred. In France, this is the Commission nationale de l'informatique et des libertés, CNIL. You do not have to contact us before making a complaint. In the United Kingdom, you can contact the Information Commissioner's Office.",
      ],
      links: [
        {
          label: "Make a complaint to the CNIL",
          href: "https://www.cnil.fr/fr/plaintes",
        },
        {
          label: "Find a European data protection authority",
          href: "https://www.edpb.europa.eu/about-edpb/about-edpb/members_en",
        },
        {
          label: "Contact the UK Information Commissioner's Office",
          href: "https://ico.org.uk/make-a-complaint/",
        },
      ],
    },
    {
      heading: "Children and automated decisions",
      paragraphs: [
        `This website is intended for business audiences, not children. If you believe a child has provided personal information through this website, contact ${LEGAL_CONTACT_EMAIL} so we can investigate and address it.`,
        "We do not use website analytics or demo enquiries to make solely automated decisions about you that produce legal or similarly significant effects. This statement concerns the marketing website, not the functions of a separate product.",
      ],
    },
    {
      heading: "Changes to this policy",
      paragraphs: [
        "We may revise this policy as the website, our practices, or legal requirements change. The original effective date and the latest revision date appear above. We will publish updates here and provide additional notice or request fresh consent where applicable law requires it.",
      ],
    },
  ] satisfies LegalSection[],
  cookies: [
    {
      name: "at.consent.v1",
      category: "Strictly necessary local storage",
      purpose:
        "Remembers category choices, consent format version, and the time the choice was saved. Stored in this browser, not a cookie or an account setting.",
      duration:
        "Until browser storage is cleared. No automatic expiry is currently configured.",
    },
    {
      name: "_ga",
      category: "Analytics",
      purpose:
        "Google Analytics visitor identifier. Used with analytics consent.",
      duration:
        "Google default of up to 2 years, subject to configuration and browser limits.",
    },
    {
      name: "_ga_*",
      category: "Analytics",
      purpose: "Google Analytics 4 session state. Used with analytics consent.",
      duration:
        "Google default of up to 2 years, subject to configuration and browser limits.",
    },
  ] satisfies CookieRow[],
};
