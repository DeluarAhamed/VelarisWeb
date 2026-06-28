# Velaris Web Sanity CMS

This studio contains CMS collections for the Velaris Web marketing site:

- Blog posts
- Resources and lead magnets
- Case studies
- Services
- Testimonials
- Client logos
- SEO pages
- Playbook leads

## Setup

1. Create a Sanity project in the Sanity dashboard.
2. Copy `.env.example` to `.env`.
3. Add your real `SANITY_STUDIO_PROJECT_ID` and dataset.
4. Run `npm install` inside this `sanity` folder.
5. Run `npm run dev` to open the studio.

The current website is static. These schemas are ready for the next pass where the static arrays can be replaced with Sanity queries and deployed behind the public site.
