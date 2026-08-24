"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { techCatalog } from "./marks/TechMarks";

const names = ["nova", "kade", "mira", "rex", "lumen", "ash", "orio", "nile"];
const liveEase = [0.22, 1, 0.36, 1] as const;
const RAIL = 8;

type Drop = {
  id: number;
  user: string;
  tech: (typeof techCatalog)[number];
  mult: string;
  payout: string;
  hot: boolean;
};

function makeDrop(id: number): Drop {
  return {
    id,
    user: names[id % names.length],
    tech: techCatalog[id % techCatalog.length],
    mult: `${(1.4 + (id % 9) * 0.8).toFixed(2)}x`,
    payout: `$${(12 + (id % 7) * 18).toFixed(0)}`,
    hot: id % 5 === 0,
  };
}

export function LiveFeed() {
  const reduce = useReducedMotion();
  const [items, setItems] = useState<Drop[]>(() =>
    Array.from({ length: RAIL }, (_, index) => makeDrop(RAIL - 1 - index)),
  );
  const live = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  useEffect(() => {
    if (reduce) return;
    let next = RAIL;
    const id = window.setInterval(() => {
      const drop = makeDrop(next);
      next += 1;
      setItems((list) => [drop, ...list].slice(0, RAIL));
    }, 2400);
    return () => window.clearInterval(id);
  }, [reduce]);

  return (
    <div className="relative overflow-hidden">
      <ul className="live-drop-rail flex gap-2">
        <AnimatePresence initial={false}>
          {items.map((item) => (
            <motion.li
              key={item.id}
              layout={!reduce}
              className="shrink-0"
              initial={reduce ? false : { opacity: 0, x: "-100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduce ? undefined : { opacity: 0, x: "100%" }}
              transition={{
                duration: 0.64,
                ease: liveEase,
              }}
            >
              <article
                className={`live-drop-card${item.hot ? " live-drop-card--hot" : ""}${
                  live && item.id === items[0].id ? " live-drop-card--in" : ""
                }`}
              >
                <div className="live-drop-card__surface">
                  <div
                    className={`live-drop-card__icon ${
                      item.hot ? "is-hot" : ""
                    }`}
                  >
                    {item.tech.render("h-12 w-12")}
                  </div>
                  <div className="live-drop-card__body">
                    <span className="live-drop-card__mult">{item.mult}</span>
                    <p className="live-drop-card__user">{item.user}</p>
                  </div>
                  <p className="live-drop-card__payout">{item.payout}</p>
                </div>
              </article>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}
