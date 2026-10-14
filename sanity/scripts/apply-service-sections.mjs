// Applies in-depth sections and extra FAQs from data/service-longform.json to service docs.
// Re-runnable: sections are replaced, FAQs are only added when the question is not already there.
// Run from sanity/: npx sanity exec scripts/apply-service-sections.mjs --with-user-token
import {readFileSync} from 'node:fs'
import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2026-07-03'})
const data = JSON.parse(readFileSync(new URL('../../data/service-longform.json', import.meta.url), 'utf8'))

for (const [slug, d] of Object.entries(data)) {
  if (slug.startsWith('_')) continue
  const doc = await client.fetch('*[_type=="service" && slug.current==$slug && !(_id in path("drafts.**"))][0]{_id,faqs}', {slug})
  if (!doc) { console.warn(`No service "${slug}"`); continue }
  const have = new Set((doc.faqs || []).map((f) => f.question))
  const extra = (d.faqs || []).filter((f) => !have.has(f.question))
    .map((f, i) => ({_key: `lf${Date.now().toString(36)}${i}`, _type: 'serviceFaq', question: f.question, answer: f.answer}))
  await client.patch(doc._id)
    .set({
      sectionsHeading: d.sectionsHeading,
      sections: d.sections.map((s, i) => ({_key: `sec${i}`, _type: 'serviceSection', heading: s.heading, body: s.body})),
      faqs: [...(doc.faqs || []), ...extra],
    })
    .commit()
  console.log(`${slug}: ${d.sections.length} sections, +${extra.length} FAQs`)
}
