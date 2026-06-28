/* ============================================================================
   VELARIS WEB — SERVICE PAGE CMS DATA
   ----------------------------------------------------------------------------
   Drives the rich, musemind-structured service.html template. Everything here
   is content-only so the template scales: add/extend a service by editing data,
   never markup.

   PER-SERVICE (keyed by VELARIS_SERVICES slug):
     VELARIS_SVC_PROCESS  — 4 numbered steps, each with a checklist of points
     VELARIS_SVC_CAPS     — "what's included" capability cards [title, desc]
     VELARIS_SVC_MEDIA    — hero/visual Unsplash photo id

   GLOBAL (shared across every service page — edit once):
     VELARIS_SVC_BENEFITS — "why it works" benefit list
     VELARIS_INDUSTRIES   — industries we serve
     VELARIS_WHYUS        — why founders choose Velaris

   Any per-service map falls back to its `_default` entry, so a brand-new
   service renders a complete page even before bespoke content is written.
   ========================================================================== */

/* ---- PROCESS (per service · 4 steps, musemind-style with checklists) ---- */
window.VELARIS_SVC_PROCESS = {
  _default: [
    { t:"Discovery &amp; strategy", d:"We learn your business, audience and goals to define the strategy behind the work.",
      points:["Goals &amp; success metrics","Audience research","Competitor benchmarking","Scope &amp; milestones"] },
    { t:"Design &amp; plan", d:"We shape the approach around your customer journey and agree the direction with you.",
      points:["Structure &amp; direction","Concepts for review","Conversion focus","Sign-off"] },
    { t:"Build &amp; refine", d:"We craft and ship the work, keeping you updated and reviewing at every milestone.",
      points:["Production build","Responsive &amp; tested","SEO foundations","Quality review"] },
    { t:"Launch &amp; grow", d:"We launch carefully, measure results and keep optimising month after month.",
      points:["Safe launch","Analytics &amp; tracking","Iteration","Ongoing support"] }
  ],
  "brand-identity": [
    { t:"Discovery &amp; brand strategy", d:"We learn your business, audience and competitors to define a positioning that makes you the obvious choice.",
      points:["Brand audit","Audience &amp; market research","Competitor benchmarking","Positioning &amp; messaging"] },
    { t:"Concept &amp; direction", d:"We explore distinct visual directions and agree the one that best fits your story.",
      points:["Moodboards &amp; direction","Logo concepts","Type &amp; colour exploration","Direction sign-off"] },
    { t:"Identity design", d:"We craft the full identity system — logo, colour, type and the assets you'll use everywhere.",
      points:["Logo suite","Colour &amp; type system","Brand voice","Marketing templates"] },
    { t:"Guidelines &amp; handover", d:"We package everything into clear guidelines so your brand stays consistent as you grow.",
      points:["Brand guidelines","Asset export kit","Usage rules","Handover walkthrough"] }
  ],
  "conversion-uiux": [
    { t:"Discovery &amp; UX strategy", d:"We map your customer journey, goals and competitors to define the strategy behind every screen.",
      points:["Goals &amp; KPIs","User journeys","Competitor teardown","Conversion strategy"] },
    { t:"Wireframes &amp; prototyping", d:"We structure each page around how people actually decide — tested before a pixel of polish.",
      points:["Information architecture","Low-fi wireframes","Interactive prototype","Usability review"] },
    { t:"High-fidelity design", d:"We design conversion-focused, on-brand screens with copy that guides visitors to act.",
      points:["Visual design","Conversion copywriting","Trust &amp; social proof","Design system"] },
    { t:"Test &amp; handover", d:"We validate the design, refine the weak points and hand over a build-ready system.",
      points:["Usability testing","A/B-ready variants","Dev-ready handoff","Iteration plan"] }
  ],
  "custom-development": [
    { t:"Architecture &amp; planning", d:"We plan a clean, scalable architecture and choose the tech that fits your goals and budget.",
      points:["Stack &amp; approach","Content model","Performance budget","SEO foundations"] },
    { t:"Build &amp; integrate", d:"We hand-write fast, semantic code and wire up the tools your business runs on.",
      points:["Custom front-end","CMS integration","Forms &amp; analytics","Third-party tools"] },
    { t:"Optimise &amp; test", d:"We tune Core Web Vitals and test across every device until it's flawless.",
      points:["Core Web Vitals","Cross-device QA","Accessibility checks","Speed tuning"] },
    { t:"Launch &amp; support", d:"We ship safely with redirects and monitoring, then keep the site healthy.",
      points:["Safe launch &amp; redirects","Monitoring","Documentation","Ongoing support"] }
  ],
  "webflow-development": [
    { t:"Plan &amp; structure", d:"We map your CMS collections and page structure so the site is easy to manage and scale.",
      points:["CMS planning","Sitemap","Collection schema","SEO setup"] },
    { t:"Design in Webflow", d:"We build a custom, designer-grade Webflow site — not a marketplace template.",
      points:["Custom design build","Responsive layouts","Interactions &amp; motion","Component classes"] },
    { t:"CMS &amp; integrations", d:"We wire up blog, cases and services as editable collections plus your tools.",
      points:["CMS collections","Forms &amp; integrations","Search &amp; filtering","On-page SEO"] },
    { t:"Train &amp; launch", d:"We launch, then train your team so you can publish without a developer.",
      points:["Editor training","Launch &amp; hosting","Documentation","Handover"] }
  ],
  "framer-development": [
    { t:"Plan &amp; motion strategy", d:"We define the structure and the motion language that makes your launch feel premium.",
      points:["Sitemap","Motion direction","Content model","SEO plan"] },
    { t:"Design &amp; animate", d:"We craft a striking, animated Framer site built to launch fast.",
      points:["Custom design","Advanced interactions","Responsive build","Component system"] },
    { t:"CMS &amp; polish", d:"We add editable CMS content and refine every transition.",
      points:["CMS collections","Interaction polish","Performance pass","On-page SEO"] },
    { t:"Launch &amp; handover", d:"We ship quickly and hand over an editable, animated site.",
      points:["Launch &amp; hosting","Editor training","Documentation","Handover"] }
  ],
  "ai-web-development": [
    { t:"Discovery &amp; AI scoping", d:"We define where AI accelerates the build and where an on-site assistant adds value.",
      points:["Goals &amp; use-cases","Assistant scope","Content model","SEO plan"] },
    { t:"AI-accelerated build", d:"We use Claude across design and build to ship faster, with human review at every step.",
      points:["AI-assisted design","Rapid front-end build","Human QA","Brand consistency"] },
    { t:"Assistant &amp; automation", d:"We add an optional assistant that qualifies leads and answers questions 24/7.",
      points:["On-site AI chat","Lead qualification","Routing &amp; handoff","Guardrails &amp; tone"] },
    { t:"Launch &amp; optimise", d:"We launch, monitor the assistant and keep improving its answers.",
      points:["Safe launch","Monitoring","Answer tuning","Ongoing support"] }
  ],
  "seo-optimization": [
    { t:"Audit &amp; research", d:"We audit your site health and map the high-intent keywords your customers search.",
      points:["Technical audit","Keyword research","Competitor analysis","Local SEO audit"] },
    { t:"On-page &amp; technical", d:"We fix the foundations and optimise every page to rank and convert.",
      points:["Technical fixes","On-page optimisation","Structured data","Site speed"] },
    { t:"Content &amp; local", d:"We build content and local signals that target buyers ready to act.",
      points:["Content that ranks","Google Business Profile","Local citations","Internal linking"] },
    { t:"Report &amp; iterate", d:"We track rankings and double down on what's driving traffic and leads.",
      points:["Rank tracking","Monthly reporting","Iteration","Growth roadmap"] }
  ],
  "cold-email-marketing": [
    { t:"Setup &amp; deliverability", d:"We warm domains and configure infrastructure so your email lands in the inbox.",
      points:["Domain warm-up","SPF / DKIM / DMARC","Inbox placement","Sending limits"] },
    { t:"Targeting &amp; lists", d:"We build accurate, targeted prospect lists that match your ideal customer.",
      points:["ICP definition","List building","Verification","Segmentation"] },
    { t:"Copy &amp; sequences", d:"We write high-reply copy and multi-step sequences that start conversations.",
      points:["Cold email copy","Follow-up sequences","A/B testing","Personalisation"] },
    { t:"Run &amp; report", d:"We manage sending, handle replies and report on booked meetings.",
      points:["Campaign management","Reply handling","Reporting","Optimisation"] }
  ]
};

/* ---- CAPABILITIES (per service · "what's included" cards [title, desc]) ---- */
window.VELARIS_SVC_CAPS = {
  _default: [
    ["Strategy &amp; planning","A clear plan scoped to your goals before any work begins."],
    ["Design &amp; build","Considered, on-brand execution at every step."],
    ["Conversion focus","Every decision aimed at turning visitors into leads."],
    ["SEO foundations","Built to be found by the customers you want."],
    ["Testing &amp; QA","Refined and tested until it's right."],
    ["Handover &amp; support","Documented, editable and supported after launch."]
  ],
  "brand-identity": [
    ["Logo &amp; visual identity","A primary logo, variations and marks designed to work everywhere from favicon to billboard."],
    ["Colour &amp; typography system","A flexible palette and type scale that keeps every touchpoint unmistakably you."],
    ["Brand voice &amp; messaging","Clear positioning, tagline and tone so your words sound as considered as your visuals."],
    ["Brand guidelines","A practical rulebook your team and partners can follow to stay on-brand."],
    ["Marketing templates","Ready-to-use social, slide and document templates so launch day is effortless."],
    ["Asset handover kit","Every file, format and export organised and ready for web, print and social."]
  ],
  "conversion-uiux": [
    ["UX strategy &amp; journeys","Every page mapped to a real customer decision, not a template."],
    ["Wireframes to hi-fi","From low-fidelity structure to pixel-perfect, on-brand screens."],
    ["Conversion copywriting","Headlines and CTAs written to build trust and drive action."],
    ["Trust &amp; social proof","Reviews, logos and proof placed exactly where doubt creeps in."],
    ["Design system &amp; components","A reusable component library so the site stays consistent as it grows."],
    ["Usability &amp; conversion testing","We test with real users and refine what isn't converting."]
  ],
  "custom-development": [
    ["Custom front-end build","Hand-coded, semantic markup with zero template bloat slowing you down."],
    ["Core Web Vitals tuning","Engineered to pass Google's performance metrics and load in under a second."],
    ["Fully responsive","Pixel-tested across phones, tablets and desktops, not just resized."],
    ["Technical SEO foundations","Clean markup, structured data and speed that search engines reward."],
    ["CMS-ready structure","A content model your team can edit without breaking the design."],
    ["Analytics &amp; tracking","Conversion and event tracking wired in from day one."]
  ],
  "webflow-development": [
    ["Custom Webflow build","A bespoke design built properly in Webflow — fast, clean and yours."],
    ["CMS collections","Blog, case studies and services as collections you edit yourself."],
    ["Interactions &amp; animation","Tasteful motion that adds polish without hurting performance."],
    ["On-page &amp; technical SEO","Meta, structured data and speed configured to rank from launch."],
    ["Editor training","A walkthrough so your team can publish confidently, no code needed."],
    ["Hosting &amp; launch support","We handle domains, hosting and a smooth go-live."]
  ],
  "framer-development": [
    ["Custom Framer build","A beautiful, motion-rich site built fast without sacrificing polish."],
    ["Advanced interactions","Scroll, hover and page transitions that feel genuinely premium."],
    ["CMS for blog &amp; cases","Editable collections so content stays fresh after launch."],
    ["Responsive across devices","Smooth and fast on every screen size, not just desktop."],
    ["SEO &amp; performance setup","Configured to load quickly and rank from day one."],
    ["Editor training &amp; handover","You leave able to edit and grow the site yourself."]
  ],
  "ai-web-development": [
    ["AI-accelerated build","Claude across our process ships your site up to 2× faster, quality intact."],
    ["On-site AI assistant","An optional chat assistant that answers questions around the clock."],
    ["Lead qualification &amp; routing","The assistant qualifies enquiries and routes them to you instantly."],
    ["AI-assisted SEO content","Drafts and outlines generated fast, then refined by humans to rank."],
    ["Faster turnaround","Compressed timelines without the corner-cutting."],
    ["Human-reviewed quality","Every AI output is checked by a designer before it ships."]
  ],
  "seo-optimization": [
    ["Local SEO &amp; GBP","Map-pack rankings and an optimised Google Business Profile that wins clicks."],
    ["Technical SEO &amp; health","A fast, crawlable, error-free site search engines trust."],
    ["Keyword research &amp; mapping","The exact high-intent terms your customers search, mapped to pages."],
    ["On-page optimisation","Titles, meta, headings and structure tuned to rank."],
    ["Content that ranks","Articles engineered around real search intent, not filler."],
    ["Monthly reporting","Clear reports on rankings, traffic and the leads they drive."]
  ],
  "cold-email-marketing": [
    ["Deliverability setup","Domain warm-up and authentication so you land in the inbox, not spam."],
    ["Targeted prospect lists","Accurate, verified lists matched to your ideal customer profile."],
    ["High-reply copy","Cold email written to start genuine conversations, not get deleted."],
    ["Nurture sequences","Multi-step follow-ups that turn interest into booked calls."],
    ["List segmentation","The right message to the right segment at the right time."],
    ["Reply handling &amp; reporting","We manage responses and report on meetings booked."]
  ]
};

/* ---- HERO / VISUAL MEDIA (per service · Unsplash photo id) ---- */
window.VELARIS_SVC_MEDIA = {
  _default:               "photo-1467232004584-a241de8bcf5d",
  "brand-identity":       "photo-1626785774573-4b799315345d",
  "conversion-uiux":      "photo-1467232004584-a241de8bcf5d",
  "custom-development":    "photo-1461749280684-dccba630e2f6",
  "webflow-development":   "photo-1547658719-da2b51169166",
  "framer-development":    "photo-1517077304055-6e89abbf09b0",
  "ai-web-development":    "photo-1620712943543-bcc4688e7485",
  "seo-optimization":      "photo-1460925895917-afdab827c52f",
  "cold-email-marketing":  "photo-1596526131083-e8c633c948d2"
};

/* ---- BENEFITS (global · "why it works") ---- */
window.VELARIS_SVC_BENEFITS = [
  { t:"Built to convert, not just look good",
    d:"Every decision is made to turn visitors into qualified leads — design with a commercial job to do.",
    points:["Conversion-led design","Trust signals built in","Clear calls to action","Measurable results"] },
  { t:"A partner across the whole funnel",
    d:"From brand and site to SEO and outreach, it's one team owning the path from stranger to booked call.",
    points:["Brand to leads in-house","Joined-up strategy","One point of contact","No finger-pointing"] },
  { t:"A founder-friendly process",
    d:"Clear milestones, plain English and regular updates — you always know exactly what's happening.",
    points:["Clear timelines","Regular check-ins","No jargon","You stay in control"] },
  { t:"Built to scale with you",
    d:"CMS-ready, well-documented work you can edit and grow long after launch day.",
    points:["CMS-ready foundations","Documented handover","Easy to edit","Ongoing support available"] }
];

/* ---- INDUSTRIES (global) ---- */
window.VELARIS_INDUSTRIES = [
  { name:"Healthcare &amp; clinics",     desc:"Booking-focused sites that build trust and fill the calendar." },
  { name:"Property &amp; lettings",      desc:"Modern, credible sites for agents, landlords and developers." },
  { name:"Professional services",   desc:"Authority-building sites for firms that sell expertise." },
  { name:"B2B &amp; SaaS",               desc:"Clear narratives that turn complex products into demos." },
  { name:"Finance &amp; investment",     desc:"Institutional-grade presence that signals credibility." },
  { name:"Local &amp; service business", desc:"Local-SEO-led sites that get you found and booked." }
];

/* ---- WHY VELARIS (global) ---- */
window.VELARIS_WHYUS = [
  { t:"Conversion-obsessed", d:"We design for booked calls and qualified leads, not vanity metrics." },
  { t:"Full-funnel team",    d:"Brand, design, build, SEO and outreach under one roof." },
  { t:"Built to rank",       d:"Technical and local SEO engineered in from the first line." },
  { t:"Fast, premium builds",d:"Custom, Webflow or Framer — shipped quickly without cutting quality." },
  { t:"Truly yours",         d:"CMS-ready, documented work you fully own and can edit." },
  { t:"Real partnership",    d:"Clear communication and support that continues after launch." }
];
