// One-off migration: switch Sanity plan pricing to USD and the expanded feature lists (Oct 2026).
// Run from sanity/: npx sanity exec scripts/migrate-usd-plans.mjs --with-user-token
import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2026-07-03'})

const cta = (label, style) => ({_type: 'cta', href: 'https://wa.me/8801989570693', label, style})

const result = await client
  .transaction()
  .patch('faq-2', (p) =>
    p.set({
      answer:
        "There's no big upfront cost. Websites are on monthly plans: Starter $199/month, Growth $399/month and Scale from $699/month, covering design, hosting, business email, listings, updates and SEO. No setup fee and no long-term contract. One-off projects are also available on request.",
    }),
  )
  .patch('pricing-plan-starter', (p) =>
    p.set({
      price: '$199',
      period: 'month',
      tagline: 'Get online fast and start getting found.',
      features: [
        'Custom website, up to 5 pages',
        'Domain, hosting, SSL & security',
        '1 business email',
        'ADA / accessibility compliant',
        '10 content updates a month',
        'SEO setup & Google Search Console',
        'Google Maps & Apple Maps listing',
        'Analytics & uptime monitoring',
        'Basic e-commerce (up to 10 products)',
      ],
      cta: cta('Get started', 'dark'),
    }),
  )
  .patch('pricing-plan-growth', (p) =>
    p.set({
      price: '$399',
      period: 'month',
      tagline: 'Everything you need to outrank local competitors.',
      features: [
        'Everything in Starter',
        'Premium custom design, up to 15 pages',
        '3 business emails',
        'Unlimited content updates',
        'On-page SEO & 2 blog posts a month',
        'Google Business Profile management',
        'Listings on 20+ directories',
        'Booking & CRM systems',
        'Fully customised e-commerce',
        'LinkedIn profile positioning',
        'Monthly analytics report & priority support',
      ],
      cta: cta('Get started', 'primary'),
    }),
  )
  .patch('pricing-plan-scale', (p) =>
    p.set({
      price: 'From $699',
      period: 'month',
      tagline: 'Your full digital team, on demand.',
      features: [
        'Everything in Growth',
        'Unlimited pages',
        'Custom software & web app development',
        '5 business emails',
        'Custom SEO strategy & execution',
        'AI chatbot or workflow automation',
        'Conversion optimisation & A/B testing',
        'Dedicated account manager & same-day support',
      ],
      cta: cta('Get started', 'dark'),
    }),
  )
  .commit()

console.log(`Updated ${result.results.length} documents:`, result.results.map((r) => r.id).join(', '))
