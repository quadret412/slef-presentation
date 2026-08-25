"use client";

import { memo, useCallback, useEffect, useRef, useState } from "react";
import type { RefObject } from "react";
import { motion, useReducedMotion } from "motion/react";
import { techCatalog } from "./marks/TechMarks";

const ITEM = 72;
const BUFFER = 2;
const SCROLL_CELLS = 20;
const DURATION = 1200;
const easeOut = [0.23, 1, 0.32, 1] as const;

type Tech = (typeof techCatalog)[number];

function itemAt(v: number, winners: Map<number, Tech>): Tech {
  const pinned = winners.get(v);
  if (pinned) return pinned;
  const i = ((v % techCatalog.length) + techCatalog.length) % techCatalog.length;
  return techCatalog[i];
}

function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3;
}

function paintSlot(
  el: HTMLDivElement,
  v: number,
  offset: number,
  winners: Map<number, Tech>,
  rebound: boolean,
) {
  if (rebound) el.style.visibility = "hidden";
  el.style.transform = `translate3d(${v * ITEM - offset}px, 0, 0)`;
  if (rebound) {
    const id = itemAt(v, winners).id;
    for (const node of el.querySelectorAll<HTMLElement>("[data-mark]")) {
      node.hidden = node.dataset.mark !== id;
    }
    el.style.visibility = "visible";
  }
}

const ReelTrack = memo(function ReelTrack({
  viewportRef,
  bindSlot,
  ringN,
}: {
  viewportRef: RefObject<HTMLDivElement | null>;
  bindSlot: (slot: number) => (el: HTMLDivElement | null) => void;
  ringN: number;
}) {
  return (
    <div ref={viewportRef} className="relative mt-5 h-[4.5rem] overflow-hidden">
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10"
        style={{
          background: "linear-gradient(90deg, var(--reel-edge), transparent)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10"
        style={{
          background: "linear-gradient(270deg, var(--reel-edge), transparent)",
        }}
      />
      <div className="pointer-events-none absolute inset-y-1 left-1/2 z-10 w-[72px] -translate-x-1/2 rounded-[14px] ring-1 ring-sand/35" />
      {Array.from({ length: ringN }, (_, slot) => (
        <div
          key={slot}
          ref={bindSlot(slot)}
          className="absolute top-0 left-0 grid place-items-center [transition:none]"
          style={{ width: ITEM, height: ITEM }}
        >
          <div className="relative h-9 w-9">
            {techCatalog.map((item) => (
              <span
                key={item.id}
                data-mark={item.id}
                hidden
                className="absolute inset-0 grid place-items-center"
              >
                {item.render("h-9 w-9")}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
});

export function CrateReel() {
  const reduce = useReducedMotion();
  const viewportRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const slotEls = useRef<(HTMLDivElement | null)[]>([]);
  const slots = useRef<{ v: number }[]>([]);
  const offsetRef = useRef(0);
  const winnersRef = useRef<Map<number, Tech>>(new Map());
  const ringNRef = useRef(0);
  const centerRef = useRef(160);
  const seededRef = useRef(false);
  const spinningRef = useRef(false);
  const frameRef = useRef(0);
  const bindersRef = useRef<Array<(el: HTMLDivElement | null) => void>>([]);
  const [ringN, setRingN] = useState(0);
  const [landed, setLanded] = useState<Tech | null>(null);
  const [landKey, setLandKey] = useState(0);

  const paintRef = useRef((el: HTMLDivElement, slot: number) => {
    const v = slots.current[slot]?.v ?? slot;
    paintSlot(el, v, offsetRef.current, winnersRef.current, true);
  });

  const bindSlot = useCallback((slot: number) => {
    if (!bindersRef.current[slot]) {
      bindersRef.current[slot] = (el) => {
        slotEls.current[slot] = el;
        if (el) paintRef.current(el, slot);
      };
    }
    return bindersRef.current[slot];
  }, []);

  const updateSlots = (offset: number, force = false) => {
    const n = ringNRef.current;
    if (!n) return;
    const visibleStart = Math.floor(offset / ITEM) - BUFFER;

    for (let i = 0; i < n; i++) {
      const v = visibleStart + i;
      const slot = ((v % n) + n) % n;
      const cell = slots.current[slot];
      const rebound = force || !cell || cell.v !== v;
      if (rebound) slots.current[slot] = { v };
      const el = slotEls.current[slot];
      if (el) paintSlot(el, v, offset, winnersRef.current, rebound);
    }
  };

  useEffect(() => {
    const node = viewportRef.current;
    if (!node) return;

    const measure = () => {
      if (spinningRef.current) return;
      const width = node.clientWidth;
      if (width <= 0) return;
      centerRef.current = width / 2;
      const desired = Math.max(8, Math.ceil(width / ITEM) + BUFFER * 2 + 2);

      if (!seededRef.current) {
        offsetRef.current = 2 * ITEM + ITEM / 2 - centerRef.current;
        seededRef.current = true;
      }

      if (desired !== ringNRef.current) {
        ringNRef.current = desired;
        const next = Array.from({ length: desired }, (_, index) => ({
          v: slots.current[index]?.v ?? index,
        }));
        slots.current = next;
        setRingN(desired);
      }

      requestAnimationFrame(() => updateSlots(offsetRef.current, true));
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (spinningRef.current) return;
    updateSlots(offsetRef.current, true);
  }, [ringN]);

  useEffect(() => {
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  const setButton = (busy: boolean) => {
    const button = buttonRef.current;
    if (!button) return;
    button.disabled = busy;
    button.textContent = busy ? "Rolling…" : "Start roll";
  };

  const roll = () => {
    if (spinningRef.current) return;
    spinningRef.current = true;
    setButton(true);

    const start = offsetRef.current;
    const center = centerRef.current;
    let winnerIndex = Math.max(0, Math.floor((start + center) / ITEM)) + SCROLL_CELLS;
    let target = winnerIndex * ITEM + ITEM / 2 - center;
    if (target <= start) {
      winnerIndex = Math.floor((start + center) / ITEM) + SCROLL_CELLS;
      target = start + SCROLL_CELLS * ITEM;
      winnerIndex = Math.max(winnerIndex, Math.round((target + center - ITEM / 2) / ITEM));
      target = winnerIndex * ITEM + ITEM / 2 - center;
    }
    const winnerItem =
      techCatalog[Math.floor(Math.random() * techCatalog.length)];
    winnersRef.current.set(winnerIndex, winnerItem);
    const distance = target - start;

    const finish = () => {
      offsetRef.current = target;
      updateSlots(target, true);
      spinningRef.current = false;
      setButton(false);
      setLanded(winnerItem);
      setLandKey((key) => key + 1);
    };

    if (reduce) {
      finish();
      return;
    }

    const begun = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - begun) / DURATION, 1);
      const next = Math.max(start, start + easeOutCubic(progress) * distance);
      offsetRef.current = next;
      updateSlots(next);
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick);
        return;
      }
      finish();
    };
    frameRef.current = requestAnimationFrame(tick);
  };

  return (
    <div>
      <button
        ref={buttonRef}
        type="button"
        onClick={roll}
        className="w-full rounded-full bg-sand py-2.5 text-[14px] font-medium text-bg transition-[background,transform] duration-100 ease-out hover:bg-sand-hover active:scale-[0.97] disabled:opacity-60"
      >
        Start roll
      </button>

      <ReelTrack
        viewportRef={viewportRef}
        bindSlot={bindSlot}
        ringN={ringN}
      />

      <div className="mt-4 min-h-[3.4rem]">
        {landed ? (
          <motion.p
            key={`${landed.id}-${landKey}`}
            className="text-[15px] leading-6 text-sand"
            initial={
              reduce ? false : { opacity: 0, transform: "translateY(8px)" }
            }
            animate={{ opacity: 1, transform: "translateY(0px)" }}
            transition={{ duration: 0.28, ease: easeOut }}
          >
            <span className="font-medium">{landed.name}.</span>{" "}
            <span className="text-sand-dim">{landed.used}</span>
          </motion.p>
        ) : (
          <p className="text-[14px] text-sand-dim">
            Start the roll. The land is the reveal.
          </p>
        )}
      </div>
    </div>
  );
}
