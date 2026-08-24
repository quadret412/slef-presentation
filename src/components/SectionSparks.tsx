"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useReducedMotion } from "motion/react";

type Burst = { id: number; x: number; y: number };

const bits = [
  [0, -22],
  [0, 22],
  [8, -12],
  [-8, -12],
  [8, 12],
  [-8, 12],
  [11, 0],
  [-11, 0],
] as const;

export function SectionSparks() {
  const reduce = useReducedMotion();
  const [bursts, setBursts] = useState<Burst[]>([]);
  const nextId = useRef(0);

  useEffect(() => {
    let frame = 0;
    let first = true;
    const close = new Set<string>();

    const fire = (x: number, y: number) => {
      const id = nextId.current++;
      setBursts((list) => [...list, { id, x, y }]);
      window.setTimeout(() => {
        setBursts((list) => list.filter((burst) => burst.id !== id));
      }, reduce ? 220 : 500);
    };

    const probe = () => {
      const pills = [
        ...document.querySelectorAll<HTMLElement>("[data-section-pill]"),
      ]
        .map((node) => ({
          key: node.dataset.sectionPill ?? "",
          box: node.getBoundingClientRect(),
        }))
        .filter((item) => item.box.width > 0 && item.box.height > 0)
        .sort((a, b) => a.box.top - b.box.top);

      const now = new Set<string>();

      for (let index = 0; index < pills.length - 1; index += 1) {
        const current = pills[index];
        const next = pills[index + 1];
        const gap = next.box.top - current.box.bottom;
        if (gap > 12) continue;

        const pair = `${current.key}:${next.key}`;
        now.add(pair);
        if (!first && !close.has(pair)) {
          fire(
            (current.box.left + current.box.right) / 2,
            (current.box.bottom + next.box.top) / 2,
          );
        }
      }

      close.clear();
      for (const pair of now) close.add(pair);
      first = false;
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        probe();
      });
    };

    probe();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [reduce]);

  return (
    <div className="pointer-events-none hidden xl:block" aria-hidden>
      {bursts.map((burst) => (
        <span
          key={burst.id}
          className="section-spark"
          style={{ left: burst.x, top: burst.y }}
        >
          <span className="section-spark__core" />
          {reduce
            ? null
            : bits.map(([x, y], index) => (
                <span
                  key={index}
                  className="section-spark__bit"
                  style={
                    {
                      "--tx": `${x}px`,
                      "--ty": `${y}px`,
                    } as CSSProperties
                  }
                />
              ))}
        </span>
      ))}
    </div>
  );
}
