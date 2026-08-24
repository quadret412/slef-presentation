"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { nav, profile } from "@/data/profile";
import { DownloadIcon } from "./Icons";
import { Mark } from "./Mark";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { useNavPill, useSectionNav } from "./section-nav";

export function Nav() {
  const reduce = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const { active, go } = useSectionNav();
  const [hovered, setHovered] = useState<string | null>(null);
  const trackRef = useRef<HTMLElement>(null);
  const dockRef = useRef<HTMLDivElement>(null);
  const shown = hovered ?? active;
  const desktopPill = useNavPill(trackRef, shown, "x");
  const dockPill = useNavPill(dockRef, active, "x");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const itemClass =
    "rounded-full px-1.5 py-1 text-[12.5px] sm:px-2 sm:text-[13.5px]";

  return (
    <>
      <header
        className={`glass sticky top-0 z-50 border-b transition-[background,border-color,backdrop-filter] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] ${
          scrolled
            ? "border-line bg-glass backdrop-blur-[20px] backdrop-saturate-150"
            : "border-transparent bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-14 w-full min-w-0 max-w-[72rem] items-center justify-between gap-3 overflow-visible px-5 sm:h-16 sm:px-8">
          <a
            href="#top"
            onClick={() => go(null)}
            className="flex shrink-0 items-center gap-2.5 text-[15px] font-semibold tracking-[-0.02em] text-sand"
            aria-label={`${profile.name}, home`}
          >
            <Mark className="h-8 w-8 shrink-0" />
            <span className="md:hidden" aria-hidden>
              {profile.shortName}
            </span>
            <span className="hidden md:inline" aria-hidden>
              {profile.name}
            </span>
          </a>
          <nav
            ref={trackRef}
            className="relative hidden min-w-0 items-center md:flex"
            aria-label="Primary"
            onPointerLeave={() => setHovered(null)}
          >
            <div className="flex flex-nowrap items-center gap-6 lg:gap-7">
              {nav.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  data-nav={item.href}
                  aria-current={active === item.href ? "location" : undefined}
                  onClick={() => go(item.href)}
                  onPointerEnter={(event) => {
                    if (event.pointerType !== "mouse") return;
                    setHovered(item.href);
                  }}
                  className={`${itemClass} text-sand-dim`}
                >
                  {item.label}
                </a>
              ))}
            </div>
            <div
              aria-hidden
              className={`nav-active ${desktopPill.ready && !reduce ? "is-ready" : ""}`}
              style={{ clipPath: desktopPill.clip }}
            >
              <div className="flex flex-nowrap items-center gap-6 lg:gap-7">
                {nav.map((item) => (
                  <span
                    key={item.href}
                    className={`${itemClass} bg-fill-strong text-sand`}
                  >
                    {item.label}
                  </span>
                ))}
              </div>
            </div>
          </nav>
          <div className="flex shrink-0 items-center gap-2">
            <ThemeSwitcher />
            <a
              href={profile.resumeHref}
              download={profile.resumeFile}
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-sand px-3 py-1.5 text-[13px] font-medium text-bg transition-transform duration-100 ease-out hover:bg-sand-hover active:scale-[0.97] sm:px-3.5"
            >
              <DownloadIcon className="h-3.5 w-3.5" />
              Resume
            </a>
          </div>
        </div>
      </header>

      <nav
        className="fixed inset-x-0 bottom-0 z-50 px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] md:hidden"
        aria-label="Sections"
      >
        <div className="glass rounded-full border border-line bg-glass-strong px-1.5 py-1.5 shadow-[var(--shadow-dock)] backdrop-blur-[20px] backdrop-saturate-150">
          <div
            ref={dockRef}
            className="relative flex items-center"
          >
            <div className="flex w-full items-center">
              {nav.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  data-nav={item.href}
                  aria-current={active === item.href ? "location" : undefined}
                  onClick={() => go(item.href)}
                  className="flex min-w-0 flex-1 items-center justify-center rounded-full px-1 py-2 text-[11px] text-sand-dim whitespace-nowrap active:scale-[0.97] sm:text-[12px]"
                >
                  {item.label}
                </a>
              ))}
            </div>
            <div
              aria-hidden
              className={`nav-active ${dockPill.ready && !reduce ? "is-ready" : ""}`}
              style={{ clipPath: dockPill.clip }}
            >
              <div className="flex w-full items-center">
                {nav.map((item) => (
                  <span
                    key={item.href}
                    className="flex min-w-0 flex-1 items-center justify-center rounded-full bg-fill-strong px-1 py-2 text-[11px] text-sand whitespace-nowrap sm:text-[12px]"
                  >
                    {item.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
