"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  THEME_KEY,
  applyTheme,
  isThemeMode,
  resolveTheme,
  type ThemeMode,
  type ThemeResolved,
} from "@/lib/theme";

type ThemeContextValue = {
  mode: ThemeMode;
  resolved: ThemeResolved;
  setMode: (mode: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function readStoredMode(): ThemeMode {
  try {
    const stored = localStorage.getItem(THEME_KEY);
    if (isThemeMode(stored)) return stored;
  } catch {
    /* private mode */
  }
  const fromDom = document.documentElement.dataset.themeMode;
  return isThemeMode(fromDom) ? fromDom : "system";
}

function readDomMode(): ThemeMode {
  if (typeof document === "undefined") return "system";
  return readStoredMode();
}

function readDomResolved(): ThemeResolved {
  if (typeof document === "undefined") return "dark";
  return resolveTheme(readStoredMode());
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>(readDomMode);
  const [resolved, setResolved] = useState<ThemeResolved>(readDomResolved);

  useEffect(() => {
    applyTheme(mode, resolved);
  }, [mode, resolved]);

  useEffect(() => {
    if (mode !== "system") return;
    const media = window.matchMedia("(prefers-color-scheme: light)");
    const onChange = () => {
      const next = resolveTheme("system");
      setResolved(next);
      applyTheme("system", next);
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [mode]);

  const value = useMemo(
    () => ({
      mode,
      resolved,
      setMode: (nextMode: ThemeMode) => {
        const next = resolveTheme(nextMode);
        setModeState(nextMode);
        setResolved(next);
        applyTheme(nextMode, next);
        try {
          localStorage.setItem(THEME_KEY, nextMode);
        } catch {
          /* private mode */
        }
      },
    }),
    [mode, resolved],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }
  return context;
}
