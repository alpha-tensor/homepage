#!/usr/bin/env node
// Assemble the production dist/ for the alphatensor-www worker.
//
// Sources:
//   site/build/dist/  the static marketing site, vendored in ./site with its
//                     rendered output committed (source of truth: the
//                     Markdown corpus in site/corpus, built by
//                     site/build/build.py)
//   privacy.txt       the privacy policy text, rendered here through the
//                     site templates so /privacy keeps the same shell
//
// The previous React build remains available as `npm run build:react`.
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SITE_BUILD = join(ROOT, "site", "build");
const DIST = join(ROOT, "dist");
const CTA_URL = "https://cal.com/alphatensor/free-consultation";

function fill(tpl, values) {
  let out = tpl;
  for (const [k, v] of Object.entries(values)) {
    out = out.split("{{" + k + "}}").join(v);
  }
  return out;
}

const esc = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function template(rel) {
  return readFileSync(join(SITE_BUILD, "templates", rel), "utf8");
}

function parsePrivacy(text) {
  const lines = text.split(/\r?\n/);
  let i = 0;
  while (i < lines.length && lines[i].trim() === "") i++;
  i++; // skip the "Privacy Policy" title line; it becomes the headline
  while (i < lines.length && lines[i].trim() === "") i++;
  const effective = lines[i].trim();
  i++;
  const sections = [];
  let current = null;
  let block = [];
  const flush = () => {
    if (!current || block.length === 0) {
      block = [];
      return;
    }
    if (block.every((l) => /^\s/.test(l))) {
      const items = block.map((l) => "  <li>" + esc(l.trim()) + "</li>");
      current.blocks.push("<ul>\n" + items.join("\n") + "\n</ul>");
    } else {
      current.blocks.push("<p>" + esc(block.map((l) => l.trim()).join(" ")) + "</p>");
    }
    block = [];
  };
  for (; i < lines.length; i++) {
    const line = lines[i];
    if (/^\d+\.\s+\S/.test(line)) {
      flush();
      current = { title: line.trim(), blocks: [] };
      sections.push(current);
    } else if (line.trim() === "") {
      flush();
    } else if (current) {
      block.push(line);
    }
  }
  flush();
  return { effective, sections };
}

function buildPrivacy() {
  const { effective, sections } = parsePrivacy(
    readFileSync(join(ROOT, "privacy.txt"), "utf8")
  );
  const sectionTpl = template("partials/section.html");
  const sectionsHtml = sections
    .map((s) =>
      fill(sectionTpl, {
        section_title: esc(s.title),
        section_body: s.blocks.join("\n"),
      }).trim()
    )
    .join("\n");
  const content = fill(template("article.html"), {
    eyebrow: "Privacy",
    headline: "Privacy Policy",
    subhead: esc(effective),
    lead_html: "",
    sections: sectionsHtml,
  });
  const navItems = [
    ["index.html", "Home"],
    ["what-we-do.html", "What we do"],
    ["solutions.html", "Solutions"],
    ["how-it-works.html", "How it works"],
    ["history.html", "History"],
  ]
    .map(([href, label]) => '        <li><a href="' + href + '">' + label + "</a></li>")
    .join("\n");
  const nav = fill(template("partials/nav.html"), {
    nav_items: navItems,
    cta_url: CTA_URL,
  });
  const footer = fill(template("partials/footer.html"), { cta_url: CTA_URL });
  const page = fill(template("base.html"), {
    title: "Privacy Policy \u2014 Alpha Tensor",
    meta_description: esc(effective),
    nav,
    content,
    footer,
  });
  writeFileSync(join(DIST, "privacy.html"), page, "utf8");
  console.log("built privacy.html from privacy.txt");
}

rmSync(DIST, { recursive: true, force: true });
mkdirSync(DIST, { recursive: true });
cpSync(join(SITE_BUILD, "dist"), DIST, { recursive: true });
console.log("copied site/build/dist -> dist");
buildPrivacy();
console.log("dist assembled");
