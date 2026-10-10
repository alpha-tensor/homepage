/**
 * Light form model for the generated-form experiment at `/lab/form`.
 *
 * This is a deliberately small projection of the workflow generator in
 * `apps/puerta-seraf/src/workflow`: the parts that decide what a document's
 * form looks like, without the runtime. A section is an input node; a field
 * keeps the generator's `name` (the canonical path used to key the answer) and
 * its `label`, and `group` carries the node's group label so a section with two
 * groups still renders as one page.
 *
 * Left out on purpose, because this page is a rendering test and not the
 * product: the Zod schema (`schemaGenerator.ts`), canonical mapping
 * (`canonicalMapper.ts`), packaging and packet scoring, persistence, and every
 * conditional rule. Nothing here reads or writes anything.
 */

/**
 * The field types the light renderer understands.
 *
 * These are the generator's types (`text`, `textarea`, `email`, `date`,
 * `select`, `number`, `repeat_group`) plus the handful the v2 discovery
 * workflow adds (`phone`, `radio`, `multi_select`, `combobox`). A type that is
 * not in this list falls back to a text input rather than vanishing, so an
 * unknown field is visible rather than silently dropped.
 */
export type LightFieldType =
  | "text"
  | "textarea"
  | "email"
  | "phone"
  | "number"
  | "date"
  | "select"
  | "combobox"
  | "radio"
  | "checkbox"
  | "multi_select"
  | "repeat_group";

/** A selectable option, reduced to the value stored and the label shown. */
export interface LightOption {
  value: string;
  label: string;
}

/** A single field, in the order it should be read. */
export interface LightField {
  /** The generator's field name, e.g. `person.name.first`. Keys the answer. */
  name: string;
  label: string;
  type: LightFieldType;
  /** The source node group this field belongs to, e.g. `Identity`. */
  group?: string;
  required?: boolean;
  placeholder?: string;
  /** A short format hint, rendered under the control. */
  help?: string;
  options?: LightOption[];
  /** Child fields, present only for `repeat_group`. */
  fields?: LightField[];
}

/** One input node, rendered as one section of the form. */
export interface LightSection {
  /** The input node id in the source workflow, e.g. `client_bio`. */
  id: string;
  title: string;
  description?: string;
  fields: LightField[];
}

/** A whole light form: the sections and fields for one document. */
export interface LightForm {
  id: string;
  /** The document this form stands in for, e.g. `Form I-485`. */
  document: string;
  title: string;
  description: string;
  sections: LightSection[];
}
