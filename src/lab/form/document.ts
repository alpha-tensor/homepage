import type { DocumentIdentity, PublicFormField } from "../types";
import type {
  LightField,
  LightFieldType,
  LightForm,
  LightOption,
  LightSection,
} from "./types";

/**
 * Turns an uploaded document into a `LightForm`.
 *
 * The backend does the reading: it extracts each field's name, label, control
 * type and value from the file's own form (see
 * `padilla/routers/public_analysis/form_fields.py`) and returns them on the
 * upload response. This adapter only reshapes that into the model the renderer
 * draws, which is the same renderer the sample templates use, so there is one
 * implementation of "sections and fields to a form", not two.
 *
 * A public field carries a section, a label and a type already, so this is a
 * projection rather than a guess. The only per-field decision left is which
 * renderer control matches the form's own type, and a radio or select without
 * choices degrades to a text box rather than rendering nothing.
 */

/** Everything needed to derive a form from one processed upload. */
export interface DocumentFormSource {
  documentId: string;
  filename: string;
  identity: DocumentIdentity | null;
  /** The named fields on page one, straight from the upload response. */
  fields: PublicFormField[];
}

/** A derived form and the values already read for it. */
export interface DerivedForm {
  template: LightForm;
  /** Flat initial values, keyed by field name. */
  values: Record<string, string>;
}

/** `person.name.first_name` to `First name`; `Line1a_FamilyName` to `Line 1a Family name`. */
export const humanize = (segment: string): string => {
  const spaced = segment
    .replace(/[_-]+/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/([A-Za-z])(\d)/g, "$1 $2")
    .replace(/\s+/g, " ")
    .trim();
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
};

/**
 * Pick the renderer control for the form's own field type.
 *
 * @param fieldType The form's control, as the backend reported it.
 * @param options Choices carried by the field, if any.
 * @returns The closest renderer type. An unknown control degrades to text.
 */
export const mapFieldType = (
  fieldType: string,
  options: LightOption[] | undefined,
  multiline = false,
): LightFieldType => {
  switch (fieldType) {
    case "checkbox":
      return "checkbox";
    case "radio":
      return options ? "radio" : "text";
    case "select":
      return options ? "select" : "text";
    default:
      // A multiline text box is a text area. Signature, button, and unknown
      // all render as a text box.
      return multiline ? "textarea" : "text";
  }
};

/** The identified form's display value, when the ladder established one. */
const identifiedForm = (identity: DocumentIdentity | null): string | null => {
  const rung = identity?.rungs.find(
    (entry) => entry.key === "form_type" && entry.status === "identified",
  );
  return rung?.value ?? null;
};

/**
 * Build a light form from a processed document, or `null` when the response
 * carried no fields.
 *
 * @param source The upload result, its identity ladder, and the filename.
 * @returns The derived form and its read values, or `null` when there is
 *   nothing to render.
 */
export const buildLightFormFromDocument = (
  source: DocumentFormSource,
): DerivedForm | null => {
  const fields = source.fields;
  if (fields.length === 0) return null;

  const order: string[] = [];
  const bySection = new Map<string, LightField[]>();
  const values: Record<string, string> = {};

  // The open question group. A single-choice item is one box per option, each
  // repeating the question in its tooltip, so a run of boxes that share a
  // question is drawn once, with the question as the legend and the boxes as a
  // row of answers rather than the question printed on every one.
  let openGroup: LightField | null = null;
  let openQuestion = "";
  let openSection = "";
  let openGroupLabel = "";

  for (const field of fields) {
    // A reserved field is a machine field, e.g. the USCIS PDF417 barcode, and
    // must not be shown as something a person fills in.
    if (field.reserved) continue;

    const sectionKey = field.section || "Page 1";
    if (!bySection.has(sectionKey)) {
      bySection.set(sectionKey, []);
      order.push(sectionKey);
    }

    // A subsection becomes the renderer's group, which draws the sub-heading.
    const group = field.subsection ?? undefined;
    const question = field.question ?? "";

    if (question) {
      const continues =
        openGroup !== null &&
        question === openQuestion &&
        sectionKey === openSection &&
        (group ?? "") === openGroupLabel;
      if (continues && openGroup) {
        openGroup.fields?.push({
          name: field.name,
          label: field.label,
          type: "checkbox",
        });
      } else {
        const created: LightField = {
          name: field.name,
          label: question,
          group,
          type: "checkbox_group",
          fields: [{ name: field.name, label: field.label, type: "checkbox" }],
        };
        bySection.get(sectionKey)?.push(created);
        openGroup = created;
        openQuestion = question;
        openSection = sectionKey;
        openGroupLabel = group ?? "";
      }
      values[field.name] = field.value;
      continue;
    }

    // Any other field ends the run, so a later question starts a new group.
    openGroup = null;
    openQuestion = "";

    const options =
      field.options && field.options.length > 0
        ? field.options.map((value) => ({ value, label: humanize(value) }))
        : undefined;

    bySection.get(sectionKey)?.push({
      name: field.name,
      label: field.label,
      group,
      type: mapFieldType(field.field_type, options, field.multiline),
      options,
    });
    values[field.name] = field.value;
  }

  const sections: LightSection[] = order.map((sectionKey) => ({
    id: sectionKey,
    title: sectionKey,
    fields: bySection.get(sectionKey) ?? [],
  }));

  const document = identifiedForm(source.identity) ?? "Uploaded document";

  return {
    template: {
      id: source.documentId,
      document,
      title: "Fields read from the document",
      description: `Sections and fields read from ${source.filename}. A value already in the file is shown; edit any field.`,
      sections,
    },
    values,
  };
};
