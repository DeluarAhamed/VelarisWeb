---
name: velaris-web-design
description: Use this skill to generate well-branded interfaces and assets for Velaris Web, either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files.

Velaris Web is an Ant Design–based system rebranded with the Velaris identity:
teal primary (`#2A8F94`, scaling into the brand navy `#1A2940`), **Cabinet
Grotesk** for UI text, **Zodiak** for display/marketing serif, and **Space Mono**
for code/data. Icons are Ant Design Outlined (in `assets/icons/`, `currentColor`).

Key files:
- `README.md` — brand context, content & visual foundations, iconography, index.
- `colors_and_type.css` — all tokens (colors, type, spacing, radius, shadows) + self-hosted @font-face. Link this first.
- `fonts/` — Zodiak + Cabinet Grotesk web fonts.
- `assets/` — logos, app icon, `icons/` (Ant SVGs), `icons.js` (inline-SVG hydrator).
- `preview/` — design-system specimen cards.
- `ui_kits/web-app/` — interactive Velaris Web console recreation (React/Babel).

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy
assets out and create static HTML files for the user to view. If working on
production code, copy assets and read the rules here to become an expert in
designing with this brand.

If the user invokes this skill without any other guidance, ask them what they
want to build or design, ask some questions, and act as an expert designer who
outputs HTML artifacts _or_ production code, depending on the need.

Brand rules to honor: sentence case everywhere (the wordmark is the only
all-caps element); address the user as "you"; no emoji (the sparkle-star glyph
is the one brand accent); teal for brand/primary, blue reserved for info states;
6px radius on controls, 8px on cards; calm 0.2s transitions, no bounce.
