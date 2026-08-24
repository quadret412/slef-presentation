export const THEME_KEY = "theme";
export const THEME_MODES = ["system", "light", "dark"] as const;

export type ThemeMode = (typeof THEME_MODES)[number];
export type ThemeResolved = "light" | "dark";

export const THEME_COLORS = {
  light: "#f3eee6",
  dark: "#0b0a08",
} as const;

export function isThemeMode(value: string | null | undefined): value is ThemeMode {
  return value === "system" || value === "light" || value === "dark";
}

export function systemTheme(): ThemeResolved {
  return window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";
}

export function resolveTheme(mode: ThemeMode): ThemeResolved {
  return mode === "system" ? systemTheme() : mode;
}

export function nextThemeMode(mode: ThemeMode): ThemeMode {
  return THEME_MODES[(THEME_MODES.indexOf(mode) + 1) % THEME_MODES.length];
}

export function applyTheme(mode: ThemeMode, resolved: ThemeResolved) {
  const root = document.documentElement;
  root.dataset.theme = resolved;
  root.dataset.themeMode = mode;
  root.style.colorScheme = resolved;

  for (const meta of document.querySelectorAll('meta[name="theme-color"]')) {
    meta.setAttribute("content", THEME_COLORS[resolved]);
  }
}

export const themeBootScript = `(function(){try{var m=localStorage.getItem("${THEME_KEY}");var mode=m==="light"||m==="dark"||m==="system"?m:"system";var resolved=mode==="system"?(matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"):mode;var r=document.documentElement;r.dataset.theme=resolved;r.dataset.themeMode=mode;r.style.colorScheme=resolved;}catch(e){var r=document.documentElement;r.dataset.theme="dark";r.dataset.themeMode="system";r.style.colorScheme="dark";}})();`;
