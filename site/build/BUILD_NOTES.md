# Build notes — Alpha Tensor marketing site

Static site generated from the Markdown corpus in `../site-corpus/`.
No JavaScript, no framework, no build chain beyond one Python script.

## Rebuild

```bash
cd site-build
python3 build.py
```

Runs in under a second, fully deterministic (verified: two consecutive
builds produce byte-identical output). Writes `dist/`:

- `index.html`, `what-we-do.html`, `solutions.html`,
  `how-it-works.html`, `history.html`
- `styles.css` (copied from `site-build/styles.css`)

Dependency: the Python `markdown` package
(`pip install --user markdown`). On this machine's PEP 668
externally-managed Python it was installed with
`pip install --user --break-system-packages markdown` (user site only).
To change copy, edit the corpus Markdown and rebuild. To change design,
edit `styles.css` or the templates and rebuild. The corpus is never
modified by the build.

## Structure

- `build.py` — the whole pipeline: parse, render, write.
- `templates/base.html` — shared shell: head, fonts, `{{nav}}`,
  `{{content}}`, `{{footer}}`.
- `templates/home.html` — home: hero partial + sections.
- `templates/article.html` — the other four pages: page head
  (eyebrow, headline, lede, intro) + sections.
- `templates/partials/nav.html` — text wordmark "Alpha Tensor", links
  to the five pages (current page marked active), consultation link
  at the right as an outline button.
- `templates/partials/footer.html` — "Alpha Tensor LLC" and the
  consultation link only. No address, no other details.
- `templates/partials/hero.html` — home hero: mono eyebrow, serif H1,
  thin accent rule, subhead, lead.
- `templates/partials/cta.html` — the call-to-action button
  (accent background, white text, links to
  https://cal.com/alphatensor/free-consultation).
- `templates/partials/section.html` — one `###` block: title + body,
  flat, separated by hairlines.

## Corpus-to-template mapping

The parser is block-based (blocks split on blank lines):

- `# H1` → page headline.
- First `## H2` → subhead (hero subhead on home, lede on articles).
- Blocks between the H2 and the first `###` → lead (hero lead /
  article intro).
- Each `###` → a section, rendered through the section partial.
- A paragraph consisting solely of the Cal.com consultation link →
  rendered through the CTA partial as a button, keeping the corpus
  link text ("Book a free consultation") as the label.

## Design tokens

`styles.css` opens with a clearly marked DESIGN TOKENS block (`:root`
variables): paper #FFFFFF, ink #201A1A, muted ink at 66%, hairlines
rgba(0,0,0,0.2), accent #F06E00 (used only for the CTA button and the
hero rule), card radius 16px (defined for the Lab; no cards are used
on this site), font stacks. The product Lab is meant to consume the
same variables. Fonts load from Google Fonts: Funnel Sans (body/UI),
IBM Plex Mono (labels/eyebrows). H1 headlines use the serif display
stack (Georgia, "Times New Roman", serif) as the sanctioned fallback
for the licensed display face. Layout: 1120px max width, left-aligned,
flat sections with hairline separators, no images, no gradients, no
decorative color blocks, no shadows.

## Mapping notes (nothing blocked; three judgment calls)

1. **04-how-it-works.md has no lead blocks** — its H2 is followed
   directly by the first `###`. The article template renders an empty
   intro there. Clean, no special case needed.
2. **Article H1s are short labels** ("What we do", "Solutions",
   "How it works", "History") while the H2 carries the actual
   message. Per the specified mapping, the H1 renders as the serif
   page headline and the H2 as the lede beneath it, so on those
   pages the lede does the persuasive work. If that ever feels
   inverted, it is a corpus edit (promote the H2 text), not a
   template change.
3. **Home's "The work, in order"** section uses bold-led paragraphs
   (`**Determination.** ...`). They render as strong-led paragraphs
   inside a standard section; no dedicated component was warranted.
4. **Eyebrows** are a template device, not corpus copy: home uses
   "Alpha Tensor"; article pages repeat their nav label in mono
   uppercase.
5. **Footer scope** follows the brief (entity + consultation link).
   The corpus README's open question about a fuller legal footer
   (entity line "Alpha Tensor LLC, a Georgia LLC", privacy page)
   remains Brandon's call; nothing was invented here.

## Verification (2026-10-31)

- All five HTML files generated; nav present on every page; the
  Cal.com CTA appears on every page (4 instances on home: header,
  hero button, closing-section button, footer; 3 on article pages).
- Each page's H1 matches its corpus headline.
- No unreplaced `{{placeholders}}` in the output.
- Banned-string scan of `dist/` is clean: no "Padilla", "70,000",
  "1,100", "Vega", or "AcroForm".
