import fs from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'
import {fileURLToPath} from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '../..')
const webApp = path.join(root, 'public/velaris-design-system/ui_kits/web-app')
const outDir = path.join(root, 'sanity/seed')
const outFile = path.join(outDir, 'velaris-content.ndjson')

const sandbox = {
  window: {},
  console,
  URLSearchParams,
  location: {search: ''},
  document: {},
}
sandbox.globalThis = sandbox
vm.createContext(sandbox)

for (const file of ['home-data.js', 'service-data.js', 'blog-data.js']) {
  const source = fs.readFileSync(path.join(webApp, file), 'utf8')
  vm.runInContext(source, sandbox, {filename: file})
}

const w = sandbox.window

const slugify = (value = '') =>
  String(value)
    .toLowerCase()
    .replace(/&amp;/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

const docId = (type, value) => `${type}-${slugify(value)}`
const clean = (value = '') =>
  String(value)
    .replace(/&amp;/g, '&')
    .replace(/Â£/g, '£')
    .replace(/â€”/g, '-')
    .replace(/â€“/g, '-')
    .replace(/â†’/g, '→')
    .replace(/â˜…/g, '★')
    .replace(/Ã—/g, 'x')
    .trim()

const ref = (_id) => ({_type: 'reference', _ref: _id})
const slug = (current) => ({_type: 'slug', current})
const arr = (value) => (Array.isArray(value) ? value : [])
const imagePath = (legacyPath, alt = '') => ({
  _type: 'imageWithAlt',
  alt: clean(alt),
  legacyPath,
})

const stat = (item) => ({
  _type: 'stat',
  value: clean(item?.[0] || item?.value || ''),
  label: clean(item?.[1] || item?.label || ''),
})

const processStep = (item) => ({
  _type: 'processStep',
  title: clean(item.t || item.title || ''),
  description: clean(item.d || item.description || ''),
  points: arr(item.points).map(clean),
})

const htmlToBlocks = (html = '') => {
  const body = String(html)
  const blocks = []
  const pattern = /<(h2|h3|p)[^>]*>([\s\S]*?)<\/\1>/gi
  let match
  while ((match = pattern.exec(body)) && blocks.length < 60) {
    const tag = match[1].toLowerCase()
    const text = clean(match[2].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' '))
    if (!text) continue
    blocks.push({
      _type: 'block',
      style: tag === 'p' ? 'normal' : tag,
      children: [{_type: 'span', text, marks: []}],
      markDefs: [],
    })
  }
  return blocks
}

const docs = []
const push = (doc) => docs.push(JSON.parse(JSON.stringify(doc)))

push({
  _id: 'siteSettings',
  _type: 'siteSettings',
  title: 'Velaris Web',
  siteUrl: 'https://velarisweb.vercel.app',
  logo: imagePath('home-img/velaris-logo.png', 'Velaris Web logo'),
  icon: imagePath('../../assets/velaris-app-icon.jpg', 'Velaris Web icon'),
  description:
    'Velaris Web designs conversion-focused websites, local SEO systems and growth assets that help founders generate more qualified leads.',
  primaryCta: {_type: 'cta', label: 'Book a Call', href: 'pricing.html', style: 'primary'},
  socialLinks: [
    {_type: 'link', label: 'LinkedIn', href: 'https://www.linkedin.com/in/deluar-ahamed/', openInNewTab: true},
  ],
  defaultSeo: {
    metaTitle: 'Velaris Web | Lead Generation Websites for B2B and B2C Founders',
    metaDescription:
      'Conversion-focused websites, local SEO and growth assets that help founders generate more qualified leads.',
  },
})

push({
  _id: 'navigation-header',
  _type: 'navigation',
  title: 'Header navigation',
  location: 'header',
  items: [
    {_type: 'link', label: 'Home', href: 'home-figma.html'},
    {_type: 'link', label: 'Services', href: 'services.html'},
    {_type: 'link', label: 'Case Studies', href: 'work.html'},
    {_type: 'link', label: 'Resources', href: 'resources.html'},
    {_type: 'link', label: 'Blog', href: 'blog.html'},
    {_type: 'link', label: 'About', href: 'about.html'},
  ],
})

const pageDocs = [
  ['page-home', 'Home', 'home', 'Helping B2B and B2C founders generate 10+ qualified leads every month.'],
  ['page-services', 'Services', 'services', 'Everything needed to attract and convert qualified customers.'],
  ['page-case-studies', 'Case Studies', 'case-studies', 'Real businesses, real qualified leads and premium website work.'],
  ['page-resources', 'Resources', 'resources', 'Free and premium tools for website conversion, SEO and lead generation.'],
  ['page-blog', 'Blog', 'blog', 'Website design, local SEO and lead generation insights.'],
  ['page-pricing', 'Pricing', 'pricing', 'Website, SEO and growth packages for founders.'],
  ['page-playbook', 'Playbook', 'playbook', 'Lead magnet landing page for Velaris Web resources.'],
  ['page-about', 'About', 'about', 'Meet Velaris Web and the team behind the work.'],
]
for (const [id, title, pageType, intro] of pageDocs) {
  push({
    _id: id,
    _type: 'page',
    title,
    slug: slug(title === 'Home' ? 'home' : slugify(title)),
    pageType,
    intro,
    sections: [],
    seo: {metaTitle: `${title} | Velaris Web`, metaDescription: intro},
  })
}

const authorId = 'author-deluar-ahamed'
push({
  _id: authorId,
  _type: 'author',
  name: 'Deluar Ahamed',
  slug: slug('deluar-ahamed'),
  role: 'Founder, Velaris Web',
  linkedinUrl: 'https://www.linkedin.com/in/deluar-ahamed/',
})

const categories = new Map()
for (const post of arr(w.VELARIS_POSTS)) {
  const title = clean(post.cat || 'Uncategorised')
  categories.set(title, {
    _id: docId('category', title),
    _type: 'category',
    title,
    slug: slug(slugify(title)),
  })
}
for (const doc of categories.values()) push(doc)

arr(w.VELARIS_SERVICES).forEach((service, index) => {
  const serviceSlug = service.slug || slugify(service.name)
  const procMap = w.VELARIS_SVC_PROCESS || {}
  const capMap = w.VELARIS_SVC_CAPS || {}
  push({
    _id: docId('service', serviceSlug),
    _type: 'service',
    name: clean(service.name),
    slug: slug(serviceSlug),
    orderRank: index + 1,
    tag: clean(service.tag),
    icon: service.icon,
    featured: Boolean(service.feat),
    shortDescription: clean(service.short),
    tagline: clean(service.tagline),
    intro: clean(service.intro),
    features: arr(service.feats).map(clean),
    includes: arr(service.includes).map(clean),
    process: arr(procMap[serviceSlug] || procMap._default).map(processStep),
    capabilities: arr(capMap[serviceSlug] || capMap._default).map((item) => ({
      _type: 'object',
      title: clean(item[0]),
      description: clean(item[1]),
    })),
    highlights: arr(service.highlights).map(stat),
    bestFor: clean(service.bestfor),
    deliverable: clean(service.deliverable),
    startingPrice: clean(service.startingPrice),
    heroImagePath: w.VELARIS_SVC_MEDIA?.[serviceSlug] || w.VELARIS_SVC_MEDIA?._default || '',
    seo: {
      metaTitle: `${clean(service.name)} | Velaris Web`,
      metaDescription: clean(service.short || service.intro).slice(0, 160),
    },
  })
})

arr(w.VELARIS_CASES).forEach((item) => {
  push({
    _id: docId('case-study', item.slug),
    _type: 'caseStudy',
    client: clean(item.client),
    slug: slug(item.slug),
    caseNumber: item.n,
    sector: clean(item.sector),
    industry: clean((item.sector || '').split('·').pop() || item.sector),
    projectClient: clean(item.projectClient || item.client),
    headline: clean(item.headline),
    summary: clean(item.summary),
    challenge: clean(item.challenge),
    approach: clean(item.approach),
    outcome: clean(item.outcome),
    liveUrl: item.live,
    featured: Boolean(item.featured),
    darkTheme: Boolean(item.dark),
    logoPath: item.logo,
    heroImagePath: item.img,
    galleryPaths: arr(item.gallery),
    pageScreenshots: arr(item.pages).map((page) => ({
      _type: 'pageScreenshot',
      title: clean(page.title),
      legacyPath: page.img,
    })),
    services: arr(item.services).map(clean),
    deliverables: arr(item.deliverables).map(clean),
    timeline: clean(item.timeline || 'From 1 week'),
    results: arr(item.stats).map(stat),
    quote: clean(item.quote),
    quoteAuthor: clean(item.author),
    quoteRole: clean(item.role),
    quoteAvatarPath: item.avatar,
    fonts: item.fonts || {},
    palette: arr(item.palette).map((hex, index) => ({_type: 'paletteColor', name: `Brand ${index + 1}`, hex})),
    seo: {
      metaTitle: `${clean(item.client)} Case Study | Velaris Web`,
      metaDescription: clean(item.summary).slice(0, 160),
    },
  })
})

arr(w.VELARIS_TESTIMONIALS).forEach((item, index) => {
  push({
    _id: docId('testimonial', index + 1),
    _type: 'testimonial',
    name: clean(item.author),
    role: clean(item.role),
    company: clean((item.role || '').split(',').pop()),
    quote: clean(item.quote),
    stars: item.stars || 5,
    avatarPath: item.avatar,
    featured: index < 5,
  })
})

arr(w.VELARIS_LOGOS).forEach((item) => {
  push({
    _id: docId('client-logo', item.name),
    _type: 'clientLogo',
    name: clean(item.name),
    logoPath: item.src,
  })
})

arr(w.VELARIS_RESOURCES).forEach((item) => {
  const current = slugify(item.title)
  push({
    _id: docId('resource', current),
    _type: 'resource',
    title: clean(item.title),
    slug: slug(current),
    resourceType: slugify(item.type),
    category: clean(item.cat),
    price: clean(item.price),
    description: clean(item.desc),
    coverImagePath: item.img,
    ctaLabel: clean(item.cta),
    featured: Boolean(item.featured),
    seo: {
      metaTitle: `${clean(item.title)} | Velaris Web`,
      metaDescription: clean(item.desc).slice(0, 160),
    },
  })
})

arr(w.VELARIS_PRICING).forEach((item, index) => {
  push({
    _id: docId('pricing-plan', item.name),
    _type: 'pricingPlan',
    name: clean(item.name),
    price: clean(item.price),
    period: clean(item.per),
    tagline: clean(item.tagline),
    features: arr(item.feats).map(clean),
    cta: {_type: 'cta', label: clean(item.cta), href: 'pricing.html#start', style: item.feat ? 'primary' : 'dark'},
    featured: Boolean(item.feat),
    orderRank: index + 1,
  })
})

arr(w.VELARIS_FAQS).forEach((item, index) => {
  push({
    _id: docId('faq', index + 1),
    _type: 'faq',
    question: clean(item.q),
    answer: clean(item.a),
    category: 'General',
    orderRank: index + 1,
  })
})

arr(w.VELARIS_POSTS).forEach((item) => {
  const current = item.slug || slugify(item.title)
  const catTitle = clean(item.cat || 'Uncategorised')
  push({
    _id: docId('post', current),
    _type: 'post',
    title: clean(item.title),
    slug: slug(current),
    category: ref(docId('category', catTitle)),
    categoryName: catTitle,
    targetKeyword: clean(item.kw),
    excerpt: clean(item.excerpt),
    coverGraphicKey: `${slugify(catTitle)}-${current}`,
    author: ref(authorId),
    authorName: 'Deluar Ahamed',
    publishedAt: item.date ? new Date(item.date).toISOString() : undefined,
    readTimeMinutes: Number(item.read) || undefined,
    body: htmlToBlocks(item.body),
    legacyHtmlBody: item.body,
    seo: {
      metaTitle: clean(item.title).slice(0, 60),
      metaDescription: clean(item.excerpt).slice(0, 160),
      keywords: [clean(item.kw), catTitle, 'Velaris Web', 'lead generation website'].filter(Boolean),
    },
  })
})

fs.mkdirSync(outDir, {recursive: true})
fs.writeFileSync(outFile, docs.map((doc) => JSON.stringify(doc)).join('\n') + '\n')
console.log(`Wrote ${docs.length} Sanity documents to ${path.relative(root, outFile)}`)
