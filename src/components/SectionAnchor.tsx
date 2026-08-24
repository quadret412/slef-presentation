"use client";

import { useSectionNav } from "./section-nav";

export function SectionAnchor({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  const { go } = useSectionNav();

  return (
    <div className="pointer-events-none absolute inset-y-0 left-0 hidden xl:block">
      <div className="absolute inset-y-0 right-full mr-7 w-28">
        <span
          aria-hidden
          className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-sand/15"
        />
        <a
          href={href}
          onClick={() => go(href)}
          data-section-pill={href}
          className="pointer-events-auto sticky top-1/2 z-[1] mx-auto flex w-fit -translate-y-1/2 rounded-full bg-bg-raised px-3 py-1.5 text-[13px] tracking-[-0.01em] text-sand shadow-[0_0_0_1px_var(--line)]"
        >
          {label}
        </a>
      </div>
    </div>
  );
}
