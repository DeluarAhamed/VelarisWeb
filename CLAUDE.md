# Velaris Web

Marketing site for https://velarisweb.com. GitHub: DeluarAhamed/VelarisWeb (branch `master`).

## Deploy
- Hosted on Vercel (project `velarisweb`, linked in `.vercel/`). Every push to `master` auto-deploys to production, so a push means the change is live. Confirm with the user before pushing.
- `npm run build` = `generate-seo.js` → `vite build` → `finalize-build.js`.

## Where things live
- The real pages are static HTML/JS in `public/velaris-design-system/ui_kits/web-app/`. `vercel.json` rewrites clean URLs to them (`/` → `home-figma.html`, `/services` → `services.html`, `/case-studies` → `work.html`, `/blog`, `/post`, `/pricing`, `/about`, `/resources`, `/playbook`, `/service`, `/case`).
- `src/` (React/Vite) is not what the live pages render.
- `api/` holds Vercel serverless functions (leads, calendar, Ava voice agent; see `docs/ava-voice-agent.md`). Secrets go in Vercel env vars, never in the repo.

## Content: Sanity CMS
- Project `9ino9ode`, dataset `production`. Studio code is in `sanity/` (`npm run cms:dev`, deploy with `npm --prefix sanity run deploy`).
- `sanity-config.js` + `sanity-bridge.js` fetch from Sanity in the browser and override the static `window.VELARIS_*` data: services, case studies, testimonials, client logos, resources, blog posts, FAQs, pricing plans. Editing these in Sanity changes the live site with no deploy.
- Static fallbacks: `home-data.js`, `blog-data.js`, `service-data.js`, `data.js`. Hero/section copy written into the HTML files is not CMS-driven. To change it, edit the code and push.
- `siteSettings`, `navigation`, `page` exist in the schema, but the bridge doesn't read them yet.
- The sitemap/SEO (`scripts/generate-seo.js`) is built from static `blog-data.js`, not from Sanity. New Sanity posts are left out of the sitemap until that's changed.
- `npm run cms:import` runs `--replace` on production. Never run it without the user's explicit OK.
