// Creates or replaces ONE industry page in Sanity from data/industry-pages.json, leaving the others untouched.
// Run from sanity/: npx sanity exec scripts/add-industry-page.mjs --with-user-token -- <slug>
import {readFileSync} from 'node:fs'
import {getCliClient} from 'sanity/cli'

const slug = process.argv[process.argv.length - 1]
const client = getCliClient({apiVersion: '2026-07-03'})
const d = JSON.parse(readFileSync(new URL('../../data/industry-pages.json', import.meta.url), 'utf8')).find((x) => x.slug === slug)
if (!d) throw new Error(`No industry page with slug "${slug}" in data/industry-pages.json`)

const services = await client.fetch('*[_type=="service" && !(_id in path("drafts.**"))]{_id,"slug":slug.current}')
const serviceId = Object.fromEntries(services.map((s) => [s.slug, s._id]))
const steps = (list, prefix) => list.map((s, i) => ({_key: `${prefix}${i}`, _type: 'processStep', title: s.title, description: s.description}))

const doc = await client.createOrReplace({
  _id: `industry-${d.slug}`,
  _type: 'industry',
  name: d.name,
  slug: {_type: 'slug', current: d.slug},
  hidden: false,
  orderRank: d.orderRank,
  accent: d.accent,
  audience: d.audience,
  audienceSingular: d.audienceSingular,
  heroHeadline: d.heroHeadline,
  shortDescription: d.shortDescription,
  intro: d.intro,
  painPoints: steps(d.painPoints, 'pain'),
  systems: steps(d.systems, 'sys'),
  example: d.example,
  recommendedPlan: d.recommendedPlan,
  relatedServices: d.relatedServices.filter((s) => serviceId[s]).map((s, i) => ({_key: `svc${i}`, _type: 'reference', _ref: serviceId[s]})),
  faqs: d.faqs.map((f, i) => ({_key: `faq${i}`, _type: 'industryFaq', question: f.question, answer: f.answer})),
  seo: {metaTitle: d.seo.metaTitle, metaDescription: d.seo.metaDescription, keywords: d.seo.keywords},
})
console.log(`Saved ${doc._id}`)
