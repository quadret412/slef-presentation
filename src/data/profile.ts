export const profile = {
  name: "Dmitry Antonov",
  shortName: "DA",
  title: "Senior Frontend Engineer",
  headline:
    "Vue.js · TypeScript · Design Systems · Real-Time Web Apps",
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
  photo: {
    src: "/dmitry.jpg",
    alt: "Dmitry Antonov, photographed in profile against coastal cliffs",
  },
  offer:
    "I own Vue 3 + TypeScript frontends for real-time, multi-brand products - architecture, design system, and the metrics after ship.",
  lookingFor: "Open to Senior Frontend and UI Platform roles.",
  about: [
    "I ship Vue, React, and TypeScript products end to end: spec, architecture, UI, tests, then the numbers. At Looptain that was one codebase for three live brands, a token-driven design system, and real-time gameplay plus wallet sync over WebSockets. I am now building Noxaren, a white-label demo casino: React player app, operator console, and the NestJS API behind them.",
    "The work I care about is usually invisible in a GitHub sample. Animation pipelines that hold 60/30 FPS. A JavaScript bundle cut by about 30%. Lighthouse load from ~2.0s to ~1.5s. PostHog owned on the frontend - flags, experiments, offer timing - not bolted on after launch.",
    "I use AI as leverage, not as the author. It handles research, scaffolding, refactors, and first drafts. I keep architecture, taste, and review. I do not ship generated slop. If it goes out, I can defend every line.",
    "At Looptain I worked with product, design, backend, QA, and data in a six-engineer team. Native Russian. English for speech, writing, and technical docs. Remote from Punta del Este.",
  ],
  experience: [
    {
      company: "Noxaren",
      role: "Senior Frontend Engineer",
      start: "Aug 2026",
      end: "Present",
      duration: "2 mo",
      place: "Independent · Remote",
      summary:
        "Building Noxaren, a white-label demo casino: player app, operator console, and the NestJS API. Virtual NOX only. The server settles every result.",
      bullets: [
        "Built the React player around four modes that do not share a runtime. Crash keeps a live multiplier curve, a tracking camera, a 3D ship, and other players' cash-outs on one frame. Plinko draws many balls through a peg board that still has to land the server's bucket. Chicken hops a scrolling road while traffic runs in lanes ahead. Tower is a floor-by-floor pick: a safe door climbs the board by a measured row, a trap blows the door and reveals the floor.",
        "Game and wallet state over Socket.IO. The server settles every result; the client owns the motion and the interaction.",
        "White-label theme tokens and brand assets so one frontend reskins without forking the game UI.",
        "Shipped the operator console (React, MUI): users, risk alerts, bans, balance adjustments, per-game RTP, VIP, and retention on the same API.",
      ],
      tech: [
        "React 19",
        "TypeScript",
        "Vite",
        "Tailwind",
        "TanStack Query",
        "Socket.IO",
        "MUI",
      ],
    },
    {
      company: "Looptain.Limited",
      role: "Senior Frontend Developer",
      start: "May 2024",
      end: "Oct 2026",
      duration: "2 yr 5 mo",
      place: "Remote",
      summary:
        "Owned the Vue 3 + TypeScript frontend for a real-time web platform: architecture, design system, gameplay UI, wallet, and product analytics. Spec → ship → metrics with product, design, backend, QA, and data.",
      bullets: [
        "Built and maintained core real-time surfaces (live rooms, rounds, and match flows) with low-latency WebSocket game state and wallet sync for hundreds of concurrent players.",
        "Owned the V2 UI platform: 50+ reusable components, Storybook, Figma design tokens; one codebase serving 3 production brands.",
        "Cut JS bundle ~30% (Vite analyzer: code splitting, deps, build config) and Lighthouse load ~2.0s → ~1.5s (lazy routes, asset delivery, render strategy).",
        "Engineered animation pipelines that hold 60/30 FPS on live gameplay UI (render + DOM budgets, mobile and desktop).",
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
        "Real-time live platform - the same product class as the later roles.",
      bullets: [
        "Built responsive Vue.js and Nuxt.js UI for live room flows and related game surfaces.",
        "Integrated frontend with PHP APIs for catalog, open/result, and user state.",
        "Improved performance and layout across desktop and mobile in production.",
      ],
      tech: ["Vue.js", "Nuxt.js", "JavaScript", "SCSS", "REST", "PHP"],
    },
  ],
  projects: [
    {
      name: "Noxaren",
      context: "Independent · Aug 2026–present",
      oneLiner:
        "White-label demo casino: React player app, operator console, and a NestJS API. Virtual NOX only.",
      outcome:
        "Crash holds one camera for the curve, the ship, and every cash-out. Plinko keeps several balls in flight and lands each in the decided bucket. Chicken times a hop against traffic on a road that scrolls to stay centered. Tower climbs one measured floor per safe pick and reveals the floor on a trap. Admin covers users, risk, bans, RTP, VIP, and retention.",
      stack: ["React 19", "TypeScript", "Vite", "Tailwind", "Socket.IO", "MUI"],
    },
    {
      name: "Multi-brand real-time platform",
      context: "Looptain · 2024–2026",
      oneLiner:
        "One Vue 3 + TypeScript frontend serving three live brands, with gameplay and wallet state over WebSockets.",
      outcome:
        "Hundreds of concurrent players on live rooms and match surfaces. Low-latency game state and wallet sync.",
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
        "JS bundle about −30%. Lighthouse load ~2.0s → ~1.5s. Animation pipelines holding 60/30 FPS on live gameplay screens.",
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
        "React",
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

export const builtAlone = {
  title: "Noxaren, built alone",
  lead: "Three systems, one person. The player, the API, and the admin. A win is settled on the server, and the platform runs without SQL.",
  parts: [
    {
      name: "Player",
      stack: "React 19 · Vite · Socket.IO",
      what: "Separate games in one client, plus account and a virtual NOX wallet. Four of them have their own runtime.",
      how: "Crash and plinko draw their own frames. Chicken and tower are boards driven by transforms. Socket.IO brings the round.",
      why: "The server names the result. The client still has to play it while the player is mid-move.",
    },
    {
      name: "API",
      stack: "NestJS · Postgres · Redis",
      what: "Accounts, billing, the game engine, and provably fair settlement.",
      how: "Prisma on Postgres, Redis for prices and jobs. Games debit and credit through one billing port.",
      why: "The server settles every result. Demo NOX can be swapped for a real wallet without rewriting a game.",
    },
    {
      name: "Admin",
      stack: "React · MUI · NestJS",
      what: "Users, risk alerts, bans, balance adjustments, per-game RTP, VIP, and retention.",
      how: "An operator console on its own NestJS API, reading and writing the same Postgres as the player platform.",
      why: "The day is run from a screen, not from a query. Password, TOTP, and CSRF guard the writes.",
    },
  ],
  modes: [
    {
      name: "Crash",
      href: "https://noxaren.com/crash",
      line: "One camera for the curve, the ship, and every cash-out.",
      detail:
        "The multiplier is a curve that keeps growing. A camera follows it. A 3D ship rides that curve, with flame, spin, and parallax stars and planets behind it. Other players' cash-outs pin to the same camera, so a marker stays on the curve as it moves. On crash the chart freezes and the ship blows. Axis labels, markers, and the rocket have to agree on one frame, including when motion is reduced.",
    },
    {
      name: "Plinko",
      href: "https://noxaren.com/plinko",
      line: "Many balls in the air, one decided bucket each.",
      detail:
        "A drop is a peg path the server already chose. The board draws it in Pixi: a trail, the bounce, then the ball slips behind the bucket rim and the bucket fires. Autoplay keeps several balls in flight. Changing rows or risk rebuilds the pegs and the buckets. A narrow screen takes a lighter draw path. The motion has to look physical and still finish in that bucket.",
    },
    {
      name: "Chicken",
      href: "https://noxaren.com/chicken",
      line: "A hop, a scrolling road, and traffic that has not arrived yet.",
      detail:
        "Each step is a short hop with a ghost trail. The road scrolls so the chicken stays in the middle of five visible lanes and never slides off either end. Cars run in lanes ahead, so the next lane is not shown as safe before the player commits. Cash out, or take the hit. The hop, the camera, and the traffic have to land on the same lane.",
    },
    {
      name: "Tower",
      href: "https://noxaren.com/tower",
      line: "One live floor, then the whole tower climbs.",
      detail:
        "Only the next floor accepts a pick. A press settles into safe or trap. A safe door clears the floor and the board climbs by one measured row, so a resize does not leave the climb short. A trap blows that door and reveals the rest of the floor. Glow steps up as you climb. The pick, the reveal, and the climb offset have to move together.",
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
