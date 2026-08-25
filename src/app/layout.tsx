import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Host_Grotesk } from "next/font/google";
import { profile } from "@/data/profile";
import { asset, getSiteUrl, personJsonLd, seo, siteName } from "@/lib/site";
import { themeBootScript } from "@/lib/theme";
import "./globals.css";

const host = Host_Grotesk({
  variable: "--font-host",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = getSiteUrl();

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f3eee6" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0a08" },
  ],
  colorScheme: "dark light",
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: seo.title,
    template: `%s | ${profile.name}`,
  },
  description: seo.description,
  applicationName: siteName,
  authors: [{ name: profile.name, url: siteUrl }],
  creator: profile.name,
  publisher: profile.name,
  keywords: seo.keywords,
  category: "technology",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [{ url: asset("/mark.svg"), type: "image/svg+xml" }],
  },
  manifest: asset("/manifest.webmanifest"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName,
    title: seo.title,
    description: seo.description,
  },
  twitter: {
    card: "summary_large_image",
    title: seo.title,
    description: seo.description,
  },
  appleWebApp: {
    title: profile.shortName,
    capable: true,
    statusBarStyle: "black-translucent",
  },
};

const directionContract = `THESIS: A hiring manager remembers the portrait looking into the work, not a card grid of jobs.
OWN-WORLD: Cinema dusk, sand type, steel from the vest, frosted chrome, photo as first object.
STORY: Senior Vue/TS engineer who owns real-time multi-brand frontends. Remote. Hire him.
FIRST VIEWPORT: Portrait left looking right; name and offer right; primary actions under the name.
FORM: Apple-cinematic, pinned by owner. No concept roll.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  const jsonLd = personJsonLd(siteUrl);

  return (
    <html
      lang="en"
      className={`${host.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full font-sans">
        <Script
          id="theme-boot"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: themeBootScript }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <div
          hidden
          dangerouslySetInnerHTML={{
            __html: `<!-- ${directionContract} -->`,
          }}
        />
        {children}
      </body>
    </html>
  );
}
