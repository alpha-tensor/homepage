import type { LightForm } from "./types";

/**
 * Sample light forms for the `/lab/form` experiment.
 *
 * The sections, field names, labels and types here are transcribed from the
 * workflow generator's seed workflows, so the renderer is exercised against
 * real shapes rather than invented ones:
 *
 *   - `clientIntake`  from `data/seeds/workflows/master_intake_v1.json`
 *                     (input nodes `client_bio`, `family_info`, `immigration_history`)
 *   - `discovery`     from `data/seeds/workflows/master_intake_v2.json`
 *                     (input nodes `discovery`, `family_signals`, `core_risk`)
 *   - `contact`       the fields of the lab's own contact stage, which is the
 *                     one sample that uses a `textarea`
 *
 * The country and state option lists are trimmed to a few entries: the seed
 * leaves them sourced from the canonical field tables, which this page cannot
 * reach. The section order and the field order inside each section are the
 * workflow's own, taken from the node definitions rather than the `next` chain.
 */
export const FORM_SAMPLES: LightForm[] = [
  {
    id: "client_intake",
    document: "master_intake_v1",
    title: "Client intake",
    description:
      "The three input nodes of the v1 intake workflow. Children and entries are repeat groups, so a client with two children adds two rows.",
    sections: [
      {
        id: "client_bio",
        title: "Client Biographics",
        description:
          "Identity and mailing address for the principal applicant.",
        fields: [
          {
            name: "person.name.first",
            label: "First Name",
            type: "text",
            group: "Identity",
            required: true,
          },
          {
            name: "person.name.middle",
            label: "Middle Name",
            type: "text",
            group: "Identity",
          },
          {
            name: "person.name.last",
            label: "Last Name",
            type: "text",
            group: "Identity",
            required: true,
          },
          {
            name: "person.birth.date",
            label: "Date of Birth",
            type: "date",
            group: "Identity",
            required: true,
          },
          {
            name: "person.birth.city",
            label: "City of Birth",
            type: "text",
            group: "Identity",
            required: true,
          },
          {
            name: "person.birth.country",
            label: "Country of Birth",
            type: "select",
            group: "Identity",
            required: true,
            options: [
              { value: "MX", label: "Mexico" },
              { value: "GT", label: "Guatemala" },
              { value: "HN", label: "Honduras" },
              { value: "SV", label: "El Salvador" },
              { value: "US", label: "United States" },
            ],
          },
          {
            name: "address.physical.street_1",
            label: "Street Address",
            type: "text",
            group: "Address",
            required: true,
          },
          {
            name: "address.physical.city",
            label: "City",
            type: "text",
            group: "Address",
            required: true,
          },
          {
            name: "address.physical.state",
            label: "State",
            type: "select",
            group: "Address",
            required: true,
            options: [
              { value: "CA", label: "California" },
              { value: "TX", label: "Texas" },
              { value: "NY", label: "New York" },
              { value: "FL", label: "Florida" },
              { value: "IL", label: "Illinois" },
            ],
          },
          {
            name: "address.physical.zip_code",
            label: "Zip Code",
            type: "text",
            group: "Address",
            required: true,
          },
          {
            name: "person.ident.alien_registration_number",
            label: "A-Number",
            type: "text",
            group: "Identity",
            placeholder: "A123456789",
            help: "Leave blank if the client has never been issued one.",
          },
          {
            name: "person.ident.social_security_number",
            label: "Social Security Number",
            type: "text",
            group: "Identity",
          },
          {
            name: "person.ident.uscis_online_account_number",
            label: "USCIS Online Account Number",
            type: "text",
            group: "Identity",
          },
          {
            name: "relationship.marital.status",
            label: "Marital Status",
            type: "select",
            group: "Identity",
            required: true,
            options: [
              { value: "Single", label: "Single" },
              { value: "Married", label: "Married" },
              { value: "Divorced", label: "Divorced" },
              { value: "Widowed", label: "Widowed" },
              { value: "Separated", label: "Separated" },
              { value: "Annulled", label: "Annulled" },
            ],
          },
        ],
      },
      {
        id: "family_info",
        title: "Family Information",
        description: "List all children regardless of age or location.",
        fields: [
          {
            name: "person.children",
            label: "Children",
            type: "repeat_group",
            fields: [
              {
                name: "name.first",
                label: "First Name",
                type: "text",
                required: true,
              },
              {
                name: "name.last",
                label: "Last Name",
                type: "text",
                required: true,
              },
              {
                name: "birth.date",
                label: "Date of Birth",
                type: "date",
                required: true,
              },
            ],
          },
        ],
      },
      {
        id: "immigration_history",
        title: "Immigration History",
        description: "List all arrivals to the United States.",
        fields: [
          {
            name: "immigration.history.entries",
            label: "Entry History",
            type: "repeat_group",
            fields: [
              {
                name: "date",
                label: "Date of Entry",
                type: "date",
                required: true,
              },
              {
                name: "place",
                label: "Place of Entry",
                type: "text",
                required: true,
              },
              {
                name: "status",
                label: "Status at Entry",
                type: "select",
                required: true,
                options: [
                  { value: "visitor", label: "Visitor" },
                  { value: "student", label: "Student" },
                  { value: "work", label: "Work visa" },
                  { value: "immigrant", label: "Immigrant visa" },
                  { value: "ewi", label: "Entered without inspection" },
                ],
              },
              {
                name: "passport_number",
                label: "Passport Number",
                type: "text",
              },
              {
                name: "visa_number",
                label: "Visa Number",
                type: "text",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "discovery",
    document: "master_intake_v2",
    title: "Discovery screen",
    description:
      "The screening nodes of the v2 discovery workflow, where the field mix is widest: text, date, combobox, phone, email, radio, single select, and multi-select.",
    sections: [
      {
        id: "discovery",
        title: "Universal Discovery",
        description: "One bounded screen, asked before any pathway is chosen.",
        fields: [
          {
            name: "client.full_name",
            label: "Full Name",
            type: "text",
          },
          {
            name: "client.date_of_birth",
            label: "Date of Birth",
            type: "date",
          },
          {
            name: "client.country_of_birth",
            label: "Country of Birth",
            type: "combobox",
            help: "Type to filter the list.",
            options: [
              { value: "MX", label: "Mexico" },
              { value: "GT", label: "Guatemala" },
              { value: "HN", label: "Honduras" },
              { value: "SV", label: "El Salvador" },
              { value: "US", label: "United States" },
            ],
          },
          {
            name: "client.alien_registration_number",
            label: "Alien Registration Number (A#)",
            type: "text",
          },
          {
            name: "client.phone_number",
            label: "Phone Number",
            type: "phone",
          },
          {
            name: "client.email_address",
            label: "Email Address",
            type: "email",
          },
          {
            name: "case.principal.location",
            label: "Where is the client located?",
            type: "radio",
            options: [
              { value: "inside_us", label: "Inside the United States" },
              { value: "outside_us", label: "Outside the United States" },
              { value: "unknown", label: "Unknown" },
            ],
          },
          {
            name: "immigration.current_status",
            label: "What is the client's current immigration status?",
            type: "select",
            options: [
              { value: "usc", label: "U.S. Citizen" },
              { value: "lpr", label: "Lawful Permanent Resident" },
              {
                value: "conditional_lpr",
                label: "Conditional Permanent Resident",
              },
              { value: "tps", label: "Temporary Protected Status" },
              { value: "other", label: "Other" },
            ],
          },
          {
            name: "immigration.pending_filings",
            label: "Pending immigration case or application?",
            type: "multi_select",
            help: "Select every one that applies.",
            options: [
              { value: "i_130", label: "I-130 Petition" },
              { value: "i_485", label: "I-485 Adjustment" },
              { value: "i_589", label: "I-589 Asylum" },
              { value: "i_751", label: "I-751 Remove Conditions" },
              { value: "n_400", label: "N-400 Naturalization" },
            ],
          },
          {
            name: "case.current_counsel",
            label: "Does the client currently have an immigration lawyer?",
            type: "radio",
            options: [
              { value: "no", label: "No" },
              { value: "yes", label: "Yes" },
              { value: "unknown", label: "Unknown" },
            ],
          },
          {
            name: "case.government_deadline",
            label: "Is there a government hearing, notice, or deadline?",
            type: "radio",
            options: [
              { value: "no", label: "No" },
              { value: "yes", label: "Yes" },
              { value: "unknown", label: "Unknown" },
            ],
          },
          {
            name: "case.intake.goal",
            label: "Why did the client contact the firm?",
            type: "radio",
            options: [
              {
                value: "review_options",
                label: "Review all available immigration options",
              },
              {
                value: "permanent_residence",
                label: "Permanent residence / Green Card",
              },
              { value: "family_member", label: "Petition for a family member" },
              {
                value: "citizenship",
                label: "Citizenship / Naturalization",
              },
            ],
          },
        ],
      },
      {
        id: "family_signals",
        title: "Family Signals",
        fields: [
          {
            name: "family.marital_status",
            label: "Marital Status",
            type: "select",
            options: [
              { value: "single", label: "Single" },
              { value: "married", label: "Married" },
              { value: "divorced", label: "Divorced" },
              { value: "widowed", label: "Widowed" },
              { value: "separated", label: "Separated" },
            ],
          },
          {
            name: "family.spouse.status",
            label: "Is the spouse a U.S. citizen or LPR?",
            type: "select",
            options: [
              { value: "usc", label: "U.S. Citizen" },
              { value: "lpr", label: "Lawful Permanent Resident" },
              { value: "other", label: "Other / None" },
              { value: "unknown", label: "Unknown" },
            ],
          },
          {
            name: "family.minor_children",
            label: "Are there children under 21?",
            type: "radio",
            options: [
              { value: "yes", label: "Yes" },
              { value: "no", label: "No" },
              { value: "unknown", label: "Unknown" },
            ],
          },
        ],
      },
      {
        id: "core_risk",
        title: "Risk Baseline",
        description:
          "Four questions that, on their own, can reroute the matter.",
        fields: [
          {
            name: "risk.removal_or_court",
            label: "Immigration court or removal proceedings?",
            type: "radio",
            options: [
              { value: "no", label: "No" },
              { value: "yes", label: "Yes" },
              { value: "unknown", label: "Unknown" },
            ],
          },
          {
            name: "risk.criminal_history",
            label: "Criminal history?",
            type: "radio",
            options: [
              { value: "no", label: "No" },
              { value: "yes", label: "Yes" },
              { value: "unknown", label: "Unknown" },
            ],
          },
          {
            name: "risk.fraud_or_false_claim",
            label: "Fraud or false claim to citizenship?",
            type: "radio",
            options: [
              { value: "no", label: "No" },
              { value: "yes", label: "Yes" },
              { value: "unknown", label: "Unknown" },
            ],
          },
          {
            name: "risk.smuggling",
            label: "Helped anyone enter without inspection?",
            type: "radio",
            options: [
              { value: "no", label: "No" },
              { value: "yes", label: "Yes" },
              { value: "unknown", label: "Unknown" },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "contact",
    document: "lab contact stage",
    title: "Follow-up contact",
    description:
      "The fields behind the lab's own contact stage. The one sample with a textarea, and the one that is not from a workflow seed.",
    sections: [
      {
        id: "contact",
        title: "Contact",
        fields: [
          {
            name: "email",
            label: "Email",
            type: "email",
            required: true,
          },
          {
            name: "phone",
            label: "Phone",
            type: "phone",
          },
          {
            name: "intent",
            label: "What are you working on?",
            type: "select",
            required: true,
            options: [
              { value: "for_a_client", label: "For a client" },
              { value: "for_myself", label: "For myself" },
              { value: "for_my_organization", label: "For my organization" },
              { value: "evaluating", label: "I'm evaluating AlphaTensor" },
              { value: "research_or_other", label: "Research or other" },
            ],
          },
          {
            name: "note",
            label: "Anything specific about this document?",
            type: "textarea",
            help: "Up to 300 characters in the live form.",
          },
        ],
      },
    ],
  },
];
