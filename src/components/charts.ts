"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "./ThemeProvider";
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  type ChartOptions,
  type ChartTypeRegistry,
} from "chart.js";

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  Filler,
  LinearScale,
  LineElement,
  PointElement,
  Legend,
  Tooltip,
);

export type ChartColors = {
  sand: string;
  dim: string;
  steel: string;
  deep: string;
  clay: string;
  line: string;
  raised: string;
  fill: string;
};

const palettes: Record<"light" | "dark", ChartColors> = {
  dark: {
    sand: "#f3ede4",
    dim: "#c8bdb0",
    steel: "#8eafc4",
    deep: "#5d7d90",
    clay: "#8a7360",
    line: "rgba(243, 237, 228, 0.1)",
    raised: "#14120f",
    fill: "rgba(255, 255, 255, 0.08)",
  },
  light: {
    sand: "#1c1915",
    dim: "#5c534b",
    steel: "#3f5f73",
    deep: "#2f4a5a",
    clay: "#7a6252",
    line: "rgba(28, 25, 21, 0.12)",
    raised: "#fffaf3",
    fill: "rgba(28, 25, 21, 0.08)",
  },
};

export const chartColor = palettes.dark;

function canvasFont() {
  if (typeof document === "undefined") return "system-ui, sans-serif";
  return getComputedStyle(document.body).fontFamily;
}

export function chartMotion(reduce: boolean | null) {
  return {
    duration: reduce ? 0 : 900,
    easing: "easeOutQuart" as const,
  };
}

export function baseOptions<TType extends keyof ChartTypeRegistry>(
  reduce: boolean | null,
  colors: ChartColors = chartColor,
): ChartOptions<TType> {
  const font = canvasFont();
  return {
    responsive: true,
    maintainAspectRatio: false,
    animation: chartMotion(reduce),
    font: { family: font, size: 12 },
    color: colors.dim,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: colors.raised,
        borderColor: colors.line,
        borderWidth: 1,
        titleColor: colors.sand,
        bodyColor: colors.dim,
        padding: 10,
        displayColors: false,
        titleFont: { family: font, size: 12, weight: 600 },
        bodyFont: { family: font, size: 12 },
      },
    },
  } as ChartOptions<TType>;
}

export function useChartColors(): ChartColors {
  const { resolved } = useTheme();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  return palettes[mounted ? resolved : "dark"];
}
