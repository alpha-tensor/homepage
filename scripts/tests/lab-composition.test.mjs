/**
 * Lab composition invariants, copied from the1.amsterdam.
 *
 * The lab page exists to settle a tagline direction, so the things it borrowed
 * from the reference are the things worth pinning. Two of them are easy to undo
 * by accident and neither shows up as a broken page:
 *
 *   - The display line is flush right at desktop and back to the leading edge
 *     below it. Adding `text-align: right` to the base rule would silently take
 *     the phone layout with it, which is the opposite of what was asked for.
 *   - The body copy does not scale with the viewport. It was a `clamp()` before
 *     this, so nothing in the file resists drifting back to one.
 *   - The display size is a token on `.page`. The motif below the headline is
 *     positioned from it, so a literal in the display rule would let the two drift
 *     and the motif would start at the wrong height on every width.
 *
 * Dependency free: node:test and node:fs only.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
const LAB_PATH = resolve(REPO_ROOT, "src/lab/TaglineLab.module.css");
const MATRIX_PATH = resolve(REPO_ROOT, "src/lab/LabHeroMatrix.module.css");
const LAB_COMPONENT_PATH = resolve(REPO_ROOT, "src/lab/TaglineLab.tsx");

/** Comments and whitespace change freely; assertions must not depend on them. */
const lab = readFileSync(LAB_PATH, "utf8")
  .replace(/\/\*[\s\S]*?\*\//g, " ")
  .replace(/\s+/g, " ")
  .trim();

/** The whole rule for a selector. The base rule is the one before any media query. */
function ruleFor(selector) {
  const start = lab.indexOf(`${selector} {`);
  assert.notEqual(start, -1, `the stylesheet no longer has a ${selector} rule`);
  return lab.slice(start, lab.indexOf("}", start));
}

/**
 * A single declaration's value, read to its terminating semicolon. Hand parsed so
 * an assertion about the type size is not accidentally satisfied or broken by a
 * neighbouring declaration that legitimately uses the same function.
 */
function declaration(rule, property) {
  const start = rule.indexOf(`${property}:`);
  assert.notEqual(start, -1, `${property} is no longer declared`);
  const from = start + property.length + 1;
  return rule.slice(from, rule.indexOf(";", from)).trim();
}

/** The desktop breakpoint block, up to whatever media query follows it. */
function desktopBlock() {
  const start = lab.indexOf("@media (min-width: 1001px)");
  assert.notEqual(start, -1, "the desktop breakpoint is gone");
  const next = lab.indexOf("@media", start + 1);
  return next === -1 ? lab.slice(start) : lab.slice(start, next);
}

test("the desktop display is sized against the content width", () => {
  const block = desktopBlock();
  const size = declaration(
    block.slice(block.indexOf(".page {")),
    "--lab-display-size",
  );
  assert.match(
    size,
    /var\(--page-gutter\)/,
    "the gutter is a constant, so a plain viewport percentage overstates the room " +
      "available at smaller widths and the longest line wraps. Subtracting the " +
      "gutter is what keeps the headline three lines at every desktop width.",
  );
  assert.doesNotMatch(
    size,
    /^clamp\(\s*[\d.]+rem,\s*[\d.]+vw/,
    "a bare vw middle term is the form that wrapped, so it must not come back",
  );
  assert.equal(
    declaration(block.slice(block.indexOf(".display {")), "font-size"),
    "var(--lab-display-size)",
    "the display rule has to consume the token rather than repeat the expression. " +
      "The motif below the headline is placed from this same number, so a second " +
      "copy of it is a silent misalignment the moment either one is edited.",
  );
});

test("the display line is right aligned at desktop only", () => {
  assert.doesNotMatch(
    ruleFor(".display"),
    /text-align/,
    "the base display rule must not set an alignment. The reference right aligns " +
      "at desktop and leads at the phone width, and a rule here would apply to " +
      "both, so the phone layout would go right too.",
  );
  assert.match(
    desktopBlock(),
    /\.display \{[^}]*text-align: right/,
    "the desktop breakpoint is where the right alignment belongs. The rotating " +
      "word keeps its reserved width inside an inline-grid, so the line cannot " +
      "reflow and right alignment stays put.",
  );
});

test("the desktop matrix sits below the headline, left of the copy column", () => {
  const matrix = readFileSync(MATRIX_PATH, "utf8");
  const component = readFileSync(LAB_COMPONENT_PATH, "utf8");
  const desktop = desktopBlock();
  assert.match(component, /<LabHeroMatrix \/>/);
  assert.doesNotMatch(component, /styles\.orbit/);
  assert.match(matrix, /\.field \{[\s\S]*?position: absolute;/);
  assert.match(matrix, /inset: 0 auto 0 0/);
  assert.match(matrix, /width: min\(70%, 940px\)/);
  assert.doesNotMatch(matrix, /grid-column|grid-row/);
  assert.match(desktop, /\.aside \{[^}]*grid-column: 2;[^}]*grid-row: 2/);
  assert.match(desktop, /\.field \{[^}]*display: none/);
  assert.match(matrix, /\.field \{\s*display: none/);
  assert.match(matrix, /\.core \{[^}]*opacity: 0\.38/);
  assert.match(
    matrix,
    /@media \(min-width: 600px\) and \(max-width: 1000px\) \{\s*\.field \{[^}]*display: block;[^}]*inset: 0 0 0 auto;/,
  );
  assert.match(
    lab,
    /@media \(min-width: 600px\) and \(max-width: 1000px\) \{[\s\S]*?\.field \{\s*display: none;/,
  );
  /* The desktop placement. A full height field sits under the whole headline,
   * because the desktop display line is right aligned across the full content width
   * and three lines tall. The field starts below that block and stays clear of the
   * copy column, and it takes its top from the same token the display rule uses. */
  assert.match(
    matrix,
    /@media \(min-width: 1001px\) \{\s*\.field \{[^}]*display: block;[^}]*top: calc\(var\(--lab-header-height\) \+ var\(--lab-display-size\) \* 2\.6\);[^}]*width: min\(62%, 820px\);/,
    "the desktop motif belongs under the headline and left of the copy column, " +
      "which is the only clear area a full width right aligned headline leaves",
  );
});

test("the body copy does not scale with the viewport", () => {
  const lede = ruleFor(".lede");
  assert.equal(
    declaration(lede, "font-size"),
    "18px",
    "the reference holds its body copy at a flat 18px from the phone width up. " +
      "A clamp() or a viewport unit is how this drifted before.",
  );
  assert.equal(
    declaration(lede, "line-height"),
    "1.1",
    "1.1 is the reference's leading, and it is what makes a narrow column read " +
      "as one block rather than as loose sentences",
  );
  assert.equal(
    declaration(lede, "letter-spacing"),
    "-0.03em",
    "the reference tracks its body at -0.03em, which is -0.54px at 18px",
  );
});
