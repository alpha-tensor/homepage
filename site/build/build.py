#!/usr/bin/env python3
"""Build the Alpha Tensor marketing site from the Markdown corpus.

Usage:
    python3 build.py

Reads the corpus in ../site-corpus/ (01-home.md ... 05-history.md),
renders each page through the templates in templates/, and writes
static HTML into dist/ and the stylesheet into dist/assets/. Deterministic: no timestamps,
no network, no state. Requires the Python `markdown` package
(pip install --user markdown).

Mapping (per the corpus structure):
    # H1            -> page headline
    ## first H2     -> subhead / hero text
    blocks after H2 -> lead (hero lead on home, intro on article pages)
    ### blocks      -> sections (title + body)
    a paragraph that is only the Cal.com consultation link
                    -> rendered through the CTA partial (button)
"""

import html
import re
import shutil
from pathlib import Path

import markdown as md

HERE = Path(__file__).resolve().parent
CORPUS = HERE.parent / "corpus"
TEMPLATES = HERE / "templates"
DIST = HERE / "dist"

CTA_URL = "https://cal.com/alphatensor/free-consultation"
CTA_RE = re.compile(r"^\[([^\]]+)\]\(" + re.escape(CTA_URL) + r"\)$")

# (corpus file, output file, nav label, eyebrow, template kind)
PAGES = [
    ("01-home.md", "index.html", "Home", "Alpha Tensor", "home"),
    ("02-what-we-do.md", "what-we-do.html", "What we do", "What we do", "article"),
    ("03-solutions.md", "solutions.html", "Solutions", "Solutions", "article"),
    ("04-how-it-works.md", "how-it-works.html", "How it works", "How it works", "article"),
    ("06-industries.md", "industries.html", "Industries", "Industries", "article"),
    ("05-history.md", "history.html", "History", "History", "article"),
]


def load_template(relpath):
    return (TEMPLATES / relpath).read_text(encoding="utf-8")


def render(template, values):
    """Replace {{key}} placeholders. Content values are inserted raw
    (they are already HTML or pre-escaped by the caller)."""
    out = template
    for key, value in values.items():
        out = out.replace("{{" + key + "}}", value)
    return out


def split_blocks(text):
    return [b.strip() for b in re.split(r"\n\s*\n", text.strip()) if b.strip()]


def parse_page(text):
    """Split a corpus page into headline, subhead, lead blocks, sections."""
    headline = None
    subhead = None
    lead = []
    sections = []
    current = None  # current section dict
    for block in split_blocks(text):
        if block.startswith("### "):
            current = {"title": block[4:].strip(), "blocks": []}
            sections.append(current)
        elif block.startswith("## ") and subhead is None and headline is not None:
            subhead = block[3:].strip()
        elif block.startswith("# ") and headline is None:
            headline = block[2:].strip()
        elif current is not None:
            current["blocks"].append(block)
        else:
            lead.append(block)
    return headline, subhead, lead, sections


def render_blocks(blocks, cta_template):
    parts = []
    for block in blocks:
        m = CTA_RE.match(block)
        if m:
            parts.append(
                render(
                    cta_template,
                    {"cta_url": CTA_URL, "cta_label": html.escape(m.group(1))},
                ).strip()
            )
        else:
            parts.append(md.markdown(block).strip())
    return "\n".join(parts)


def section_slug(title):
    slug = re.sub(r"[^a-z0-9]+", "-", title.lower()).strip("-")
    return "section--" + slug if slug else ""


def nav_items(active_output):
    items = []
    for _src, output, label, _eyebrow, _kind in PAGES:
        # No Home item: the wordmark already links to
        # index.html, in the desktop nav and the mobile menu
        # alike, since both render from this one list.
        if output == "index.html":
            continue
        if output == active_output:
            attrs = ' class="active" aria-current="page"'
        else:
            attrs = ""
        items.append(
            '        <li><a href="{}"{}>{}</a></li>'.format(
                output, attrs, html.escape(label)
            )
        )
    return "\n".join(items)


def meta_description(subhead):
    text = re.sub(r"\s+", " ", subhead).strip()
    if len(text) > 158:
        text = text[:155].rsplit(" ", 1)[0] + "..."
    return html.escape(text, quote=True)


def build():
    base = load_template("base.html")
    home_tpl = load_template("home.html")
    article_tpl = load_template("article.html")
    nav_tpl = load_template("partials/nav.html")
    footer_tpl = load_template("partials/footer.html")
    hero_tpl = load_template("partials/hero.html")
    motif_tpl = load_template("partials/packet.html")
    form_demo_tpl = load_template("partials/form-demo.html")
    talk_cat_tpl = load_template("partials/talk-cat.html")
    cta_tpl = load_template("partials/cta.html")
    section_tpl = load_template("partials/section.html")

    DIST.mkdir(parents=True, exist_ok=True)
    for old in DIST.glob("*.html"):
        old.unlink()
    old_assets = DIST / "assets"
    if old_assets.exists():
        shutil.rmtree(old_assets)
    stale_css = DIST / "styles.css"
    if stale_css.exists():
        stale_css.unlink()

    footer = render(footer_tpl, {"cta_url": CTA_URL})

    founder_figure = (
        '<figure class="founder-figure">'
        '<img src="assets/brandon-moody.jpg" '
        'alt="Brandon Moody, founder of Alpha Tensor" '
        'width="720" height="900">'
        "<figcaption>Brandon Moody, founder</figcaption>"
        "</figure>"
    )

    def render_sections(sections, with_demo, with_founder=False):
        rendered = []
        for i, s in enumerate(sections):
            body = render_blocks(s["blocks"], cta_tpl)
            if with_founder and i == 0:
                body = founder_figure + "\n" + body
            if (
                with_demo
                and section_slug(s["title"])
                == "section--one-fact-every-format-the-form-asks-for"
            ):
                body += "\n" + form_demo_tpl
            if section_slug(s["title"]) == "section--talk-to-us":
                body = talk_cat_tpl + "\n" + body
            rendered.append(
                render(
                    section_tpl,
                    {
                        "section_class": section_slug(s["title"]),
                        "section_title": html.escape(s["title"]),
                        "section_body": body,
                    },
                ).strip()
            )
        return "\n".join(rendered)

    for src, output, _label, eyebrow, kind in PAGES:
        text = (CORPUS / src).read_text(encoding="utf-8")
        headline, subhead, lead, sections = parse_page(text)
        if headline is None or subhead is None:
            raise SystemExit(f"{src}: missing H1 headline or H2 subhead")

        sections_html = render_sections(
            sections, kind == "home", output == "history.html"
        )
        lead_html = render_blocks(lead, cta_tpl)

        if kind == "home":
            hero = render(
                hero_tpl,
                {
                    "eyebrow": html.escape(eyebrow),
                    "headline": html.escape(headline),
                    "subhead": html.escape(subhead),
                    "lead_html": lead_html,
                    "motif": motif_tpl.replace(
                        "{{hero_cat}}",
                        '<div class="hero-cat" aria-hidden="true">'
                        + talk_cat_tpl
                        + "</div>",
                    ),
                },
            )
            content = render(home_tpl, {"hero": hero, "sections": sections_html})
            title = "Alpha Tensor"
        else:
            content = render(
                article_tpl,
                {
                    "eyebrow": html.escape(eyebrow),
                    "headline": html.escape(headline),
                    "subhead": html.escape(subhead),
                    "lead_html": lead_html,
                    "sections": sections_html,
                    "page_class": (
                        "page--editorial" if output == "history.html" else ""
                    ),
                },
            )
            title = "{} \u2014 Alpha Tensor".format(headline)

        nav = render(nav_tpl, {"nav_items": nav_items(output), "cta_url": CTA_URL})
        page = render(
            base,
            {
                "title": html.escape(title, quote=True),
                "meta_description": meta_description(subhead),
                "nav": nav,
                "content": content,
                "footer": footer,
            },
        )
        (DIST / output).write_text(page, encoding="utf-8")
        print(f"built {output} from {src}")

    # /yc: the product demonstration page linked from the YC
    # application. Built like an article page, but deliberately
    # not in PAGES, so it stays out of the site navigation. Its
    # demonstration section reuses the homepage form demo
    # partial unchanged, world model included.
    yc_text = (CORPUS / "07-yc.md").read_text(encoding="utf-8")
    yc_headline, yc_subhead, yc_lead, yc_sections = parse_page(yc_text)
    if yc_headline is None or yc_subhead is None:
        raise SystemExit("07-yc.md: missing H1 headline or H2 subhead")
    yc_content = render(
        article_tpl,
        {
            "eyebrow": "Product demonstration",
            "headline": html.escape(yc_headline),
            "subhead": html.escape(yc_subhead),
            "lead_html": render_blocks(yc_lead, cta_tpl),
            "sections": render_sections(yc_sections, True),
            "page_class": "",
        },
    )
    yc_nav = render(nav_tpl, {"nav_items": nav_items(""), "cta_url": CTA_URL})
    yc_page = render(
        base,
        {
            "title": html.escape(
                "{} \u2014 Alpha Tensor".format(yc_headline), quote=True
            ),
            "meta_description": meta_description(yc_subhead),
            "nav": yc_nav,
            "content": yc_content,
            "footer": footer,
        },
    )
    (DIST / "yc.html").write_text(yc_page, encoding="utf-8")
    print("built yc.html from 07-yc.md")

    assets_dir = DIST / "assets"
    assets_dir.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(HERE / "styles.css", assets_dir / "styles.css")
    print("copied assets/styles.css")

    static_dir = HERE / "static"
    if static_dir.exists():
        for f in sorted(static_dir.iterdir()):
            if f.is_file():
                shutil.copyfile(f, assets_dir / f.name)
        print("copied static assets")

    not_found = render(
        article_tpl,
        {
            "eyebrow": "404",
            "headline": "Page not found",
            "subhead": "The page you were looking for is not here.",
            "lead_html": talk_cat_tpl
            + '\n<p><a href="index.html">Return to the home page</a></p>',
            "sections": "",
            "page_class": "",
        },
    )
    nav = render(nav_tpl, {"nav_items": nav_items(""), "cta_url": CTA_URL})
    page = render(
        base,
        {
            "title": "Page not found \u2014 Alpha Tensor",
            "meta_description": "The page you were looking for is not here.",
            "nav": nav,
            "content": not_found,
            "footer": footer,
        },
    )
    (DIST / "404.html").write_text(page, encoding="utf-8")
    print("built 404.html")


if __name__ == "__main__":
    build()
