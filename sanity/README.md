# Velaris Web Sanity CMS

This Studio is the editable content layer for Velaris Web. It covers the content the current static website already uses, plus the collections needed for the next phase of CMS-driven pages.

## Collections

- Site settings, header/footer navigation and default SEO
- Pages with reusable page sections
- Services and service detail pages
- Case studies with screenshots, deliverables, style guide, palette, results and live links
- Blog posts, authors and categories
- Resources and lead magnets
- Testimonials and client logos
- Pricing plans and FAQs

## Local Setup

1. Copy `.env.example` to `.env`.
2. Add your real `SANITY_STUDIO_PROJECT_ID`.
3. Keep `SANITY_STUDIO_DATASET=production` unless you create a different dataset.
4. From the repo root, run:

```bash
npm run cms:dev
```

The Studio runs from the `sanity` folder and is configured with `basePath: /studio` for hosted deployment.

## Seed Current Website Content

The current site still uses static `window.VELARIS_*` data files. To prepare that content for Sanity import:

```bash
npm run cms:seed
```

This writes:

```text
sanity/seed/velaris-content.ndjson
```

Then import into your configured Sanity project:

```bash
npm run cms:import
```

The seed preserves current local image paths in `legacyPath`, `logoPath`, `heroImagePath`, `galleryPaths` and screenshot fields. Uploading those images into Sanity assets can be done as a follow-up migration pass.

## Deployment

Build the Studio:

```bash
npm run cms:build
```

Deploy the Studio to Sanity hosting:

```bash
npm --prefix sanity run deploy
```

The public website can keep using the static data while the CMS is populated. Once content is approved in Sanity, the next implementation pass can swap the static arrays for GROQ queries.
