/**
 * All site copy lives here so it can be edited in one place.
 * Copy carried over verbatim from tillmannk.com unless marked TODO.
 */

// ---------------------------------------------------------------------------
// CONFIG
// ---------------------------------------------------------------------------

export const site = {
  name: 'Tillmann Kühn',
  role: 'Growth · CRM · Dashboards',
  // Single source of truth for absolute URLs: metadataBase, sitemap.xml,
  // robots.txt, llms.txt and JSON-LD all derive from this. No trailing slash.
  url: 'https://tillmann24.com',
  // Singular here on purpose: this is a job title ("Dashboard Consultant"),
  // whereas `role` above is a discipline list and takes the plural.
  tagline: 'Growth, CRM & Dashboard Consultant',
  // Google Appointment Schedules short link. The https:// prefix is required:
  // Cta treats a scheme-less href as an internal route, which would resolve to
  // /calendar.app.google/... and 404.
  bookingUrl: 'https://calendar.app.google/pZdfgGB2mSCEEtnYA',
  email: 'hello@tillmann24.com',
  linkedin: 'https://www.linkedin.com/in/tillmannkuhn/',
  location: 'Berlin, Germany',
} as const

export const nav = [
  { label: 'Services', href: '/#services' },
  { label: 'Work', href: '/#work' },
  { label: 'Offerings', href: '/#offerings' },
  { label: 'Writing', href: '/blog' },
] as const

// ---------------------------------------------------------------------------
// 01 — HERO
// ---------------------------------------------------------------------------

export const hero = {
  words: ['Growth', 'CRM', 'Analytics'],
  lede: '15+ years turning data and AI into measurable business impact — for global brands and startups alike.',
} as const

// ---------------------------------------------------------------------------
// 02 — CLIENTS
// ---------------------------------------------------------------------------

/**
 * Order is randomised on every page load (see components/sections/client-wall.tsx),
 * so the sequence here is not meaningful — add new brands anywhere in the list.
 *
 * 19 brands + 1 filler cell = 20 grid slots, which divides evenly by the
 * 2 / 4 / 5 column counts used at each breakpoint. If you add or remove a
 * brand, adjust the filler count in ClientWall to keep the grid flush.
 */
export const clients = [
  { name: 'Dior' },
  { name: 'LVMH' },
  { name: "McDonald's" },
  { name: 'NIVEA' },
  { name: 'Continental' },
  { name: 'Lufthansa' },
  { name: 'Publicis' },
  { name: 'Louis Vuitton' },
  { name: 'Nissan' },
  { name: 'Niterra' },
  { name: 'Michelin' },
  { name: 'Douglas' },
  { name: 'Puma' },
  { name: 'DDB' },
  { name: 'Ford' },
  { name: 'Beiersdorf' },
  { name: 'STIHL' },
  // NOTE: corrected from "Sachi & Sachi" — revert if you meant something else.
  { name: 'Saatchi & Saatchi' },
  { name: 'Optimedia' },
] as const

// ---------------------------------------------------------------------------
// 03 — POSITIONING
// ---------------------------------------------------------------------------

export const positioning = {
  statement:
    'With over 15 years of experience fueling growth for startups and global brands alike, I specialize in harnessing data and AI to deliver measurable business impact, optimize marketing investments, and align campaigns with strategic goals for rapid, tangible results.',
  facts: [
    { value: '56', label: 'Successful projects' },
    { value: '3', label: 'Languages: EN · FR · DE' },
    { value: '24', label: 'Satisfied customers' },
  ],
} as const

// ---------------------------------------------------------------------------
// 04 — SERVICES
// ---------------------------------------------------------------------------

export const services = [
  {
    id: 'growth-leadership',
    title: 'AI driven Growth Leadership',
    body: 'Scaling brands, I excel at building high-performing teams to drive growth across markets and channels. My leadership blends strategic vision, data-driven decisions, and hands-on execution to align campaigns with business goals. I have a proven track record in executing integrated campaigns, CRM automation, engagement, and budget optimization. Known for a customer-centric approach, I inspire innovation and deliver measurable results in market expansion, retention, and rebranding. Fluent in English, French, and German, I thrive in dynamic, multicultural environments, driving business transformation through marketing.',
    tags: ['Team building', 'Integrated campaigns', 'Budget optimization'],
  },
  {
    id: 'crm-automation',
    title: 'CRM + Automation',
    body: 'I specialize in maximizing customer lifecycle value by connecting the dots across your CRM ecosystem, from analyzing performance across channels to defining strategic action points and executing customer-centric campaigns. Whether you need a comprehensive data driven CRM strategy or hands-on support with day-to-day optimization, I bring a deep understanding of how to drive results across all touchpoints.\n\nAs a certified Braze expert, I’ve successfully implemented multiple CRM frameworks tailored to business needs. I value HubSpot for its unmatched flexibility, extensive API capabilities, and powerful knowledge base—all built around a core vision of fostering a truly customer-focused mindset across the organization. I also enjoy working with Braze to create meaningful, data-driven engagement and build real, two-way conversations with customers.',
    tags: ['Braze', 'HubSpot', 'Lifecycle value'],
  },
  {
    id: 'data-analytics',
    title: 'Data + Analytics',
    body: 'I leverage advanced analytics and reporting to unlock actionable insights and inform smarter marketing decisions. Skilled in translating complex data into clear, impactful dashboards, I empower teams to monitor campaign performance in real-time and identify opportunities for optimization. My experience spans end-to-end measurement, from defining relevant KPIs to automating reports and uncovering trends that drive business growth. With a deep understanding of AI-driven tools and data ecosystems, I ensure marketing initiatives are grounded in evidence, fostering continuous improvement and delivering measurable impact.',
    tags: ['KPI design', 'Dashboards', 'Automated reporting'],
  },
] as const

// ---------------------------------------------------------------------------
// 05 — PROJECTS
// ---------------------------------------------------------------------------

export const projects = [
  {
    client: 'NIUS',
    title: 'Registration & Paywall',
    body: 'I implemented the registration flows and paywall, then structured the product and CRM side around them — so subscription conversion and retention could scale cleanly.',
    metric: '146%+',
    metricLabel: 'Monthly subscriptions',
  },
  {
    client: 'Track',
    title: "McDonald's CRM Programm",
    body: 'I was running the 1:1 communication for McDonald’s. Newsletters with over 40% open rate… I was lovin’ it!',
    metric: '42%+',
    metricLabel: 'Newsletter open rate',
  },
  {
    client: 'DDB',
    title: 'Lufthansa rebranding',
    body: 'I was launching the new Lufthansa Brand Design (BTL Campaign)… over 3 minutes user interaction on LP is not so bad isn’t it?',
    metric: '3min+',
    metricLabel: 'User interaction on LP',
  },
  {
    client: 'circulee',
    title: 'Growth engine reboot',
    body: 'I reshaped the paid campaigns and rebuilt the HubSpot-powered funnel underneath them — turning scattered spend into a predictable B2B growth engine.',
    metric: '53%',
    metricLabel: 'Lower CAC',
  },
] as const

// ---------------------------------------------------------------------------
// 06 — OFFERINGS
// ---------------------------------------------------------------------------

export type Offering = {
  title: string
  body: string
  /** Optional outbound link, e.g. a dedicated product site for this service. */
  link?: { label: string; href: string }
}

export const offerings: Offering[] = [
  {
    title: 'Interim Management',
    body: 'I step in for a defined period with hands-on leadership, I stabilize operations, drive key initiatives, deliver measurable results, and ensure smooth knowledge transfer for your team’s long-term success.',
  },
  {
    title: 'Growth Consultancy',
    body: 'Tailored GTM strategy to get you first 100 customers. Buyer personas, building strong acquisition channels and CRM. I’ll help you build a growth engine that delivers results.',
  },
  {
    title: 'CRM Expert',
    body: 'Certified Braze expert and long-time HubSpot advocate. I audit your lifecycle, fix the flows that quietly leak revenue, and hand back a CRM setup your team can actually run — segmentation, triggers and reporting included.',
  },
  {
    title: 'Dashboards',
    body: 'Tailor-made dashboards built in days, not months. Performance, SEO and growth views wired to the KPIs that actually move your business — keep the code and run it yourself, or let me host it.',
    link: { label: 'GoDashly.com', href: 'https://godashly.com' },
  },
  {
    title: 'AI Empowerment Program',
    body: 'I will help your team to find the right setup to catch-up with productive and owned marketing execution. Powered by proven AI implementation concepts… until speed is back.',
  },
  {
    title: '1:1 Consultations',
    body: 'As a leader you need sparring but nobody around that can understand the problems you want to tackle. Let’s have a chat (one shot or regular) so I can support you w/ my experience.',
  },
] as const

// ---------------------------------------------------------------------------
// 07 — TESTIMONIALS
//
// Quotes are verbatim as supplied. Where a recommender wrote "Tillman" with a
// single N, that spelling is preserved — it is their words, not a typo to fix.
//
// Rendered as a slider (components/sections/testimonials.tsx). Add an entry
// here and it becomes a new slide automatically; nothing else to update.
// ---------------------------------------------------------------------------

export type Testimonial = {
  name: string
  title: string | null
  location: string | null
  quote: string | null
  /** BCP-47 tag, set only when the quote is not in the page language. */
  lang?: string
}

export const testimonials: Testimonial[] = [
  {
    // Placed first: a CEO describing a concrete interim-management engagement
    // is the strongest opener, and it maps directly to offering 01.
    name: 'Tim Seewöster',
    title: 'CEO',
    location: 'Berlin',
    quote:
      'Tillmann joined our team as an interim manager to guide and implement a change process. At the time, our team was not a high-performing unit. He restructured the team, comprehensively revised our marketing strategy, and contributed his expertise to the development of our CRM strategy. Additionally, he took on the responsibility of onboarding new team members.',
  },
  {
    name: 'Miji Sarwono',
    title: 'Growth Strategist | Creator & Affiliate Marketing Expert',
    location: 'Singapore',
    quote:
      'Working with Tillman has been an amazing experience — he has a vast experience in marketing and CRM strategy combined with a ‘get-it-done’ attitude and ability to work as a team as well as independently. A true marketing professional!',
  },
  {
    name: 'Kristina Bonitz',
    title: 'Managing Founder, Serotonin | Strategic reinvention',
    location: 'Hamburg',
    quote:
      'I had the pleasure of working together with Tillmann for over a year. He is everything you would be looking for in a client service director as well as an outstanding team player. We managed several clients together, not only successfully but always with a lot of fun. Handling client relations, keeping calm in challenging times while always keeping a good mood and protecting the team — he makes a rewarding lead that you will miss enormously as soon as you don’t have him anymore.',
  },
  {
    name: 'Tony Gandía',
    title: 'Vice President, Executive Client Partner',
    location: 'Paris',
    quote:
      'His passion is infectious and his dedication to his clients and team members doesn’t fail. There aren’t any obstacles that Tillmann doesn’t hesitate to remove for his team and his clients. His management style allows for a collaborative and amiable working environment.',
  },
  {
    name: 'Cherif Hennaoui',
    title: 'Lead Salesforce Marketing Cloud',
    location: 'Paris',
    quote:
      'Tillmann is one of those rare managers who also naturally serves as an inspiring mentor for the whole staff. Tillmann exhibits strong interpersonal skills and a unique capacity for empathy. These qualities most notably translate in his ability to motivate a team to care about its project and be invested in the project’s success. He steps in to diffuse tension and induce compromising. Though he’s never one to draw attention to himself, Tillmann’s positive attitude and the respect others feel toward him are palpable.',
  },
  {
    name: 'Adrian Ma',
    title: 'Ecommerce | Digital Marketing | Web3',
    location: 'Hong Kong',
    quote:
      'I had the pleasure of working with Tillman while he managed the LVMH digital business at ZenithOptimedia. His unique combination of a no-fail attitude coupled with his creative experience from Razorfish, enabled us to create out-of-the-box digital campaigns for his LVMH clients. I hope we have a chance to collaborate again in the future.',
  },
  {
    name: 'Gülcan Coskun',
    title: 'Freelance Consultant',
    location: 'Berlin',
    quote:
      'It was a great experience to work with Tillmann. He knows how to motivate his team and to drive each team member in order to reach a common goal. Tillman’s full involvement and positive mindset was always appreciated by his team, third parties and customers. His 360 digital vision and strategic thinking is making him a real asset for any company looking for a senior digital marketing specialist and a manager acting in a global environment.',
  },
  {
    name: 'Yvonnig Guégan',
    title: null,
    location: 'Paris',
    lang: 'fr',
    quote:
      'Tillmann était, au sein de la société LeGuide.com, un manager charismatique et mobilisateur, sachant encadrer, gérer et motiver son équipe, perspicace et expérimenté.',
  },
  {
    name: 'Mark Cox',
    title: 'Global Marketing & Communications Leader',
    location: 'Tyrol',
    quote:
      'Tillmann Kühn has been a great Client Partner for Nissan Center Europe and I recommend him highly to any company looking for a real leader in Digital Marketing. It is simply a pleasure to work with Tillmann, his professional manner, his know how, his language skills, his dependability and personality all combine into a package which is hard to beat. I look forward to working with Tillmann again and would do so in a heartbeat.',
  },
]

// ---------------------------------------------------------------------------
// 09 — CONTACT
// ---------------------------------------------------------------------------

export const contact = {
  heading: 'Let’s talk',
  body: 'Whether you need an interim lead, a growth engine built from scratch, or a sparring partner for the hard calls — start with a conversation.',
} as const
