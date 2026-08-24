"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import { useReducedMotion } from "motion/react";
import type { ChartOptions, Plugin } from "chart.js";
import { metrics, profile } from "@/data/profile";
import { baseOptions, chartMotion, useChartColors } from "./charts";
import { Reveal } from "./Reveal";
import { SectionAnchor } from "./SectionAnchor";

function monthsFromDuration(duration: string) {
  const years = Number(/(\d+)\s*yr/.exec(duration)?.[1] ?? 0);
  const months = Number(/(\d+)\s*mo/.exec(duration)?.[1] ?? 0);
  return years * 12 + months;
}

function useEntered() {
  const ref = useRef<HTMLDivElement>(null);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setEntered(true);
        observer.disconnect();
      },
      { threshold: 0, rootMargin: "80px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return { ref, entered };
}

function ChartLegend({
  items,
}: {
  items: { label: string; color: string; detail: string }[];
}) {
  return (
    <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
      {items.map((item) => (
        <li key={item.label} className="flex items-center gap-2 text-[13px]">
          <span
            className="h-1.5 w-1.5 shrink-0 rounded-full"
            style={{ background: item.color }}
            aria-hidden="true"
          />
          <span className="text-sand-dim">{item.label}</span>
          <span className="tabular text-sand">{item.detail}</span>
        </li>
      ))}
    </ul>
  );
}

export function Metrics() {
  const reduce = useReducedMotion();
  const chartColor = useChartColors();
  const { ref, entered } = useEntered();
  const animate = entered && !reduce;

  const roles = useMemo(
    () =>
      profile.experience.map((job) => ({
        label: job.company.split(/[.\s]/)[0],
        months: monthsFromDuration(job.duration),
        duration: job.duration,
      })),
    [],
  );

  const skills = useMemo(
    () =>
      profile.skills.map((group, index) => ({
        label: group.group,
        count: group.items.length,
        color:
          [chartColor.steel, chartColor.sand, chartColor.deep, chartColor.clay][
            index
          ] ?? chartColor.dim,
      })),
    [chartColor],
  );

  const loadOptions = useMemo<ChartOptions<"bar">>(
    () => ({
      ...baseOptions<"bar">(reduce, chartColor),
      scales: {
        x: {
          grid: { display: false },
          border: { display: false },
          ticks: { color: chartColor.dim },
        },
        y: {
          beginAtZero: true,
          max: 2.4,
          grid: { color: chartColor.line },
          border: { display: false },
          ticks: {
            color: chartColor.dim,
            callback: (value) => `${value}s`,
          },
        },
      },
    }),
    [reduce, chartColor],
  );

  const roleOptions = useMemo<ChartOptions<"bar">>(
    () => ({
      ...baseOptions<"bar">(reduce, chartColor),
      indexAxis: "y",
      scales: {
        x: {
          beginAtZero: true,
          grid: { color: chartColor.line },
          border: { display: false },
          ticks: {
            color: chartColor.dim,
            callback: (value) => `${value} mo`,
          },
        },
        y: {
          grid: { display: false },
          border: { display: false },
          ticks: { color: chartColor.dim },
        },
      },
    }),
    [reduce, chartColor],
  );

  const doughnutOptions = useMemo<ChartOptions<"doughnut">>(
    () => ({
      ...baseOptions<"doughnut">(reduce, chartColor),
      cutout: "72%",
    }),
    [reduce, chartColor],
  );

  const countOptions = useMemo<ChartOptions<"bar">>(
    () => ({
      ...baseOptions<"bar">(reduce, chartColor),
      scales: {
        x: {
          grid: { display: false },
          border: { display: false },
          ticks: { color: chartColor.dim },
        },
        y: {
          beginAtZero: true,
          grid: { color: chartColor.line },
          border: { display: false },
          ticks: {
            color: chartColor.dim,
            precision: 0,
          },
        },
      },
    }),
    [reduce, chartColor],
  );

  const lineOptions = useMemo<ChartOptions<"line">>(
    () => ({
      ...baseOptions<"line">(reduce, chartColor),
      scales: {
        x: {
          grid: { display: false },
          border: { display: false },
          ticks: { color: chartColor.dim },
        },
        y: {
          beginAtZero: true,
          max: 60,
          grid: { color: chartColor.line },
          border: { display: false },
          ticks: {
            color: chartColor.dim,
            stepSize: 10,
          },
        },
      },
    }),
    [reduce, chartColor],
  );

  const bundleCenter: Plugin<"doughnut"> = useMemo(
    () => ({
      id: "bundleCenter",
      afterDraw(chart) {
        const { ctx, chartArea } = chart;
        const x = (chartArea.left + chartArea.right) / 2;
        const y = (chartArea.top + chartArea.bottom) / 2;
        ctx.save();
        ctx.fillStyle = chartColor.sand;
        ctx.font = `600 22px ${getComputedStyle(document.body).fontFamily}`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(`−${metrics.bundleCutPercent}%`, x, y - 8);
        ctx.fillStyle = chartColor.dim;
        ctx.font = `400 11px ${getComputedStyle(document.body).fontFamily}`;
        ctx.fillText("bundle cut", x, y + 12);
        ctx.restore();
      },
    }),
    [chartColor],
  );

  return (
    <section
      id="metrics"
      className="relative mx-auto max-w-[72rem] border-t border-line px-5 py-12 sm:px-8 sm:py-16"
    >
      <SectionAnchor href="#metrics" label="Metrics" />
      <Reveal>
        <h2 className="max-w-none text-[clamp(2rem,4.4vw,3.25rem)] font-semibold leading-[1.05] tracking-[-0.03em] sm:max-w-[16ch]">
          Numbers I can stand behind.
        </h2>
      </Reveal>
      <Reveal delay={0.06}>
        <p className="mt-4 max-w-[54ch] text-[17px] leading-[1.6] text-sand-dim">
          Load, bundle, brands, components, frame budget, time in role, and the
          stack as I list it. The component line is an illustrative path to the
          50+ floor.
        </p>
      </Reveal>

      <div
        ref={ref}
        className="mt-10 grid min-w-0 items-start gap-x-16 gap-y-14 lg:grid-cols-12"
      >
        <figure className="min-w-0 lg:col-span-7">
          <figcaption className="text-[17px] font-medium tracking-[-0.02em] text-sand">
            Lighthouse load
          </figcaption>
          <p className="mt-2 max-w-[42ch] text-[14px] leading-6 text-sand-dim">
            Gameplay UI, not a marketing landing page. Lazy routes, asset
            delivery, render strategy.
          </p>
          <div className="relative mt-5 h-[220px] w-full min-w-0">
              <Bar
                data={{
                  labels: ["Before", "After"],
                  datasets: [
                    {
                      data: [
                        metrics.lighthouseLoadSec.before,
                        metrics.lighthouseLoadSec.after,
                      ],
                      backgroundColor: [chartColor.deep, chartColor.steel],
                      borderRadius: 8,
                      barPercentage: 0.46,
                    },
                  ],
                }}
                options={{
                  ...loadOptions,
                  animation: animate ? chartMotion(false) : { duration: 0 },
                }}
              />
          </div>
          <p className="sr-only">
            Lighthouse load {metrics.lighthouseLoadSec.before} seconds before,
            {` ${metrics.lighthouseLoadSec.after} `}
            seconds after.
          </p>
        </figure>

        <figure className="min-w-0 lg:col-span-5">
          <figcaption className="text-[17px] font-medium tracking-[-0.02em] text-sand">
            JavaScript bundle
          </figcaption>
          <p className="mt-2 max-w-[36ch] text-[14px] leading-6 text-sand-dim">
            Vite analyzer: code splitting, dependency cleanup, build config.
          </p>
          <div className="relative mt-5 h-[220px] w-full min-w-0">
              <Doughnut
                data={{
                  labels: ["Cut", "Remaining"],
                  datasets: [
                    {
                      data: [
                        metrics.bundleCutPercent,
                        100 - metrics.bundleCutPercent,
                      ],
                      backgroundColor: [chartColor.steel, chartColor.fill],
                      borderWidth: 0,
                      hoverOffset: 0,
                    },
                  ],
                }}
                options={{
                  ...doughnutOptions,
                  animation: animate ? chartMotion(false) : { duration: 0 },
                }}
                plugins={[bundleCenter]}
              />
          </div>
          <ChartLegend
            items={[
              {
                label: "Removed",
                color: chartColor.steel,
                detail: `~${metrics.bundleCutPercent}%`,
              },
              {
                label: "Still in the bundle",
                color: chartColor.fill,
                detail: `~${100 - metrics.bundleCutPercent}%`,
              },
            ]}
          />
        </figure>

        <figure className="min-w-0 lg:col-span-7">
          <figcaption className="text-[17px] font-medium tracking-[-0.02em] text-sand">
            Months in each role
          </figcaption>
          <p className="mt-2 max-w-[46ch] text-[14px] leading-6 text-sand-dim">
            From the dates on the résumé. Some roles overlap, so this is time in
            post, not an exclusive career split.
          </p>
          <div className="relative mt-5 h-[240px] w-full min-w-0">
              <Bar
                data={{
                  labels: roles.map((role) => role.label),
                  datasets: [
                    {
                      data: roles.map((role) => role.months),
                      backgroundColor: roles.map((_, index) =>
                        index === 0 ? chartColor.steel : chartColor.deep,
                      ),
                      borderRadius: 8,
                      barPercentage: 0.56,
                    },
                  ],
                }}
                options={{
                  ...roleOptions,
                  animation: animate ? chartMotion(false) : { duration: 0 },
                }}
              />
          </div>
          <p className="sr-only">
            {roles
              .map((role) => `${role.label}: ${role.duration}`)
              .join(". ")}
          </p>
        </figure>

        <figure className="min-w-0 lg:col-span-5">
          <figcaption className="text-[17px] font-medium tracking-[-0.02em] text-sand">
            How the stack is grouped
          </figcaption>
          <p className="mt-2 max-w-[36ch] text-[14px] leading-6 text-sand-dim">
            Count of skills as listed on this page. Not a usage-share claim.
          </p>
          <div className="relative mt-5 h-[220px] w-full min-w-0">
              <Doughnut
                data={{
                  labels: skills.map((skill) => skill.label),
                  datasets: [
                    {
                      data: skills.map((skill) => skill.count),
                      backgroundColor: skills.map((skill) => skill.color),
                      borderWidth: 0,
                      hoverOffset: 0,
                    },
                  ],
                }}
                options={{
                  ...doughnutOptions,
                  animation: animate ? chartMotion(false) : { duration: 0 },
                }}
              />
          </div>
          <ChartLegend
            items={skills.map((skill) => ({
              label: skill.label,
              color: skill.color,
              detail: String(skill.count),
            }))}
          />
        </figure>

        <figure className="min-w-0 lg:col-span-4">
          <figcaption className="text-[17px] font-medium tracking-[-0.02em] text-sand">
            One codebase, three brands
          </figcaption>
          <p className="mt-2 max-w-[36ch] text-[14px] leading-6 text-sand-dim">
            One tree. Three live production skins. Same components, tokens, and
            ship path.
          </p>
          <div className="mt-5">
            <div className="rounded-2xl border border-line bg-fill px-4 py-4">
              <p className="text-[12px] text-steel">Codebase</p>
              <p className="mt-1 text-[16px] font-medium tracking-[-0.02em] text-sand">
                Vue 3 + TypeScript
              </p>
              <p className="mt-1 text-[13px] text-sand-dim">1 frontend</p>
            </div>
            <svg
              viewBox="0 0 120 28"
              className="mx-auto block h-7 w-full"
              aria-hidden="true"
            >
              <path
                d="M60 0v10M14 10h92M14 10v18M60 10v18M106 10v18"
                stroke="var(--line)"
                strokeWidth="1.25"
                fill="none"
              />
            </svg>
            <div className="grid grid-cols-3 gap-2">
              {["01", "02", "03"].map((label) => (
                <div
                  key={label}
                  className="rounded-xl border border-line bg-fill px-2 py-3 text-center"
                >
                  <p className="tabular text-[11px] text-steel">{label}</p>
                  <p className="mt-1 text-[13px] leading-4 text-sand">
                    Live brand
                  </p>
                </div>
              ))}
            </div>
          </div>
          <p className="sr-only">
            One Vue 3 and TypeScript codebase serving {metrics.brands} live
            production brands.
          </p>
        </figure>

        <figure className="min-w-0 lg:col-span-8">
          <figcaption className="text-[17px] font-medium tracking-[-0.02em] text-sand">
            Production components
          </figcaption>
          <p className="mt-2 max-w-[48ch] text-[14px] leading-6 text-sand-dim">
            Illustrative build-up on the current platform, from first tokens to
            the Storybook floor. Fifty is the landed count, not a sprint log.
          </p>
          <div className="relative mt-5 h-[220px] w-full min-w-0">
              <Line
                data={{
                  labels: metrics.componentGrowth.map((point) => point.label),
                  datasets: [
                    {
                      data: metrics.componentGrowth.map((point) => point.count),
                      borderColor: chartColor.steel,
                      backgroundColor: "rgba(142, 175, 196, 0.16)",
                      fill: true,
                      tension: 0.35,
                      borderWidth: 2,
                      pointRadius: 3.5,
                      pointBackgroundColor: chartColor.sand,
                      pointBorderColor: chartColor.steel,
                      pointBorderWidth: 1.5,
                    },
                  ],
                }}
                options={{
                  ...lineOptions,
                  animation: animate ? chartMotion(false) : { duration: 0 },
                }}
              />
          </div>
          <ChartLegend
            items={[
              {
                label: "Reusable UI",
                color: chartColor.steel,
                detail: `${metrics.components}+`,
              },
            ]}
          />
          <p className="sr-only">
            Component library growing from{" "}
            {metrics.componentGrowth[0].count} to {metrics.components} or more.
          </p>
        </figure>

        <figure className="min-w-0 lg:col-span-12">
          <figcaption className="text-[17px] font-medium tracking-[-0.02em] text-sand">
            Frame budget
          </figcaption>
          <p className="mt-2 max-w-[54ch] text-[14px] leading-6 text-sand-dim">
            Crate and gameplay UI. The clay line is one pass before the render
            budget - it hunts between 50 and 15. After: desktop holds 60,
            mobile holds 30.
          </p>
          <div className="mt-5 grid gap-10 lg:grid-cols-2">
            <div className="min-w-0">
              <p className="text-[13px] text-steel">Held floor</p>
              <p className="mt-1 text-[13px] leading-5 text-sand-dim">
                Average before vs after, desktop and mobile.
              </p>
              <div className="relative mt-3 h-[220px] w-full min-w-0">
                <Bar
                  data={{
                    labels: ["Desktop", "Mobile"],
                    datasets: [
                      {
                        label: "Before",
                        data: [
                          metrics.fps.beforeDesktop,
                          metrics.fps.beforeMobile,
                        ],
                        backgroundColor: chartColor.clay,
                        borderRadius: 8,
                        barPercentage: 0.62,
                        categoryPercentage: 0.58,
                      },
                      {
                        label: "After",
                        data: [metrics.fps.desktop, metrics.fps.mobile],
                        backgroundColor: chartColor.steel,
                        borderRadius: 8,
                        barPercentage: 0.62,
                        categoryPercentage: 0.58,
                      },
                    ],
                  }}
                  options={{
                    ...countOptions,
                    scales: {
                      ...countOptions.scales,
                      y: {
                        ...countOptions.scales?.y,
                        max: 60,
                        ticks: {
                          color: chartColor.dim,
                          stepSize: 15,
                          callback: (value) => `${value} FPS`,
                        },
                      },
                    },
                    animation: animate ? chartMotion(false) : { duration: 0 },
                  }}
                />
              </div>
              <ChartLegend
                items={[
                  {
                    label: "Before",
                    color: chartColor.clay,
                    detail: "50 / 15",
                  },
                  {
                    label: "After",
                    color: chartColor.steel,
                    detail: "60 / 30",
                  },
                ]}
              />
            </div>
            <div className="min-w-0">
              <p className="text-[13px] text-steel">One crate pass</p>
              <p className="mt-1 text-[13px] leading-5 text-sand-dim">
                Same UI over time. Jagged is the old pass. Flat is the held
                budget.
              </p>
              <div className="relative mt-3 h-[220px] w-full min-w-0">
                <Line
                  data={{
                    labels: metrics.fps.beforeSamples.map((_, index) =>
                      String(index + 1),
                    ),
                    datasets: [
                      {
                        label: "Before, unstable",
                        data: [...metrics.fps.beforeSamples],
                        borderColor: chartColor.clay,
                        backgroundColor: "transparent",
                        tension: 0.15,
                        borderWidth: 2,
                        pointRadius: 0,
                      },
                      {
                        label: "Desktop after, held",
                        data: [...metrics.fps.afterDesktopSamples],
                        borderColor: chartColor.steel,
                        backgroundColor: "transparent",
                        tension: 0.2,
                        borderWidth: 2,
                        pointRadius: 0,
                      },
                      {
                        label: "Mobile after, held",
                        data: [...metrics.fps.afterMobileSamples],
                        borderColor: chartColor.deep,
                        backgroundColor: "transparent",
                        tension: 0.2,
                        borderWidth: 2,
                        pointRadius: 0,
                      },
                    ],
                  }}
                  options={{
                    ...lineOptions,
                    scales: {
                      ...lineOptions.scales,
                      x: {
                        ...lineOptions.scales?.x,
                        ticks: { display: false },
                      },
                      y: {
                        ...lineOptions.scales?.y,
                        max: 60,
                        ticks: {
                          color: chartColor.dim,
                          stepSize: 15,
                          callback: (value) => `${value} FPS`,
                        },
                      },
                    },
                    animation: animate ? chartMotion(false) : { duration: 0 },
                  }}
                />
              </div>
              <ChartLegend
                items={[
                  {
                    label: "Before, unstable",
                    color: chartColor.clay,
                    detail: "50–15",
                  },
                  {
                    label: "Desktop after, held",
                    color: chartColor.steel,
                    detail: `${metrics.fps.desktop} FPS`,
                  },
                  {
                    label: "Mobile after, held",
                    color: chartColor.deep,
                    detail: `${metrics.fps.mobile} FPS`,
                  },
                ]}
              />
            </div>
          </div>
          <p className="sr-only">
            Before optimizations, frames swung between 50 and 15 FPS. After,
            desktop holds {metrics.fps.desktop} and mobile holds{" "}
            {metrics.fps.mobile}.
          </p>
        </figure>
      </div>
    </section>
  );
}
