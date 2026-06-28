/* ============================================================================
   VELARIS WEB — Site CMS content (home + all detail pages).
   Every array maps 1:1 to a CMS collection. Detail pages (service.html?s=,
   case.html?c=) render straight from these objects. Blog posts: blog-data.js.
   ========================================================================== */

/* ---- HERO CASE-STUDY SLIDER (image on top, headline below — clickable) ---- */
window.VELARIS_HERO_SLIDES = [
  {client:"Coastal Crest Lettings", tag:"B2C · Property", img:"home-img/dev-coastal.png",
   headline:"Lettings Made Simple, Transparent & Stress-Free",
   blurb:"A fresh, modern lettings website built exactly to brief — bringing a 20-year, family-run property business online with clarity and trust.",
   href:"case.html?c=coastal"},
  {client:"Hazelwood Hearcare", tag:"B2C · Local Healthcare", img:"home-img/dev-hazelwood.jpg",
   headline:"How Hazelwood Generated 60+ Qualified Leads in 30 Days",
   blurb:"We redesigned their digital experience with a conversion-focused website, SEO optimization and a trust-driven structure — helping generate 300+ Google reviews and over £30K in revenue.",
   href:"case.html?c=hazelwood"},
  {client:"Bellavista Investments", tag:"B2B · Private Equity", img:"home-img/dev-bellavista.jpg",
   headline:"An Institutional-Grade Website for a Capital Firm",
   blurb:"A disciplined, credible presence that matches the calibre of their deals — built to win the trust of investors, founders and business owners.",
   href:"case.html?c=bellavista"},
  {client:"Core Mechanical Design", tag:"B2B · Engineering", img:"home-img/dev-core.jpg",
   headline:"From Concept to Product — A Premium Engineering Presence",
   blurb:"A confident, editorial website showcasing deep technical work and positioning the consultancy as the obvious premium choice for serious product teams.",
   href:"case.html?c=core"},
  {client:"Menstruacion", tag:"B2C · Femtech", img:"home-img/dev-menstruation.jpg",
   headline:"A Warm, Trusted Health Resource for Parents & Teens",
   blurb:"A reassuring, expert-led experience that parents actually feel comfortable using — pairing sensitive design with a research-backed content hub.",
   href:"case.html?c=menstruation"},
  {client:"Navasana", tag:"B2B · AI Cyber Insurance", img:"home-img/dev-navasana.jpg",
   headline:"Clarity & Credibility for a Complex AI Cyber Platform",
   blurb:"We translated a complex, technical product into a clear, credible brand experience that turns enterprise visitors into qualified demo requests.",
   href:"case.html?c=navasana"}
];

/* ---- CLIENT LOGOS (marquee) ---- */
window.VELARIS_LOGOS = [
  {name:"Hazelwood Hearcare", src:"home-img/logo-hazelwood.png"},
  {name:"Navasana", src:"home-img/logo-navasana.png"},
  {name:"Core Mechanical Design", src:"home-img/logo-core.png"},
  {name:"Coastal Crest Lettings", src:"home-img/logo-coastal.png"},
  {name:"Bellavista Investments", src:"home-img/logo-bellavistra.png"},
  {name:"Menstruacion", src:"home-img/logo-menstruation.png"}
];

/* ---- CASE STUDIES (full CMS — drives home cards AND case.html?c=) ---- */
window.VELARIS_TESTIMONIALS = [
  {quote:"I highly recommend Deluar. I just had my logo updated and couldn't be happier with the result. The work was clean, professional, and delivered exactly what I was looking for. Communication was clear throughout, turnaround was fast, and the final product hit the mark on the first pass.",
   stars:5, author:"David Scarborough", role:"Founder, Strategic Marketing (USA)", avatar:"home-img/david.jpg", url:""},
  {quote:"Imagine a website that's not performing, only one poorly visible CTA and poorly designed! Well Ahamed is the man for the job — he completely transformed my patient booking system with seamless integration, using advanced design software for each landing page to improve the user experience. Drop him a message for your business!",
   stars:5, author:"Rizwan Makda", role:"Founder, Hazelwood Hearcare (UK)", avatar:"home-img/rizwan.png", url:"https://www.hazelwoodhearcare.com/"},
  {quote:"Ahamed was great to work with. From start to finish during the project, he was patient and helpful, ensuring that the finished website was exactly what I wanted. He is an exciting designer with fresh ideas, and I would highly recommend him. I would be keen to work with him again.",
   stars:5, author:"Rupert", role:"Business Owner, UK", avatar:"home-img/logo-coastal.png", avatarLogo:true, url:"https://www.coastalcrestlettings.co.uk/"},
  {quote:"I trusted Ahamed Deluar with my website and he didn't disappoint me — in fact he did a really good job with my website creativibes.co and I'm glad I gave him the job.",
   stars:5, author:"Charaf Zaoudi", role:"CEO &amp; Founder, CREATIVIBE", avatar:"home-img/client-2.png", url:"https://creativibes.co"},
  {quote:"I highly recommend Ahamed for any role involving UI/UX design, web development or mobile app creation. His ability to blend user-centered design with smart technical execution is outstanding — he has a sharp eye for detail and consistently delivers designs that are both beautiful and functional. A proactive problem-solver, great communicator and a true team player.",
   stars:5, author:"Shafi Uddin", role:"Senior Software QA Engineer (USA)", avatar:"home-img/shafi.jpg", url:""}
];

window.VELARIS_CASES = [
  {
    slug:"hazelwood", n:"01", client:"Hazelwood Hearcare", sector:"B2C · Local Healthcare",
    logo:"home-img/logo-hazelwood.png", logoInvert:false, dark:false, featured:true,
    fonts:{ui:"Work Sans", display:"Work Sans"},
    title:["From ","invisible"," to fully ","booked"],
    headline:"How Hazelwood Generated 60+ Qualified Leads in 30 Days",
    summary:"A complete rebuild — new positioning, conversion-focused UX and local SEO — took Hazelwood from zero inbound to a booked calendar in under 30 days.",
    img:"home-img/dev-hazelwood.jpg", gallery:["home-img/dev-hazelwood.jpg","home-img/hazelwood-before-after.png","home-img/portfolio-hazelwood.png"], live:"https://www.hazelwoodhearcare.com/",
    pages:[
      {title:"Home", img:"home-img/hazelwood-pages/home-desktop.png"},
      {title:"About Us", img:"home-img/hazelwood-pages/about-us-desktop.png"},
      {title:"Locations", img:"home-img/hazelwood-pages/locations-desktop.png"}
    ],
    services:["Logo & Brand Design","UI/UX Design","Webflow Development","Local SEO","Social Media Management"],
    deliverables:["Logo & Brand Design","UI/UX Design","Webflow Development","Launch & SEO"],
    stats:[["60+","Bookings in 30 days"],["300+","Google reviews"],["£30K","Revenue in 6 months"]],
    challenge:"Hazelwood's old site was barely visible on Google, had a single poorly-placed call-to-action and a confusing booking flow — so qualified enquiries simply weren't coming in.",
    approach:"We rebuilt the experience around the patient journey: clear positioning, a frictionless 'Book an appointment' path on every screen, trust signals (reviews, accreditations) up front, and local SEO targeting high-intent 'near me' searches across their service areas.",
    outcome:"Within the first 30 days the new site generated more enquiries than the old one had in a year, backed by 300+ Google reviews and a fully booked calendar.",
    quote:"Ahamed completely transformed my patient booking system with seamless integration, using advanced design for each landing page to improve the user experience. Drop him a message for your business!",
    author:"Rizwan Makda", role:"Founder, Hazelwood Hearcare", avatar:"home-img/rizwan.png"
  },
  {
    slug:"navasana", n:"02", client:"Navasana", sector:"B2B · AI Cyber Insurance",
    logo:"home-img/logo-navasana.png", logoInvert:true, dark:true, featured:true,
    fonts:{ui:"Roboto", display:"Montserrat"},
    title:["A modern experience for an ","AI cyber insurance"," platform"],
    headline:"Clarity & Credibility for a Complex AI Cyber Platform",
    summary:"We translated a complex, technical product into a clear, credible brand experience that turns enterprise visitors into qualified demo requests.",
    img:"home-img/dev-navasana.jpg", gallery:["home-img/dev-navasana.jpg"], live:"https://www.navasana.ai/",
    pages:[
      {title:"Home", img:"home-img/navasana-pages/home.png"},
      {title:"Cyber Insurance", img:"home-img/navasana-pages/cyber-insurance.png"},
      {title:"Broker", img:"home-img/navasana-pages/broker.png"},
      {title:"Policy Holder", img:"home-img/navasana-pages/policy-holder.png"},
      {title:"About Us", img:"home-img/navasana-pages/about-us.png"},
      {title:"Contact & Careers", img:"home-img/navasana-pages/contact-careers.png"}
    ],
    services:["UI/UX Design","Web Design"],
    deliverables:["UI/UX Design","Web Design","Responsive Page Design","Design System"],
    stats:[["Clear","Product narrative"],["Demo-ready","Conversion paths"],["Enterprise","-grade credibility"]],
    challenge:"Navasana's AI cyber-insurance product is genuinely complex. The previous site buried the value proposition in jargon, so technical buyers bounced before requesting a demo.",
    approach:"We built a clear narrative — problem, product, proof — with technical-yet-human copy, a credible visual system, and demo CTAs placed at each decision point. Performance and on-page SEO were engineered in from the first line of code.",
    outcome:"The redesign turned a jargon-heavy product into a clear, credible narrative — giving enterprise buyers an obvious path to request a demo at each decision point.",
    quote:"", author:"", role:"", avatar:""
  },
  {
    slug:"core", n:"03", client:"Core Mechanical Design", sector:"B2B · Engineering",
    logo:"home-img/logo-core.png", logoInvert:false, dark:false, featured:true,
    fonts:{ui:"Satoshi", display:"General Sans"},
    title:["Unified design &amp; engineering, ","concept to product"],
    headline:"From Concept to Product — A Premium Engineering Presence",
    summary:"A confident, editorial site that showcases deep technical work and positions the consultancy as the obvious premium choice for serious product teams.",
    img:"home-img/dev-core.jpg", gallery:["home-img/dev-core.jpg","home-img/core-alt.png"], live:"https://coremech.design/",
    pages:[
      {title:"Home", img:"home-img/core-pages/home.jpg"},
      {title:"About Us", img:"home-img/core-pages/about-us.jpg"},
      {title:"Our Services", img:"home-img/core-pages/services.jpg"},
      {title:"Portfolio", img:"home-img/core-pages/portfolio.jpg"},
      {title:"3-Piece Alloy Wheels", img:"home-img/core-pages/portfolio-alloy-wheels.jpg"},
      {title:"Blog", img:"home-img/core-pages/blog.jpg"},
      {title:"Blog Article", img:"home-img/core-pages/blog-detail.jpg"},
      {title:"Contact", img:"home-img/core-pages/contact.jpg"}
    ],
    services:["UX Research","Competitor Research","UI/UX Design","Web Design"],
    deliverables:["UX & Competitor Research","Sitemap & User Flows","UI/UX Design","Responsive Web Design","Design System","Developer Handoff"],
    stats:[["Premium","Market positioning"],["Editorial","Project-led design"],["Concept→Product","Clear story"]],
    challenge:"Core's engineering work is world-class, but their old website made them look like a generic supplier — underselling the depth of their concept-to-product capability.",
    approach:"We created an editorial, project-led site that leads with real engineering work, a clear process narrative, and confident typography — positioning Core as the premium partner for ambitious product teams.",
    outcome:"A confident, editorial site that leads with real engineering work — positioning Core as the premium, concept-to-product partner, supported by a brand system that scales across every page.",
    quote:"", author:"", role:"", avatar:""
  },
  {
    slug:"bellavista", n:"04", client:"Bellavista Investments", sector:"B2B · Private Equity",
    logo:"home-img/logo-bellavistra.png", logoInvert:false, dark:false, featured:false,
    projectClient:"Junior Aguaze", timeline:"3 weeks",
    fonts:{ui:"PP Neue Montreal", display:"PP Neue Montreal", uiStack:"\"PP Neue Montreal\",system-ui,-apple-system,BlinkMacSystemFont,\"Segoe UI\",sans-serif", displayStack:"\"PP Neue Montreal\",system-ui,-apple-system,BlinkMacSystemFont,\"Segoe UI\",sans-serif"},
    title:["An ","institutional-grade"," presence for a capital firm"],
    headline:"An Institutional-Grade Website for a Capital Firm",
    summary:"A disciplined, credible digital presence that finally matches the calibre of Bellavista's deals and investor relationships.",
    img:"home-img/dev-bellavista.jpg", gallery:["home-img/dev-bellavista.jpg"], live:"https://www.bellevistainvestments.com/",
    pages:[
      {title:"Home", img:"home-img/bellavista-pages/home.jpg"},
      {title:"Our Services", img:"home-img/bellavista-pages/services.png"},
      {title:"Real Estate Development", img:"home-img/bellavista-pages/real-estate-development.png"},
      {title:"Custom Home & Property Design", img:"home-img/bellavista-pages/custom-home-property.png"},
      {title:"Private Equity Investments", img:"home-img/bellavista-pages/private-equity.png"},
      {title:"Portfolio", img:"home-img/bellavista-pages/portfolio.png"}
    ],
    services:["UI/UX Design","Competitor Analysis","Target Audience Research","Web Design","Webflow Development"],
    deliverables:["Competitor & Audience Research","UX Strategy & User Flows","Responsive UI/UX Design","Web Design System","Webflow Development","CMS & Launch"],
    stats:[["Investor","-grade design"],["Faster","Partner enquiries"],["Clear","Service narrative"]],
    challenge:"Bellavista deploys serious capital across real estate, private equity and M&A, but their website didn't convey institutional credibility to founders and investors.",
    approach:"We designed a restrained, confident experience — disciplined typography, a clear services architecture and 'Partner with us' paths — that signals trust and long-term value at every step.",
    outcome:"Bellavista now has a presence that matches the calibre of their deals, making it easier for the right partners to take them seriously and reach out.",
    quote:"", author:"", role:"", avatar:""
  },
  {
    slug:"coastal", n:"05", client:"Coastal Crest Lettings", sector:"B2C · Property",
    logo:"home-img/logo-coastal.png", logoInvert:false, dark:false, featured:false,
    fonts:{ui:"General Sans", display:"General Sans", uiStack:"\"General Sans\",system-ui,-apple-system,BlinkMacSystemFont,\"Segoe UI\",sans-serif", displayStack:"\"General Sans\",system-ui,-apple-system,BlinkMacSystemFont,\"Segoe UI\",sans-serif"},
    palette:["#2D3F69","#F4A01D","#53B6C8","#F7F3EA"],
    title:["A fresh, trustworthy site for a ","lettings"," business"],
    headline:"A Fresh, Trustworthy Website for a Lettings Business",
    summary:"A clean, modern lettings website built exactly to brief — patient collaboration, fresh ideas and a finish the client was thrilled with.",
    img:"home-img/dev-coastal.png", gallery:["home-img/coastal-pages/home.jpg","home-img/coastal-pages/landlords.jpg","home-img/coastal-pages/tenants.png"], live:"https://www.coastalcrestlettings.co.uk/",
    pages:[
      {title:"Home", img:"home-img/coastal-pages/home.jpg"},
      {title:"Landlords", img:"home-img/coastal-pages/landlords.jpg"},
      {title:"Tenants", img:"home-img/coastal-pages/tenants.png"}
    ],
    services:["UI/UX Design","Framer Development","SEO Optimized"],
    deliverables:["UI/UX Design","Framer Development","Responsive Page Design","SEO Optimized Launch"],
    stats:[["20+ yrs","Brought online"],["Exactly","On brief"],["5.0★","Client rating"]],
    challenge:"Coastal Crest needed a website that felt modern and trustworthy to landlords and tenants, without losing the personal, approachable feel of the business.",
    approach:"We worked closely and patiently through every stage, bringing fresh design ideas while making sure the finished site was exactly what the client wanted.",
    outcome:"A finished website the client was delighted with — and a relationship they'd happily return to.",
    quote:"Ahamed was great to work with. From start to finish during the project, he was patient and helpful, ensuring that the finished website was exactly what I wanted. He is an exciting designer with fresh ideas, and I would highly recommend him. I would be keen to work with him again.",
    author:"Rupert", role:"Business Owner, UK", avatar:"home-img/logo-coastal.png", avatarLogo:true
  },
  {
    slug:"menstruation", n:"06", client:"Menstruacion", sector:"B2C · Femtech",
    logo:"home-img/logo-menstruation.png", logoInvert:false, dark:false, featured:false,
    fonts:{ui:"Poppins", display:"Poppins"},
    title:["Real support for ","real moments"],
    headline:"A Warm, Trusted Health Resource for Parents & Teens",
    summary:"A reassuring, expert-led experience pairing sensitive design with a research-backed content hub parents actually feel comfortable using.",
    img:"home-img/dev-menstruation.jpg", gallery:["home-img/menstruation-pages/parents.jpg","home-img/menstruation-pages/children.png","home-img/menstruation-pages/blog.png"], live:"https://menstruacion.com/",
    pages:[
      {title:"Parent Home", img:"home-img/menstruation-pages/parents.jpg"},
      {title:"Children Home", img:"home-img/menstruation-pages/children.png"},
      {title:"Blog Article", img:"home-img/menstruation-pages/blog.png"}
    ],
    services:["Brand Design","Logo Design","UI/UX Design","Web Design","SEO Optimization"],
    deliverables:["Brand Design","Logo Design","UI/UX Design","Responsive Web Design","SEO-Ready Content Structure"],
    stats:[["Warm","Trusted tone"],["Expert","Content hub"],["Parent","-friendly UX"]],
    challenge:"Menstruacion needed to discuss a sensitive topic in a way that felt safe and trustworthy for both parents and teens — without feeling clinical or awkward.",
    approach:"We built a warm, approachable experience with an expert articles and research hub at its heart, designed to give families reliable information with confidence.",
    outcome:"A trustworthy resource with exactly the tone the brand needed to support parents and teens through real moments.",
    quote:"", author:"", role:"", avatar:""
  }
];

/* ---- SERVICES (full CMS — drives home grid AND service.html?s=) ----
   Order: brand → web/UX design → build (custom/Webflow/Framer/AI) → SEO → cold email. */
window.VELARIS_SERVICES = [
  {
    slug:"brand-identity", tag:"01", name:"Logo &amp; Brand Design", icon:"brand", feat:false,
    short:"A distinctive identity, logo and brand kit that makes your business look credible and recognisable.",
    feats:["Logo &amp; brand system","Guidelines that scale"],
    tagline:"A brand that looks as good as your work.",
    intro:"Your brand decides whether people trust you in the first three seconds. We craft a distinctive identity and brand kit that makes your business look credible, premium and recognisable — the foundation every great website is built on.",
    includes:["Logo &amp; visual identity","Colour &amp; typography system","Brand voice &amp; messaging","Brand guidelines","Social &amp; marketing templates","Asset handover kit"],
    outcome:"A cohesive brand that builds instant credibility and lets you charge what you're worth.",
    highlights:[["3s","To earn trust"],["1","Cohesive system"],["∞","Scales with you"]],
    bestfor:"Founders launching or rebranding who need a credible, premium identity.",
    deliverable:"Logo suite, brand guidelines and a ready-to-use asset kit."
  },
  {
    slug:"conversion-uiux", tag:"02", name:"Web &amp; UX Design", icon:"ux", feat:false,
    short:"Conversion-focused web design built around your customer's journey to maximise trust and bookings.",
    feats:["Wireframe → high-fidelity","Conversion-tested layouts"],
    tagline:"Design that turns clicks into booked calls.",
    intro:"Great design isn't decoration — it's persuasion. We design every page, headline and interaction around your customer's journey, using proven UX principles to build trust and guide visitors to act.",
    includes:["UX strategy &amp; user journeys","Wireframes to high-fidelity design","Conversion-focused copywriting","Trust &amp; social-proof placement","Design system &amp; components","Usability &amp; conversion testing"],
    outcome:"A site that feels effortless to use and consistently converts visitors into leads.",
    highlights:[["+38%","Avg. conversion lift"],["UX","Law-led design"],["100%","Mobile-first"]],
    bestfor:"Businesses whose site looks fine but isn't converting visitors into enquiries.",
    deliverable:"A complete, conversion-tested design system ready to build."
  },
  {
    slug:"custom-development", tag:"03", name:"Custom-Coded Development", icon:"code", feat:false,
    short:"Hand-built, lightning-fast websites with zero template bloat — engineered for speed, SEO and longevity.",
    feats:["Core Web Vitals optimized","Scalable, secure architecture"],
    tagline:"Websites built by hand, engineered to perform.",
    intro:"Templates and page builders leave you with bloated, slow, hard-to-rank websites. We write clean, custom code so your site loads instantly, ranks well and scales with your business for years.",
    includes:["Custom front-end build (no template bloat)","Core Web Vitals &amp; performance tuning","Responsive across every device","Technical SEO foundations","CMS-ready content structure","Analytics &amp; conversion tracking"],
    outcome:"A fast, future-proof website that search engines and customers both love.",
    highlights:[["<1s","Load times"],["100","Lighthouse target"],["0","Template bloat"]],
    bestfor:"Brands that want maximum speed, control and a site that's truly theirs.",
    deliverable:"A hand-coded, SEO-ready website you fully own."
  },
  {
    slug:"webflow-development", tag:"04", name:"Webflow Development", icon:"webflow", feat:false,
    short:"Powerful, CMS-driven Webflow sites you can edit yourself — fast to launch, easy to scale.",
    feats:["Visual CMS you control","Fast, no-dev updates"],
    tagline:"Beautiful, editable websites — without the dev queue.",
    intro:"Webflow gives you a fast, designer-grade website with a visual CMS your team can update without touching code. We design and build it properly so it stays fast, ranks well and grows with you.",
    includes:["Custom Webflow design &amp; build","CMS collections (blog, cases, services)","Responsive interactions &amp; animation","On-page &amp; technical SEO setup","Editor training &amp; handover","Hosting &amp; launch support"],
    outcome:"A polished website your team can confidently manage in-house.",
    highlights:[["DIY","Easy edits"],["CMS","Blog &amp; cases"],["Fast","To launch"]],
    bestfor:"Teams that want to publish and edit content without a developer.",
    deliverable:"A live Webflow site plus editor training for your team."
  },
  {
    slug:"framer-development", tag:"05", name:"Framer Development", icon:"framer", feat:false,
    short:"Stunning, animated Framer sites that launch fast and feel premium — ideal for launches and landing pages.",
    feats:["Rich motion &amp; interactions","Rapid launch-ready builds"],
    tagline:"High-impact, animated sites — shipped fast.",
    intro:"Framer is our go-to for beautiful, motion-rich websites and landing pages that need to launch quickly without sacrificing polish. We craft fast, responsive Framer builds that feel genuinely premium.",
    includes:["Custom Framer design &amp; build","Advanced animation &amp; interactions","CMS for blog &amp; case studies","Responsive across devices","SEO &amp; performance setup","Editor training &amp; handover"],
    outcome:"A striking, fast-to-launch site that makes the right first impression.",
    highlights:[["Motion","Built-in"],["Days","Not months"],["Premium","Feel"]],
    bestfor:"Launches, campaigns and brands that want standout motion design.",
    deliverable:"A live, animated Framer site ready to edit and grow."
  },
  {
    slug:"ai-web-development", tag:"06", name:"Claude AI Web Development", icon:"spark", feat:true,
    short:"AI-assisted builds and on-site assistants that qualify leads and answer questions around the clock.",
    feats:["Ship up to 2× faster","AI lead qualification 24/7"],
    tagline:"AI-accelerated builds and round-the-clock lead assistants.",
    intro:"We use Claude AI across our build process to ship faster without cutting quality — and we can add an on-site AI assistant that qualifies leads and answers customer questions 24/7.",
    includes:["AI-accelerated design &amp; build","On-site AI chat assistant (optional)","Automated lead qualification &amp; routing","AI-assisted SEO content","Faster turnaround times","Human-reviewed quality at every step"],
    outcome:"A modern website that works for you around the clock — and gets to market faster.",
    highlights:[["2×","Faster builds"],["24/7","AI assistant"],["Smart","Lead routing"]],
    bestfor:"Forward-thinking founders who want an edge and faster delivery.",
    deliverable:"An AI-accelerated website with an optional lead-qualifying assistant."
  },
  {
    slug:"seo-optimization", tag:"07", name:"SEO Optimization", icon:"search", feat:false,
    short:"Local and technical SEO that puts you in front of high-intent customers searching for you right now.",
    feats:["Local map-pack rankings","Content engineered to rank"],
    tagline:"Get found by customers searching right now.",
    intro:"A beautiful website is useless if nobody finds it. We combine local, technical and content SEO to put you in front of high-intent customers at the exact moment they're searching for what you offer.",
    includes:["Local SEO &amp; Google Business Profile","Technical SEO &amp; site health","Keyword research &amp; mapping","On-page optimization","Content that ranks","Monthly reporting &amp; iteration"],
    outcome:"First-page rankings that send you a steady stream of free, high-intent traffic.",
    highlights:[["300+","Keywords ranked"],["Map","Pack rankings"],["Free","High-intent traffic"]],
    bestfor:"Local and service businesses that want to be found on Google.",
    deliverable:"A ranking website with a clear monthly SEO growth report."
  },
  {
    slug:"social-media-management", tag:"08", name:"Social Media Management", icon:"spark", feat:false,
    short:"Strategic social content, profiles and posting systems that keep your brand visible and trusted.",
    feats:["Content strategy & calendars","Profile and post design"],
    tagline:"Social content that builds trust before buyers enquire.",
    intro:"Consistent social media builds familiarity, proof and demand. We create a practical content system for your brand so your profiles look premium, stay active and support your website, SEO and sales funnel.",
    includes:["Social media audit","Profile optimization","Content pillars & calendar","Post templates & creative direction","Caption and campaign planning","Monthly performance reporting"],
    outcome:"A clear social presence that supports trust, authority and qualified enquiries.",
    highlights:[["30d","Content plan"],["Multi","Channel-ready"],["Proof","Built in"]],
    bestfor:"Service brands that need a consistent, premium presence across social channels.",
    deliverable:"A managed social media system with templates, content plans and reporting."
  },
  {
    slug:"cold-email-marketing", tag:"09", name:"Cold Email &amp; Marketing", icon:"mail", feat:false,
    short:"Deliverability-first outreach and email marketing that starts real conversations and books meetings.",
    feats:["Inbox-safe cold email","Nurture that converts"],
    tagline:"Outbound that books meetings — not spam.",
    intro:"We run deliverability-first cold email and email marketing that lands in the inbox, starts genuine conversations and books qualified meetings directly on your calendar.",
    includes:["Domain warm-up &amp; deliverability setup","Targeted prospect lists","High-reply cold email copy","Nurture &amp; follow-up sequences","List segmentation","Reply handling &amp; reporting"],
    outcome:"A predictable outbound channel that fills your pipeline with qualified conversations.",
    highlights:[["Inbox","Not spam"],["Booked","Meetings"],["Predictable","Pipeline"]],
    bestfor:"Founders who want proactive, predictable lead flow alongside inbound.",
    deliverable:"A running cold-email system booking qualified calls for you."
  }
];

/* ---- PROCESS (used on Pricing page) ---- */
window.VELARIS_PROCESS = [
  {n:"01", title:"Strategy &amp; Positioning",
   desc:"We dig into your market, customers and goals to define a message that makes you the obvious choice.",
   out:"Positioning &amp; sitemap", tags:["Discovery","Messaging"]},
  {n:"02", title:"Conversion-Focused Design",
   desc:"Every layout, headline, CTA and interaction is designed to build trust and guide visitors to act.",
   out:"High-fidelity design", tags:["UX","UI","Copy"]},
  {n:"03", title:"Development &amp; Build",
   desc:"Fast, responsive, SEO-ready builds — custom-coded, Webflow or Framer — that are easy to manage.",
   out:"Live, tested website", tags:["Custom code","SEO"]},
  {n:"04", title:"Launch &amp; Optimization",
   desc:"We launch, measure and keep refining so your site generates more qualified leads month after month.",
   out:"Monthly growth report", tags:["Analytics","Growth"]}
];

/* ---- PRICING ---- */
window.VELARIS_PRICING = [
  {name:"Starter", price:"£2,500", per:"project", tagline:"A complete brand + website to launch with credibility.",
   feats:["Logo &amp; brand essentials","Up to 7 pages, custom designed","Webflow, Framer or custom build","On-page SEO + keyword research","Mobile responsive &amp; fast","CMS-ready content","1–2 weeks delivery"], cta:"Start with Starter", feat:false},
  {name:"Growth", price:"£5,500", per:"project", tagline:"Our most popular — the full lead-generation system.",
   feats:["Everything in Starter","Full brand &amp; identity system","Up to 16 pages + UI/UX design","Local &amp; technical SEO","Lead-gen &amp; booking flows","Blog / case-study CMS","Analytics &amp; conversion tracking","2–4 weeks delivery"], cta:"Choose Growth", feat:true},
  {name:"Scale", price:"From £9,000", per:"project", tagline:"Everything, done-for-you — brand to outreach.",
   feats:["Everything in Growth","Claude AI web development","Cold email &amp; outreach setup","Advanced SEO &amp; content engine","Ongoing optimization &amp; support","Priority delivery","Custom timeline"], cta:"Talk to us", feat:false}
];

/* ---- INDIVIDUAL SERVICE PRICING (à la carte) ---- */
window.VELARIS_SERVICE_PRICING = [
  {name:"Logo &amp; Brand Design", icon:"brand", price:"From £600", note:"Logo, colour, type &amp; brand kit", slug:"brand-identity"},
  {name:"Web &amp; UX Design", icon:"ux", price:"From £1,200", note:"Conversion-focused design, per project", slug:"conversion-uiux"},
  {name:"Custom-Coded Development", icon:"code", price:"From £1,800", note:"Hand-built, performance-tuned", slug:"custom-development"},
  {name:"Webflow Development", icon:"webflow", price:"From £1,500", note:"CMS-driven, editable build", slug:"webflow-development"},
  {name:"Framer Development", icon:"framer", price:"From £1,400", note:"Animated, launch-ready build", slug:"framer-development"},
  {name:"Claude AI Web Development", icon:"spark", price:"From £2,200", note:"AI-accelerated build + assistant", slug:"ai-web-development"},
  {name:"SEO Optimization", icon:"search", price:"From £300/mo", note:"Keyword research + on-page + local", slug:"seo-optimization"},
  {name:"Cold Email &amp; Marketing", icon:"mail", price:"From £600/mo", note:"Deliverability, copy &amp; sequences", slug:"cold-email-marketing"}
];

/* ---- RESOURCES (ebooks, PDFs, digital products, guides) ---- */
window.VELARIS_RESOURCES = [
  {type:"E-Book", price:"Free", title:"The 2026 Lead Generation Playbook", cat:"Lead Generation",
   desc:"Our complete system for generating 10+ qualified leads a month for service businesses — the exact framework we use with clients.",
   cta:"Download free", featured:true, img:"unsplash:photo-1551288049-bebda4e38f71"},
  {type:"Checklist", price:"Free", title:"The Local SEO Checklist for Service Businesses", cat:"Local SEO",
   desc:"A step-by-step checklist to rank in the Google Map Pack and get found by high-intent local customers.",
   cta:"Get the checklist", featured:false, img:"unsplash:photo-1432888622747-4eb9a8efeb07"},
  {type:"Template", price:"Free", title:"High-Converting Homepage Wireframe Kit", cat:"Conversion",
   desc:"The section-by-section homepage structure we use to turn visitors into booked calls — ready to copy.",
   cta:"Download kit", featured:false, img:"unsplash:photo-1559028012-481c04fa702d"},
  {type:"Guide", price:"£29", title:"Cold Email That Books Meetings", cat:"Email Marketing",
   desc:"A deliverability-first cold email system with templates, sequences and the exact copy that gets replies.",
   cta:"Buy now", featured:false, img:"unsplash:photo-1596526131083-e8c633c948d2"},
  {type:"Mini-Course", price:"£49", title:"Website SEO Foundations", cat:"SEO",
   desc:"Everything a founder needs to make their website rank — technical SEO, content and local SEO, made simple.",
   cta:"Enrol now", featured:false, img:"unsplash:photo-1460925895917-afdab827c52f"},
  {type:"Notion Kit", price:"£19", title:"The Service Business Content Calendar", cat:"Content",
   desc:"A plug-and-play content system to plan, write and publish blog posts that rank and bring in leads.",
   cta:"Get the kit", featured:false, img:"unsplash:photo-1484480974693-6ca0a78fb36b"}
];

/* ---- FAQ (buyer-intent, search-optimized) ---- */
window.VELARIS_FAQS = [
  {q:"How long does it take to build a website?",
   a:"Most projects run from 1 week for a focused landing page up to 3–6 weeks for a full website, depending on scope. You'll get a clear timeline with milestones at kickoff and updates at every stage."},
  {q:"How much does a new website cost?",
   a:"Our projects start at £1,500 for a focused launch site and scale with the work involved. Most lead-generation websites land in the £3,500 range. Book a free call for a clear, no-obligation quote."},
  {q:"Do you only build websites, or handle SEO and leads too?",
   a:"Both. Every build includes technical and local SEO, and we offer cold email, email marketing and ongoing optimization so your site actually generates qualified leads — not just looks good."},
  {q:"Will my website actually rank on Google?",
   a:"Yes — ranking is built in, not bolted on. We engineer technical SEO, local SEO and content that targets the high-intent terms your customers search, then keep optimizing after launch."},
  {q:"What platforms do you build on — Webflow, Framer or custom code?",
   a:"All three. We build custom-coded sites as well as Webflow and Framer, choosing the right tool for your goals, budget and how hands-on you want to be editing content."},
  {q:"Will I be able to edit the website myself?",
   a:"Yes. We build on CMS-ready foundations and hand over a simple, documented setup so you or your team can update pages, blogs and case studies without touching code."},
  {q:"How do you actually generate 10+ leads a month?",
   a:"Through a system — conversion-focused design, local and technical SEO, content that ranks, and optional cold email. We track what works and double down on the channels driving booked calls."},
  {q:"Do you work with businesses outside the UK?",
   a:"Absolutely. We work with B2B and B2C founders across the UK and internationally — everything is handled remotely with clear communication and regular check-ins."},
  {q:"What happens after my website launches?",
   a:"We don't disappear at launch. We monitor performance, fix issues, and offer ongoing optimization and growth plans so your site keeps improving and generating leads month after month."},
  {q:"Can you redesign my existing website without losing my Google rankings?",
   a:"Yes. We migrate carefully — preserving URLs, redirects and on-page SEO — so a redesign protects your existing rankings and traffic while improving conversions."}
];
