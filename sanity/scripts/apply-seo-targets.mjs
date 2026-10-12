// Applies data/seo-targets.json (titles, meta descriptions, H1s, keyword-led intros, SEO keywords)
// to the service and industry documents in Sanity, and mirrors it into the JSON fallbacks.
// Run from sanity/: npx sanity exec scripts/apply-seo-targets.mjs --with-user-token
import {readFileSync, writeFileSync} from 'node:fs'
import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2026-07-03'})
const targets = JSON.parse(readFileSync(new URL('../../data/seo-targets.json', import.meta.url), 'utf8'))

const tx = client.transaction()
const apply = (id, t) => tx.patch(id, (p) => p.set({
  heroHeadline: t.heroHeadline,
  intro: t.intro,
  'seo.metaTitle': t.metaTitle,
  'seo.metaDescription': t.metaDescription,
  'seo.keywords': t.keywords,
}))
for (const [slug, t] of Object.entries(targets.services)) apply(`service-${slug}`, t)
for (const [slug, t] of Object.entries(targets.industries)) apply(`industry-${slug}`, t)
const result = await tx.commit()
console.log(`Updated ${Object.keys(targets.services).length} services and ${Object.keys(targets.industries).length} industry pages. Transaction ${result.transactionId}`)

// Keep the build fallbacks in step with Sanity.
for (const [file, map] of [['service-pages.json', targets.services], ['industry-pages.json', targets.industries]]) {
  const url = new URL(`../../data/${file}`, import.meta.url)
  const rows = JSON.parse(readFileSync(url, 'utf8'))
  for (const row of rows) {
    const t = map[row.slug]
    if (!t) continue
    row.heroHeadline = t.heroHeadline
    row.intro = t.intro
    row.seo = {...(row.seo || {}), metaTitle: t.metaTitle, metaDescription: t.metaDescription, keywords: t.keywords}
  }
  writeFileSync(url, JSON.stringify(rows, null, 2) + '\n')
}
console.log('Updated data/service-pages.json and data/industry-pages.json')
