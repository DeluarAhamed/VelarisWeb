// One-off migration (Oct 2026): create the 6 core service landing pages from data/service-pages.json
// and retire the older services (hidden, not deleted). Re-running overwrites edits made in the Studio.
// Run from sanity/: npx sanity exec scripts/migrate-service-pages.mjs --with-user-token
import {readFileSync} from 'node:fs'
import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2026-07-03'})
const services = JSON.parse(readFileSync(new URL('../../data/service-pages.json', import.meta.url), 'utf8'))

const cases = await client.fetch('*[_type=="caseStudy"]{_id,"slug":slug.current}')
const caseId = Object.fromEntries(cases.map((c) => [c.slug, c._id]))
const key = (prefix, i) => `${prefix}${i}`

const tx = client.transaction()
for (const s of services) {
  tx.createOrReplace({
    _id: `service-${s.slug}`,
    _type: 'service',
    name: s.name,
    slug: {_type: 'slug', current: s.slug},
    retired: false,
    orderRank: s.orderRank,
    icon: s.icon,
    accent: s.accent,
    featured: s.orderRank === 1,
    tagline: s.tagline,
    shortDescription: s.shortDescription,
    heroHeadline: s.heroHeadline,
    intro: s.intro,
    features: s.capabilities.slice(0, 3).map((c) => c.title),
    includes: s.includes,
    capabilities: s.capabilities.map((c, i) => ({_key: key('cap', i), title: c.title, description: c.description})),
    benefits: s.benefits.map((b, i) => ({_key: key('ben', i), _type: 'processStep', title: b.title, description: b.description})),
    process: s.process.map((p, i) => ({_key: key('step', i), _type: 'processStep', title: p.title, description: p.description})),
    faqs: s.faqs.map((f, i) => ({_key: key('faq', i), _type: 'serviceFaq', question: f.question, answer: f.answer})),
    relatedCases: s.relatedCases
      .filter((slug) => caseId[slug])
      .map((slug, i) => ({_key: key('rel', i), _type: 'reference', _ref: caseId[slug]})),
    seo: {metaTitle: s.seo.metaTitle, metaDescription: s.seo.metaDescription, keywords: s.seo.keywords},
  })
}

const keep = new Set(services.map((s) => s.slug))
const old = await client.fetch('*[_type=="service" && !(_id in path("drafts.**"))]{_id,"slug":slug.current}')
const retired = old.filter((d) => !keep.has(d.slug))
for (const d of retired) tx.patch(d._id, (p) => p.set({retired: true}))

const result = await tx.commit()
console.log(`Created/updated ${services.length} services; retired ${retired.length}: ${retired.map((d) => d.slug).join(', ')}`)
console.log(`Transaction ${result.transactionId}`)
