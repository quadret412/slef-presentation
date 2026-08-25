"use client";

import { useEffect, useState } from "react";
import { profile } from "@/data/profile";
import { asset } from "@/lib/site";

const US_RESUME_COUNTRIES = new Set(["US", "CA"]);
const STORAGE_KEY = "resume-country";

export type ResumeDownload = {
  href: string;
  file: string;
  region: "eu" | "us";
};

const euResume: ResumeDownload = {
  href: asset(profile.resumeHref),
  file: profile.resumeFile,
  region: "eu",
};

const usResume: ResumeDownload = {
  href: asset(profile.resumeUsHref),
  file: profile.resumeUsFile,
  region: "us",
};

function resumeForCountry(country: string | null): ResumeDownload {
  return country && US_RESUME_COUNTRIES.has(country) ? usResume : euResume;
}

async function detectCountry(): Promise<string | null> {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), 2500);
  try {
    const response = await fetch("https://get.geojs.io/v1/ip/country.json", {
      signal: controller.signal,
    });
    if (!response.ok) return null;
    const data = (await response.json()) as { country?: string };
    const country = data.country?.toUpperCase();
    return country && /^[A-Z]{2}$/.test(country) ? country : null;
  } catch {
    return null;
  } finally {
    window.clearTimeout(timer);
  }
}

export function useResumeDownload(): ResumeDownload {
  const [resume, setResume] = useState<ResumeDownload>(euResume);

  useEffect(() => {
    const cached = sessionStorage.getItem(STORAGE_KEY);
    if (cached) {
      setResume(resumeForCountry(cached));
      return;
    }

    let cancelled = false;
    detectCountry().then((country) => {
      if (cancelled) return;
      if (country) sessionStorage.setItem(STORAGE_KEY, country);
      setResume(resumeForCountry(country));
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return resume;
}
