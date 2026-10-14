"use client";

import { useEffect, useState } from "react";
import { asset } from "@/lib/site";

const STORAGE_KEY = "resume-continent";
const AMERICAS = new Set(["NA", "SA"]);

type ResumeDownload = {
  href: string;
  file: string;
};

const a4Montenegro: ResumeDownload = {
  href: asset("/Dmitry-Antonov-Resume-Montenegro.pdf"),
  file: "Dmitry-Antonov-Resume-Montenegro.pdf",
};

const usUruguay: ResumeDownload = {
  href: asset("/Dmitry-Antonov-Resume-US.pdf"),
  file: "Dmitry-Antonov-Resume-US.pdf",
};

export function resumeForContinent(code: string | null): ResumeDownload {
  return code && AMERICAS.has(code) ? usUruguay : a4Montenegro;
}

async function detectContinent(): Promise<string | null> {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), 2500);
  try {
    const response = await fetch("https://get.geojs.io/v1/ip/geo.json", {
      signal: controller.signal,
    });
    if (!response.ok) return null;
    const data = (await response.json()) as { continent_code?: string };
    const code = data.continent_code?.toUpperCase();
    return code && /^[A-Z]{2}$/.test(code) ? code : null;
  } catch {
    return null;
  } finally {
    window.clearTimeout(timer);
  }
}

export function useResumeDownload(): ResumeDownload {
  const [resume, setResume] = useState<ResumeDownload>(a4Montenegro);

  useEffect(() => {
    const cached = sessionStorage.getItem(STORAGE_KEY);
    if (cached) {
      setResume(resumeForContinent(cached));
      return;
    }

    let cancelled = false;
    detectContinent().then((code) => {
      if (cancelled) return;
      if (code) sessionStorage.setItem(STORAGE_KEY, code);
      setResume(resumeForContinent(code));
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return resume;
}
