// Build-time prerenderer for the marketing site.
//
// `vite build` produces a client bundle whose index.html contains only an
// empty `#root` shell. Crawlers, link previews, and some accessibility tooling
// do not run the bundle, so they only ever saw the boot screen. This script
// renders the homepage to static HTML with react-dom/server and splices it
// into `dist/index.html`, so the served page contains real content markup.
//
// Runs after `vite build` (see the `build` script in package.json).
import { renderToString } from "react-dom/server";
import React from "react";
import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "vite";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");
const distIndex = resolve(root, "dist", "index.html");
const ssrOutDir = resolve(root, "dist", "ssr");

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

// Import the freshly built ESM SSR bundle and render the homepage.
const { default: App } = await import(resolve(ssrOutDir, "entry-server.js"));
const appHtml = renderToString(React.createElement(App));

let html = await readFile(distIndex, "utf-8");

// Remove the boot screen block. With prerendered markup the visitor gets real
// content immediately; the boot card and its inline styles only ever served
// the empty-shell case.
html = html.replace(/<style>\s*#boot-screen[\s\S]*?<\/style>/, "");
html = html.replace(/<div id="boot-screen"[\s\S]*?(?=<div id="root")/g, "");

// Inject the rendered tree into the root container.
if (!html.includes('<div id="root"></div>')) {
  throw new Error(
    'prerender: expected an empty <div id="root"></div> in dist/index.html',
  );
}
html = html.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);

await writeFile(distIndex, html, "utf-8");

console.log(
  `prerender: wrote static homepage (${appHtml.length} chars of markup) to dist/index.html`,
);
