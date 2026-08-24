import type { MetadataRoute } from "next";
import { profile } from "@/data/profile";
import { seo, siteName } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteName,
    short_name: profile.shortName,
    description: seo.description,
    start_url: "/",
    display: "standalone",
    background_color: "#0b0a08",
    theme_color: "#0b0a08",
    lang: "en",
    icons: [
      {
        src: "/mark.svg",
        type: "image/svg+xml",
        sizes: "any",
        purpose: "any",
      },
    ],
  };
}
