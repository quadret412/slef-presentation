import { useSyncExternalStore } from "react";

export const FINE_DESK_QUERY =
  "(hover: hover) and (pointer: fine) and (min-width: 768px)";

export function fineDeskMatches() {
  return window.matchMedia(FINE_DESK_QUERY).matches;
}

function subscribeFineDesk(onChange: () => void) {
  const media = window.matchMedia(FINE_DESK_QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

export function useFineDesk() {
  return useSyncExternalStore(subscribeFineDesk, fineDeskMatches, () => false);
}
