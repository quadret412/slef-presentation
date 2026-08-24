import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Host_Grotesk } from "next/font/google";
import { themeBootScript } from "@/lib/theme";
import "./globals.css";

const host = Host_Grotesk({
  variable: "--font-host",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f3eee6" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0a08" },
  ],
  colorScheme: "dark light",
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "Dmitry Antonov - Senior Frontend Engineer",
  description:
    "Senior Frontend Engineer. Vue 3, TypeScript, design systems, real-time web apps. Remote from Punta del Este.",
  icons: {
    icon: [{ url: "/mark.svg", type: "image/svg+xml" }],
  },
  openGraph: {
    title: "Dmitry Antonov - Senior Frontend Engineer",
    description:
      "Vue 3 + TypeScript frontends for real-time, multi-brand products.",
    type: "website",
  },
};

const directionContract = `THESIS: A hiring manager remembers the portrait looking into the work, not a card grid of jobs.
OWN-WORLD: Cinema dusk, sand type, steel from the vest, frosted chrome, photo as first object.
STORY: Senior Vue/TS engineer who owns real-time multi-brand frontends. Remote. Hire him.
FIRST VIEWPORT: Portrait left looking right; name and offer right; primary actions under the name.
FORM: Apple-cinematic, pinned by owner. No concept roll.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance`;

export default function RootLayout({ children }: LayoutProps<"/">) {
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
