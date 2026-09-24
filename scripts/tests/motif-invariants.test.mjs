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
const TOKENS_PATH = resolve(REPO_ROOT, "src/index.css");

/** Comments change freely; assertions must not depend on them. */
function readNormalised(path) {
  return readFileSync(path, "utf8")
    .replace(/\/\*[\s\S]*?\*\//g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const css = readNormalised(CSS_PATH);
const tsx = readNormalised(TSX_PATH);
const tokens = readNormalised(TOKENS_PATH);

/**
 * Perceived luminance, Rec. 601. Only ever used to reason about the gap between
 * two near-black surfaces, which is the one comparison a channel triplet cannot
 * make by inspection.
 */
function luminance([r, g, b]) {
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

/**
 * An `--token: r, g, b;` channel triplet as numbers, with or without an `rgb()`
 * wrapper. Parsed by hand rather than by regex so the token name is the only
 * thing being matched and a wrapper is not a special case.
 */
function readRgbTriplet(rule, token) {
  const start = rule.indexOf(`${token}:`);
  assert.notEqual(start, -1, `${token} is no longer declared`);
  const declaration = rule.slice(start, rule.indexOf(";", start));
  const channels = declaration.match(/[0-9]+/g);
  assert.ok(
    channels && channels.length >= 3,
    `${token} is no longer a channel triplet`,
  );
  return channels.slice(0, 3).map(Number);
}

/** A `--token: #rrggbb;` colour as numbers. */
function readHexToken(text, token) {
  const match = text.match(new RegExp(`${token}: #([0-9a-fA-F]{6});`));
  assert.ok(match, `${token} is no longer a six digit hex token`);
  const hex = match[1];
  return [0, 2, 4].map((offset) =>
    Number.parseInt(hex.slice(offset, offset + 2), 16),
  );
}

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

/** Every `--name: value;` declaration in a rule, as a lookup. */
function tokensFor(rule) {
  return Object.fromEntries(
    [...rule.matchAll(/--([a-z-]+): ([^;]+);/g)].map(([, name, value]) => [
      name,
      value.trim(),
    ]),
  );
}

/** A `--name: 20% 14%;` pair as numbers. */
function readPair(rule, token) {
  const value = tokensFor(rule)[token];
  const match = value && /^([0-9.]+)% ([0-9.]+)%$/.exec(value);
  assert.ok(match, `${token} is no longer a pair of percentages`);
  return [Number(match[1]), Number(match[2])];
}

/** A `--name: 0.3;` numeric token as a number. */
function readNumber(rule, token) {
  const value = tokensFor(rule)[token];
  assert.ok(value !== undefined, `${token} is no longer declared`);
  const parsed = Number(value);
  assert.ok(Number.isFinite(parsed), `${token} is not a number`);
  return parsed;
}

test("the screen keeps one colour, one profile and one pitch", () => {
  assert.equal(
    (css.match(/--screen-rgb\)/g) ?? []).length,
    2,
    "the dot screen must be exactly one gradient: one colour for the whole field. " +
      "A second screen layer means per-region dot colour has come back.",
  );
  assert.match(
    ruleFor(".field"),
    /--dot-pitch: 5px;/,
    "the dot pitch is frozen at 5px. Do not raise it to compensate for a " +
      "responsive or composition problem.",
  );
  assert.match(
    css,
    /--screen-rgb: 244, 240, 232;/,
    "the screen is one neutral paper light, not a chromatic dot set",
  );
});

test("the dot profile is a solid core with a softer rim", () => {
  const field = ruleFor(".field");
  // The profile replaced a flat `--screen-alpha`. A solid core with a soft rim is what
  // keeps a 5px pitch reading as a surface instead of a grid, and the rim has to stay
  // below the core or the dot becomes a flat disc with a hard edge.
  const core = readNumber(field, "dot-alpha-core");
  const edge = readNumber(field, "dot-alpha-edge");
  assert.ok(
    edge < core,
    `the rim alpha ${edge} is not below the core alpha ${core}, so the profile is ` +
      "flat or inverted and the screen reads as a grid rather than a surface",
  );
  assert.match(
    field,
    /rgba\(var\(--screen-rgb\), var\(--dot-alpha-core\)\) var\(--dot-core\)/,
    "the screen stack must read its alphas from the profile tokens, or the entrance " +
      "reveal and this invariant are both disconnected from what actually ships",
  );
  assert.ok(
    !field.includes("--screen-alpha"),
    "`--screen-alpha` is gone, superseded by the profile tokens. A reintroduced flat " +
      "alpha would quietly overrule the profile.",
  );
});

test("the ambient drift moves only the colour groups", () => {
  const drift = css.slice(css.indexOf("@keyframes drift-"));
  assert.notEqual(drift, css, "the drift keyframes are gone");
  const settle = drift.indexOf("@keyframes fieldSettle");
  const block = settle === -1 ? drift : drift.slice(0, settle);
  for (const forbidden of ["screen", "opacity", "transform", "mask", "pitch"]) {
    assert.ok(
      !block.includes(forbidden),
      `the drift keyframes reference ${forbidden}. The dots, the ink, the pitch and ` +
        "the masks are the fixed physical part of the motif and are never animation " +
        "targets.",
    );
  }
  for (const group of ["--up-d", "--mid-d", "--low-d"]) {
    assert.ok(
      block.includes(group),
      `the drift keyframes no longer move ${group}`,
    );
  }
});

test("motion is gated on visibility and on reduced motion", () => {
  assert.match(
    css,
    /\.field\[data-motif-motion="paused"\] \{ animation-play-state: paused; \}/,
    "the visibility gate is gone, so a registered property feeding background-image " +
      "would repaint the gradient stack for as long as the page is open, on screen or not",
  );
  assert.match(
    css,
    /@media \(prefers-reduced-motion: reduce\) \{ \.field \{ animation: none; \}/,
    "reduced motion must stop the drift, not slow it",
  );

  // Pinned deliberately. The drift is the only piece that repaints continuously, and
  // narrow viewports are where that is least affordable, so losing this override would
  // silently put the cost back on phones and cramped desktops.
  const start = css.indexOf("@media (max-width: 1200px) {");
  assert.notEqual(start, -1, "the narrow viewport motion override is gone");
  const block = css.slice(start, css.indexOf("}", start));
  assert.ok(
    !block.includes("drift-"),
    `the drift still runs below 1200px: "${block}". It repaints the gradient stack ` +
      "every frame on the main thread.",
  );
  assert.ok(
    block.includes("fieldSettle") && block.includes("matrixReveal"),
    "the narrow viewport override also dropped the entrance, which is a one time cost " +
      "and the effect that stops the field appearing hard.",
  );
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

test("the atmosphere is the core pushed out at the same centres", () => {
  const field = ruleFor(".field");
  const core = ruleFor(".core");
  const atmosphere = ruleFor(".atmosphere");
  // Sharing the centre tokens is what keeps the two layers from drifting apart, and
  // strictly larger atmosphere radii are what keep the atmosphere the more opaque of
  // the two through the core's fade, so cream never dominates the blend and the
  // transition never passes through neutral grey.
  for (const name of ["upper", "central", "lower"]) {
    assert.ok(
      core.includes(`ellipse var(--core-${name}) at var(--mass-${name})`),
      `the core no longer anchors its ${name} mass to --mass-${name}`,
    );
    assert.ok(
      atmosphere.includes(`ellipse var(--atmo-${name}) at var(--mass-${name})`),
      `the atmosphere no longer shares --mass-${name} with the core`,
    );
    const [coreX, coreY] = readPair(field, `core-${name}`);
    const [atmoX, atmoY] = readPair(field, `atmo-${name}`);
    assert.ok(
      atmoX > coreX && atmoY > coreY,
      `the atmosphere's ${name} mass is not strictly larger than the core's, so ` +
        "through the core's fade the core would be the more opaque of the two and " +
        "the transition would pass through neutral grey.",
    );
  }
});

test("the hero silhouette has no straight edge", () => {
  const core = ruleFor(".core");
  // The visible rectangle was produced by intersecting a horizontal ramp with a
  // vertical one, so a linear gradient in this rule is the machine checkable form of
  // the failure. Measured on the state this replaced, the mask held its top edge
  // within 21px across the full box width and its left edge at effectively one x for
  // most of the height.
  assert.ok(
    !core.includes("linear-gradient"),
    "the core mask declares a linear-gradient, so an edge of the motif is a straight " +
      "line again. The masses must union rather than a ramp intersecting a ramp.",
  );
  const masses = (core.match(/radial-gradient\(/g) ?? []).length;
  assert.ok(
    masses >= 3,
    `the core mask declares ${masses} mass(es). At least three overlapping ones are ` +
      "needed so that no single mass reads as its own circle.",
  );
  assert.match(
    core,
    /mask-composite: add;/,
    "the masses must union. Intersecting them would remove the overlap that creates " +
      "the substrate.",
  );
});

test("the substrate is a hero local core, lighter than the ink and never a panel", () => {
  const core = ruleFor(".core");
  assert.match(
    core,
    /background-color: var\(--hero-core\);/,
    "the field sits on the hero's own core token, not an inline colour. The " +
      "token is where the intent lives, and an inline value would let the " +
      "substrate drift without a single place to review.",
  );
  // The hero core is deliberately lighter than the shared ink. The field has to
  // separate from cream at a lower darkness than a full strength band, and a
  // near-black panel is the slab the colour fields exist to relieve. The margin
  // is not a measurement, it only keeps the two tokens from converging: the
  // moment they do, the hero is a dark band again and the comparison is gone.
  const heroCore = luminance(readRgbTriplet(ruleFor(".field"), "--hero-core"));
  const ink = luminance(readHexToken(tokens, "--surface-strong"));
  assert.ok(
    heroCore > ink + 6,
    `the hero core is ${heroCore.toFixed(1)} against an ink of ${ink.toFixed(1)}. ` +
      "It must stay meaningfully lighter than the global ink, or the field " +
      "returns to the near black slab.",
  );
  assert.ok(
    !css.includes("--surface-strong:"),
    "the hero stylesheet must not redeclare the shared ink token. The " +
      "statistics band and the other dark surfaces still read it.",
  );
  // Every mass must fade to zero alpha rather than stopping at its ellipse edge.
  // A mask cannot paint outside its element, so a hard stop at a box edge prints a
  // straight line there, and that is how the rectangle becomes visible again. This
  // replaces the old assertion that the field carried two linear ramps, which was
  // the same intent expressed in the geometry that produced the rectangle.
  const masses = (core.match(/radial-gradient\(/g) ?? []).length;
  const fades = (core.match(/rgba\(0, 0, 0, 0\) 100%/g) ?? []).length;
  assert.equal(
    fades,
    masses,
    `${fades} of ${masses} masses fade out. A mass that stops without fading prints ` +
      "a hard edge and reads as a panel.",
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
  // The original form of this assertion also banned `for (`, which was a blunt proxy
  // for "no per-dot generation". It now fires on the IntersectionObserver loop, which
  // has nothing to do with dots, so the ban narrowed to the things that actually
  // reintroduce per-dot variation.
  assert.ok(
    !/Math\.random|\.map\(|Array\.from/.test(tsx),
    "the component must not generate dots. A generated field reintroduces per-dot " +
      "variation, which is what read as a star field.",
  );
  assert.equal(
    (tsx.match(/<span/g) ?? []).length,
    3,
    "the field is a positioning box, an atmosphere and a core, nothing more. A mass " +
      "per element would make the colour independently movable at the cost of the " +
      "shared stack that keeps the two layers coherent.",
  );
  assert.match(
    tsx,
    /data-motif="hero-field"/,
    "the tooling marker was removed",
  );
  assert.match(
    tsx,
    /data-motif-motion=\{motion\}/,
    "the motion gate is gone, so the field would keep repainting the gradient stack " +
      "once the hero is off screen.",
  );
});
