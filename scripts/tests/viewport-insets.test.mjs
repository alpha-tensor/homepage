/**
 * Native viewport and inset invariants.
 *
 * This pins the set adopted from the apple.com stylesheet read in
 * `research/design/native-scroll-and-viewport.md`. That document is the record of
 * a decision, but a record is not a constraint: every item below is a single
 * declaration that a plausible edit can drop, and dropping one is silent. The
 * page still renders, it is just wrong on a device nobody is testing on.
 *
 * Two of these have already been lost once. The lab page shipped with a header
 * and a full-bleed panel that carried no safe-area inset, and with the panel
 * inset at the page gutter while the header sat at the tablet inset, so the menu
 * content did not line up with the mark above it. Neither showed up on a desktop
 * because `env()` resolves to 0 there.
 *
 * These are static invariants against the real stylesheets and the real document,
 * not visual regressions. They cannot tell you the insets look right on a notched
 * phone, only that the declarations that make them possible are still present.
 *
 * Dependency free on purpose: node:test and node:fs only.
 */

import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
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

/** The whole rule for a selector. The base rule is what callers need. */
function ruleFor(source, selector) {
  const start = source.indexOf(`${selector} {`);
  assert.notEqual(start, -1, `the stylesheet no longer has a ${selector} rule`);
  return source.slice(start, source.indexOf("}", start));
}

/** Every stylesheet under src, so an absence can be asserted across the surface. */
function stylesheets(dir = join(REPO_ROOT, "src")) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return stylesheets(path);
    return entry.name.endsWith(".css") ? [readNormalised(path)] : [];
  });
}

/**
 * A declaration's value, read to its terminating semicolon. Hand parsed rather
 * than matched with a character class, because these values nest parentheses:
 * a `[^)]*` stops at the `)` inside `var(--page-gutter)` and never reaches the
 * `env()` that is the thing being asserted.
 */
function declaration(rule, property) {
  const start = rule.indexOf(`${property}:`);
  assert.notEqual(start, -1, `${property} is no longer declared`);
  const from = start + property.length + 1;
  return rule.slice(from, rule.indexOf(";", from)).trim();
}

/** `max(<gutter>, env(<inset>))`, so both the fallback and the inset are present. */
function assertInset(rule, property, inset, message) {
  const value = declaration(rule, property);
  assert.match(
    value,
    /^max\(.+\)$/,
    `${property} must take the larger of two values: got ${value}`,
  );
  assert.ok(
    value.includes(`env(${inset})`),
    `${message} (${property} was ${value}, which never reads ${inset})`,
  );
}

const indexHtml = readNormalised(join(REPO_ROOT, "index.html"));
const tokens = readNormalised(join(REPO_ROOT, "src/index.css"));
const header = readNormalised(
  join(REPO_ROOT, "src/components/Header.module.css"),
);
const lab = readNormalised(join(REPO_ROOT, "src/lab/TaglineLab.module.css"));
const allCss = stylesheets();

test("the viewport opts into the physical inset", () => {
  assert.match(
    indexHtml,
    /content="[^"]*viewport-fit=cover/,
    "viewport-fit=cover is what makes env(safe-area-inset-*) report anything. " +
      "Without it every inset below resolves to 0 and the padding is dead code.",
  );
  assert.match(
    indexHtml,
    /content="[^"]*width=device-width/,
    "the responsive width declaration must survive alongside it",
  );
});

test("the surface declares its colour scheme before first paint", () => {
  assert.match(
    ruleFor(tokens, ":root"),
    /color-scheme: light;/,
    "the marketing page is light only, so the browser must not paint dark " +
      "scrollbars, form controls and canvas ahead of the stylesheet",
  );
});

test("the document body carries the vh fallback and the dvh guard", () => {
  const body = ruleFor(tokens, "body");
  assert.match(
    body,
    /min-height: 100vh; min-height: 100dvh;/,
    "vh alone runs under collapsing mobile browser chrome. Two declarations " +
      "rather than an @supports block: a browser without dvh keeps vh.",
  );
});

test("the page gutter and the sticky bar agree, and both clear the notch", () => {
  for (const [name, source, selector] of [
    ["index.css .document-container", tokens, ".document-container"],
    ["Header.module.css .container", header, ".container"],
  ]) {
    const rule = ruleFor(source, selector);
    assertInset(
      rule,
      "padding-left",
      "safe-area-inset-left",
      `${name} must fall back to its gutter and take the larger of the two, so the ` +
        "desktop box is unchanged and the notched box is inset",
    );
    assertInset(
      rule,
      "padding-right",
      "safe-area-inset-right",
      `${name} needs the right inset too, or landscape is only half handled`,
    );
  }
});

test("every edge-touching rule on the lab page honours the insets", () => {
  for (const selector of [".labHeader", ".menuPanel"]) {
    const rule = ruleFor(lab, selector);
    assertInset(
      rule,
      "padding-left",
      "safe-area-inset-left",
      `${selector} reaches the left edge, so it must clear the notch in landscape`,
    );
    assertInset(
      rule,
      "padding-right",
      "safe-area-inset-right",
      `${selector} reaches the right edge, so it must clear the notch in landscape`,
    );
  }

  assertInset(
    ruleFor(lab, ".menuPanel"),
    "padding-bottom",
    "safe-area-inset-bottom",
    "the panel is full height, so its last link and its note sit in the " +
      "home-indicator band without this",
  );
});

test("the lab page declares one inset, so its edges cannot drift apart", () => {
  assert.match(
    ruleFor(lab, ".page"),
    /--lab-inset:/,
    "the bar, the stage and the panel all touch a horizontal edge. Declaring the " +
      "inset once is what keeps the panel's content under the mark above it.",
  );
  for (const selector of [".labHeader", ".menuPanel"]) {
    assert.match(
      ruleFor(lab, selector),
      /padding-(left|right): max\(var\(--lab-inset\)/,
      `${selector} must consume the shared inset rather than repeat a literal, ` +
        "or a breakpoint override will apply to one edge and not the other",
    );
  }
});

test("the bar and the panel share one height", () => {
  assert.match(
    ruleFor(lab, ".page"),
    /--lab-header-height: 56px;/,
    "the panel opens directly below the bar using a matching top offset",
  );
  assert.match(
    ruleFor(lab, ".menuPanel"),
    /inset: var\(--lab-header-height\) 0 0;/,
    "a literal here would silently misalign the panel the moment the bar changes",
  );
});

test("the refused properties stay refused", () => {
  for (const source of allCss) {
    assert.doesNotMatch(
      source,
      /-webkit-overflow-scrolling/,
      "-webkit-overflow-scrolling: touch is deprecated and a no-op on current " +
        "iOS. It was explicitly refused, not overlooked.",
    );
  }
  assert.doesNotMatch(
    tokens,
    /overscroll-behavior/,
    "overscroll-behavior: none on the marketing root kills pull-to-refresh and " +
      "the natural bounce, which a long scrolling document expects",
  );
});

test("scroll containment is scoped to the overlay that needs it", () => {
  const containing = allCss.filter((source) =>
    /overscroll-behavior: contain/.test(source),
  );
  assert.equal(
    containing.length,
    1,
    "containment belongs only where a scroll must not chain out of a surface, " +
      "which on this site is the full-height menu panel",
  );
  assert.match(
    ruleFor(lab, ".menuPanel"),
    /overscroll-behavior: contain;/,
    "the panel is opaque and full height, so its scroll must not chain to the " +
      "document behind it",
  );
});
