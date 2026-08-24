"use client";

import { useRef, useState, type PointerEvent } from "react";
import { motion, useReducedMotion } from "motion/react";
import { useTheme } from "./ThemeProvider";
import { WalletSheet } from "./WalletSheet";

const easeOut = [0.23, 1, 0.32, 1] as const;

type Skin = {
  ink: string;
  muted: string;
  accent: string;
  field: string;
  chip: string;
  line: string;
};

const brands = [
  {
    id: "atlas",
    name: "Atlas",
    dark: {
      ink: "#f3ede4",
      muted: "#c8bdb0",
      accent: "#8eafc4",
      field: "#14120f",
      chip: "#1c2429",
      line: "rgba(243,237,228,0.12)",
    },
    light: {
      ink: "#1c1915",
      muted: "#5c534b",
      accent: "#3f5f73",
      field: "#fffaf3",
      chip: "#ebe3d6",
      line: "rgba(28,25,21,0.1)",
    },
  },
  {
    id: "ember",
    name: "Ember",
    dark: {
      ink: "#fff1e4",
      muted: "#e0b89a",
      accent: "#e07a4a",
      field: "#1a100c",
      chip: "#2a1812",
      line: "rgba(255,241,228,0.12)",
    },
    light: {
      ink: "#2a140e",
      muted: "#8a5340",
      accent: "#c45a2e",
      field: "#fff6ef",
      chip: "#f0e0d4",
      line: "rgba(42,20,14,0.1)",
    },
  },
  {
    id: "vale",
    name: "Vale",
    dark: {
      ink: "#e8f7ef",
      muted: "#9ec9b1",
      accent: "#41b883",
      field: "#0d1612",
      chip: "#14241c",
      line: "rgba(232,247,239,0.12)",
    },
    light: {
      ink: "#10241a",
      muted: "#3d6b54",
      accent: "#2f8f62",
      field: "#f3faf6",
      chip: "#dceee4",
      line: "rgba(16,36,26,0.1)",
    },
  },
] as const;

export function BrandStudio() {
  const [active, setActive] = useState<(typeof brands)[number]["id"]>("atlas");
  const [walletOpen, setWalletOpen] = useState(false);
  const { resolved } = useTheme();
  const reduce = useReducedMotion();
  const stage = useRef<HTMLDivElement>(null);
  const brand = brands.find((item) => item.id === active) ?? brands[0];
  const skin: Skin = brand[resolved];

  const tilt = (event: PointerEvent<HTMLDivElement>) => {
    if (reduce) return;
    if (event.pointerType !== "mouse") return;
    const node = stage.current;
    if (!node) return;
    const box = node.getBoundingClientRect();
    const x = (event.clientX - box.left) / box.width - 0.5;
    const y = (event.clientY - box.top) / box.height - 0.5;
    node.style.transform = `perspective(900px) rotateX(${-y * 6}deg) rotateY(${x * 8}deg)`;
  };

  const resetTilt = () => {
    if (!stage.current) return;
    stage.current.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Brand skins">
        {brands.map((item) => {
          const selected = item.id === active;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setActive(item.id)}
              className={`cursor-pointer rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-[background,color,transform] duration-200 ease-[var(--ease-out)] active:scale-[0.97] ${
                selected ? "bg-sand text-bg" : "bg-fill text-sand-dim hover:text-sand"
              }`}
            >
              {item.name}
            </button>
          );
        })}
      </div>

      <div
        className="mt-6 [perspective:900px]"
        onPointerMove={tilt}
        onPointerLeave={resetTilt}
      >
        <div
          ref={stage}
          className="origin-center rounded-[20px] p-5 shadow-[var(--panel-shadow)] transition-transform duration-200 ease-[var(--ease-out)] sm:p-6"
          style={{
            background: skin.field,
            color: skin.ink,
            boxShadow: `inset 0 0 0 1px ${skin.line}, var(--panel-shadow)`,
          }}
        >
          <div className="flex items-center justify-between gap-4">
            <p className="text-[13px] tracking-[-0.02em]" style={{ color: skin.accent }}>
              {brand.name}
            </p>
            <span
              className="rounded-full px-2.5 py-1 text-[11px] tabular"
              style={{ background: skin.chip, color: skin.muted }}
            >
              live · 3 brands
            </span>
          </div>
          <motion.h3
            key={`${brand.id}-${resolved}`}
            className="mt-6 max-w-none text-[clamp(1.8rem,4vw,2.6rem)] font-semibold leading-[1.02] tracking-[-0.03em] sm:max-w-[12ch]"
            initial={reduce ? false : { opacity: 0.7, transform: "translateY(8px)" }}
            animate={{ opacity: 1, transform: "translateY(0px)" }}
            transition={{ duration: 0.22, ease: easeOut }}
          >
            One codebase. Three skins.
          </motion.h3>
          <p className="mt-3 max-w-[36ch] text-[14px] leading-6" style={{ color: skin.muted }}>
            Same tree, same tokens contract. Figma tokens in, one component out.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setWalletOpen(true)}
              className="cursor-pointer rounded-full px-4 py-2 text-[13px] font-medium transition-transform duration-100 ease-out active:scale-[0.97]"
              style={{ background: skin.accent, color: skin.field }}
            >
              Open wallet
            </button>
            <span className="tabular text-[13px]" style={{ color: skin.muted }}>
              $2,480.00
            </span>
          </div>
        </div>
      </div>
      <WalletSheet
        open={walletOpen}
        accent={skin.accent}
        field={skin.field}
        ink={skin.ink}
        muted={skin.muted}
        chip={skin.chip}
        onClose={() => setWalletOpen(false)}
      />
    </div>
  );
}
