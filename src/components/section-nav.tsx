"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { nav } from "@/data/profile";

const sectionHrefs = nav.map((item) => item.href);

type SectionNav = {
  active: string | null;
  go: (href: string | null) => void;
};

const SectionNavContext = createContext<SectionNav | null>(null);

function useActiveHref(): SectionNav {
  const [active, setActive] = useState<string | null>(null);
  const lock = useRef<string | null>(null);
  const unlockTimer = useRef(0);

  useEffect(() => {
    const nodes = sectionHrefs
      .map((href) => document.getElementById(href.slice(1)))
      .filter((node): node is HTMLElement => Boolean(node));

    const read = () => {
      if (lock.current) {
        setActive(lock.current);
        return;
      }

      const compact = window.matchMedia("(max-width: 767px)").matches;
      const header = compact ? 64 : 88;
      const line = window.innerHeight * (compact ? 0.42 : 0.5);
      const atEnd =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - (compact ? 96 : 32);

      if (atEnd) {
        setActive(sectionHrefs[sectionHrefs.length - 1]);
        return;
      }

      let current: string | null = null;
      for (const node of nodes) {
        const rect = node.getBoundingClientRect();
        if (rect.top <= line && rect.bottom > header) current = `#${node.id}`;
      }

      if (!current) {
        for (const node of nodes) {
          const rect = node.getBoundingClientRect();
          if (rect.top < window.innerHeight - (compact ? 88 : 48) && rect.bottom > header) {
            current = `#${node.id}`;
            break;
          }
        }
      }

      setActive(current);
    };

    read();
    const paint = window.requestAnimationFrame(() =>
      window.requestAnimationFrame(read),
    );
    window.addEventListener("scroll", read, { passive: true });
    window.addEventListener("resize", read);
    return () => {
      window.removeEventListener("scroll", read);
      window.removeEventListener("resize", read);
      window.cancelAnimationFrame(paint);
      window.clearTimeout(unlockTimer.current);
    };
  }, []);

  const go = (href: string | null) => {
    lock.current = href;
    setActive(href);

    const release = () => {
      window.removeEventListener("scrollend", release);
      window.clearTimeout(unlockTimer.current);
      lock.current = null;
    };

    window.removeEventListener("scrollend", release);
    window.addEventListener("scrollend", release, { once: true });
    window.clearTimeout(unlockTimer.current);
    unlockTimer.current = window.setTimeout(release, 1000);
  };

  return { active, go };
}

export function SectionNavProvider({ children }: { children: ReactNode }) {
  const value = useActiveHref();
  return (
    <SectionNavContext.Provider value={value}>
      {children}
    </SectionNavContext.Provider>
  );
}

export function useSectionNav() {
  const context = useContext(SectionNavContext);
  if (!context) {
    throw new Error("useSectionNav must be used inside SectionNavProvider");
  }
  return context;
}

export function useNavPill(
  trackRef: RefObject<HTMLElement | null>,
  shown: string | null,
  axis: "x" | "y",
) {
  const [clip, setClip] = useState(
    axis === "x" ? "inset(0 100% 0 0)" : "inset(0 0 100% 0)",
  );
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const layout = () => {
      if (!shown) {
        setClip(axis === "x" ? "inset(0 100% 0 0)" : "inset(0 0 100% 0)");
        return;
      }

      const link = track.querySelector<HTMLElement>(`[data-nav="${shown}"]`);
      if (!link) return;

      const box = track.getBoundingClientRect();
      const item = link.getBoundingClientRect();

      if (axis === "x") {
        const left = ((item.left - box.left) / box.width) * 100;
        const right = ((box.right - item.right) / box.width) * 100;
        setClip(`inset(0 ${right}% 0 ${left}% round 999px)`);
      } else {
        const top = ((item.top - box.top) / box.height) * 100;
        const bottom = ((box.bottom - item.bottom) / box.height) * 100;
        setClip(`inset(${top}% 0 ${bottom}% 0 round 999px)`);
      }
      setReady(true);
    };

    layout();
    const observer = new ResizeObserver(layout);
    observer.observe(track);
    return () => observer.disconnect();
  }, [shown, axis, trackRef]);

  return { clip, ready };
}
