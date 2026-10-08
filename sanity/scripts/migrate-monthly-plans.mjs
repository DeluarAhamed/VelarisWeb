// One-off migration: move Sanity pricing content to the monthly-plan model (Oct 2026).
// Run from sanity/: npx sanity exec scripts/migrate-monthly-plans.mjs --with-user-token
import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2026-07-03'})

const cta = (label, style) => ({_type: 'cta', href: '/pricing#plans', label, style})

const tx = client
  .transaction()
  .patch('faq-1', (p) =>
    p.set({
      answer:
        "You'll see a first preview of your website within 5 business days of your kickoff call. Most sites launch within 2–3 weeks, and larger custom builds get a clear timeline at kickoff.",
    }),
  )
  .patch('faq-2', (p) =>
    p.set({
      answer:
        "There's no big upfront cost. Websites are on monthly plans: Starter £149/month, Growth £299/month and Scale from £549/month, covering design, hosting, updates and SEO. No setup fee and no long-term contract. One-off projects are also available on request.",
    }),
  )
  .patch('pricing-plan-starter', (p) =>
    p.set({
      price: '£149',
      period: 'month',
      tagline: 'Get online fast with a professional site that builds trust.',
      features: [
        'Custom website, up to 5 pages',
        'Hosting, domain, SSL & security',
        '1 business email',
        '5 content updates a month',
        'SEO setup & analytics',
      ],
      cta: cta('Choose Starter', 'dark'),
    }),
  )
  .patch('pricing-plan-growth', (p) =>
    p.set({
      price: '£299',
      period: 'month',
      tagline: 'For founders who want the website and LinkedIn to bring in clients.',
      features: [
        'Everything in Starter',
        'Premium design, up to 12 pages',
        'Unlimited content updates',
        '2 SEO blog posts a month',
        'Google Business Profile optimisation',
        'LinkedIn profile positioning',
        'Booking & CRM integration',
      ],
      cta: cta('Choose Growth', 'primary'),
    }),
  )
  .patch('pricing-plan-scale', (p) =>
    p.set({
      price: 'From £549',
      period: 'month',
      tagline: 'Your full digital team for custom builds, SEO and automation.',
      features: [
        'Everything in Growth',
        'Custom development & integrations',
        'SEO strategy & reporting',
        'AI chatbot or automation',
        'Dedicated account manager',
      ],
      cta: cta('Book a scoping call', 'dark'),
    }),
  )

const result = await tx.commit()
console.log(`Updated ${result.results.length} documents:`, result.results.map((r) => r.id).join(', '))
