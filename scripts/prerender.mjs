// Build-time prerenderer for the marketing site.
//
// `vite build` produces a client bundle whose index.html contains only an
// empty `#root` shell. Crawlers, link previews, and some accessibility tooling
// do not run the bundle, so they only ever saw the boot screen. This script
// renders each route to static HTML with react-dom/server and writes one
// document per route, so the served page contains real content markup.
//
// It also emits 404.html, which the Worker's `not_found_handling: "404-page"`
// serves for unknown paths. Before this, every unknown path returned the
// homepage with a 200, so a typo was indistinguishable from a real page.
//
// Runs after `vite build` (see the `build` script in package.json).
import { renderToString } from "react-dom/server";
import React from "react";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "vite";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");
const distDir = resolve(root, "dist");
const distIndex = resolve(distDir, "index.html");

// The SSR bundle exists only to produce this HTML. It must not live inside
// `dist`, or it ships as a public asset. `dist-ssr` is gitignored and outside
// the published directory on purpose.
const ssrOutDir = resolve(root, "dist-ssr");

// One entry per published document. `boot` is the route stamped into the
// document so client hydration renders the same tree the server did.
const ROUTES = [
  { render: "/", boot: "/", out: "index.html", also: [] },
  {
    render: "/privacy",
    boot: "/privacy",
    // Emitted twice so the route resolves under either asset-server trailing
    // slash behaviour, rather than depending on `html_handling`.
    out: "privacy.html",
    also: ["privacy/index.html"],
  },
  // Any path that is neither home nor privacy renders the not-found page.
  { render: "/404", boot: "/404", out: "404.html", also: [] },
];

// Build an SSR bundle from the same Vite config as the client build.
await build({
  configFile: resolve(root, "vite.config.ts"),
  mode: "production",
  logLevel: "info",
  build: {
    ssr: resolve(root, "src", "entry-server.tsx"),
    outDir: ssrOutDir,
    minify: false,
    sourcemap: false,
  },
});

const { default: App } = await import(resolve(ssrOutDir, "entry-server.js"));
const shell = await readFile(distIndex, "utf-8");

/** Strip the boot screen, splice in markup, and stamp the boot route. */
function buildDocument(route) {
  let html = shell;

  // Remove the boot screen block. With prerendered markup the visitor gets real
  // content immediately; the boot card and its inline styles only ever served
  // the empty-shell case.
  html = html.replace(/<style>\s*#boot-screen[\s\S]*?<\/style>/, "");
  html = html.replace(/<div id="boot-screen"[\s\S]*?(?=<div id="root")/g, "");

  if (!html.includes('<div id="root"></div>')) {
    throw new Error(
      'prerender: expected an empty <div id="root"></div> in dist/index.html',
    );
  }

  // The route is passed in rather than inferred: the server has no window, and
  // this is what lets one build emit a separate document per route.
  const appHtml = renderToString(
    React.createElement(App, { initialPath: route.render }),
  );
  html = html.replace(
    '<div id="root"></div>',
    `<div id="root">${appHtml}</div>`,
  );

  // Stamp the route before the module bundle, which is deferred, so hydration
  // sees it. JSON.stringify keeps the value a valid JS string literal.
  const stamp = `<script>window.__AT_BOOT_ROUTE__=${JSON.stringify(route.boot)};</script>`;
  if (!html.includes("</head>")) {
    throw new Error("prerender: expected a </head> in dist/index.html");
  }
  html = html.replace("</head>", `        ${stamp}\n    </head>`);

  return { html, appHtml };
}

for (const route of ROUTES) {
  const { html, appHtml } = buildDocument(route);
  for (const target of [route.out, ...route.also]) {
    const destination = resolve(distDir, target);
    await mkdir(dirname(destination), { recursive: true });
    await writeFile(destination, html, "utf-8");
    console.log(
      `prerender: dist/${target} for ${route.render} (${appHtml.length} chars of markup)`,
    );
  }
}
