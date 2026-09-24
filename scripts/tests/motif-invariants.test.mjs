/**
 * Hero motif invariants.
 *
 * The hero field is deliberately a small set of decisions, and every one of them
 * has already been got wrong once: the motif started as a line grid over the
 * page, then as coloured dots, then as a flat near-black slab, and then as one
 * opacity ramp that carried a neutral grey halo through the whole cream
 * transition. Each failure is cheap to reintroduce with a plausible edit, so
 * this file pins the decisions that came out of measurement.
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

/** Every rule that declares a mask, with the selector that declares it. */
function maskedRules() {
  return [...css.matchAll(/([^{}]*)\{([^{}]*)\}/g)]
    .map(([, head, body]) => ({ head: head.trim(), body }))
    .filter(({ body }) => body.includes("mask-image:"));
}

/** The first stop position in a rule's first horizontal ramp. */
function firstRampStart(rule) {
  const match = rule.match(/to right, transparent (-?[0-9.]+)(%|px)/);
  assert.ok(match, "no horizontal ramp found");
  return Number(match[1]);
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

test("the ink and the screen share one mask, and only the atmosphere has another", () => {
  const masked = maskedRules();
  assert.ok(masked.length >= 1, "the composite no longer declares a mask");
  for (const { head } of masked) {
    assert.ok(
      head.endsWith(".core") || head.endsWith(".atmosphere"),
      `a rule other than .core or .atmosphere declares a mask: "...${head.slice(-60)}". ` +
        "The ink and the screen must share one mask; a third masked layer means " +
        "something is fading on its own again.",
    );
  }
  const heads = new Set(masked.map(({ head }) => head.split(" ").pop()));
  assert.ok(heads.has(".core"), "the core declares no mask");
  assert.ok(heads.has(".atmosphere"), "the atmosphere declares no mask");
  assert.ok(
    !ruleFor(".field").includes("mask-image"),
    "the positioning box must not mask; the mask belongs to the layers beneath it",
  );
});

test("the atmosphere carries colour and no darkness", () => {
  const core = ruleFor(".core");
  const atmosphere = ruleFor(".atmosphere");
  assert.match(
    atmosphere,
    /background-image: var\(--tone-stack\);/,
    "the atmosphere must be the colour fields on their own",
  );
  assert.ok(
    !atmosphere.includes("screen"),
    "the atmosphere must carry no screen. Dots out here would be visible in cream " +
      "with no substrate to sit on.",
  );
  assert.match(
    core,
    /var\(--screen-stack\), var\(--tone-stack\)/,
    "the core is the screen over the colour",
  );
  const children = (tsx.match(/<span/g) ?? []).length;
  assert.equal(
    children,
    3,
    "the field is a positioning box, an atmosphere and a core, nothing more",
  );
});

test("the atmosphere leads the core so the cream transition stays chromatic", () => {
  const core = ruleFor(".core");
  const atmosphere = ruleFor(".atmosphere");
  // Both reach full strength at the same horizontal stop, and the atmosphere's
  // ramp starts further out. That relationship is what keeps the atmosphere the
  // more opaque of the two throughout the core's fade, so cream never dominates
  // the blend and the transition never passes through neutral grey.
  assert.ok(
    firstRampStart(atmosphere) < firstRampStart(core),
    "the atmosphere's horizontal ramp must start further out than the core's",
  );
  // The upper ramp of the atmosphere must start above the box, because the box
  // top is clipped at the hero's top edge and there is no room inside the box for
  // the atmosphere to get ahead of the core there.
  assert.match(
    atmosphere,
    /to bottom, transparent -[0-9]/,
    "the atmosphere's upper ramp must begin above the box top",
  );
});

test("the core's mask geometry is frozen", () => {
  const core = ruleFor(".core");
  for (const stop of [
    "transparent 24%",
    "#000 33%",
    "#000 92%",
    "transparent 99%",
  ]) {
    assert.ok(
      core.includes(stop),
      `the core's horizontal ramp lost its ${stop} stop`,
    );
  }
  for (const stop of [
    "transparent 0%",
    "#000 7%",
    "calc(100% - 126px)",
    "calc(100% - 74px)",
  ]) {
    assert.ok(
      core.includes(stop),
      `the core's vertical ramp lost its ${stop} stop`,
    );
  }
  // The core must reach nothing well above the box bottom, so the dark surface
  // ends before the full width statistics band rather than running into it.
  assert.ok(
    core.includes("transparent calc(100% - 74px)"),
    "the core's last vertical stop must be its transparent end, not the box bottom",
  );
  assert.ok(
    !/to bottom, transparent 0%, #000 [0-9]+%, #000 calc\(100% - [0-9]+px\), transparent 100%/.test(
      core,
    ),
    "the core must not fade all the way to the box bottom, or it runs into the " +
      "statistics band",
  );
});

test("the substrate is the shared ink, never a near black panel", () => {
  const core = ruleFor(".core");
  assert.match(
    core,
    /background-color: var\(--surface-strong\);/,
    "the field sits on the shared ink token. A local near-black would reinstate " +
      "the slab the colour fields exist to relieve.",
  );
  const ramps = (core.match(/linear-gradient\(/g) ?? []).length;
  assert.ok(
    ramps >= 2,
    "a field with fewer than two ramps has a straight edge and reads as a rectangle",
  );
});

test("the motif palette is closed", () => {
  const tones = Object.fromEntries(
    [...css.matchAll(/--tone-([a-z]+): ([0-9]+), ([0-9]+), ([0-9]+);/g)].map(
      (m) => [m[1], [Number(m[2]), Number(m[3]), Number(m[4])]],
    ),
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
  assert.match(
    tsx,
    /data-motif="hero-field"/,
    "the tooling marker was removed",
  );
});
