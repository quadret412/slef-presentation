export const profile = {
  name: "Dmitry Antonov",
  shortName: "DA",
  title: "Senior Frontend Engineer",
  headline:
    "Vue.js · TypeScript · Design Systems · Real-Time Web Apps · iGaming",
  location: "Punta del Este, Uruguay",
  workMode: "Remote",
  years: "6+",
  email: "quadret412@gmail.com",
  linkedin: "https://www.linkedin.com/in/dmitry-antonov-web-developer",
  github: "https://github.com/quadret412",
  telegram: "https://t.me/quadret412",
  telegramHandle: "@quadret412",
  whatsapp: "https://wa.me/38269226494",
  whatsappLabel: "+382 69 226 494",
  resumeHref: "/Dmitry-Antonov-Resume.pdf",
  resumeFile: "Dmitry-Antonov-Resume.pdf",
  photo: {
    src: "/dmitry.jpg",
    alt: "Dmitry Antonov, photographed in profile against coastal cliffs",
  },
  offer:
    "I own Vue 3 + TypeScript frontends for real-time, multi-brand products - architecture, design system, and the metrics after ship.",
  lookingFor: "Open to Senior Frontend and UI Platform roles.",
  about: [
    "I ship Vue and TypeScript products end to end: spec, architecture, UI, tests, then the numbers. Most recently that means one codebase for three live brands, a token-driven design system, and real-time gameplay plus wallet sync over WebSockets.",
    "The work I care about is usually invisible in a GitHub sample. Animation pipelines that hold 60/30 FPS. A JavaScript bundle cut by about 30%. Lighthouse load from ~2.0s to ~1.5s. PostHog owned on the frontend - flags, experiments, offer timing - not bolted on after launch.",
    "I work with product, design, backend, QA, and data in a six-engineer team. Native Russian. English for speech, writing, and technical docs. Remote from Punta del Este.",
  ],
  experience: [
    {
      company: "Looptain.Limited",
      role: "Senior Frontend Developer",
      start: "May 2024",
      end: "Present",
      duration: "2 yr 4 mo",
      place: "Remote",
      summary:
        "Own the Vue 3 + TypeScript frontend for a real-time web platform: architecture, design system, gameplay UI, wallet, and product analytics. Spec → ship → metrics with product, design, backend, QA, and data.",
      bullets: [
        "Built and maintain core real-time surfaces (crate opening, roulette, case battles, miner) with low-latency WebSocket game state and wallet sync for hundreds of concurrent players.",
        "Own the V2 UI platform: 50+ reusable components, Storybook, Figma design tokens; one codebase serving 3 production brands.",
        "Cut JS bundle ~30% (Vite analyzer: code splitting, deps, build config) and Lighthouse load ~2.0s → ~1.5s (lazy routes, asset delivery, render strategy).",
        "Engineered animation pipelines that hold 60/30 FPS on crate and gameplay UI (render + DOM budgets, mobile and desktop).",
        "Designed wallet and transaction UI synced with backend over REST and WebSockets.",
        "Owned frontend PostHog: SDK, identify, feature flags, experiments, session replay, surveys; offer-modal targeting with backend and product.",
        "Code review and architecture guidance in a 6-engineer team; Vitest/Jest and Playwright on gameplay and money paths.",
      ],
      tech: [
        "Vue 3",
        "TypeScript",
        "Pinia",
        "Vite",
        "Tailwind",
        "WebSockets",
        "Storybook",
        "PostHog",
        "Playwright",
      ],
    },
    {
      company: "Insider",
      role: "Middle+ Frontend Developer",
      start: "Sep 2021",
      end: "Jul 2022",
      duration: "11 mo",
      place: "Türkiye · Remote",
      summary:
        "Customer-engagement and marketing automation platform used by global enterprise clients.",
      bullets: [
        "Shipped complex Vue.js and vanilla JavaScript UI integrated with PHP and Go APIs.",
        "Designed and published internal NPM packages reused across multiple frontend projects.",
        "Contributed to frontend architecture and component standards with backend and product.",
      ],
      tech: ["Vue.js", "JavaScript", "NPM", "REST", "PHP", "Go"],
    },
    {
      company: "Unicode",
      role: "Middle Frontend Developer",
      start: "Dec 2020",
      end: "Dec 2021",
      duration: "1 yr 1 mo",
      place: "Moscow · Remote",
      summary:
        "Visual website constructor - a Tilda-style site builder for user-generated pages.",
      bullets: [
        "Built and maintained the Vue.js editor and site-rendering UI: layout, blocks, preview, and publish.",
        "Integrated frontend with Python APIs for save/load, assets, and publish.",
        "Improved desktop and mobile performance of the constructor and the generated sites.",
        "Automated tests with Jest on critical editor and publish paths.",
        "Mentored junior developers and reviewed PRs with design and backend.",
      ],
      tech: ["Vue.js", "JavaScript", "Jest", "REST", "Python"],
    },
    {
      company: "SEDEMO Trading and Investments",
      role: "Junior+ / Pre-Middle Frontend Developer",
      start: "Dec 2019",
      end: "Jan 2021",
      duration: "1 yr 2 mo",
      place: "Poland",
      summary:
        "Real-time gaming / case-opening platform - the same product class as the current role.",
      bullets: [
        "Built responsive Vue.js and Nuxt.js UI for crate/case flows and related game surfaces.",
        "Integrated frontend with PHP APIs for catalog, open/result, and user state.",
        "Improved performance and layout across desktop and mobile in production.",
      ],
      tech: ["Vue.js", "Nuxt.js", "JavaScript", "SCSS", "REST", "PHP"],
    },
  ],
  projects: [
    {
      name: "Multi-brand real-time platform",
      context: "Looptain · 2024–present",
      oneLiner:
        "One Vue 3 + TypeScript frontend serving three live brands, with gameplay and wallet state over WebSockets.",
      outcome:
        "Hundreds of concurrent players on crate, roulette, battles, and miner surfaces. Low-latency game state and wallet sync.",
      stack: ["Vue 3", "TypeScript", "Pinia", "WebSockets", "Vite"],
    },
    {
      name: "V2 UI platform",
      context: "Looptain · design system",
      oneLiner:
        "Token-driven component library that replaced one-off brand UI with a single production system.",
      outcome:
        "50+ reusable components, Storybook, Figma tokens. One codebase, three production brands, CDN-delivered assets.",
      stack: ["Storybook", "Figma tokens", "Tailwind", "SCSS"],
    },
    {
      name: "Client performance program",
      context: "Looptain · platform",
      oneLiner:
        "Bundle, load, and frame-budget work on interactive gameplay UI - not a marketing landing page.",
      outcome:
        "JS bundle about −30%. Lighthouse load ~2.0s → ~1.5s. Animation pipelines holding 60/30 FPS on crate and gameplay screens.",
      stack: ["Vite", "Webpack", "Lighthouse", "GSAP"],
    },
    {
      name: "Visual site constructor",
      context: "Unicode · 2020–2021",
      oneLiner:
        "Editor and renderer for user-generated sites: layout, blocks, preview, publish.",
      outcome:
        "Python API integration for structure and assets. Jest coverage on editor and publish. Mentored juniors on the same codebase.",
      stack: ["Vue.js", "Jest", "Python APIs"],
    },
  ],
  skills: [
    {
      group: "Interface",
      items: [
        "Vue 3",
        "Vue.js",
        "Nuxt.js",
        "TypeScript",
        "JavaScript",
        "Pinia",
        "TanStack Query",
        "i18n",
        "PWA",
      ],
    },
    {
      group: "Systems",
      items: [
        "Design systems",
        "Storybook",
        "Figma tokens",
        "Tailwind CSS",
        "SCSS",
        "Component architecture",
      ],
    },
    {
      group: "Realtime & data",
      items: ["WebSockets", "REST", "PostHog", "Feature flags", "Wallet / payments UI"],
    },
    {
      group: "Quality",
      items: ["Vitest", "Jest", "Playwright", "Vite", "Webpack", "GSAP"],
    },
  ],
} as const;

export const metrics = {
  lighthouseLoadSec: { before: 2.0, after: 1.5 },
  bundleCutPercent: 30,
  fps: {
    desktop: 60,
    mobile: 30,
    beforeDesktop: 50,
    beforeMobile: 15,
    beforeSamples: [47, 22, 50, 16, 38, 15, 44, 19, 31, 17],
    afterDesktopSamples: [60, 59, 60, 60, 58, 60, 60, 59, 60, 60],
    afterMobileSamples: [30, 29, 30, 30, 28, 30, 30, 29, 30, 30],
  },
  brands: 3,
  components: 50,
  componentGrowth: [
    { label: "May ’24", count: 6 },
    { label: "Aug ’24", count: 12 },
    { label: "Nov ’24", count: 20 },
    { label: "Feb ’25", count: 29 },
    { label: "May ’25", count: 39 },
    { label: "Now", count: 50 },
  ],
} as const;

export const nav = [
  { href: "#about", label: "About" },
  { href: "#metrics", label: "Metrics" },
  { href: "#craft", label: "Craft" },
  { href: "#work", label: "Work" },
  { href: "#contact", label: "Contact" },
] as const;
