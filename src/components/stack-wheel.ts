const CENTER = 50;
const OUTER = 48.5;
const INNER = 43.5;
const HANDLE = 46;
const SEGMENTS = 100;
const PAD = 0.5;
const NEAR_EDGE = 2.5 / 100;

export const STACK_WHEEL_SEGMENTS = SEGMENTS;
export const STACK_WHEEL_MIN_ZONE = 0.03;
export const STACK_WHEEL_MAX_ZONE = 0.89;
export const STACK_UPGRADE_RTP = 0.9;
export const STACK_TILE_MAX = 5;
export const STACK_MOBILE_HOLD = 0.4;

type Span = { col: number; row: number };

export function stackTileCells(span: Span) {
  return span.col * span.row;
}

function nextStep(span: Span): Span | null {
  if (span.col >= STACK_TILE_MAX && span.row >= STACK_TILE_MAX) return null;
  if (span.col === span.row && span.row < STACK_TILE_MAX) {
    return { col: span.col, row: span.row + 1 };
  }
  if (span.col < span.row && span.col < STACK_TILE_MAX) {
    return { col: span.col + 1, row: span.row };
  }
  if (span.row < span.col && span.row < STACK_TILE_MAX) {
    return { col: span.col, row: span.row + 1 };
  }
  if (span.col < STACK_TILE_MAX) return { col: span.col + 1, row: span.row };
  if (span.row < STACK_TILE_MAX) return { col: span.col, row: span.row + 1 };
  return null;
}

function allSpans() {
  const spans: Span[] = [];
  for (let col = 1; col <= STACK_TILE_MAX; col += 1) {
    for (let row = 1; row <= STACK_TILE_MAX; row += 1) {
      spans.push({ col, row });
    }
  }
  return spans;
}

function stepDistance(span: Span, hint: Span | null) {
  if (!hint) return 0;
  return Math.abs(span.col - hint.col) + Math.abs(span.row - hint.row);
}

export function stackUpgradeChance(from: Span, to: Span) {
  const prize = stackTileCells(to);
  const stake = stackTileCells(from);
  if (prize <= stake) return 0;
  return Math.min(
    STACK_WHEEL_MAX_ZONE,
    Math.max(STACK_WHEEL_MIN_ZONE, (STACK_UPGRADE_RTP * stake) / prize),
  );
}

export function stackUpgradeOptions(from: Span) {
  const hint = nextStep(from);
  return allSpans()
    .filter((to) => stackTileCells(to) > stackTileCells(from))
    .sort((left, right) => {
      const byCells = stackTileCells(left) - stackTileCells(right);
      if (byCells) return byCells;
      return stepDistance(left, hint) - stepDistance(right, hint);
    });
}

export function stackUpgradeBase(from: Span) {
  const to = stackUpgradeOptions(from)[0] ?? null;
  if (!to) return { to: null, chance: 0 };
  return { to, chance: stackUpgradeChance(from, to) };
}

export function stackUpgradeForChance(from: Span, chance: number) {
  const options = stackUpgradeOptions(from);
  if (!options.length) return null;
  let best = options[0];
  let bestScore = Number.POSITIVE_INFINITY;
  for (const option of options) {
    const score = Math.abs(stackUpgradeChance(from, option) - chance);
    const bigger = stackTileCells(option) > stackTileCells(best);
    if (score < bestScore - 0.01 || (Math.abs(score - bestScore) <= 0.01 && bigger)) {
      best = option;
      bestScore = score;
    }
  }
  return best;
}

function point(radius: number, radians: number) {
  return `${(CENTER + radius * Math.cos(radians)).toFixed(2)} ${(
    CENTER +
    radius * Math.sin(radians)
  ).toFixed(2)}`;
}

function pointAt(radius: number, fraction: number) {
  return point(radius, fraction * Math.PI * 2 - Math.PI / 2);
}

function ringSlice(start: number, end: number) {
  const large = end - start > 0.5 ? 1 : 0;
  return [
    `M ${pointAt(OUTER, start)}`,
    `A ${OUTER} ${OUTER} 0 ${large} 1 ${pointAt(OUTER, end)}`,
    `L ${pointAt(INNER, end)}`,
    `A ${INNER} ${INNER} 0 ${large} 0 ${pointAt(INNER, start)}`,
    "Z",
  ].join(" ");
}

export function stackWheelSectorPath(index: number) {
  const step = 360 / SEGMENTS;
  const start = ((index * step + PAD) * Math.PI) / 180 - Math.PI / 2;
  const end = (((index + 1) * step - PAD) * Math.PI) / 180 - Math.PI / 2;
  const large = end - start > Math.PI ? 1 : 0;
  return [
    `M ${point(OUTER, start)}`,
    `A ${OUTER} ${OUTER} 0 ${large} 1 ${point(OUTER, end)}`,
    `L ${point(INNER, end)}`,
    `A ${INNER} ${INNER} 0 ${large} 0 ${point(INNER, start)}`,
    "Z",
  ].join(" ");
}

export function stackWheelSectors() {
  return Array.from({ length: SEGMENTS }, (_, index) => ({
    index,
    path: stackWheelSectorPath(index),
    major: index % 7 === 0,
  }));
}

export function stackWheelArcPath(start: number, width: number) {
  const from = Math.min(1, Math.max(0, start));
  const size = Math.min(1, Math.max(0, width));
  if (size <= 0) return "";
  const to = Math.min(1, from + size);
  if (to - from >= 1) {
    return `${ringSlice(0, 0.5)} ${ringSlice(0.5, 1)}`;
  }
  return ringSlice(from, to);
}

export function stackWheelActiveSectors(start: number, width: number) {
  const active = new Set<number>();
  if (width <= 0) return active;
  const from = Math.floor(start * SEGMENTS);
  const to = Math.min(SEGMENTS, Math.ceil((start + width) * SEGMENTS));
  for (let index = from; index < to; index += 1) active.add(index);
  return active;
}

export function stackWheelSectorIndex(angle: number) {
  const normalized = ((angle % 360) + 360) % 360;
  return Math.floor((normalized / 360) * SEGMENTS) % SEGMENTS;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function stackWheelUnfold(fraction: number, reference: number) {
  return fraction + Math.round(reference - fraction);
}

export function stackWheelPointFraction(
  clientX: number,
  clientY: number,
  rect: Pick<DOMRect, "left" | "top" | "width" | "height">,
) {
  if (rect.width <= 0 || rect.height <= 0) return null;
  const angle =
    Math.atan2(
      clientY - (rect.top + rect.height / 2),
      clientX - (rect.left + rect.width / 2),
    ) +
    Math.PI / 2;
  const normalized = angle < 0 ? angle + Math.PI * 2 : angle;
  return normalized / (Math.PI * 2);
}

export function stackWheelHandlePoint(fraction: number) {
  const angle = fraction * Math.PI * 2 - Math.PI / 2;
  return {
    x: CENTER + HANDLE * Math.cos(angle),
    y: CENTER + HANDLE * Math.sin(angle),
    rotation: fraction * 360,
  };
}

export function stackWheelEaseOutCubic(progress: number) {
  const k = Math.min(1, Math.max(0, progress));
  return 1 - (1 - k) ** 3;
}

export function stackWheelHomeZone(width: number) {
  if (width <= 0) return { start: 0, width: 0 };
  return stackWheelClampZone(0, width);
}

export function stackWheelClampZone(start: number, width: number) {
  const requested = Number.isFinite(width) ? width : STACK_WHEEL_MIN_ZONE;
  const forStart = clamp(requested, STACK_WHEEL_MIN_ZONE, STACK_WHEEL_MAX_ZONE);
  const nextStart = clamp(start, 0, 1 - forStart);
  const nextWidth = clamp(
    requested,
    STACK_WHEEL_MIN_ZONE,
    Math.min(STACK_WHEEL_MAX_ZONE, 1 - nextStart),
  );
  return { start: nextStart, width: nextWidth };
}

export function stackWheelNearEdge(
  land: number,
  zoneStart: number,
  zoneWidth: number,
  hit: boolean,
) {
  const zoneEnd = zoneStart + zoneWidth;
  if (hit) {
    return Math.min(land - zoneStart, zoneEnd - land) <= NEAR_EDGE;
  }
  const miss =
    land < zoneStart ? zoneStart - land : land - zoneEnd;
  return miss <= NEAR_EDGE;
}

export function stackWheelSettle(
  currentAngle: number,
  targetFraction: number,
  drama: boolean,
) {
  const loops = drama
    ? 4 + Math.floor(Math.random() * 2)
    : 2 + Math.floor(Math.random() * 2);
  const duration = drama
    ? 4400 + Math.random() * 1000
    : 2300 + Math.random() * 1000;
  const current = ((currentAngle % 360) + 360) % 360;
  const target = (((targetFraction % 1) + 1) % 1) * 360;
  const delta = (target - current + 360) % 360;
  const total = loops * 360 + delta;
  const incoming = 400;
  const slope = (incoming * (duration / 1000)) / total;
  const tailBlend = Math.min(drama ? 0.35 : 0.2, slope / 3.15);
  const hermiteSlope = Math.max(
    0,
    Math.min(2.8, (slope - tailBlend * 3) / (1 - tailBlend || 1)),
  );

  return {
    from: currentAngle,
    total,
    duration,
    ease(progress: number) {
      const k = Math.min(1, Math.max(0, progress));
      if (k >= 1) return 1;
      const hermite =
        (k * k * k - 2 * k * k + k) * hermiteSlope +
        (-2 * k * k * k + 3 * k * k);
      const tail = 1 - (1 - k) ** 3;
      return (1 - tailBlend) * hermite + tailBlend * tail;
    },
  };
}
