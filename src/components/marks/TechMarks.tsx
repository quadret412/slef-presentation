import type { SVGProps } from "react";

type MarkProps = SVGProps<SVGSVGElement>;

function Frame({ children, ...props }: MarkProps) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" {...props}>
      {children}
    </svg>
  );
}

export function VueMark(props: MarkProps) {
  return (
    <Frame {...props}>
      <path d="M4 6h6.2L16 16.6 21.8 6H28L16 27 4 6Z" fill="#41B883" />
      <path d="M9.4 6h4.2L16 11.4 18.4 6h4.2L16 18.2 9.4 6Z" fill="#34495E" />
    </Frame>
  );
}

export function ReactMark(props: MarkProps) {
  return (
    <Frame {...props}>
      <circle cx="16" cy="16" r="2.2" fill="#61DAFB" />
      <ellipse cx="16" cy="16" rx="12" ry="4.6" stroke="#61DAFB" strokeWidth="1.5" />
      <ellipse
        cx="16"
        cy="16"
        rx="12"
        ry="4.6"
        transform="rotate(60 16 16)"
        stroke="#61DAFB"
        strokeWidth="1.5"
      />
      <ellipse
        cx="16"
        cy="16"
        rx="12"
        ry="4.6"
        transform="rotate(-60 16 16)"
        stroke="#61DAFB"
        strokeWidth="1.5"
      />
    </Frame>
  );
}

export function JavaScriptMark(props: MarkProps) {
  return (
    <Frame {...props}>
      <rect x="4" y="4" width="24" height="24" rx="3" fill="#F7DF1E" />
      <text
        x="16"
        y="21"
        textAnchor="middle"
        fill="#111"
        fontFamily="ui-sans-serif, system-ui, sans-serif"
        fontSize="11"
        fontWeight="700"
        letterSpacing="-0.05em"
      >
        JS
      </text>
    </Frame>
  );
}

export function FileMark({
  src,
  className,
}: {
  src: string;
  className?: string;
}) {
  return (
    <img
      src={src}
      alt=""
      className={className}
      width={32}
      height={32}
      draggable={false}
    />
  );
}

export const techCatalog = [
  {
    id: "vue",
    name: "Vue",
    motion: "lift",
    used: "Daily driver. Vue 3 Composition API on the current platform, plus earlier Vue 2 / Nuxt work.",
    render: (className: string) => <VueMark className={className} />,
  },
  {
    id: "react",
    name: "React",
    motion: "spin",
    used: "This site. I do not pretend React is my day job - Vue is. I can still ship a React surface cleanly.",
    render: (className: string) => <ReactMark className={className} />,
  },
  {
    id: "ts",
    name: "TypeScript",
    motion: "pop",
    used: "Default language on the V2 platform, stores, and package APIs.",
    render: (className: string) => (
      <FileMark src="/marks/typescript.svg" className={className} />
    ),
  },
  {
    id: "nuxt",
    name: "Nuxt",
    motion: "tilt",
    used: "SSR/SSG surfaces on earlier gaming and marketing products.",
    render: (className: string) => (
      <FileMark src="/marks/nuxt.svg" className={className} />
    ),
  },
  {
    id: "pinia",
    name: "Pinia",
    motion: "bounce",
    used: "Client state for wallet, game rooms, and brand-scoped stores.",
    render: (className: string) => (
      <FileMark src="/marks/pinia.svg" className={className} />
    ),
  },
  {
    id: "vite",
    name: "Vite",
    motion: "flash",
    used: "Current build. Bundle cut ~30% with analyzer, splitting, and dep cleanup.",
    render: (className: string) => (
      <FileMark src="/marks/vite.svg" className={className} />
    ),
  },
  {
    id: "tailwind",
    name: "Tailwind",
    motion: "wave",
    used: "Token-driven utility layer on top of Figma tokens.",
    render: (className: string) => (
      <FileMark src="/marks/tailwind.svg" className={className} />
    ),
  },
  {
    id: "storybook",
    name: "Storybook",
    motion: "wiggle",
    used: "50+ production components for three brands in one library.",
    render: (className: string) => (
      <FileMark src="/marks/storybook.svg" className={className} />
    ),
  },
  {
    id: "playwright",
    name: "Playwright",
    motion: "squash",
    used: "Gameplay and money-path coverage with the QA team.",
    render: (className: string) => (
      <FileMark src="/marks/playwright.svg" className={className} />
    ),
  },
  {
    id: "posthog",
    name: "PostHog",
    motion: "pulse",
    used: "SDK, identify, flags, experiments, replay, offer-modal timing.",
    render: (className: string) => (
      <FileMark src="/marks/posthog.svg" className={className} />
    ),
  },
  {
    id: "figma",
    name: "Figma",
    motion: "flip",
    used: "Design tokens in, CSS variables out. I sit with design, not after them.",
    render: (className: string) => (
      <FileMark src="/marks/figma.svg" className={className} />
    ),
  },
  {
    id: "js",
    name: "JavaScript",
    motion: "press",
    used: "Vanilla UI at Insider, plus the parts of the stack that stay untyped.",
    render: (className: string) => <JavaScriptMark className={className} />,
  },
] as const;
