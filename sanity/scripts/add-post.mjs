// Creates or replaces ONE blog post in Sanity from data/blog-posts.json (HTML body), leaving the others untouched.
// Run from sanity/: npx sanity exec scripts/add-post.mjs --with-user-token -- <slug>
// Remember to add the slug to indexedPosts in data/seo-targets.json so it is indexed and listed.
import {readFileSync} from 'node:fs'
import {getCliClient} from 'sanity/cli'

const slug = process.argv[process.argv.length - 1]
const client = getCliClient({apiVersion: '2026-07-03'})
const p = JSON.parse(readFileSync(new URL('../../data/blog-posts.json', import.meta.url), 'utf8')).find((x) => x.slug === slug)
if (!p) throw new Error(`No post with slug "${slug}" in data/blog-posts.json`)

const doc = await client.createOrReplace({
  _id: `post-${p.slug}`,
  _type: 'post',
  title: p.title,
  slug: {_type: 'slug', current: p.slug},
  category: {_type: 'reference', _ref: p.category},
  categoryName: p.categoryName,
  targetKeyword: p.targetKeyword,
  excerpt: p.excerpt,
  coverGraphicKey: `${p.categoryName.toLowerCase().replace(/\s+/g, '-')}-${p.slug}`,
  author: {_type: 'reference', _ref: 'author-deluar-ahamed'},
  authorName: 'Deluar Ahamed',
  publishedAt: p.publishedAt,
  readTimeMinutes: p.readTimeMinutes,
  legacyHtmlBody: p.body,
  seo: {metaTitle: p.seo.metaTitle, metaDescription: p.seo.metaDescription, keywords: p.seo.keywords},
})
console.log(`Saved ${doc._id}`)
