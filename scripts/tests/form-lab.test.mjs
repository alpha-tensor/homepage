/**
 * Contract tests for the generated-form lab at `/lab/form`.
 *
 * The lab is a rendering experiment: it turns the workflow generator's own
 * sections, field names and field types into a plain form. Three things are
 * worth pinning, because each is easy to break without the page looking wrong:
 *
 *   - The route ships. A page that only exists client-side never reaches a
 *     crawler, and the prerenderer is the only place that decides.
 *   - Every field type the samples use is one the renderer actually draws. A
 *     type that is added to a sample but not to the renderer would silently
 *     fall through to the default text input and look plausible.
 *   - The page stays inert. This is a lab: if it ever starts calling an
 *     endpoint, that is a product change, not an experiment.
 *
 * Dependency free: node:test and node:fs only.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
const read = (relative) => readFileSync(resolve(REPO_ROOT, relative), "utf8");

const SAMPLES = read("src/lab/form/samples.ts");
const RENDERER = read("src/lab/form/LightForm.tsx");
const ADAPTER = read("src/lab/form/document.ts");
const PAGE = read("src/lab/form/FormLabPage.tsx");
const LAB_PAGE = read("src/lab/LabPage.tsx");
const APP = read("src/App.tsx");
const PRERENDER = read("scripts/prerender.mjs");

/** Everything the renderer claims to understand, from `types.ts`. */
const SUPPORTED_TYPES = [
  "text",
  "textarea",
  "email",
  "phone",
  "number",
  "date",
  "select",
  "combobox",
  "radio",
  "checkbox",
  "checkbox_group",
  "multi_select",
  "repeat_group",
];

/** Every `type: "..."` used by a field in the sample set. */
const sampleTypes = [...SAMPLES.matchAll(/type:\s*"([a-z_]+)"/g)].map(
  (match) => match[1],
);

test("the /lab/form route is declared for the prerenderer", () => {
  assert.match(
    PRERENDER,
    /render: "\/lab\/form",\s*boot: "\/lab\/form",\s*out: "lab\/form\.html",\s*also: \["lab\/form\/index\.html"\]/,
    "the form lab must emit its own document, with the same double emission " +
      "as /lab so it resolves under either trailing-slash behaviour",
  );
});

test("the app routes /lab/form to the form lab", () => {
  assert.match(
    APP,
    /const isFormLabRoute = pathname === "\/lab\/form";/,
    "without the exact-match route the path falls through to the 404 page",
  );
  assert.match(
    APP,
    /isFormLabRoute\s*\?\s*FORM_LAB_TITLE/,
    "the form lab needs its own document title",
  );
  assert.match(APP, /<FormLabPage \/>/);
});

test("the sample set stays inside the supported field types", () => {
  assert.ok(sampleTypes.length > 0, "no field types found in samples.ts");
  for (const type of sampleTypes) {
    assert.ok(
      SUPPORTED_TYPES.includes(type),
      `samples.ts uses "${type}", which is not a supported field type`,
    );
  }
});

test("the renderer draws every supported field type", () => {
  for (const type of SUPPORTED_TYPES) {
    assert.match(
      RENDERER,
      new RegExp(`"${type}"`),
      `LightForm.tsx never mentions "${type}", so a sample using it would ` +
        "silently fall through to the default control",
    );
  }
  assert.match(
    RENDERER,
    /default:\s*\n?\s*return \(/,
    "the renderer needs a default branch so an unknown type renders as a text " +
      "input rather than disappearing",
  );
});

test("the sample set exercises the wider field mix", () => {
  for (const type of [
    "repeat_group",
    "radio",
    "multi_select",
    "combobox",
    "phone",
    "email",
    "date",
    "select",
    "textarea",
  ]) {
    assert.ok(
      sampleTypes.includes(type),
      `the samples no longer exercise "${type}", so the renderer for it is ` +
        "untested against real data",
    );
  }
});

test("the document flow renders fields with the shared renderer", () => {
  for (const [name, source] of [
    ["LabPage.tsx", LAB_PAGE],
    ["FormLabPage.tsx", PAGE],
  ]) {
    assert.match(
      source,
      /buildLightFormFromDocument/,
      `${name} must derive its form through the shared adapter`,
    );
    assert.match(
      source,
      /<LightFormView/,
      `${name} must draw it with the one shared renderer`,
    );
  }
});

test("the renderer and the adapter stay pure", () => {
  for (const [name, source] of [
    ["LightForm.tsx", RENDERER],
    ["document.ts", ADAPTER],
  ]) {
    assert.doesNotMatch(
      source,
      /\bfetch\(|XMLHttpRequest/,
      `${name} must stay a pure transformation; network access belongs in the ` +
        "lab api module",
    );
  }
});

test("the page reaches the network only through the lab api module", () => {
  assert.match(
    PAGE,
    /from "\.\.\/api"/,
    "the upload flow must reuse the lab api client rather than call fetch itself",
  );
  assert.doesNotMatch(
    PAGE,
    /\bfetch\(|XMLHttpRequest/,
    "FormLabPage.tsx must not call fetch directly; that is the api client's job",
  );
});

test("the adapter groups by the section the backend reported", () => {
  assert.match(
    ADAPTER,
    /export const buildLightFormFromDocument/,
    "the page depends on buildLightFormFromDocument to turn a document into a form",
  );
  assert.match(
    ADAPTER,
    /const sectionKey = field\.section \|\| "Page 1";/,
    "sections come from the section the backend read off the document, so a new " +
      "document shape needs no adapter change",
  );
  assert.match(
    ADAPTER,
    /if \(fields\.length === 0\) return null;/,
    "an empty field list must return null so the page can state the fact " +
      "instead of rendering an empty form",
  );
});

test("the adapter drops reserved fields and draws multiline as a text area", () => {
  assert.match(
    ADAPTER,
    /if \(field\.reserved\) continue;/,
    "a reserved machine field such as the USCIS PDF417 barcode must never " +
      "render as something a person fills in",
  );
  assert.match(
    ADAPTER,
    /return multiline \? "textarea" : "text";/,
    "a multiline text box read off a form must render as a text area",
  );
});

test("the adapter shares one question across a run of option boxes", () => {
  assert.match(
    ADAPTER,
    /type: "checkbox_group"/,
    "one box per option must collapse into one group so the question is not " +
      "repeated on every box",
  );
  assert.match(
    ADAPTER,
    /label: question,/,
    "the shared question is the group legend, not a per box label",
  );
});
