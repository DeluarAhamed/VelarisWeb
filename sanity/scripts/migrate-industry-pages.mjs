// One-off migration (Oct 2026): create the industry landing pages (/solutions/<slug>) from data/industry-pages.json.
// Re-running overwrites edits made in the Studio.
// Run from sanity/: npx sanity exec scripts/migrate-industry-pages.mjs --with-user-token
import {readFileSync} from 'node:fs'
import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2026-07-03'})
const industries = JSON.parse(readFileSync(new URL('../../data/industry-pages.json', import.meta.url), 'utf8'))

const services = await client.fetch('*[_type=="service" && !(_id in path("drafts.**"))]{_id,"slug":slug.current}')
const serviceId = Object.fromEntries(services.map((s) => [s.slug, s._id]))
const steps = (list, prefix) => list.map((s, i) => ({_key: `${prefix}${i}`, _type: 'processStep', title: s.title, description: s.description}))

const tx = client.transaction()
for (const d of industries) {
  tx.createOrReplace({
    _id: `industry-${d.slug}`,
    _type: 'industry',
    name: d.name,
    slug: {_type: 'slug', current: d.slug},
    hidden: false,
    orderRank: d.orderRank,
    accent: d.accent,
    heroHeadline: d.heroHeadline,
    shortDescription: d.shortDescription,
    intro: d.intro,
    painPoints: steps(d.painPoints, 'pain'),
    systems: steps(d.systems, 'sys'),
    example: d.example,
    recommendedPlan: d.recommendedPlan,
    relatedServices: d.relatedServices
      .filter((slug) => serviceId[slug])
      .map((slug, i) => ({_key: `svc${i}`, _type: 'reference', _ref: serviceId[slug]})),
    faqs: d.faqs.map((f, i) => ({_key: `faq${i}`, _type: 'industryFaq', question: f.question, answer: f.answer})),
    seo: {metaTitle: d.seo.metaTitle, metaDescription: d.seo.metaDescription, keywords: d.seo.keywords},
  })
}
const result = await tx.commit()
console.log(`Created/updated ${industries.length} industry pages. Transaction ${result.transactionId}`)
