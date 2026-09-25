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
    block.slice(block.indexOf(".display {")),
    "font-size",
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
