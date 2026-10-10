import React, { useMemo, useState } from "react";
import styles from "./LightForm.module.css";
import type { LightField, LightForm } from "./types";

/**
 * The light form renderer.
 *
 * It walks a `LightForm`'s sections in order and renders each field by type,
 * keeping the generator's field `name` as the key of every answer. Fields that
 * share a `group` are gathered under one sub-heading, so a node with two groups
 * still reads as one page.
 *
 * What it does not do, because this is a rendering experiment: validation, the
 * Zod schema, canonical mapping, conditional visibility, and any network call.
 * The submit button only prints the collected object, keyed the same way the
 * generator keys its form data, so the mapping is visible rather than trusted.
 *
 * Rendered on the server (the build prerenders `/lab/form`), so there is no
 * `window` access at module scope or during render.
 */

/** A nested payload, or the array a repeat group contributes. */
type Container = Record<string, unknown> | unknown[];

/**
 * Write a flat key such as `person.children[0].name.first` into a nested object.
 *
 * @param root The object to write into.
 * @param key The flat path, with `[n]` for repeat rows.
 * @param value The value to place at that path.
 */
const assignPath = (root: Container, key: string, value: unknown): void => {
  const tokens = key.match(/[^.[\]]+/g) ?? [];
  let node: Container = root;
  tokens.forEach((token, index) => {
    const last = index === tokens.length - 1;
    const nextIsIndex = !last && /^\d+$/.test(tokens[index + 1]);
    if (Array.isArray(node)) {
      const position = Number(token);
      if (last) {
        node[position] = value;
        return;
      }
      if (node[position] === undefined) node[position] = nextIsIndex ? [] : {};
      node = node[position] as Container;
      return;
    }
    const record = node as Record<string, unknown>;
    if (last) {
      record[token] = value;
      return;
    }
    if (record[token] === undefined) record[token] = nextIsIndex ? [] : {};
    node = record[token] as Container;
  });
};

/**
 * Drop one row of a repeat group and pull every later row up to close the gap.
 *
 * @param values The current flat values.
 * @param groupPath The repeat group's field name.
 * @param index The row being removed.
 * @returns A new flat values object with that row gone.
 */
const removeRow = (
  values: Record<string, unknown>,
  groupPath: string,
  index: number,
): Record<string, unknown> => {
  const prefix = `${groupPath}[`;
  const next: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(values)) {
    if (!key.startsWith(prefix)) {
      next[key] = value;
      continue;
    }
    const [rawIndex, suffix] = key.slice(prefix.length).split("]");
    const rowIndex = Number(rawIndex);
    if (!Number.isInteger(rowIndex)) {
      next[key] = value;
      continue;
    }
    if (rowIndex === index) continue;
    const shifted = rowIndex > index ? rowIndex - 1 : rowIndex;
    next[`${groupPath}[${shifted}]${suffix}`] = value;
  }
  return next;
};

const REQUIRED_PILL = "Required";
const OPTIONAL_PILL = "Optional";

/** Values a form uses for an unchecked box, beyond the literal false. */
const UNCHECKED = new Set(["", "0", "off", "false", "no", "n"]);

/** Whether a stored value means a checkbox is ticked. */
const toChecked = (value: unknown): boolean => {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    return !UNCHECKED.has(value.trim().toLowerCase());
  }
  return false;
};

interface LightFormProps {
  /** The form to render. Remount it with a `key` when the template changes. */
  template: LightForm;
  /**
   * Flat initial values, keyed by field name. The document flow uses this to
   * prefill the form with the values already read off the file.
   */
  initialValues?: Record<string, string>;
}

/** Renders one section's fields and reports every answer back as it is typed. */
export const LightFormView = ({
  template,
  initialValues,
}: LightFormProps): React.JSX.Element => {
  const [values, setValues] = useState<Record<string, unknown>>(() => ({
    ...(initialValues ?? {}),
  }));
  const [rowCounts, setRowCounts] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState<string | null>(null);

  const setValue = (path: string, value: unknown) => {
    setSubmitted(null);
    setValues((current) => ({ ...current, [path]: value }));
  };

  const toggleOption = (path: string, option: string, checked: boolean) => {
    setSubmitted(null);
    setValues((current) => {
      const existing = Array.isArray(current[path])
        ? (current[path] as string[])
        : [];
      const next = checked
        ? [...existing, option]
        : existing.filter((entry) => entry !== option);
      return { ...current, [path]: next };
    });
  };

  const addRow = (groupPath: string) => {
    setSubmitted(null);
    setRowCounts((current) => ({
      ...current,
      [groupPath]: (current[groupPath] ?? 0) + 1,
    }));
  };

  const dropRow = (groupPath: string, index: number) => {
    setSubmitted(null);
    setValues((current) => removeRow(current, groupPath, index));
    setRowCounts((current) => ({
      ...current,
      [groupPath]: Math.max(0, (current[groupPath] ?? 0) - 1),
    }));
  };

  const reset = () => {
    setValues({});
    setRowCounts({});
    setSubmitted(null);
  };

  const renderLabelPill = (field: LightField) =>
    field.required ? (
      <span className={styles.required}>{REQUIRED_PILL}</span>
    ) : (
      <span className={styles.optional}>{OPTIONAL_PILL}</span>
    );

  const textValue = (path: string): string => {
    const value = values[path];
    return typeof value === "string" ? value : "";
  };

  const listValue = (path: string): string[] => {
    const value = values[path];
    return Array.isArray(value) ? (value as string[]) : [];
  };

  const control = (field: LightField, path: string): React.JSX.Element => {
    const id = `lab-field-${path}`;
    switch (field.type) {
      case "textarea":
        return (
          <textarea
            id={id}
            className={`${styles.control} ${styles.textarea}`}
            name={path}
            placeholder={field.placeholder}
            value={textValue(path)}
            onChange={(event) => setValue(path, event.target.value)}
          />
        );
      case "select":
      case "combobox":
        if (field.type === "combobox") {
          const listId = `${id}-list`;
          return (
            <>
              <input
                id={id}
                className={styles.control}
                type="text"
                name={path}
                list={field.options ? listId : undefined}
                placeholder={field.placeholder}
                value={textValue(path)}
                onChange={(event) => setValue(path, event.target.value)}
              />
              {field.options && (
                <datalist id={listId}>
                  {field.options.map((option) => (
                    <option key={option.value} value={option.label} />
                  ))}
                </datalist>
              )}
            </>
          );
        }
        return (
          <select
            id={id}
            className={styles.control}
            name={path}
            value={textValue(path)}
            onChange={(event) => setValue(path, event.target.value)}
          >
            <option value="" disabled>
              Select one
            </option>
            {(field.options ?? []).map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      case "date":
        return (
          <input
            id={id}
            className={styles.control}
            type="date"
            name={path}
            value={textValue(path)}
            onChange={(event) => setValue(path, event.target.value)}
          />
        );
      case "email":
        return (
          <input
            id={id}
            className={styles.control}
            type="email"
            name={path}
            autoComplete="email"
            placeholder={field.placeholder}
            value={textValue(path)}
            onChange={(event) => setValue(path, event.target.value)}
          />
        );
      case "phone":
        return (
          <input
            id={id}
            className={styles.control}
            type="tel"
            name={path}
            autoComplete="tel"
            placeholder={field.placeholder}
            value={textValue(path)}
            onChange={(event) => setValue(path, event.target.value)}
          />
        );
      case "number":
        return (
          <input
            id={id}
            className={styles.control}
            type="number"
            name={path}
            placeholder={field.placeholder}
            value={textValue(path)}
            onChange={(event) => setValue(path, event.target.value)}
          />
        );
      default:
        return (
          <input
            id={id}
            className={styles.control}
            type="text"
            name={path}
            placeholder={field.placeholder}
            value={textValue(path)}
            onChange={(event) => setValue(path, event.target.value)}
          />
        );
    }
  };

  const renderField = (field: LightField, path: string): React.JSX.Element => {
    if (field.type === "repeat_group") {
      const count = rowCounts[path] ?? 0;
      const children = field.fields ?? [];
      return (
        <div className={styles.repeat} key={path}>
          <div className={styles.repeatHead}>
            <span className={styles.label}>{field.label}</span>
            <button
              type="button"
              className={styles.addButton}
              onClick={() => addRow(path)}
            >
              Add row
            </button>
          </div>

          {count === 0 && (
            <p className={styles.empty}>No rows yet. Add one if it applies.</p>
          )}

          {Array.from({ length: count }, (_, index) => (
            <fieldset className={styles.row} key={`${path}-${index}`}>
              <legend className={styles.rowLegend}>Row {index + 1}</legend>
              <div className={styles.rowFields}>
                {children.map((child) =>
                  renderField(child, `${path}[${index}].${child.name}`),
                )}
              </div>
              <button
                type="button"
                className={styles.removeButton}
                onClick={() => dropRow(path, index)}
              >
                Remove row {index + 1}
              </button>
            </fieldset>
          ))}
        </div>
      );
    }

    if (field.type === "checkbox") {
      return (
        <div className={styles.field} key={path}>
          <label className={styles.check} htmlFor={`lab-field-${path}`}>
            <input
              id={`lab-field-${path}`}
              type="checkbox"
              name={path}
              checked={toChecked(values[path])}
              onChange={(event) => setValue(path, event.target.checked)}
            />
            <span>
              {field.label} {renderLabelPill(field)}
            </span>
          </label>
          {field.help && <span className={styles.help}>{field.help}</span>}
        </div>
      );
    }

    if (field.type === "radio" || field.type === "multi_select") {
      const selected = field.type === "radio" ? textValue(path) : "";
      const selectedList = field.type === "multi_select" ? listValue(path) : [];
      const inputType = field.type === "radio" ? "radio" : "checkbox";
      return (
        <fieldset className={styles.field} key={path}>
          <legend className={styles.label}>
            {field.label} {renderLabelPill(field)}
          </legend>
          <div className={styles.options}>
            {(field.options ?? []).map((option) => {
              const optionId = `${path}-${option.value}`;
              const checked =
                field.type === "radio"
                  ? selected === option.value
                  : selectedList.includes(option.value);
              return (
                <label className={styles.option} key={option.value}>
                  <input
                    id={`lab-field-${optionId}`}
                    type={inputType}
                    name={path}
                    value={option.value}
                    checked={checked}
                    onChange={(event) =>
                      field.type === "radio"
                        ? setValue(path, option.value)
                        : toggleOption(path, option.value, event.target.checked)
                    }
                  />
                  <span>{option.label}</span>
                </label>
              );
            })}
          </div>
          {field.help && <span className={styles.help}>{field.help}</span>}
        </fieldset>
      );
    }

    return (
      <div className={styles.field} key={path}>
        <label className={styles.label} htmlFor={`lab-field-${path}`}>
          {field.label} {renderLabelPill(field)}
        </label>
        {control(field, path)}
        {field.help && <span className={styles.help}>{field.help}</span>}
      </div>
    );
  };

  /** Group a section's fields by their `group`, preserving first-seen order. */
  const groupedFields = useMemo(() => {
    return template.sections.map((section) => {
      const order: string[] = [];
      const byGroup = new Map<string, LightField[]>();
      for (const field of section.fields) {
        const key = field.group ?? "";
        if (!byGroup.has(key)) {
          byGroup.set(key, []);
          order.push(key);
        }
        byGroup.get(key)?.push(field);
      }
      return { section, order, byGroup };
    });
  }, [template]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payload: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(values)) {
      assignPath(payload, key, value);
    }
    setSubmitted(JSON.stringify(payload, null, 2));
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {groupedFields.map(({ section, order, byGroup }) => (
        <section className={styles.section} key={section.id}>
          <header className={styles.sectionHead}>
            <h3 className={styles.sectionTitle}>{section.title}</h3>
            {section.description && (
              <p className={styles.sectionNote}>{section.description}</p>
            )}
          </header>

          {order.map((group) => {
            const fields = byGroup.get(group) ?? [];
            if (group === "") {
              return (
                <div className={styles.fieldList} key={`${section.id}-flat`}>
                  {fields.map((field) => renderField(field, field.name))}
                </div>
              );
            }
            return (
              <div className={styles.groupBlock} key={`${section.id}-${group}`}>
                <h4 className={styles.groupTitle}>{group}</h4>
                <div className={styles.fieldList}>
                  {fields.map((field) => renderField(field, field.name))}
                </div>
              </div>
            );
          })}
        </section>
      ))}

      <div className={styles.actions}>
        <button type="submit" className="btn btn-primary">
          Collect
        </button>
        <button type="button" className="btn btn-outline" onClick={reset}>
          Reset
        </button>
      </div>

      {submitted && (
        <div className={styles.output} role="status">
          <p className={styles.outputLabel}>
            Collected, keyed by field name. Nothing was sent.
          </p>
          <pre className={styles.outputCode}>{submitted}</pre>
        </div>
      )}
    </form>
  );
};
