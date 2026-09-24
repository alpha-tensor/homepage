/**
 * Consent bootstrap tests.
 *
 * These run the real inline script out of index.html inside a minimal DOM shim,
 * so what is tested is exactly what ships. There is no test runner dependency:
 * node:test and node:vm are built in, which keeps the site's dependency surface
 * unchanged.
 *
 * The regression this file exists for is F5. The bootstrap used one shared
 * `tagsLoaded` flag, so a visitor who granted marketing consent first and
 * analytics later had the Google Analytics script skipped for the rest of the
 * page's life, silently and permanently.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
const INDEX_HTML = resolve(REPO_ROOT, "index.html");

/** Pull the consent bootstrap out of index.html rather than duplicating it. */
function readBootstrap() {
  const html = readFileSync(INDEX_HTML, "utf8");
  const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(
    (match) => match[1],
  );
  const bootstrap = scripts.find((script) => script.includes("__AT_CONSENT"));
  assert.ok(bootstrap, "index.html no longer contains the consent bootstrap");
  return bootstrap;
}

class CustomEventStub {
  constructor(type, init) {
    this.type = type;
    this.detail = init && init.detail;
  }
}

/** A DOM small enough to run the bootstrap and big enough to observe it. */
function createHarness({ stored = null, pathname = "/" } = {}) {
  const injected = [];
  let cookieJar = "";
  const cookieWrites = [];
  const events = [];
  const storage = new Map();

  if (stored !== null) {
    storage.set("at.consent.v1", JSON.stringify(stored));
  }

  const document = {
    head: {
      appendChild(node) {
        if (injected.some((existing) => existing.id === node.id)) {
          throw new Error(`duplicate injection of ${node.id}`);
        }
        injected.push(node);
      },
    },
    createElement(tagName) {
      return { tagName, id: "", src: "", async: false };
    },
    getElementById(id) {
      return injected.find((node) => node.id === id) ?? null;
    },
    get cookie() {
      return cookieJar;
    },
    set cookie(value) {
      cookieWrites.push(value);
      const name = value.split("=")[0].trim();
      if (value.includes("expires=Thu, 01 Jan 1970")) {
        cookieJar = cookieJar
          .split("; ")
          .filter((entry) => !entry.startsWith(`${name}=`))
          .join("; ");
        return;
      }
      cookieJar = cookieJar ? `${cookieJar}; ${value}` : value;
    },
  };

  const window = {
    localStorage: {
      getItem: (key) => storage.get(key) ?? null,
      setItem: (key, value) => storage.set(key, value),
    },
    location: { hostname: "alphatensor.com", pathname },
    dataLayer: [],
    dispatchEvent: (event) => events.push(event),
    addEventListener: () => {},
  };

  vm.createContext({ window, document, CustomEvent: CustomEventStub });

  vm.runInContext(
    readBootstrap(),
    vm.createContext({ window, document, CustomEvent: CustomEventStub }),
  );

  return {
    consent: window.__AT_CONSENT,
    events,
    storage,
    cookieWrites,
    document,
    ids: () => injected.map((node) => node.id).sort(),
    eventsOfType: (type) =>
      events.filter((event) => event.type === type).length,
  };
}

test("the bootstrap exposes the consent API and injects nothing by default", () => {
  const harness = createHarness();

  assert.equal(typeof harness.consent.set, "function");
  assert.equal(typeof harness.consent.read, "function");
  assert.deepEqual(harness.ids(), []);
});

test("analytics consent loads both the container and the GA script", () => {
  const harness = createHarness();

  harness.consent.set({ analytics: true, marketing: false });

  assert.deepEqual(harness.ids(), ["at-gtag", "at-gtm"]);
});

test("marketing consent alone loads the container but not GA", () => {
  const harness = createHarness();

  harness.consent.set({ analytics: false, marketing: true });

  assert.deepEqual(harness.ids(), ["at-gtm"]);
});

test("granting analytics after marketing still loads GA", () => {
  const harness = createHarness();

  harness.consent.set({ analytics: false, marketing: true });
  harness.consent.set({ analytics: true, marketing: true });

  assert.deepEqual(harness.ids(), ["at-gtag", "at-gtm"]);
});

test("repeated consent changes never inject a tag twice", () => {
  const harness = createHarness();

  harness.consent.set({ analytics: true, marketing: true });
  harness.consent.set({ analytics: true, marketing: true });

  assert.deepEqual(harness.ids(), ["at-gtag", "at-gtm"]);
});

test("nothing is loaded while every optional consent stays denied", () => {
  const harness = createHarness();

  harness.consent.set({ analytics: false, marketing: false });

  assert.deepEqual(harness.ids(), []);
});

test("a stored grant loads the tags on boot without a new choice", () => {
  const harness = createHarness({
    stored: { analytics: true, marketing: false, version: 1 },
  });

  assert.deepEqual(harness.ids(), ["at-gtag", "at-gtm"]);
});

test("a stored denial loads nothing on boot", () => {
  const harness = createHarness({
    stored: { analytics: false, marketing: false, version: 1 },
  });

  assert.deepEqual(harness.ids(), []);
});

test("withdrawing consent clears Google cookies", () => {
  const harness = createHarness();
  harness.document.cookie = "_ga=GA1.1.123";
  harness.document.cookie = "theme=dark";

  harness.consent.set({ analytics: false, marketing: false });

  const cleared = harness.cookieWrites.filter((write) =>
    write.includes("expires=Thu, 01 Jan 1970"),
  );
  assert.equal(cleared.length, 3, "one clear per domain suffix");
  assert.ok(cleared.every((write) => write.startsWith("_ga=")));
  assert.equal(harness.document.cookie, "theme=dark");
});

test("a choice is persisted and announced", () => {
  const harness = createHarness();

  harness.consent.set({ analytics: true, marketing: false });

  const persisted = JSON.parse(harness.storage.get("at.consent.v1"));
  assert.equal(persisted.necessary, true);
  assert.equal(persisted.analytics, true);
  assert.equal(persisted.marketing, false);
  assert.equal(persisted.version, 1);
  assert.equal(typeof persisted.updatedAt, "string");
  assert.equal(harness.eventsOfType("at:consent-change"), 1);
});

// The lab route exemption. /lab is a hands-on surface for uploading a document,
// so no Google tag may load or be configured there, even with consent granted.

test("on the home route, granted consent still injects both tags", () => {
  const harness = createHarness({ pathname: "/" });

  harness.consent.set({ analytics: true, marketing: true });

  assert.deepEqual(harness.ids(), ["at-gtag", "at-gtm"]);
});

test("on the lab route, granted consent injects nothing", () => {
  const harness = createHarness({ pathname: "/lab" });

  harness.consent.set({ analytics: true, marketing: true });

  assert.deepEqual(harness.ids(), []);
});

test("on a lab subpath, granted consent injects nothing", () => {
  const harness = createHarness({ pathname: "/lab/session/1" });

  harness.consent.set({ analytics: true, marketing: true });

  assert.deepEqual(harness.ids(), []);
});

test("a stored grant loads nothing on the lab route", () => {
  const harness = createHarness({
    stored: { analytics: true, marketing: true, version: 1 },
    pathname: "/lab",
  });

  assert.deepEqual(harness.ids(), []);
});

test("the lab route still persists and announces a choice", () => {
  const harness = createHarness({ pathname: "/lab" });

  harness.consent.set({ analytics: true, marketing: false });

  const persisted = JSON.parse(harness.storage.get("at.consent.v1"));
  assert.equal(persisted.analytics, true);
  assert.equal(persisted.marketing, false);
  assert.equal(harness.eventsOfType("at:consent-change"), 1);
  assert.deepEqual(harness.ids(), []);
});
