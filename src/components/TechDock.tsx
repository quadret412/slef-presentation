"use client";

import { useMemo, useRef, useState, type PointerEvent } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCenter,
  defaultDropAnimationSideEffects,
  pointerWithin,
  useSensor,
  useSensors,
  type CollisionDetection,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
  type DropAnimation,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { motion, useReducedMotion } from "motion/react";
import { techCatalog } from "./marks/TechMarks";
import { STACK_UPGRADER_DROP_ID, StackUpgrader } from "./StackUpgrader";
import { STACK_TILE_MAX } from "./stack-wheel";

const easeOut = [0.23, 1, 0.32, 1] as const;
const COLS = 6;
const GAP = 8;
const ROW = 88;
const MIN_COL = 1;
const MAX_COL = STACK_TILE_MAX;
const MIN_ROW = 1;
const MAX_ROW = STACK_TILE_MAX;

type Span = { col: number; row: number };
type ItemId = (typeof techCatalog)[number]["id"];
type Tech = (typeof techCatalog)[number];

const defaultSpans = Object.fromEntries(
  techCatalog.map((item) => [item.id, { col: 1, row: 1 }]),
) as Record<ItemId, Span>;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function cellWidth(board: number) {
  return (board - GAP * (COLS - 1)) / COLS;
}

const collisionDetection: CollisionDetection = (args) => {
  const hits = pointerWithin(args);
  return hits.length ? hits : closestCenter(args);
};

class TilePointerSensor extends PointerSensor {
  static activators = [
    {
      eventName: "onPointerDown" as const,
      handler: ({ nativeEvent }: { nativeEvent: globalThis.PointerEvent }) => {
        if (nativeEvent.button !== 0) return false;
        if (
          nativeEvent.target instanceof HTMLElement &&
          nativeEvent.target.closest("[data-resize]")
        ) {
          return false;
        }
        nativeEvent.preventDefault();
        return true;
      },
    },
  ];
}

function itemById(id: UniqueIdentifier) {
  return techCatalog.find((entry) => entry.id === id);
}

function playTapMotion(node: HTMLElement) {
  node.classList.remove("is-tapped");
  void node.offsetWidth;
  node.classList.add("is-tapped");
  window.clearTimeout(Number(node.dataset.tapTimer ?? 0));
  node.dataset.tapTimer = String(
    window.setTimeout(() => node.classList.remove("is-tapped"), 380),
  );
}

function TileFace({
  item,
  span,
  selected,
  ghost = false,
}: {
  item: Tech;
  span: Span;
  selected: boolean;
  ghost?: boolean;
}) {
  const large = span.col > 1 || span.row > 1;
  return (
    <div
      className={`flex h-full min-w-0 w-full flex-col items-center justify-center gap-2 rounded-[16px] border px-2 py-3 ${
        ghost
          ? "border-sand/30 bg-bg-raised shadow-[var(--shadow-dock)]"
          : selected
            ? "border-sand/25 bg-fill-strong"
            : "border-line bg-fill"
      }`}
    >
      <span
        className={`mark-tile__icon pointer-events-none grid place-items-center ${
          large ? "h-10 w-10" : "h-8 w-8"
        }`}
      >
        {item.render(large ? "h-10 w-10" : "h-8 w-8")}
      </span>
      <span className="max-w-full truncate px-0.5 text-[12px] text-sand-dim">
        {item.name}
      </span>
    </div>
  );
}

function SortableTile({
  id,
  span,
  selected,
  resizing,
  onSelect,
  onResizeStart,
}: {
  id: ItemId;
  span: Span;
  selected: boolean;
  resizing: boolean;
  onSelect: () => void;
  onResizeStart: (event: PointerEvent<HTMLSpanElement>) => void;
}) {
  const item = itemById(id);
  const { attributes, listeners, setNodeRef, isDragging } = useSortable({
    id,
    disabled: resizing,
    animateLayoutChanges: () => false,
  });

  if (!item) return null;

  return (
    <div
      ref={setNodeRef}
      data-stack-tile={id}
      className="relative h-full min-w-0 w-full"
      style={{
        gridColumn: `span ${span.col}`,
        gridRow: `span ${span.row}`,
        zIndex: selected ? 1 : 0,
      }}
    >
      {isDragging ? (
        <div
          className="pointer-events-none absolute inset-0 rounded-[16px] border border-dashed border-sand/20 bg-fill"
          aria-hidden
        />
      ) : null}
      <button
        type="button"
        onClick={onSelect}
        onPointerUp={(event) => {
          if (event.pointerType === "mouse") return;
          playTapMotion(event.currentTarget);
        }}
        className={`mark-tile mark-tile--${item.motion} relative h-full w-full cursor-grab touch-none select-none active:cursor-grabbing [-webkit-user-drag:none] ${
          isDragging ? "opacity-0" : ""
        }`}
        {...attributes}
        {...listeners}
        aria-pressed={selected}
      >
        <TileFace item={item} span={span} selected={selected} />
      </button>
      {selected && !isDragging ? (
        <span
          role="separator"
          aria-label={`Resize ${item.name}`}
          data-resize=""
          className="absolute right-0 bottom-0 z-[3] h-7 w-7 cursor-nwse-resize touch-none"
          onPointerDown={onResizeStart}
        >
          <span
            aria-hidden="true"
            className="absolute right-2 bottom-2 h-2.5 w-2.5 border-r-2 border-b-2 border-sand/45"
          />
        </span>
      ) : null}
    </div>
  );
}

export function TechDock() {
  const reduce = useReducedMotion();
  const boardRef = useRef<HTMLDivElement>(null);
  const resizeRef = useRef<{
    id: ItemId;
    pointer: number;
    startX: number;
    startY: number;
    origin: Span;
  } | null>(null);
  const [order, setOrder] = useState<ItemId[]>(() =>
    techCatalog.map((item) => item.id),
  );
  const [spans, setSpans] = useState(defaultSpans);
  const [active, setActive] = useState<ItemId>("vue");
  const [dragging, setDragging] = useState<ItemId | null>(null);
  const [resizing, setResizing] = useState(false);
  const [overlaySize, setOverlaySize] = useState({ w: 0, h: 0 });
  const originOrder = useRef<ItemId[] | null>(null);

  const current = itemById(active) ?? techCatalog[0];
  const overlayItem = dragging ? itemById(dragging) : null;

  const sensors = useSensors(
    useSensor(TilePointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  );

  const dropAnimation = useMemo<DropAnimation>(
    () => ({
      duration: reduce ? 0 : 180,
      easing: "cubic-bezier(0.23, 1, 0.32, 1)",
      sideEffects: defaultDropAnimationSideEffects({
        styles: { active: { opacity: "0.28" } },
      }),
    }),
    [reduce],
  );

  const tileSize = (id: ItemId) => {
    const board = boardRef.current;
    const span = spans[id];
    const content = board
      ? board.clientWidth -
        Number.parseFloat(getComputedStyle(board).paddingLeft) -
        Number.parseFloat(getComputedStyle(board).paddingRight)
      : 0;
    const unit = cellWidth(content);
    return {
      w: span.col * unit + (span.col - 1) * GAP,
      h: span.row * ROW + (span.row - 1) * GAP,
    };
  };

  const moveItem = (fromId: UniqueIdentifier, toId: UniqueIdentifier) => {
    setOrder((prev) => {
      const from = prev.indexOf(String(fromId) as ItemId);
      const to = prev.indexOf(String(toId) as ItemId);
      if (from < 0 || to < 0 || from === to) return prev;
      return arrayMove(prev, from, to);
    });
  };

  const onDragStart = (event: DragStartEvent) => {
    const id = String(event.active.id) as ItemId;
    originOrder.current = order;
    setDragging(id);
    setActive(id);
    const sized = tileSize(id);
    if (sized.w > 1) {
      setOverlaySize(sized);
      return;
    }
    const node = document.querySelector<HTMLElement>(
      `[data-stack-tile="${id}"]`,
    );
    const box = node?.getBoundingClientRect();
    setOverlaySize({
      w: box?.width || 120,
      h: box?.height || ROW,
    });
  };

  const onDragOver = (event: DragOverEvent) => {
    const { active: source, over } = event;
    if (!over || source.id === over.id) return;
    if (over.id === STACK_UPGRADER_DROP_ID) return;
    moveItem(source.id, over.id);
  };

  const onDragEnd = (event: DragEndEvent) => {
    const { active: source, over } = event;
    const droppedOnDial = over?.id === STACK_UPGRADER_DROP_ID;
    if (droppedOnDial) {
      if (originOrder.current) setOrder(originOrder.current);
      originOrder.current = null;
      setDragging(null);
      setActive(String(source.id) as ItemId);
      return;
    }
    originOrder.current = null;
    setDragging(null);
    if (!over || source.id === over.id) return;
    moveItem(source.id, over.id);
  };

  const onDragCancel = () => {
    if (originOrder.current) setOrder(originOrder.current);
    originOrder.current = null;
    setDragging(null);
  };

  const endResize = (event: PointerEvent<HTMLDivElement>) => {
    const resize = resizeRef.current;
    if (!resize || event.pointerId !== resize.pointer) return;
    resizeRef.current = null;
    setResizing(false);
    event.currentTarget.releasePointerCapture(event.pointerId);
  };

  const onResizeMove = (event: PointerEvent<HTMLDivElement>) => {
    const resize = resizeRef.current;
    if (!resize || event.pointerId !== resize.pointer) return;
    const board = boardRef.current?.clientWidth ?? 0;
    const unit = cellWidth(board) + GAP;
    const next = {
      col: clamp(
        Math.round(resize.origin.col + (event.clientX - resize.startX) / unit),
        MIN_COL,
        MAX_COL,
      ),
      row: clamp(
        Math.round(
          resize.origin.row + (event.clientY - resize.startY) / (ROW + GAP),
        ),
        MIN_ROW,
        MAX_ROW,
      ),
    };
    setSpans((prev) => {
      const currentSpan = prev[resize.id];
      if (currentSpan.col === next.col && currentSpan.row === next.row) {
        return prev;
      }
      return { ...prev, [resize.id]: next };
    });
  };

  const beginResize =
    (id: ItemId) => (event: PointerEvent<HTMLSpanElement>) => {
      if (event.button !== 0) return;
      event.preventDefault();
      event.stopPropagation();
      boardRef.current?.setPointerCapture(event.pointerId);
      resizeRef.current = {
        id,
        pointer: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        origin: spans[id],
      };
      setResizing(true);
      setActive(id);
    };

  return (
    <div>
      <DndContext
        id="stack-dock"
        sensors={sensors}
        collisionDetection={collisionDetection}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDragEnd={onDragEnd}
        onDragCancel={onDragCancel}
      >
      <StackUpgrader
        item={current}
        span={spans[active]}
        locked={resizing || Boolean(dragging)}
        receiving={Boolean(dragging)}
        onCommit={(next) =>
          setSpans((prev) => ({ ...prev, [active]: next }))
        }
      />
        <SortableContext items={order} strategy={rectSortingStrategy}>
          <div
            ref={boardRef}
            className={`rounded-[20px] border border-line bg-panel p-3 shadow-[var(--panel-shadow)] ${
              dragging || resizing ? "select-none" : ""
            }`}
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))`,
              gridAutoRows: `${ROW}px`,
              gridAutoFlow: "dense",
              gap: GAP,
            }}
            onDragStart={(event) => event.preventDefault()}
            onPointerMove={onResizeMove}
            onPointerUp={endResize}
            onPointerCancel={endResize}
          >
            {order.map((id) => (
              <SortableTile
                key={id}
                id={id}
                span={spans[id]}
                selected={id === active}
                resizing={resizing}
                onSelect={() => setActive(id)}
                onResizeStart={beginResize(id)}
              />
            ))}
          </div>
        </SortableContext>
        <DragOverlay dropAnimation={dropAnimation} zIndex={90}>
          {overlayItem ? (
            <div
              className="cursor-grabbing"
              style={{ width: overlaySize.w, height: overlaySize.h }}
            >
              <TileFace
                item={overlayItem}
                span={spans[overlayItem.id]}
                selected
                ghost
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
      <motion.p
        key={current.id}
        className="mt-5 text-[16px] leading-[1.6] text-sand"
        initial={reduce ? false : { opacity: 0.7, transform: "translateY(8px)" }}
        animate={{ opacity: 1, transform: "translateY(0px)" }}
        transition={{ duration: 0.22, ease: easeOut }}
      >
        {current.used}
      </motion.p>
    </div>
  );
}
