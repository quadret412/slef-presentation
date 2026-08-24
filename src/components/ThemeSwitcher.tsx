"use client";

import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { AutoIcon, MoonIcon, SunIcon } from "./Icons";
import { useTheme } from "./ThemeProvider";
import { THEME_MODES, type ThemeMode } from "@/lib/theme";

const copy: Record<ThemeMode, { label: string; Icon: typeof SunIcon }> = {
  system: { label: "System", Icon: AutoIcon },
  light: { label: "Light", Icon: SunIcon },
  dark: { label: "Dark", Icon: MoonIcon },
};

function canHover() {
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

export function ThemeSwitcher() {
  const { mode, setMode } = useTheme();
  const ready = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const labelId = useId();
  const shown = ready ? mode : "system";

  useEffect(() => {
    if (!open) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const onPointer = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };

    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointer);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  return (
    <div
      ref={root}
      className={`theme-switch${open ? " is-open" : ""}`}
      data-mode={shown}
    >
      <div
        className="theme-switch__pill"
        onMouseEnter={() => {
          if (canHover()) setOpen(true);
        }}
        onMouseLeave={() => {
          if (canHover()) setOpen(false);
        }}
      >
        <div
          role="radiogroup"
          aria-labelledby={labelId}
          className="theme-switch__row"
        >
          <span id={labelId} className="sr-only">
            Theme
          </span>
          {THEME_MODES.map((item) => {
            const { label, Icon } = copy[item];
            const selected = shown === item;
            return (
              <button
                key={item}
                type="button"
                role="radio"
                aria-checked={selected}
                aria-label={label}
                title={label}
                tabIndex={selected || open ? 0 : -1}
                className={`theme-switch__option${selected ? " is-on" : ""}`}
                onClick={() => {
                  if (!open && !canHover()) {
                    setOpen(true);
                    return;
                  }
                  setMode(item);
                  if (!canHover()) setOpen(false);
                }}
                onFocus={() => setOpen(true)}
              >
                <Icon className="h-4 w-4" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
