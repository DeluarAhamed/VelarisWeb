# Velaris Web — Design System

A working design system for **Velaris Web**. It marries the **Ant Design**
component architecture (the structural foundation of the attached Figma UI kit)
with the **Velaris Web brand identity** (teal-to-navy gradient mark, sparkle
star, elegant serif wordmark). The result is a calm, professional, enterprise-
grade product language with a distinctive teal accent in place of Ant's default
blue.

> **What this is for:** branded interfaces and assets for Velaris Web — product
> screens, marketing surfaces, and throwaway prototypes/mocks. Treat the Ant
> Design layer as the *grammar* (tokens, components, spacing, behavior) and the
> Velaris brand as the *voice* (color, the serif display face, the logo mark).

---

## Brand at a glance

- **Name:** Velaris Web
- **Mark:** an upward-sweeping **"V" swoosh** paired with a four-point **sparkle
  star**, set in a rounded-square app tile. The tile fills with a teal→navy
  vertical gradient; the V and star are knocked out in white.
- **Wordmark:** "VELARIS WEB" in high-contrast serif capitals (Didone feel).
- **Personality:** aspirational, precise, trustworthy, a little premium. The
  star + upward V read as *navigation, ascent, clarity*.
- **Primary color:** Velaris Teal `#2A8F94` (replaces Ant blue `#1677FF`).
- **Signature gradient:** `linear-gradient(155deg, #34979C → #277E84 → #1A2940)`
  — the logo tile gradient, teal into deep brand navy.

---

## Sources

This system was built from materials supplied by the user:

1. **Figma — "Ant Design System for Figma.fig"** (mounted, read-only). The full
   Ant Design 5 Figma kit: Style Guide (Color, Typography, Size/Space/Radius,
   Effects), and component pages (Button, Menu, Input, Tag, Badge, etc.) plus
   the complete Ant **Outlined** icon set. This is the structural foundation —
   token names, component anatomy, and icons all come from here.
   - Top fonts in source: **SF Pro Text** (UI), **Space Mono** (code/data).
   - Primary in source: Ant blue `#1677FF` — **rebranded to Velaris teal**.
2. **Figma — "Velaris Web.fig"** (referenced by the brief; brand mark + wordmark
   are represented by the uploaded logo files below).
3. **Uploaded brand art:**
   - `uploads/Velaris web main logo.jpg` → `assets/velaris-logo-horizontal.jpg`
   - `uploads/Velaris logo icon.jpg` → `assets/velaris-logo-stacked.jpg`
   - `uploads/icon mark.jpg` → `assets/velaris-app-icon.jpg`

> **Note on access:** the reader may not have the original Figma files. All
> values needed to rebuild the system are captured in `colors_and_type.css` and
> in this README. Brand colors were sampled directly from the uploaded logo art.

---

## CONTENT FUNDAMENTALS

How Velaris Web writes. (The Ant source kit is documentation-style and neutral;
the Velaris voice layered on top is concise, confident, and human.)

- **Voice:** clear, calm, competent. Lead with the benefit, not the mechanism.
  Short declarative sentences. No hype, no exclamation-point energy.
- **Person:** address the user as **"you."** Refer to the product/company as
  **"we"** sparingly (mostly in marketing). In-product UI is impersonal and
  action-first ("Create project", "Invite team").
- **Casing:** **Sentence case** everywhere — buttons, menu items, headers, form
  labels, table headers. (`Save changes`, not `Save Changes`.) The **wordmark**
  is the only all-caps element. Reserve Title Case for proper nouns and product
  feature names.
- **Buttons / actions:** verb-first and specific. `Create project`,
  `Send invite`, `Connect data source`. Avoid `Submit`, `OK` (use `Done`,
  `Got it`). Destructive actions name the object: `Delete workspace`.
- **Microcopy:** helpful and brief. Empty states explain the next step
  ("No projects yet. Create one to get started."). Errors are plain and
  actionable ("That email is already in use. Try signing in.").
- **Numbers & data:** technical labels, IDs, metrics, and code render in
  **Space Mono**. Keep units tight (`24 MB`, `99.9%`, `1,204 users`).
- **Emoji:** **not used** in product UI or formal marketing. The brand's
  "spark" is expressed through the **sparkle-star glyph** from the logo, not
  emoji.
- **Tone examples:**
  - Hero: *"Build, ship, and scale your web presence — with clarity."*
  - Feature: *"Real-time analytics. Know what's working the moment it happens."*
  - Empty state: *"Nothing here yet. Your first deployment will show up here."*
  - Toast (success): *"Project created."* (toast, success): *"Changes saved."*
  - Error: *"We couldn't reach the server. Check your connection and retry."*

---

## VISUAL FOUNDATIONS

The look and feel, motif by motif.

### Color
- **Primary is Velaris Teal** `#2A8F94` (teal/6). A full 10-step teal ramp
  (`--teal-1` … `--teal-10`) drives primary surfaces, links, focus rings, and
  selected states. The ramp terminates in the brand navy `#1A2940` (teal/10).
- **Neutrals are Ant's alpha-on-white system:** text at 88% / 65% / 45% / 25%
  black; borders at 15% / 6% black; layered fills at 2–15%. Page background is
  `#F5F5F5`, containers are pure white.
- **Functional colors are Ant defaults:** success `#52C41A`, warning `#FAAD14`,
  error `#FF4D4F`, info stays Ant blue `#1677FF` (info ≠ primary, so the teal
  brand and blue informational states never collide).
- **Imagery / vibe:** cool and clean. When tinting photography or hero art,
  lean teal-cool with deep navy shadows — never warm/orange. Gradients are used
  *only* as the brand mark fill and occasional hero panels, never as default
  card or button backgrounds.

### Type
- **Two-typeface system:**
  - **UI / product text → Cabinet Grotesk** (self-hosted geometric sans). The
    brand's workhorse — buttons, body, labels, tables, headings.
  - **Display / brand → Zodiak** (high-contrast Didone serif, self-hosted) —
    matches the VELARIS WEB wordmark; used for marketing heroes & brand display.
  - **Code / data → Space Mono.**
- **Scale (Ant):** body 14/22, SM 12/20, LG 16/24. Headings H1 38/46, H2 30/38,
  H3 24/32, H4 20/28, H5 16/24. Marketing display 56/64 in Zodiak.
- **Weights:** 400 body, 500 medium (labels, menu), 600 semibold (headings,
  emphasis), 700 bold (display). Headings use **600**, not 700, in product UI.

### Spacing, radius, elevation
- **Spacing:** 4px base grid — 4 / 8 / 12 / 16 / 20 / 24 / 32 / 48.
- **Radius:** 2 (xs) / 4 (sm) / **6 (base — buttons, inputs)** / 8 (cards,
  modals) / 12 (large panels) / pill. Corners are gently rounded, never sharp,
  never fully circular except avatars/pills.
- **Shadows (Ant three-layer):**
  - `--shadow-tertiary` — barely-there lift for forms & resting cards.
  - `--shadow` — default raised surface.
  - `--shadow-secondary` — dropdowns, popovers, floating buttons.
  - `--shadow-primary` — teal-tinted glow for hero CTAs only.

### Surfaces & components
- **Cards:** white, `--radius-lg` (8px), `1px solid rgba(0,0,0,0.06)` border
  *or* `--shadow-tertiary` — usually one, not both. No colored left-border
  accents.
- **Buttons:** primary = solid teal, white text; default = white with
  `rgba(0,0,0,0.15)` border; text/link = teal, no fill. Height 32 (default),
  24 (small), 40 (large). 6px radius.
- **Inputs:** white, 1px neutral border, 6px radius; focus → teal border +
  faint teal ring (`0 0 0 2px rgba(42,143,148,0.1)`).
- **Transparency / blur:** used sparingly — modal scrims at `rgba(0,0,0,0.45)`,
  the occasional frosted header. Not a primary motif.

### Motion
- **Easing:** Ant's `cubic-bezier(0.645, 0.045, 0.355, 1)` for moves;
  `ease-out` for enters, `ease-in` for exits.
- **Duration:** 0.1s (instant feedback), 0.2s (most transitions), 0.3s
  (overlays/drawers). Calm and quick — no bounce, no spring, no decorative loops.
- **Hover:** lighten one step (e.g. teal/6 → teal/5 fill; default buttons →
  teal border + teal text). Links → teal/5.
- **Press / active:** darken one step (teal/6 → teal/7). No scale-shrink on
  buttons (Ant doesn't); subtle press is color-only.
- **Focus:** always a visible 2px teal ring for accessibility.

---

## ICONOGRAPHY

- **System:** **Ant Design Icons — Outlined** style. Single-weight line icons on
  a 24px grid, rounded joins, consistent optical sizing. This is the canonical
  set; do not mix in other icon families.
- **Format:** monochrome **SVG**, authored with `fill="currentColor"` so they
  inherit text color. A curated working set (~50 icons) lives in
  `assets/icons/` (search, user, bell, setting, home, mail, plus, close, check,
  down/up/left/right, menu, ellipsis, edit, delete, eye, calendar, filter,
  upload/download, star, heart, message, team, dashboard, appstore, file-text,
  folder, lock, logout, info/check/close/question-circle, link, global,
  rocket, thunderbolt, cloud, bar/pie/line-chart, bulb, api, safety, sync,
  database, …). These were copied directly out of the source Ant Figma kit.
- **Usage:** recolor via `currentColor` (inline SVG) or via CSS
  `mask-image` + `background: currentColor`. Default icon color is
  `--text-secondary` (65% black); active/selected is teal. Default size 16px in
  text rows, 20–24px standalone.
- **The full Ant set** (700+ Outlined/Filled/TwoTone) is the source of truth —
  copy additional icons from the Figma kit as needed rather than substituting
  another library.
- **Emoji:** not used. The **sparkle-star** from the logo is the one decorative
  brand glyph; use it sparingly as an accent (e.g. "what's new", premium marks).
- **Brand logos** live in `assets/` (see Index).

---

## INDEX — what's in this system

| Path | What it is |
|---|---|
| `README.md` | This file — brand context, content & visual foundations, iconography. |
| `colors_and_type.css` | All design tokens: Velaris teal scale, Ant neutrals/semantics, shadows, radius, spacing, full type system + self-hosted @font-face. Import this first. |
| `fonts/` | Self-hosted brand web fonts — Zodiak (display serif) + Cabinet Grotesk (UI sans). |
| `assets/velaris-logo-horizontal.jpg` | Primary horizontal lockup (mark + wordmark). |
| `assets/velaris-logo-stacked.jpg` | Stacked mark over wordmark. |
| `assets/velaris-app-icon.jpg` | Rounded-square app tile (teal→navy gradient). |
| `assets/icons/*.svg` | Curated Ant Outlined icon set (`currentColor`). |
| `assets/icons.js` | Inline-SVG hydrator — `<span data-icon="name">` becomes a recolorable icon. |
| `preview/*.html` | Design-system cards (colors, type, spacing, components) shown in the Design System tab. |
| `ui_kits/web-app/` | UI kit — interactive Velaris Web console (login, dashboard, projects, analytics, team, settings). |
| `SKILL.md` | Agent Skill manifest so this system works in Claude Code. |

### How to build with this
1. Link `colors_and_type.css` (it `@import`s the web fonts).
2. Use the tokens — never hard-code hex. Primary action = `--color-primary`.
3. Pull icons from `assets/icons/`. Pull components from `ui_kits/`.
4. Sentence case, "you", no emoji. Teal for brand/primary, blue only for info.

---

## CAVEATS / SUBSTITUTIONS

- **Display serif is Zodiak** (Indian Type Foundry / Fontshare), self-hosted in
  `fonts/`. It's a contemporary high-contrast Didone that closely echoes the
  VELARIS WEB wordmark. The wordmark itself should still be set from the logo
  art, not retyped.
- **UI sans = Cabinet Grotesk** (Fontshare), self-hosted in `fonts/`. The source
  Ant kit used SF Pro Text (Apple system font); the brand's chosen UI face is
  Cabinet Grotesk, now wired across the whole system.
- **Logos are JPG with white backgrounds.** Transparent PNG/SVG versions would
  composite better on dark/colored surfaces — please share them if available.
- **No product copy was provided.** Voice examples above are written *in the
  Velaris register* as a starting point, not lifted from existing material.
  Point me at real copy and I'll tune the guidance.
