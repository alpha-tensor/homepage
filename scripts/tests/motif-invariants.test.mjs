/**
 * Hero motif invariants.
 *
 * The hero field is deliberately a small set of decisions, and every one of them
 * has already been got wrong once: the motif started as a line grid over the
 * page, then as coloured dots, then as a flat near-black slab. Each failure is
 * cheap to reintroduce with one plausible-looking edit, so this file pins the
 * decisions that were reached by measurement.
 *
 * These are static invariants, not visual regressions. They cannot tell you the
 * composition looks right, only that the frozen properties have not moved. Pixel
 * level capture is a separate, later exercise.
 *
 * Dependency free on purpose: node:test and node:fs only, so the site's
 * dependency surface is unchanged. The corpus is the real stylesheet and the
 * real component, so what is asserted is what ships.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
const CSS_PATH = resolve(REPO_ROOT, "src/components/HeroMatrix.module.css");
const TSX_PATH = resolve(REPO_ROOT, "src/components/HeroMatrix.tsx");

/** Comments change freely; assertions must not depend on them. */
function readNormalised(path) {
  return readFileSync(path, "utf8")
    .replace(/\/\*[\s\S]*?\*\//g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const css = readNormalised(CSS_PATH);
const tsx = readNormalised(TSX_PATH);

/** The whole rule for a selector, so a property can be attributed to one block. */
function ruleFor(selector) {
  const start = css.indexOf(`${selector} {`);
  assert.notEqual(start, -1, `the stylesheet no longer has a ${selector} rule`);
  const end = css.indexOf("}", start);
  return css.slice(start, end);
}

test("the screen keeps one colour, one alpha and one pitch", () => {
  assert.equal(
    (css.match(/--screen-rgb\)/g) ?? []).length,
    2,
    "the dot screen must be exactly one gradient: one colour for the whole field. " +
      "A second screen layer means per-region dot colour has come back.",
  );
  assert.match(
    ruleFor(".field"),
    /--dot-pitch: 6px;/,
    "the dot pitch is frozen at 6px. Do not raise it to compensate for a " +
      "responsive or composition problem.",
  );
  assert.match(
    css,
    /--screen-rgb: 244, 240, 232;/,
    "the screen is one neutral paper light, not a chromatic dot set",
  );
});

test("dot contrast stays under the visible-grid ceiling", () => {
  const alphas = [...css.matchAll(/--screen-alpha: ([0-9.]+)/g)].map((m) =>
    Number(m[1]),
  );
  assert.ok(alphas.length > 0, "no --screen-alpha declaration found");
  const [desktop, ...responsive] = alphas;
  assert.ok(
    desktop <= 0.08,
    `desktop screen alpha is ${desktop}; above 0.08 the dots read as a grid ` +
      "before the surface reads as colour",
  );
  for (const alpha of responsive) {
    assert.ok(
      alpha <= desktop,
      `a responsive override raises the screen alpha to ${alpha} from ${desktop}. ` +
        "Scaling must not be paid for with dot contrast.",
    );
  }
});

test("colour and texture share exactly one mask", () => {
  assert.equal(
    (css.match(/mask-image:/g) ?? []).length,
    2,
    "expected one mask on the desktop composite and one responsive override. " +
      "A separate mask for the screen would let texture outlive the colour it sits on.",
  );
  assert.ok(
    !ruleFor(".field").includes("mask-image"),
    "the positioning box must not mask; the mask belongs to the composite alone",
  );
  const children = (tsx.match(/<span/g) ?? []).length;
  assert.equal(
    children,
    2,
    "the field is a positioning box and one composite surface, nothing more",
  );
});

test("the composite mask geometry is frozen", () => {
  const surface = ruleFor(".surface");
  for (const stop of ["transparent 24%", "#000 50%", "#000 92%", "transparent 100%"]) {
    assert.ok(
      surface.includes(stop),
      `the mask's horizontal ramp lost its ${stop} stop. The cream dissolve is settled.`,
    );
  }
  for (const stop of ["transparent 0%", "#000 13%", "#000 87%", "transparent 95%"]) {
    assert.ok(
      surface.includes(stop),
      `the mask's vertical ramp lost its ${stop} stop. The 95 percent bottom stop ` +
        "is what stops the field running into the statistics band.",
    );
  }
});

test("the substrate is the shared ink, never a near black panel", () => {
  assert.match(
    ruleFor(".surface"),
    /background-color: var\(--surface-strong\);/,
    "the field sits on the shared ink token. A local near-black would reinstate " +
      "the slab the colour fields exist to relieve.",
  );
  const ramps = (ruleFor(".surface").match(/linear-gradient\(/g) ?? []).length;
  assert.ok(
    ramps >= 2,
    "a field with fewer than two ramps has a straight edge and reads as a rectangle",
  );
});

test("the motif palette is closed", () => {
  const tones = Object.fromEntries(
    [...css.matchAll(/--tone-([a-z]+): ([0-9]+), ([0-9]+), ([0-9]+);/g)].map((m) => [
      m[1],
      [Number(m[2]), Number(m[3]), Number(m[4])],
    ]),
  );
  assert.deepEqual(
    Object.keys(tones).sort(),
    ["calm", "ember", "navy", "orange", "oxblood", "plum", "violet"],
    "no new motif colours. The lower warm end and the upper violet are tuned by " +
      "hue and saturation, which is why the set is closed.",
  );
  for (const [name, [r, g, b]] of Object.entries(tones)) {
    assert.ok(
      [r, g, b].every((channel) => channel >= 0 && channel <= 255),
      `${name} is not a channel triplet`,
    );
  }
});

test("the screen is painted, not generated", () => {
  assert.ok(
    !/Math\.random|\.map\(|Array\.from|for \(/.test(tsx),
    "the component must not generate dots. A generated field reintroduces per-dot " +
      "variation, which is what read as a star field.",
  );
  assert.match(tsx, /data-motif="hero-field"/, "the tooling marker was removed");
});
