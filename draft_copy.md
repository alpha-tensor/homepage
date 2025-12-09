## 1. Positioning

**Core promise**

> AlphaTensor turns messy documents into reliable, automated workflows for high stakes processes.

Not “LLM platform” or “RAG agency.”
You are: **document intelligence and automation for complex forms and rules.**

Anchor verticals you already know

- Immigration and legal workflows

- Government and regulated industries

- Claims, onboarding, compliance paperwork

---

## 2. Page anatomy

One page, no clutter, one CTA.

1.  Hero

2.  Proof strip / clients or context

3.  “What AlphaTensor does” 3 step narrative

4.  Live-looking “system view” section

5.  Use cases grid

6.  Trust, architecture, and guarantees

7.  About / founder credibility

8.  Final CTA block

I will give copy and visual direction for each.

---

## 3. Hero

**Layout**

Use Haptic / OutThere style:

- Full-bleed orange hero

- Left: big type, 2–3 lines

- Right: compact panel with CTA and a micro animation frame

**Copy**

_Title_

> Document intelligence for serious workflows.

_Subhead_

> AlphaTensor ingests your PDFs, forms, and policies, learns the structure, and ships automation that actually survives production. Versioned templates, autofill, and rules-based decisions built on LLMs, not run by them.

_Bullets (3 max)_

- From unstructured PDFs to typed schemas in days, not quarters.

- Proven on real immigration, claims, and agency workflows.

- Designed for auditors, not just demos.

_CTA_

Button: **Book a working session →**
Small line under it: “30 minutes on Cal.com. We come with ideas, not a deck.”

_Micro interaction idea_

- A “stack” of monochrome document cards sliding and snapping into a clean schema grid.

- Subtle motion only on first load and hover. No scroll-jacking.

---

## 4. Proof strip

Directly under hero, on white or very light gray.

_Left_

Small label: **Previously deployed in**

_Right_

Logos or name tags in a single row. If you cannot legally show logos, use text pills:

- “Federal claims workflows”

- “Immigration case automation”

- “Internal knowledge tools for consulting teams”

Keep it understated. This section is about _reassurance_, not flexing.

---

## 5. “What AlphaTensor does”

Stripe.dev style grid with clear headings.

Three columns across, on white:

1.  **See the documents**
    - “Ingest PDFs, forms, scanned packets, and knowledge bases. AlphaTensor detects structures, fields, and relationships automatically.”

2.  **Understand the rules**
    - “We map your business rules, eligibility criteria, and routing logic into explicit graphs that can be inspected and updated.”

3.  **Ship automation that sticks**
    - “Versioned templates, autofill, and rules engines wired into your stack. Every decision is traceable back to the source document.”

Each block gets a simple line icon and a hover lift.

---

## 6. “Inside the system” section

This is where you make the tech feel tangible, like Stripe’s console.

**Layout**

- Split screen

- Left: explanation

- Right: faux-UI panels stacked with subtle motion

_Left copy_

Label: **Product**

Title:

> One engine for documents, knowledge, and decisions.

Short paragraphs:

- “AlphaTensor builds a typed representation of your forms and documents. Every field, rule, and version is tracked.”

- “Your LLMs call into this layer instead of hallucinating structure. Inputs stay predictable, outputs stay reviewable.”

Mini list:

- “Template inference from real packets”

- “Field mapping and autofill with confidence scores”

- “Rules graph for eligibility and routing”

- “Human-in-the-loop review queues”

_Right visual_

Stacked cards with labels like:

- “Form schema: I-130 Intake v4”

- “Rule set: Income eligibility 2024-Q3”

- “Packet view: Uploaded PDF → Extracted fields”

Minimal line art, no fake charts. This should feel like a calm operations console.

---

## 7. Use cases

Grid of 3–4 tiles, big type, short copy.

_Section title_

> Where AlphaTensor makes the most impact first.

_Tiles_

1.  **Immigration and legal packets**
    “Turn 100-page client packets into structured cases. Autofill government forms, track every version, and surface edge cases to humans.”

2.  **Claims and benefits**
    “Normalize wildly different submissions into a single schema. Apply complex eligibility logic automatically, with full audit trails.”

3.  **Onboarding and compliance**
    “Collect documents once, reuse across forms and systems, and keep a living record of what was accepted when.”

4.  **Internal knowledge operations**
    “Attach policies and SOPs directly to decisions so staff always see the ‘why’ behind an outcome.”

Under the grid, one sentence:

> If your work lives in PDFs, packets, and policies, AlphaTensor is built for you.

---

## 8. Trust / architecture

You are selling to cautious operators. This section is non negotiable.

_Title_

> Built for regulated teams, not toy demos.

_Three columns or stacked items_

- **Deployment**
  “Run fully managed or in your own cloud. We never train foundation models on your private data.”

- **Security**
  “Encryption in transit and at rest, role-based access, and strict separation between environments.”

- **Explainability**
  “Every automated action links back to original documents and rules. No ‘the model just said so’ decisions.”

Optional small aside:

> We are comfortable working with security reviews and procurement.

---

## 9. About

Keep it lean but credible. No “our mission is to synergize.” Speak like an engineer who has shipped for real teams.

_Title_

> AlphaTensor comes from the operations floor, not a slide deck.

_Copy_

“AlphaTensor started inside real law and government workflows, where delays and errors are measured in lives, not vanity metrics. We built tools to survive federal audits, shifting rules, and messy packets first, then turned them into a platform.”

Bullet style:

- “15+ years building production systems for government and healthcare.”

- “Hands-on experience automating hundreds of thousands of claims and packets.”

- “Comfortable in both the ops war room and the codebase.”

If you want, end with a short personal line:

> Based in Atlanta and Albuquerque, working with teams across the US.

---

## 10. Final CTA block

Full orange footer, similar weight to hero for symmetry.

_Title_

> Bring one messy workflow. We will map it in 30 minutes.

_Subline_

> Book a working session, bring a real example packet or process, and we will walk through how AlphaTensor would structure and automate it.

_Button_

**Schedule a working session →**
Under it, small line like:

> Powered by Cal.com. No sales theater, just architecture.

---

## 11. Visual and motion language

Keep it tight and opinionated, not dribbble-overdesigned.

**Color**

- Primary: deep orange background used in large fields.

- Secondary: off-white / light gray backgrounds for content.

- Accents: near black for text, a muted blue or moss for highlights if needed.

**Type**

- Display: strong grotesk (think Space Grotesk, Suisse Int’l, or similar).

- Body: neutral sans (Inter, Satoshi, etc).

- Big contrast between H1 size and body, like the inspiration screenshots.

**Micro interactions**

- Soft, quick hover elevation on cards.

- Slight parallax on stacked document visuals.

- Maybe one subtle marquee or auto scrolling “feed” like Stripe.dev showing recent “Patterns we have automated.”

No scroll-hijack. No excessive motion. You want “this team is meticulous,” not “this team bought a Framer template.”

---

## 12. Implementation notes

Given your stack preferences

- Next.js or Bun + React, Tailwind, Framer Motion.

- Components you will likely need
  - `HeroSection`

  - `ProofStrip`

  - `CapabilitiesGrid`

  - `SystemView`

  - `UseCasesGrid`

  - `TrustSection`

  - `AboutSection`

  - `FinalCtaSection`

Once you are ready, I can turn this into actual React + Tailwind components with layout and motion scaffolding.

##### You said:

can you create a single markdown file with all instructions without snippet formatting?

###### ChatGPT said:

# AlphaTensor one pager spec

## 1 Positioning

Core promise

> AlphaTensor turns messy documents into reliable automated workflows for high stakes processes.

Do not lead with language about generic LLM platforms.

Present AlphaTensor as document intelligence and automation for complex forms and rules.

Anchor known verticals

- Immigration and legal workflows

- Government and regulated industries

- Claims onboarding and compliance paperwork

Tone

- Serious and technical

- Direct language that sounds like an engineer who ships production systems

---

## 2 Page anatomy

Single page layout with one primary call to action.

Sections in order

1.  Hero

2.  Proof strip with brief context

3.  What AlphaTensor does as a three step narrative

4.  Inside the system product view

5.  Use cases grid

6.  Trust and architecture guarantees

7.  About and founder credibility

8.  Final call to action block

No secondary calls to action. All paths should lead to scheduling a call.

---

## 3 Hero

Visual direction

- Full bleed orange hero

- Left side large type with title and subhead

- Right side compact panel with primary call to action and micro animation frame

Copy

Title

> Document intelligence for serious workflows.

Subhead

> AlphaTensor ingests your PDFs forms and policies, learns the structure, and ships automation that survives production. Versioned templates, autofill, and rules based decisions built on LLMs, not run by them.

Supporting bullets

- From unstructured PDFs to typed schemas in days not quarters.

- Proven on real immigration claims and agency workflows.

- Designed for auditors not only for demos.

Primary call to action

Button label

> Book a working session

Button opens Cal dot com scheduling page.

Under button small line

> Thirty minutes. We come with ideas not a slide deck.

Micro interaction idea

- Stack of simple monochrome document cards that slide and snap into a clean schema grid.

- Motion only on first load and on hover.

- No scroll locking or forced animations.

---

## 4 Proof strip

Purpose is to reassure not to brag.

Background light gray or white.

Left side label in small caps

> Previously deployed in

Right side row of logos or neutral pills. If logos are not allowed use text pills such as

- Federal claims workflows

- Immigration case automation

- Internal knowledge tools for consulting teams

Keep this section compact and understated.

---

## 5 What AlphaTensor does

Use a three column layout similar to Stripe developer feed. White background.

Each column has a title, two or three sentences, and a simple line icon.

Column one

Title

> See the documents

Text

> Ingest PDFs forms scanned packets and knowledge bases.
> AlphaTensor detects structures fields and relationships automatically.

Column two

Title

> Understand the rules

Text

> Map business rules eligibility criteria and routing logic into explicit graphs.
> Rules can be inspected changed and versioned without touching prompt text.

Column three

Title

> Ship automation that sticks

Text

> Versioned templates autofill and rules engines wired into your stack.
> Every decision is traceable back to the source document.

Interactions

- On hover each card lifts slightly and may show one extra detail line.

- Keep typography clean and calm.

---

## 6 Inside the system

This section makes the product feel real and operational.

Layout

- Split screen.

- Left column text.

- Right column stacked product cards with light motion.

Left side

Label small

> Product

Title

> One engine for documents knowledge and decisions.

Body text

> AlphaTensor builds a typed representation of your forms and documents. Every field rule and version is tracked.
> LLMs call into this layer instead of guessing structure. Inputs stay predictable and outputs stay reviewable.

Short feature list

- Template inference from real client packets.

- Field mapping and autofill with confidence scores.

- Rules graph for eligibility and routing.

- Human in the loop review queues.

Right side visual

Create a simple faux console with three or four stacked cards such as

- Form schema I dash one thirty intake v four.

- Rule set income eligibility twenty twenty four Q three.

- Packet view uploaded PDF to extracted fields.

Use clean line art and gentle borders. No noisy charts.

---

## 7 Use cases

Goal is to show where AlphaTensor is best applied first.

Section title

> Where AlphaTensor delivers the most impact first.

Use a grid with three or four tiles.

Tile one

Title

> Immigration and legal packets

Text

> Turn large client packets into structured cases. Autofill government forms, track every version, and surface edge cases to humans.

Tile two

Title

> Claims and benefits

Text

> Normalize different submission formats into a single schema. Apply complex eligibility logic automatically with full audit trails.

Tile three

Title

> Onboarding and compliance

Text

> Collect documents one time and reuse across forms and systems. Keep a living record of what was accepted and when it was accepted.

Tile four optional

Title

> Internal knowledge operations

Text

> Attach policies and standard operating procedures directly to decisions so staff always see the reason behind an outcome.

Closing line under grid

> If your work lives in PDFs packets and policies, AlphaTensor is built for you.

---

## 8 Trust and architecture

This section is required for regulated buyers and risk averse teams.

Title

> Built for regulated teams not toy demos.

Use three equal columns or stacked blocks.

Block one

Heading

> Deployment

Text

> Run fully managed or in your own cloud environment.
> Private data is not used to train foundation models.

Block two

Heading

> Security

Text

> Encryption in transit and at rest.
> Role based access and clear separation between environments.

Block three

Heading

> Explainability

Text

> Every automated action links back to original documents and explicit rules.
> No decisions that rely on the model alone without a clear record.

Optional line at bottom

> AlphaTensor is comfortable working through security reviews procurement and compliance checks.

---

## 9 About

Tone should be direct and grounded.

Title

> AlphaTensor comes from the operations floor not from a slide deck.

Body text

> AlphaTensor grew inside real law and government workflows where delays and errors are measured in lives not vanity metrics. The first tools were built to survive federal audits shifting rules and messy packets. The platform is a product of that work not a pitch first experiment.

Bullets for credibility

- More than fifteen years building production systems for government and healthcare.

- Direct experience automating hundreds of thousands of claims and packets.

- Able to work both with operations leads and technical teams.

Optional location line

> Based in Atlanta and Albuquerque serving teams across the United States.

---

## 10 Final call to action block

Mirror the hero with another strong orange band near the bottom.

Title

> Bring one messy workflow and map it in thirty minutes.

Subline

> Book a working session. Bring a real packet or process. See exactly how AlphaTensor would structure and automate it.

Button label

> Schedule a working session

Button action opens Cal dot com booking.

Small line under button

> No sales theater. Live architecture and honest feasibility.

---

## 11 Visual and motion language

Color

- Primary deep orange for hero and final call to action.

- Secondary off white or very light gray for most content sections.

- Text in near black.

- If needed one muted accent such as a dark moss or muted blue used sparingly.

Typography

- Display font a strong grotesk in the style of Swiss design.

- Body font a neutral sans such as Inter or similar.

- Large contrast between hero headings and body size.

Layout character

- Generous margins and whitespace.

- Clear vertical rhythm between sections.

- Subtle dividing lines similar to Stripe developer pages.

Motion

- Gentle hover elevation on cards.

- Slight parallax or slide motion on stacked document visuals.

- No scroll hijacking or heavy autoplay videos.

- Motion should signal craft and confidence, not showmanship.

---

## 12 Implementation notes

Stack suggestion

- Next or React with Tailwind and Framer Motion.

- Keep code structure lean and opinionated.

Core components

- HeroSection

- ProofStrip

- CapabilitiesGrid

- SystemView

- UseCasesGrid

- TrustSection

- AboutSection

- FinalCtaSection

Routing

- Single root route for now.

- Future additions such as docs can spin off separate paths without affecting this landing.

Copy and content

- Keep sentences short and direct.

- Remove any buzzwords that do not map to a concrete capability.

- Emphasize how AlphaTensor behaves in production rather than in small demos.
