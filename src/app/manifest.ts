import type { MetadataRoute } from "next";
import { profile } from "@/data/profile";
import { asset, seo, siteName } from "@/lib/site";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  const base = process.env.PAGES_BASE_PATH || "";

  return {
    name: siteName,
    short_name: profile.shortName,
    description: seo.description,
    start_url: `${base}/`,
    display: "standalone",
    background_color: "#0b0a08",
    theme_color: "#0b0a08",
    lang: "en",
    icons: [
      {
        src: asset("/mark.svg"),
        type: "image/svg+xml",
        sizes: "any",
        purpose: "any",
      },
    ],
  };
}
