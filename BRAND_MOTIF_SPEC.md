# Alpha Tensor Brand Motif Specification

Self-contained specification for the Alpha Tensor "information to structure" visual motif. Lives with the website source so it travels with every commit. Position and copy authority remain with `ALPHATENSOR_LANDING_PAGE_REDESIGN_IMPLEMENTATION.md`.

---

## 1. Concept

Messy information becomes ordered information.

A case enters as loose documents. Alpha Tensor identifies what each one is, extracts structured facts, and surfaces the exceptions a person must review. The visual motif says the same thing without words: a small field of neutral dots, an orange selection, the selected points aligning into structure, and one unresolved point becoming a review flag.

The motif is explanatory brand language, not production evidence. It never stands in for a real product recording.

---

## 2. Semantic grammar

| Element                      | Meaning                                          |
| :--------------------------- | :----------------------------------------------- |
| Cream ground                 | Source material and the page surface             |
| White surface                | Structured artifact and surfaced result          |
| Ink / near black             | System state, settled records, authority         |
| Orange                       | Active processing, selection, or attention       |
| Neutral dots                 | Unstructured information, only in context        |
| Lines and grids              | Source relationships and structure               |
| Orange bracket or annotation | An exception or an extracted value being located |
| Registration marks           | A document is the subject of capture             |
| Mono coordinates             | A value is addressable inside a source document  |

Color tokens live in `src/index.css` (`--bg`, `--surface-card`, `--surface-strong`, `--surface-dark`, `--accent`, `--accent-bright`, `--border`).

---

## 3. Visual vocabulary

### 3.1 Dots

- Dot diameter in artifact use: 3 to 5 px at typical render sizes; scale proportionally.
- Dot spacing: 1.5 to 2.5 dot diameters.
- Dots are neutral (ink or muted) until selected. Orange is reserved for selection, exception, or attention.
- A dot field never appears without a nearby artifact (document, record row, review flag) that explains what the dots mean.

### 3.2 Selection and alignment

- Selection is shown by an orange right-angle bracket or a short leader line to an aligned value.
- The signature motion: an irregular field of neutral dots appears, an orange bracket isolates a subset, the subset aligns into rows beside an extracted value, one dot remains orange as an exception, everything settles. One pass, roughly one to two seconds, then still.
- Alignment uses straight horizontal or vertical hairlines only.

### 3.3 Registration marks

- Registration marks are small orange or ink corner ticks placed just outside a source document crop.
- Use on the source document in the extraction scene and, at most, one other artifact per viewport. Do not frame every card.
- Mark length 6 to 10 px with a 1 px stroke, offset 2 to 3 px from the artifact edge.

### 3.4 Coordinates and confidence

- Coordinates use the mono typeface at 8 to 10 px, uppercase, of the form `1040 · F1 · X214 Y082`. They describe addressability inside the illustrative document. They are not product telemetry.
- Confidence values use mono type. A low value is rendered with an orange bracket and a "below threshold" style note, never with a meter fill that contradicts the number.

### 3.5 Mark

- The existing AlphaTensor mark is retained (2026-09-07 decision). No replacement mark is adopted.
- The motif is expressed through the artifact vocabulary below: registration marks, coordinates, selection brackets, confidence blocks, and the faint dot raster in the journey stage.

---

## 4. Motion rules

- Every motion is a one-pass response to an event (page load, stage activation, section entry) and then stops.
- No perpetual looping, floating, or glowing. The page should feel like a machine completing work.
- Motion communicates selection, alignment, or state change. It does not decorate.
- Reduced motion renders the settled state instantly. Content never depends on motion to be understood.
- Motion runs inside the visual artifact regions. The headline, proof band, and call to action do not animate.

---

## 5. Integration map

| Location                       | Motif use                                                   |
| :----------------------------- | :---------------------------------------------------------- |
| Case journey, classification   | Dots align into classified rows with one orange exception   |
| Case journey, extraction       | Registration marks and mono coordinates on the source paper |
| Case journey, review sheet     | Confidence block; orange bracket on the low value           |
| Case journey, stage background | Very faint dot raster at low opacity (texture only)         |
| Proof band                     | Faint dot raster plus an aligned matrix with one exception  |
| Platform and trust headers     | Recurring aligned matrix with one exception (ink / on-dark) |
| Header / footer / favicon      | Existing mark retained (2026-09-07)                         |

Explicitly not used: decorative dot sections, particles replacing product UI, and ornament on marketing paragraphs.

---

## 6. Do and do not

Do.

- Keep documents, review sheets, and the ledger as the explanation.
- Let orange point at a specific value or state.
- Test every mark at 16 px and in one color.
- Use hairlines and mono labels sparingly.

Do not.

- Do not build a generic data-company aesthetic of floating dots and lines.
- Do not imply the illustration is a real product screen.
- Do not use dots as section dividers.
- Do not introduce a second motif for decoration.

---

## 7. Origin and maintenance

This specification derives from the 2026-09-07 identity direction review. Design decisions that change this spec should update this file and the parent planning plan in the same change.
