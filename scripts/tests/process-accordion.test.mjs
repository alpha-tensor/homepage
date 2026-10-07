/**
 * Process accordion invariants.
 *
 * The accordion is ported from a reference build, and four things about it are easy
 * to lose without the page looking broken:
 *
 *   - The collapsed panels are `inert`. The height collapse is visual only, so
 *     without it a screen reader reads all five panels and reports five steps where
 *     one is showing. Nothing about the rendering changes when it is dropped.
 *   - The height is the `grid-template-rows: 0fr` mechanism. Swapping it for a
 *     `max-height` transition also animates, and also subtly wrong, because the
 *     curve becomes a function of the guess rather than of the panel.
 *   - One row open at a time is held as a single index. Two booleans per row would
 *     render the same until the day someone opens two, and would then let the two
 *     `aria-expanded` attributes disagree.
 *   - The row height is the sum of the badge and the padding rather than a fixed
 *     height, so the title can wrap without the row growing. A literal height would
 *     clip a two line title.
 *
 * Dependency free: node:test and node:fs only.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");

/** Comments and whitespace change freely; assertions must not depend on them. */
function readNormalised(path) {
  return readFileSync(path, "utf8")
    .replace(/\/\*[\s\S]*?\*\//g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** The whole rule for a selector, read to its closing brace. */
function ruleFor(source, selector) {
  const start = source.indexOf(`${selector} {`);
  assert.notEqual(start, -1, `the stylesheet no longer has a ${selector} rule`);
  return source.slice(start, source.indexOf("}", start));
}

/** A declaration's value, read to its terminating semicolon. */
function declaration(rule, property) {
  const start = rule.indexOf(`${property}:`);
  assert.notEqual(start, -1, `${property} is no longer declared`);
  const from = start + property.length + 1;
  return rule.slice(from, rule.indexOf(";", from)).trim();
}

const css = readNormalised(
  resolve(REPO_ROOT, "src/lab/ProcessAccordion.module.css"),
);
const component = readFileSync(
  resolve(REPO_ROOT, "src/lab/ProcessAccordion.tsx"),
  "utf8",
);
const lab = readNormalised(resolve(REPO_ROOT, "src/lab/TaglineLab.module.css"));
const page = readFileSync(resolve(REPO_ROOT, "src/lab/TaglineLab.tsx"), "utf8");

test("the rows are a real accordion, not a styled list", () => {
  assert.match(
    component,
    /aria-expanded=\{isOpen\}/,
    "the row has to announce its own state or assistive tech sees five identical buttons",
  );
  assert.match(
    component,
    /aria-controls=\{`\$\{ID\}-panel-\$\{index\}`\}/,
    "the control has to point at the panel it opens, and by a computed id rather " +
      "than a literal, or the two drift the moment the index handling changes",
  );
  assert.match(
    component,
    /role="region"[\s\S]*?aria-labelledby=\{`\$\{ID\}-button-\$\{index\}`\}/,
    "the panel is a region named by its own button, which is what makes it " +
      "reachable as a landmark rather than as loose text",
  );
});

test("collapsed panels are inert, so only the open step is read", () => {
  assert.match(
    component,
    /inert=\{!isOpen\}/,
    "a collapsed panel still occupies the accessibility tree. The collapse is a " +
      "height, so without `inert` every step is announced and the open one is not " +
      "identifiable by the reading order.",
  );
});

test("one row is open at a time, held as a single index", () => {
  assert.match(
    component,
    /const \[openIndex, setOpenIndex\] = React\.useState\(/,
    "a boolean per row would let two rows be open and let the two aria-expanded " +
      "attributes disagree with the visual state",
  );
  assert.match(component, /const isOpen = index === openIndex;/);
  assert.match(
    component,
    /onClick=\{\(\) => setOpenIndex\(index\)\}/,
    "opening a row has to set the index, which is what closes the previous one. Two " +
      "animations running together is the reference's own behaviour.",
  );
});

test("the step content comes from the shared journey content", () => {
  assert.match(
    component,
    /landingPageContent\.caseJourney/,
    "the steps are copy, and the process section is the second surface to show them. " +
      "A local array here would be a second copy to keep in step with the homepage.",
  );
  assert.doesNotMatch(
    component,
    /Documents arrive|Exceptions are flagged/,
    "no step copy may be inlined in the component",
  );
});

test("the row height is the badge and the padding, not a literal", () => {
  assert.equal(
    declaration(ruleFor(css, ".section"), "--acc-badge"),
    "36px",
    "the badge is what fixes the row height on the reference: 36 plus 22 twice is 80",
  );
  assert.equal(declaration(ruleFor(css, ".section"), "--acc-pad-y"), "22px");
  assert.equal(
    declaration(ruleFor(css, ".section"), "--acc-row"),
    "80px",
    "80 is the closed row on the reference, and it is the badge plus the padding",
  );
  assert.match(
    ruleFor(css, ".rowButton"),
    /min-height: var\(--acc-row\);/,
    "a literal height here would clip a title that wraps to two lines",
  );
});

test("only the open row carries a fill", () => {
  assert.equal(
    declaration(ruleFor(css, ".row"), "background-color"),
    "transparent",
    "closed rows are transparent so the five labels read as a list and the open one " +
      "reads as a panel. Filling every row turns it into five stacked cards.",
  );
  assert.match(
    css,
    /\.row\[data-open="true"\] \{ background-color: var\(--acc-open-fill\);/,
  );
});

test("the height animates through the grid mechanism, not a max-height guess", () => {
  assert.equal(
    declaration(ruleFor(css, ".panelWrap"), "grid-template-rows"),
    "0fr",
  );
  assert.match(
    css,
    /\.row\[data-open="true"\] \.panelWrap \{ grid-template-rows: 1fr;/,
  );
  assert.doesNotMatch(
    css,
    /max-height/,
    "a max-height transition animates but the curve becomes a function of the guess, " +
      "and the panel is a different height at every width and wrapping",
  );
  /* The 0fr row still resolves to the content height without both of these. */
  assert.match(ruleFor(css, ".panel"), /overflow: hidden;/);
  assert.match(ruleFor(css, ".panel"), /min-height: 0;/);
});

test("one duration drives the row, the panel and the chevron", () => {
  assert.equal(declaration(ruleFor(css, ".section"), "--acc-dur"), "400ms");
  for (const selector of [".row", ".panelWrap", ".chevron"]) {
    assert.match(
      declaration(ruleFor(css, selector), "transition"),
      /var\(--acc-dur\) var\(--acc-ease\)/,
      `${selector} must read the shared duration, or the fill, the height and the ` +
        "chevron finish at three different times on one click",
    );
  }
});

test("the panel copy is inset to the title, not to the row", () => {
  assert.match(
    declaration(ruleFor(css, ".panelInner"), "padding"),
    /calc\(var\(--acc-pad-x\) \+ var\(--acc-badge\) \+ var\(--acc-badge-gap\)\)/,
    "the reference aligns the panel's copy with the title's own left edge, which is " +
      "the row padding plus the badge plus the gap. A literal 84 would come apart " +
      "the moment the badge is resized for a phone.",
  );
});

test("both columns are real tracks, so the visual cannot overflow", () => {
  const value = declaration(ruleFor(css, ".pair"), "grid-template-columns");
  const tracks = [...value.matchAll(/minmax\(0, (\d+)fr\)/g)].map((m) =>
    Number(m[1]),
  );
  assert.equal(
    tracks.length,
    2,
    `expected two fractional tracks, got ${value}`,
  );
  const [first, second] = tracks;
  assert.ok(
    second >= first * 0.5,
    `the second track is ${second}fr against ${first}fr, which resolves to a few ` +
      "pixels. The visual then paints past the viewport from inside its own column " +
      "instead of sitting in it, and the page gains a horizontal scrollbar that no " +
      "individual rule looks responsible for.",
  );
});

test("the entrance cannot outlive reduced motion", () => {
  assert.match(
    css,
    /\.visualNumber \{[^}]*animation: processNumberIn/,
    "the entrance is an animation, not a transition",
  );
  const blanket = lab.slice(
    lab.indexOf("@media (prefers-reduced-motion: reduce)"),
  );
  assert.match(
    blanket,
    /animation-duration: 1ms !important;/,
    "a transitions-only reduced-motion blanket leaves an animation running. The doc " +
      "requires the static composition to be complete without motion.",
  );
  assert.match(blanket, /transition-duration: 1ms !important;/);
});

test("the process section sits inside the overlay's inert wrapper", () => {
  assert.match(
    page,
    /<div inert=\{menuOpen\}>[\s\S]*<ProcessAccordion \/>/,
    "the menu panel is opaque and full bleed, so a section outside the inert wrapper " +
      "stays focusable behind an open menu",
  );
  assert.equal(
    (page.match(/inert=\{/g) || []).length,
    1,
    "one wrapper owns the inert state. A second one on a section reads as if it were " +
      "doing the work and would silently keep doing nothing after the wrapper changed.",
  );
});
