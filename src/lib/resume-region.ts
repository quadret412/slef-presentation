"use client";

import { useSyncExternalStore } from "react";
import { asset } from "@/lib/site";

export type ResumeFormat = "eu" | "us";

export type ResumeDownload = {
  format: ResumeFormat;
  href: string;
  file: string;
  label: string;
};

export const resumes: Record<ResumeFormat, ResumeDownload> = {
  eu: {
    format: "eu",
    href: asset("/Dmitry-Antonov-Resume.pdf"),
    file: "Dmitry-Antonov-Resume.pdf",
    label: "EU format",
  },
  us: {
    format: "us",
    href: asset("/Dmitry-Antonov-Resume-US.pdf"),
    file: "Dmitry-Antonov-Resume-US.pdf",
    label: "US format",
  },
};

/** Server render / no-JS default: the EU (A4) file. */
const DEFAULT_FORMAT: ResumeFormat = "eu";

// Legacy IANA aliases and non-"America/" zones that are still in the Americas.
const AMERICAS_TZ_PREFIXES = ["America/", "US/", "Canada/", "Brazil/", "Chile/", "Mexico/"];
const AMERICAS_TZ_EXACT = new Set(["Pacific/Honolulu", "Pacific/Galapagos", "Pacific/Easter", "Atlantic/Bermuda", "Atlantic/Stanley"]);

// ISO 3166 region codes in North, Central and South America and the Caribbean.
const AMERICAS_REGIONS = new Set(
  (
    "US CA MX GT BZ SV HN NI CR PA CU DO HT JM PR BS BB TT AG DM GD KN LC VC AW CW SX BQ KY TC VG VI AI MS BM GL PM " +
    "CO VE EC PE BO BR PY UY AR CL GY SR GF FK"
  ).split(" "),
);

function formatFromTimeZone(): ResumeFormat | null {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    // Missing or generic zones (UTC, Etc/*) say nothing about the visitor.
    if (!tz || tz === "UTC" || tz.startsWith("Etc/")) return null;
    if (AMERICAS_TZ_EXACT.has(tz) || AMERICAS_TZ_PREFIXES.some((p) => tz.startsWith(p))) return "us";
    return "eu";
  } catch {
    return null;
  }
}

function formatFromLanguage(): ResumeFormat | null {
  const langs = navigator.languages?.length ? navigator.languages : [navigator.language];
  for (const tag of langs) {
    if (!tag) continue;
    let region: string | undefined;
    try {
      region = new Intl.Locale(tag).maximize().region;
    } catch {
      region = tag.split(/[-_]/)[1];
    }
    if (region) return AMERICAS_REGIONS.has(region.toUpperCase()) ? "us" : "eu";
  }
  return null;
}

let detected: ResumeFormat | null = null;

function getClientFormat(): ResumeFormat {
  if (detected === null) {
    detected = formatFromTimeZone() ?? formatFromLanguage() ?? DEFAULT_FORMAT;
  }
  return detected;
}

function getServerFormat(): ResumeFormat {
  return DEFAULT_FORMAT;
}

// The visitor's region does not change during a visit, so there is nothing to subscribe to.
function subscribe(): () => void {
  return () => {};
}

/** Picks the resume file for the visitor: Americas get the US file, everyone else the EU file. */
export function useResumeDownload(): { primary: ResumeDownload; alternate: ResumeDownload } {
  const format = useSyncExternalStore(subscribe, getClientFormat, getServerFormat);
  return {
    primary: resumes[format],
    alternate: resumes[format === "us" ? "eu" : "us"],
  };
}
