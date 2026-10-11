/**
 * The annotated page preview on `/lab`.
 *
 * The preview renders the visitor's own first page with a box on every field
 * the backend reported, and one curved link from the active field to its row in
 * the form. Three properties are worth pinning, because each fails silently:
 *
 *   - The preview must not enter the server render. `/lab` is prerendered and
 *     `pdfjs` touches browser globals on import, so a static import would break
 *     the build rather than the page.
 *   - A box must be placed from the backend's normalized geometry, never from a
 *     measured page. Measuring is how the two silently drift apart.
 *   - The link line is one curve for the active field, not a diagram for every
 *     field, which is the decision the case-ops fill tool already made.
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

/** Block comments and whitespace change freely; assertions must not depend on them. */
const normalise = (source) =>
  source.replace(/\/\*[\s\S]*?\*\//g, " ").replace(/\s+/g, " ").trim();

const READING = normalise(read("src/lab/ReadingStage.tsx"));
const READING_CSS = normalise(read("src/lab/ReadingStage.module.css"));
const PREVIEW = normalise(read("src/lab/preview/PdfPreview.tsx"));
const PREVIEW_CSS = normalise(read("src/lab/preview/PdfPreview.module.css"));
const GEOMETRY = normalise(read("src/lab/preview/geometry.ts"));
const CONNECTOR = normalise(read("src/lab/preview/FieldConnector.tsx"));
const RENDERER = normalise(read("src/lab/form/LightForm.tsx"));
const TYPES = normalise(read("src/lab/types.ts"));

test("the preview is loaded in the browser only", () => {
  assert.match(
    READING,
    /void import\("\.\/preview\/PdfPreview"\)\.then/,
    "the preview module must be reached through a dynamic import inside an " +
      "effect. A static import is evaluated during the prerender, where pdfjs " +
      "reads browser globals, and the build breaks instead of the page.",
  );
  assert.doesNotMatch(
    READING,
    /import \{ PdfPreview \}/,
    "no value import of PdfPreview may exist; a type-only import is the only " +
      "one that is erased before the server render",
  );
  assert.match(
    PREVIEW,
    /pdfjs\.GlobalWorkerOptions\.workerSrc = workerUrl;/,
    "the worker has to be configured or every render falls back to the main " +
      "thread and blocks on a large form",
  );
});

test("a box is placed from the backend's normalized geometry", () => {
  assert.match(
    TYPES,
    /bbox\?: number\[\] \| null;/,
    "the field contract must carry the widget box, or the preview has nothing " +
      "to draw",
  );
  assert.match(
    PREVIEW,
    /left: percent\(x\),/,
    "a box is a percentage of the rendered page. Multiplying a measured page " +
      "size is the form that drifts when the renderer changes.",
  );
  assert.doesNotMatch(
    PREVIEW,
    /originalWidth|originalHeight/,
    "the page's point size must not be read; normalized geometry needs it not, " +
      "and a rotated or cropped page has no honest box anyway",
  );
});

test("the preview skips a field with no drawable box", () => {
  assert.match(
    READING,
    /field\.reserved \|\| !bbox \|\| bbox\.length !== 4/,
    "a reserved machine field, and a field the backend gave no box, must be " +
      "left out rather than given a guessed rectangle",
  );
});

test("the page and the form agree on the active field", () => {
  assert.match(
    RENDERER,
    /"data-lab-field": name,/,
    "a form row must carry its field name, or the connector layer cannot find " +
      "the row the box on the page belongs to",
  );
  assert.match(
    PREVIEW,
    /data-lab-box=\{name\}/,
    "a box on the page must carry its field name for the same reason",
  );
  assert.match(
    RENDERER,
    /onMouseEnter: onActivateField \? \(\) => onActivateField\(name\) : undefined,/,
    "the hover handlers are attached only when someone is listening, so the " +
      "sample-driven sandbox does no hover work it does not use",
  );
});

test("the link is one curve for the active field", () => {
  assert.match(
    GEOMETRY,
    /if \(gap < MIN_CONNECTOR_GAP\) return null;/,
    "a curve with no gutter to cross must not be drawn, or the two surfaces " +
      "look joined when they have wrapped to one column",
  );
  assert.match(
    GEOMETRY,
    /C \$\{round1\(startX \+ handle\)\}/,
    "the link is one cubic Bezier with horizontal tangents at both ends",
  );
  assert.match(
    CONNECTOR,
    /const BOX_SELECTOR = "\[data-lab-box\]";/,
    "the connector measures only the active field, so a large form costs no " +
      "more than a small one",
  );
  assert.match(
    PREVIEW_CSS,
    /\.connectorLayer \{[^}]*pointer-events: none;/,
    "the line layer must never intercept the pointer, or it swallows clicks on " +
      "the boxes beneath it",
  );
});

test("the page stays in view while the form scrolls", () => {
  assert.match(
    READING_CSS,
    /\.previewColumn \{[^}]*position: sticky;/,
    "the link line is worthless once the page has scrolled away, so the " +
      "preview column is sticky while the form scrolls past it",
  );
  assert.match(
    READING_CSS,
    /@media \(max-width: 1180px\) \{.*?\.previewColumn \{ position: static;/,
    "once the columns stack there is no gutter for a line to cross, so the " +
      "column must stop being sticky",
  );
});

test("the three column reading appears only with a preview", () => {
  assert.match(
    READING,
    /styles\.gridWithPreview/,
    "a document with no drawable geometry keeps the two column reading, so the " +
      "column count must be conditional rather than fixed at three",
  );
  assert.match(
    READING_CSS,
    /\.gridWithPreview \{ grid-template-columns: minmax\(0, 3fr\)/,
    "the three column track is what puts the page between the reading and the " +
      "form, adjacent to the form the line has to reach",
  );
});

test("the embedded file viewer does not come back", () => {
  assert.doesNotMatch(
    READING,
    /<iframe/,
    "the preview is a grounded overlay on the visitor's own file, not the " +
      "embedded viewer that showed them the file they already had",
  );
});
