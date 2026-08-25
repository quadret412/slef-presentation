import { profile } from "@/data/profile";

function trimSlash(url: string) {
  return url.replace(/\/$/, "");
}

export const basePath =
  process.env.NEXT_PUBLIC_BASE_PATH || process.env.PAGES_BASE_PATH || "";

export function asset(path: string) {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${basePath}${normalized}`;
}

export function getSiteUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return trimSlash(explicit);

  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  if (process.env.PAGES_BASE_PATH) {
    return "https://quadret412.github.io/slef-presentation";
  }

  return "http://localhost:3001";
}

export const siteName = `${profile.name} - ${profile.title}`;

export const seo = {
  title: `${profile.name} | ${profile.title} · Vue 3, TypeScript, Design Systems`,
  description: `${profile.title}. Vue 3, TypeScript, design systems, and real-time web apps. ${profile.lookingFor} ${profile.workMode} from ${profile.location}.`,
  shortDescription: profile.offer,
  keywords: [
    "Dmitry Antonov",
    "Senior Frontend Engineer",
    "Vue 3",
    "Vue.js",
    "TypeScript",
    "design systems",
    "real-time web apps",
    "iGaming",
    "UI platform",
    "remote frontend",
    "Punta del Este",
    "WebSockets",
    "Storybook",
    "PostHog",
  ],
};

export function personJsonLd(siteUrl: string) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${siteUrl}/#person`,
        name: profile.name,
        jobTitle: profile.title,
        description: seo.description,
        email: `mailto:${profile.email}`,
        url: siteUrl,
        image: `${siteUrl}${profile.photo.src}`,
        address: {
          "@type": "PostalAddress",
          addressLocality: "Punta del Este",
          addressCountry: "UY",
        },
        workLocation: {
          "@type": "Place",
          name: profile.workMode,
        },
        sameAs: [profile.linkedin, profile.github, profile.telegram],
        knowsLanguage: ["en", "ru"],
        knowsAbout: [
          "Vue 3",
          "TypeScript",
          "Design systems",
          "Real-time web applications",
          "iGaming",
          "WebSockets",
        ],
        worksFor: {
          "@type": "Organization",
          name: "Looptain.Limited",
        },
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: siteName,
        description: seo.description,
        inLanguage: "en",
        publisher: { "@id": `${siteUrl}/#person` },
      },
      {
        "@type": "ProfilePage",
        "@id": `${siteUrl}/#profile`,
        url: siteUrl,
        name: seo.title,
        description: seo.description,
        inLanguage: "en",
        mainEntity: { "@id": `${siteUrl}/#person` },
        about: { "@id": `${siteUrl}/#person` },
      },
    ],
  };
}
