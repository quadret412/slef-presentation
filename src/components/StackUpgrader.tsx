"use client";

import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { useDroppable } from "@dnd-kit/core";
import { useReducedMotion } from "motion/react";
import type { techCatalog } from "./marks/TechMarks";
import {
  STACK_WHEEL_MIN_ZONE,
  STACK_WHEEL_SEGMENTS,
  stackUpgradeBase,
  stackUpgradeForChance,
  stackWheelActiveSectors,
  stackWheelArcPath,
  stackWheelClampZone,
  stackWheelEaseOutCubic,
  stackWheelHandlePoint,
  stackWheelHomeZone,
  stackWheelNearEdge,
  stackWheelPointFraction,
  stackWheelSectorIndex,
  stackWheelSectors,
  stackWheelSettle,
  stackWheelUnfold,
} from "./stack-wheel";

type Tech = (typeof techCatalog)[number];
type Span = { col: number; row: number };
type Result = "held" | "miss" | null;
type DragMode = "start" | "end" | "move";
type Zone = { start: number; width: number };
type Drag = {
  mode: DragMode;
  pointerId: number;
  previous: number;
  start: number;
  width: number;
};

export const STACK_UPGRADER_DROP_ID = "stack-upgrader-target";

const sectors = stackWheelSectors();

function shrink(span: Span): Span {
  if (span.col > span.row && span.col > 1) {
    return { col: span.col - 1, row: span.row };
  }
  if (span.row > 1) return { col: span.col, row: span.row - 1 };
  if (span.col > 1) return { col: span.col - 1, row: span.row };
  return span;
}

function pickMiss(zoneStart: number, zoneWidth: number) {
  const rest = 1 - zoneWidth;
  const pick = Math.random() * rest;
  return pick < zoneStart ? pick : pick + zoneWidth;
}

export function StackUpgrader({
  item,
  span,
  locked,
  receiving = false,
  onCommit,
}: {
  item: Tech;
  span: Span;
  locked: boolean;
  receiving?: boolean;
  onCommit: (next: Span) => void;
}) {
  const reduce = useReducedMotion();
  const reactId = useId();
  const clipId = `stack-zone-${reactId.replace(/:/g, "")}`;
  const [spinning, setSpinning] = useState(false);
  const [building, setBuilding] = useState(true);
  const [dragging, setDragging] = useState(false);
  const [result, setResult] = useState<Result>(null);
  const [note, setNote] = useState<string | null>(null);
  const [zone, setZone] = useState<Zone>({ start: 0, width: 0 });
  const svgRef = useRef<SVGSVGElement>(null);
  const needleRef = useRef<SVGGElement>(null);
  const glowRef = useRef<SVGGElement>(null);
  const glowLevels = useRef(Array.from({ length: STACK_WHEEL_SEGMENTS }, () => 0));
  const frameRef = useRef(0);
  const decayRef = useRef(0);
  const zoneTweenRef = useRef(0);
  const needleTweenRef = useRef(0);
  const buildTimer = useRef(0);
  const angleRef = useRef(0);
  const trackingRef = useRef(false);
  const selectedRef = useRef<string | null>(null);
  const dragRef = useRef<Drag | null>(null);
  const zoneRef = useRef(zone);
  const dragMove = useRef<(event: PointerEvent) => void>(() => {});
  const dragUp = useRef<(event: PointerEvent) => void>(() => {});
  const windowDrag = useRef<{
    move: (event: PointerEvent) => void;
    up: (event: PointerEvent) => void;
  } | null>(null);
  zoneRef.current = zone;

  const base = stackUpgradeBase(span);
  const suggested = base.chance;
  const chance = zone.width;
  const target =
    chance > 0
      ? stackUpgradeForChance(span, chance)
      : base.to;
  const zonePath = useMemo(
    () => stackWheelArcPath(zone.start, zone.width),
    [zone.start, zone.width],
  );
  const active = useMemo(
    () => stackWheelActiveSectors(zone.start, zone.width),
    [zone.start, zone.width],
  );
  const firstActive = active.size ? Math.min(...active) : 0;
  const startHandle = stackWheelHandlePoint(zone.start);
  const endHandle = stackWheelHandlePoint(zone.start + zone.width);
  const canPlay = Boolean(target) && !spinning && !locked;
  const canDrag = canPlay;

  const paintNeedle = (next: number) => {
    angleRef.current = next;
    const node = needleRef.current;
    if (node) node.style.transform = `rotate(${next}deg)`;
  };

  const paintGlow = (index: number, opacity: number) => {
    const node = glowRef.current?.children[index] as SVGElement | undefined;
    if (node) node.style.opacity = opacity <= 0 ? "0" : opacity.toFixed(3);
  };

  const pulseSector = (nextAngle: number) => {
    const index = stackWheelSectorIndex(nextAngle);
    glowLevels.current[index] = 1;
    paintGlow(index, 1);
  };

  const decayGlow = () => {
    if (decayRef.current) return;
    const step = () => {
      let live = false;
      const kids = glowRef.current?.children;
      for (let index = 0; index < glowLevels.current.length; index += 1) {
        const level = glowLevels.current[index];
        if (level <= 0.012) {
          if (level !== 0) {
            glowLevels.current[index] = 0;
            paintGlow(index, 0);
          }
          continue;
        }
        const next = level * 0.86;
        glowLevels.current[index] = next;
        const node = kids?.[index] as SVGElement | undefined;
        if (node) node.style.opacity = next.toFixed(3);
        if (next > 0.012) live = true;
      }
      if (live || trackingRef.current) {
        decayRef.current = window.requestAnimationFrame(step);
        return;
      }
      decayRef.current = 0;
    };
    decayRef.current = window.requestAnimationFrame(step);
  };

  useEffect(() => {
    const move = (event: PointerEvent) => dragMove.current(event);
    const up = (event: PointerEvent) => dragUp.current(event);
    windowDrag.current = { move, up };
    return () => {
      window.cancelAnimationFrame(frameRef.current);
      window.cancelAnimationFrame(decayRef.current);
      window.cancelAnimationFrame(zoneTweenRef.current);
      window.cancelAnimationFrame(needleTweenRef.current);
      window.clearTimeout(buildTimer.current);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
  }, []);

  const eventFraction = (event: PointerEvent) => {
    const svg = svgRef.current;
    if (!svg) return null;
    return stackWheelPointFraction(
      event.clientX,
      event.clientY,
      svg.getBoundingClientRect(),
    );
  };

  const commitZone = (start: number, width: number) => {
    const next =
      width <= 0 ? { start: 0, width: 0 } : stackWheelClampZone(start, width);
    zoneRef.current = next;
    setZone(next);
    return next;
  };

  const cancelZoneTween = () => {
    window.cancelAnimationFrame(zoneTweenRef.current);
    zoneTweenRef.current = 0;
  };

  const cancelNeedleTween = () => {
    window.cancelAnimationFrame(needleTweenRef.current);
    needleTweenRef.current = 0;
  };

  const startCascade = (width: number) => {
    window.clearTimeout(buildTimer.current);
    if (reduce || width <= 0) {
      setBuilding(false);
      return;
    }
    setBuilding(true);
    buildTimer.current = window.setTimeout(
      () => setBuilding(false),
      18 * Math.max(1, Math.round(width * STACK_WHEEL_SEGMENTS)) + 420,
    );
  };

  const tweenNeedleHome = () => {
    cancelNeedleTween();
    const from = angleRef.current;
    const to = Math.round(from / 360) * 360;
    if (reduce || Math.abs(to - from) < 0.01) {
      paintNeedle(0);
      return;
    }
    const started = performance.now();
    const step = (now: number) => {
      const progress = Math.min(1, (now - started) / 320);
      paintNeedle(from + (to - from) * stackWheelEaseOutCubic(progress));
      if (progress < 1) {
        needleTweenRef.current = window.requestAnimationFrame(step);
        return;
      }
      paintNeedle(0);
      needleTweenRef.current = 0;
    };
    needleTweenRef.current = window.requestAnimationFrame(step);
  };

  const tweenZoneTo = (dest: Zone, cascade: boolean) => {
    cancelZoneTween();
    const from = zoneRef.current;
    const target =
      dest.width <= 0
        ? { start: 0, width: 0 }
        : stackWheelClampZone(dest.start, dest.width);
    if (
      reduce ||
      (Math.abs(from.start - target.start) < 0.001 &&
        Math.abs(from.width - target.width) < 0.001)
    ) {
      commitZone(target.start, target.width);
      if (cascade) startCascade(target.width);
      return;
    }
    setBuilding(false);
    const started = performance.now();
    const step = (now: number) => {
      const progress = Math.min(1, (now - started) / 340);
      const eased = stackWheelEaseOutCubic(progress);
      commitZone(
        from.start + (target.start - from.start) * eased,
        from.width + (target.width - from.width) * eased,
      );
      if (progress < 1) {
        zoneTweenRef.current = window.requestAnimationFrame(step);
        return;
      }
      commitZone(target.start, target.width);
      zoneTweenRef.current = 0;
      if (cascade) startCascade(target.width);
    };
    zoneTweenRef.current = window.requestAnimationFrame(step);
  };

  useEffect(() => {
    const first = selectedRef.current === null;
    const swapped = selectedRef.current !== item.id;
    selectedRef.current = item.id;

    if (suggested <= 0) {
      cancelZoneTween();
      commitZone(0, 0);
      setBuilding(false);
      if (first || swapped) {
        window.cancelAnimationFrame(frameRef.current);
        trackingRef.current = false;
        setSpinning(false);
        setResult(null);
        setNote(null);
        tweenNeedleHome();
      }
      return;
    }

    if (first || swapped) {
      window.cancelAnimationFrame(frameRef.current);
      trackingRef.current = false;
      setSpinning(false);
      setResult(null);
      setNote(null);
      tweenNeedleHome();
      tweenZoneTo(stackWheelHomeZone(suggested), true);
      return;
    }

    tweenZoneTo(
      stackWheelClampZone(zoneRef.current.start, suggested),
      false,
    );
  }, [item.id, reduce, span.col, span.row, suggested]);

  dragMove.current = (event: PointerEvent) => {
    const drag = dragRef.current;
    if (!drag || event.pointerId !== drag.pointerId) return;
    const raw = eventFraction(event);
    if (raw === null) return;
    event.preventDefault();

    if (drag.mode === "move") {
      const fraction = stackWheelUnfold(raw, drag.previous);
      const delta = fraction - drag.previous;
      drag.previous = fraction;
      const next = commitZone(drag.start + delta, drag.width);
      drag.start = next.start;
      drag.width = next.width;
      return;
    }

    const start = drag.start;
    const end = drag.start + drag.width;

    if (drag.mode === "start") {
      const fraction = Math.min(
        end - STACK_WHEEL_MIN_ZONE,
        Math.max(0, stackWheelUnfold(raw, start)),
      );
      const next = commitZone(fraction, end - fraction);
      drag.start = next.start;
      drag.width = next.width;
      return;
    }

    const fraction = Math.min(
      1,
      Math.max(start + STACK_WHEEL_MIN_ZONE, stackWheelUnfold(raw, end)),
    );
    const next = commitZone(start, fraction - start);
    drag.start = next.start;
    drag.width = next.width;
  };

  dragUp.current = (event: PointerEvent) => {
    const drag = dragRef.current;
    if (!drag) return;
    if (event.pointerId !== drag.pointerId) return;
    const listeners = windowDrag.current;
    if (listeners) {
      window.removeEventListener("pointermove", listeners.move);
      window.removeEventListener("pointerup", listeners.up);
      window.removeEventListener("pointercancel", listeners.up);
    }
    commitZone(drag.start, drag.width);
    dragRef.current = null;
    setDragging(false);
  };

  const beginDrag = (mode: DragMode, event: ReactPointerEvent<SVGElement>) => {
    if (!canDrag) return;
    const listeners = windowDrag.current;
    const raw = eventFraction(event.nativeEvent);
    if (!listeners || raw === null) return;
    event.preventDefault();
    event.stopPropagation();
    cancelZoneTween();
    const current = zoneRef.current;
    dragRef.current = {
      mode,
      pointerId: event.pointerId,
      previous: raw,
      start: current.start,
      width: Math.max(STACK_WHEEL_MIN_ZONE, current.width),
    };
    setDragging(true);
    setBuilding(false);
    window.addEventListener("pointermove", listeners.move);
    window.addEventListener("pointerup", listeners.up);
    window.addEventListener("pointercancel", listeners.up);
  };

  const roll = () => {
    if (!target || spinning || locked || chance <= 0) return;
    const hit = Math.random() < chance;
    const land = hit
      ? zone.start + Math.random() * zone.width
      : pickMiss(zone.start, zone.width);
    const drama = stackWheelNearEdge(land, zone.start, zone.width, hit);
    const plan = stackWheelSettle(angleRef.current, land, drama);
    const started = performance.now();

    cancelNeedleTween();
    cancelZoneTween();
    trackingRef.current = true;
    setSpinning(true);
    setResult(null);
    setNote(null);

    if (reduce) {
      paintNeedle(plan.from + plan.total);
      trackingRef.current = false;
      finish(hit);
      return;
    }

    const tick = (now: number) => {
      const progress = Math.min(1, (now - started) / plan.duration);
      const next = plan.from + plan.total * plan.ease(progress);
      paintNeedle(next);
      pulseSector(next);
      decayGlow();
      if (progress < 1) {
        frameRef.current = window.requestAnimationFrame(tick);
        return;
      }
      trackingRef.current = false;
      finish(hit);
    };

    frameRef.current = window.requestAnimationFrame(tick);
  };

  const finish = (hit: boolean) => {
    if (hit && !target) return;
    const next = hit && target ? target : shrink(span);
    onCommit(next);
    setResult(hit ? "held" : "miss");
    setSpinning(false);
    setNote(
      hit
        ? `Held. ${item.name} is ${next.col}×${next.row}.`
        : `Miss. ${item.name} is ${next.col}×${next.row}.`,
    );
  };

  const wheelClass = [
    "stack-wheel",
    spinning ? "is-spinning" : "",
    building ? "is-building" : "",
    dragging ? "is-dragging" : "",
    result === "held" ? "is-held" : "",
    result === "miss" ? "is-miss" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="mb-5 rounded-[20px] border border-line bg-panel px-5 py-5 sm:px-6">
      <div className="flex items-end justify-between gap-6">
        <div className="min-w-0 flex-1">
          <p className="text-[13px] text-steel">Chance dial</p>
          <p className="mt-1 text-[14px] leading-6 text-sand-dim">
            Click a mark or drag it onto the target. A thinner hold aims bigger.
          </p>
        </div>
        <p className="shrink-0 tabular text-[13px] text-sand-dim">
          {target
            ? `${Math.round(chance * 100)}% to ${target.col}×${target.row}`
            : "Already 5×5"}
        </p>
      </div>

      <div className="mt-5 grid items-center gap-6 sm:grid-cols-[1fr_minmax(13rem,18rem)_1fr]">
        <MarkSide
          item={item}
          caption={item.name}
          size={`${span.col}×${span.row}`}
        />

        <div className={wheelClass}>
          <svg
            ref={svgRef}
            className="stack-wheel__svg"
            viewBox="0 0 100 100"
          >
            <defs>
              <clipPath id={clipId}>
                {zonePath ? <path d={zonePath} /> : null}
              </clipPath>
            </defs>
            <circle className="stack-wheel__guide" cx="50" cy="50" r="49.4" />
            <circle className="stack-wheel__guide" cx="50" cy="50" r="42.8" />
            <g className="stack-wheel__ticks">
              {sectors.map((sector) => (
                <path
                  key={sector.index}
                  className={`stack-wheel__tick${sector.major ? " is-major" : ""}`}
                  d={sector.path}
                />
              ))}
            </g>
            {zonePath ? (
              <g className="stack-wheel__zone" clipPath={`url(#${clipId})`}>
                {sectors.map((sector) =>
                  active.has(sector.index) ? (
                    <path
                      key={sector.index}
                      className="stack-wheel__zone-tick"
                      d={sector.path}
                      style={{
                        ["--stack-zone-delay" as string]: `${
                          (sector.index - firstActive) * 18
                        }ms`,
                      }}
                    />
                  ) : null,
                )}
              </g>
            ) : null}
            {zonePath ? (
              <path
                className="stack-wheel__zone-hit"
                d={zonePath}
                onPointerDown={(event) => beginDrag("move", event)}
              />
            ) : null}
            {zonePath ? (
              <path className="stack-wheel__zone-glow" d={zonePath} />
            ) : null}
            <g ref={glowRef} className="stack-wheel__glow">
              {sectors.map((sector) => (
                <path
                  key={sector.index}
                  className="stack-wheel__glow-tick"
                  d={sector.path}
                />
              ))}
            </g>
            <g ref={needleRef} className="stack-wheel__needle">
              <path
                className="stack-wheel__needle-point"
                d="M50 9.8 Q50.6 9.8 50.95 10.35 L57.3 21.45 Q58.05 22.75 56.55 22.75 L53.15 22.75 Q52.45 22.75 52.05 22.15 L50 18.55 L47.95 22.15 Q47.55 22.75 46.85 22.75 L43.45 22.75 Q41.95 22.75 42.7 21.45 L49.05 10.35 Q49.4 9.8 50 9.8 Z"
              />
              <circle className="stack-wheel__needle-dot" cx="50" cy="12.1" r="0.85" />
            </g>
            {zonePath ? (
              <g className="stack-wheel__handles">
                <ZoneHandle
                  point={startHandle}
                  label="Hold start"
                  disabled={!canDrag}
                  onPointerDown={(event) => beginDrag("start", event)}
                />
                <ZoneHandle
                  point={endHandle}
                  label="Hold end"
                  disabled={!canDrag}
                  onPointerDown={(event) => beginDrag("end", event)}
                />
              </g>
            ) : null}
          </svg>
          <p className="stack-wheel__chance tabular">
            {Math.round(chance * 100)}%
          </p>
          <span className="stack-wheel__bits" aria-hidden>
            {Array.from({ length: 8 }, (_, index) => (
              <i key={index} style={{ ["--i" as string]: index }} />
            ))}
          </span>
        </div>

        <TargetDrop
          item={item}
          size={target ? `${target.col}×${target.row}` : "Max"}
          receiving={receiving}
        />
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          type="button"
          disabled={!canPlay}
          onClick={roll}
          className="rounded-full bg-sand px-4 py-2 text-[13px] font-medium text-bg transition-[background,transform] duration-100 ease-out hover:bg-sand-hover active:scale-[0.97] disabled:opacity-50"
        >
          {spinning ? "Spinning…" : "Upgrade"}
        </button>
        {note ? (
          <p className="text-[13px] text-sand-dim">{note}</p>
        ) : (
          <p className="text-[13px] text-sand-dim">
            Drag a mark onto the target slot. Tiles can grow up to 5×5.
          </p>
        )}
      </div>
    </div>
  );
}

function ZoneHandle({
  point,
  label,
  disabled,
  onPointerDown,
}: {
  point: { x: number; y: number; rotation: number };
  label: string;
  disabled: boolean;
  onPointerDown: (event: ReactPointerEvent<SVGElement>) => void;
}) {
  return (
    <g
      className="stack-wheel__handle"
      aria-label={label}
      transform={`translate(${point.x} ${point.y}) rotate(${point.rotation})`}
      onPointerDown={disabled ? undefined : onPointerDown}
    >
      <circle className="stack-wheel__handle-hit" r="7.5" />
      <rect
        className="stack-wheel__handle-bar"
        x="-0.7"
        y="-2.25"
        width="1.4"
        height="4.5"
        rx="0.5"
      />
    </g>
  );
}

function MarkSide({
  item,
  caption,
  size,
}: {
  item: Tech;
  caption: string;
  size: string;
}) {
  return (
    <div className="flex items-center justify-center gap-3">
      <span className="grid h-12 w-12 place-items-center">
        {item.render("h-10 w-10")}
      </span>
      <span className="text-[13px] text-sand-dim">
        {caption}
        <span className="mt-0.5 block tabular text-sand">{size}</span>
      </span>
    </div>
  );
}

function TargetDrop({
  item,
  size,
  receiving,
}: {
  item: Tech;
  size: string;
  receiving: boolean;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: STACK_UPGRADER_DROP_ID,
  });

  return (
    <div
      ref={setNodeRef}
      className={`flex min-h-[5.5rem] items-center justify-center gap-3 rounded-[18px] border px-3 py-3 transition-[border-color,background] duration-150 ${
        isOver
          ? "border-[#4ecf6a]/55 bg-[#4ecf6a]/12"
          : receiving
            ? "border-dashed border-sand/35 bg-fill"
            : "border-transparent"
      }`}
    >
      <span className="grid h-12 w-12 place-items-center">
        {item.render("h-10 w-10")}
      </span>
      <span className="text-[13px] text-sand-dim">
        {isOver ? "Drop to upgrade" : receiving ? "Drop a mark" : "Target"}
        <span className="mt-0.5 block tabular text-sand">{size}</span>
      </span>
    </div>
  );
}
