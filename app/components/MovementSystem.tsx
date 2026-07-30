"use client";

import {
  type CSSProperties,
  type DragEvent,
  type ElementType,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
  type ReactNode,
  type TouchEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import {
  clampOffset,
  countMovedElements,
  MOVEMENT_STORAGE_KEY,
  parseStoredLayout,
  resetLayoutItem,
  type LayoutState,
  type MovementBounds,
  type Offset,
} from "../movement-state.mjs";

const ORIGIN: Offset = { x: 0, y: 0 };
const EMPTY_LAYOUT: LayoutState = {};
const DRAG_THRESHOLD = 5;
const TOUCH_CANCEL_THRESHOLD = 8;
const TOUCH_HOLD_DELAY = 250;
const EDGE_SIZE = 64;
const EDGE_SPEED = 15;

type LayoutStore = {
  getSnapshot: () => LayoutState;
  getServerSnapshot: () => LayoutState;
  getOffset: (id: string) => Offset;
  subscribeAll: (listener: () => void) => () => void;
  subscribeToId: (id: string, listener: () => void) => () => void;
  setOffset: (id: string, offset: Offset) => void;
  resetItem: (id: string) => void;
  resetAll: () => void;
  hydrate: () => void;
};

function createLayoutStore(): LayoutStore {
  let state: LayoutState = EMPTY_LAYOUT;
  const globalListeners = new Set<() => void>();
  const itemListeners = new Map<string, Set<() => void>>();

  const publish = (next: LayoutState) => {
    const changedIds = new Set([
      ...Object.keys(state),
      ...Object.keys(next),
    ]);
    for (const id of changedIds) {
      const previous = state[id] ?? ORIGIN;
      const upcoming = next[id] ?? ORIGIN;
      if (previous.x === upcoming.x && previous.y === upcoming.y) {
        changedIds.delete(id);
      }
    }

    if (changedIds.size === 0) return;
    state = next;
    if (typeof window !== "undefined") {
      if (Object.keys(next).length === 0) {
        window.localStorage.removeItem(MOVEMENT_STORAGE_KEY);
      } else {
        window.localStorage.setItem(MOVEMENT_STORAGE_KEY, JSON.stringify(next));
      }
    }
    changedIds.forEach((id) => {
      itemListeners.get(id)?.forEach((listener) => listener());
    });
    globalListeners.forEach((listener) => listener());
  };

  return {
    getSnapshot: () => state,
    getServerSnapshot: () => EMPTY_LAYOUT,
    getOffset: (id) => state[id] ?? ORIGIN,
    subscribeAll: (listener) => {
      globalListeners.add(listener);
      return () => globalListeners.delete(listener);
    },
    subscribeToId: (id, listener) => {
      const listeners = itemListeners.get(id) ?? new Set<() => void>();
      listeners.add(listener);
      itemListeners.set(id, listeners);
      return () => {
        listeners.delete(listener);
        if (listeners.size === 0) itemListeners.delete(id);
      };
    },
    setOffset: (id, offset) => {
      const rounded = { x: Math.round(offset.x), y: Math.round(offset.y) };
      if (rounded.x === 0 && rounded.y === 0) {
        publish(resetLayoutItem(state, id));
        return;
      }
      const current = state[id];
      if (current?.x === rounded.x && current.y === rounded.y) return;
      publish({ ...state, [id]: rounded });
    },
    resetItem: (id) => publish(resetLayoutItem(state, id)),
    resetAll: () => publish({}),
    hydrate: () => {
      const parsed = parseStoredLayout(
        window.localStorage.getItem(MOVEMENT_STORAGE_KEY),
      );
      publish(parsed);
    },
  };
}

const sharedLayoutStore = createLayoutStore();

function useLayoutStore() {
  return sharedLayoutStore;
}

export function MovementProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    sharedLayoutStore.hydrate();
  }, []);

  return children;
}

function useLayoutSnapshot() {
  const store = useLayoutStore();
  return useSyncExternalStore(
    store.subscribeAll,
    store.getSnapshot,
    store.getServerSnapshot,
  );
}

function useMovableOffset(store: LayoutStore, movableId: string) {
  const subscribe = useCallback(
    (listener: () => void) => store.subscribeToId(movableId, listener),
    [movableId, store],
  );
  const getSnapshot = useCallback(
    () => store.getOffset(movableId),
    [movableId, store],
  );

  return useSyncExternalStore(subscribe, getSnapshot, () => ORIGIN);
}

type DragState = {
  kind: "pointer" | "touch";
  pointerId?: number;
  startClientX: number;
  startClientY: number;
  currentClientX: number;
  currentClientY: number;
  startOffset: Offset;
  currentOffset: Offset;
  bounds: MovementBounds;
  armed: boolean;
  active: boolean;
};

function getMovementBounds(
  element: HTMLElement,
  offset: Offset,
  boundsMode: "document" | "parent",
): MovementBounds {
  const rect = element.getBoundingClientRect();

  if (boundsMode === "parent" && element.parentElement) {
    const parentRect = element.parentElement.getBoundingClientRect();
    const baseLeft = rect.left - offset.x;
    const baseTop = rect.top - offset.y;

    return {
      minX: parentRect.left - baseLeft,
      maxX: parentRect.right - (baseLeft + rect.width),
      minY: parentRect.top - baseTop,
      maxY: parentRect.bottom - (baseTop + rect.height),
    };
  }

  const baseLeft = rect.left + window.scrollX - offset.x;
  const baseTop = rect.top + window.scrollY - offset.y;
  const canvasWidth = document.documentElement.clientWidth;
  const canvasHeight = Math.max(
    document.documentElement.scrollHeight,
    document.body.scrollHeight,
  );

  return {
    minX: -baseLeft,
    maxX: canvasWidth - (baseLeft + rect.width),
    minY: -baseTop,
    maxY: canvasHeight - (baseTop + rect.height),
  };
}

function getEdgeScroll(clientX: number, clientY: number) {
  let x = 0;
  let y = 0;

  if (clientX < EDGE_SIZE) x = -EDGE_SPEED;
  else if (clientX > window.innerWidth - EDGE_SIZE) x = EDGE_SPEED;

  if (clientY < EDGE_SIZE) y = -EDGE_SPEED;
  else if (clientY > window.innerHeight - EDGE_SIZE) y = EDGE_SPEED;

  return { x, y };
}

type MovableOwnProps = {
  movableId: string;
  bounds?: "document" | "parent";
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  ariaLabel?: string;
};

type MovableProps<T extends ElementType> = MovableOwnProps & {
  as?: T;
} & Omit<
    React.ComponentPropsWithoutRef<T>,
    keyof MovableOwnProps | "as" | "onPointerDown" | "onTouchStart" | "onKeyDown"
  >;

export function Movable<T extends ElementType = "div">({
  as,
  movableId,
  bounds = "document",
  children,
  className,
  style,
  ariaLabel,
  ...rest
}: MovableProps<T>) {
  const Component = as ?? "div";
  const store = useLayoutStore();
  const offset = useMovableOffset(store, movableId);
  const elementRef = useRef<HTMLElement | null>(null);
  const dragRef = useRef<DragState | null>(null);
  const touchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const frameRef = useRef<number | null>(null);
  const suppressClickRef = useRef(false);

  const stopDragFrame = useCallback(() => {
    if (frameRef.current !== null) {
      window.cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
  }, []);

  const applyCurrentPosition = useCallback(() => {
    const drag = dragRef.current;
    const element = elementRef.current;
    if (!drag?.active || !element) return;

    const clamped = clampOffset(
      {
        x:
          drag.startOffset.x +
          drag.currentClientX -
          drag.startClientX,
        y:
          drag.startOffset.y +
          drag.currentClientY -
          drag.startClientY,
      },
      drag.bounds,
    );
    const next = {
      x: Math.round(clamped.x),
      y: Math.round(clamped.y),
    };
    if (
      next.x === drag.currentOffset.x &&
      next.y === drag.currentOffset.y
    ) {
      return;
    }
    drag.currentOffset = next;
    element.style.translate = `${next.x}px ${next.y}px`;
  }, []);

  const runDragFrame = useCallback(
    function tick() {
      frameRef.current = null;
      const drag = dragRef.current;
      if (!drag?.active) return;

      const scroll = getEdgeScroll(
        drag.currentClientX,
        drag.currentClientY,
      );
      if (scroll.x === 0 && scroll.y === 0) {
        applyCurrentPosition();
        return;
      }

      const beforeX = window.scrollX;
      const beforeY = window.scrollY;
      window.scrollBy(scroll.x, scroll.y);
      const shiftedX = window.scrollX - beforeX;
      const shiftedY = window.scrollY - beforeY;
      drag.startClientX -= shiftedX;
      drag.startClientY -= shiftedY;
      applyCurrentPosition();

      if (shiftedX !== 0 || shiftedY !== 0) {
        frameRef.current = window.requestAnimationFrame(tick);
      }
    },
    [applyCurrentPosition],
  );

  const queueDragFrame = useCallback(() => {
    if (frameRef.current === null) {
      frameRef.current = window.requestAnimationFrame(runDragFrame);
    }
  }, [runDragFrame]);

  const activateDrag = useCallback(() => {
    const drag = dragRef.current;
    if (!drag || drag.active) return;
    drag.active = true;
    suppressClickRef.current = true;
    elementRef.current?.setAttribute("data-dragging", "true");
    document.documentElement.setAttribute("data-layout-dragging", "true");
  }, []);

  const finishDrag = useCallback(() => {
    if (touchTimerRef.current !== null) {
      clearTimeout(touchTimerRef.current);
      touchTimerRef.current = null;
    }
    stopDragFrame();
    const completedDrag = dragRef.current;
    if (completedDrag?.active) applyCurrentPosition();
    dragRef.current = null;
    elementRef.current?.removeAttribute("data-dragging");
    document.documentElement.removeAttribute("data-layout-dragging");
    if (completedDrag?.active) {
      store.setOffset(movableId, completedDrag.currentOffset);
      window.setTimeout(() => {
        suppressClickRef.current = false;
      }, 0);
    }
  }, [applyCurrentPosition, movableId, stopDragFrame, store]);

  useEffect(() => {
    const clampCurrentPosition = () => {
      const element = elementRef.current;
      const current = store.getSnapshot()[movableId];
      if (!element || !current) return;
      store.setOffset(
        movableId,
        clampOffset(current, getMovementBounds(element, current, bounds)),
      );
    };

    clampCurrentPosition();
    window.addEventListener("resize", clampCurrentPosition);
    return () => window.removeEventListener("resize", clampCurrentPosition);
  }, [bounds, movableId, offset.x, offset.y, store]);

  useEffect(
    () => () => {
      if (touchTimerRef.current !== null) clearTimeout(touchTimerRef.current);
      stopDragFrame();
      document.documentElement.removeAttribute("data-layout-dragging");
    },
    [stopDragFrame],
  );

  const onPointerDown = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType === "touch" || event.button !== 0) return;
    const element = elementRef.current;
    if (!element) return;
    dragRef.current = {
      kind: "pointer",
      pointerId: event.pointerId,
      startClientX: event.clientX,
      startClientY: event.clientY,
      currentClientX: event.clientX,
      currentClientY: event.clientY,
      startOffset: offset,
      currentOffset: offset,
      bounds: getMovementBounds(element, offset, bounds),
      armed: true,
      active: false,
    };
    element.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    const drag = dragRef.current;
    if (
      !drag ||
      drag.kind !== "pointer" ||
      drag.pointerId !== event.pointerId
    ) {
      return;
    }
    const distance = Math.hypot(
      event.clientX - drag.startClientX,
      event.clientY - drag.startClientY,
    );
    if (!drag.active && distance >= DRAG_THRESHOLD) activateDrag();
    if (dragRef.current?.active) {
      event.preventDefault();
      dragRef.current.currentClientX = event.clientX;
      dragRef.current.currentClientY = event.clientY;
      queueDragFrame();
    }
  };

  const finishPointerDrag = (event: PointerEvent<HTMLElement>) => {
    const drag = dragRef.current;
    if (
      !drag ||
      drag.kind !== "pointer" ||
      drag.pointerId !== event.pointerId
    ) {
      return;
    }
    finishDrag();
  };

  const onTouchStart = (event: TouchEvent<HTMLElement>) => {
    if (event.touches.length !== 1) return;
    const element = elementRef.current;
    const touch = event.touches[0];
    if (!element || !touch) return;
    dragRef.current = {
      kind: "touch",
      startClientX: touch.clientX,
      startClientY: touch.clientY,
      currentClientX: touch.clientX,
      currentClientY: touch.clientY,
      startOffset: offset,
      currentOffset: offset,
      bounds: getMovementBounds(element, offset, bounds),
      armed: false,
      active: false,
    };
    touchTimerRef.current = setTimeout(() => {
      touchTimerRef.current = null;
      if (dragRef.current?.kind === "touch") {
        dragRef.current.armed = true;
      }
    }, TOUCH_HOLD_DELAY);
  };

  const onTouchMove = (event: TouchEvent<HTMLElement>) => {
    const drag = dragRef.current;
    const touch = event.touches[0];
    if (!drag || drag.kind !== "touch" || !touch) return;
    const distance = Math.hypot(
      touch.clientX - drag.startClientX,
      touch.clientY - drag.startClientY,
    );
    if (!drag.armed) {
      if (distance > TOUCH_CANCEL_THRESHOLD) finishDrag();
      return;
    }
    if (!drag.active && distance >= DRAG_THRESHOLD) activateDrag();
    if (dragRef.current?.active) {
      event.preventDefault();
      dragRef.current.currentClientX = touch.clientX;
      dragRef.current.currentClientY = touch.clientY;
      queueDragFrame();
    }
  };

  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "Home") {
      event.preventDefault();
      store.resetItem(movableId);
      return;
    }

    const amount = event.shiftKey ? 24 : 8;
    const moves: Record<string, Offset> = {
      ArrowLeft: { x: -amount, y: 0 },
      ArrowRight: { x: amount, y: 0 },
      ArrowUp: { x: 0, y: -amount },
      ArrowDown: { x: 0, y: amount },
    };
    const move = moves[event.key];
    const element = elementRef.current;
    if (!move || !element) return;
    event.preventDefault();
    const next = clampOffset(
      { x: offset.x + move.x, y: offset.y + move.y },
      getMovementBounds(element, offset, bounds),
    );
    store.setOffset(movableId, next);
  };

  const onClickCapture = (event: MouseEvent<HTMLElement>) => {
    if (!suppressClickRef.current) return;
    event.preventDefault();
    event.stopPropagation();
    suppressClickRef.current = false;
  };

  const onDragStart = (event: DragEvent<HTMLElement>) => {
    event.preventDefault();
  };

  const movableStyle = {
    ...style,
    translate: `${offset.x}px ${offset.y}px`,
  } satisfies CSSProperties;
  const nativeAriaLabel = (
    rest as {
      "aria-label"?: string;
    }
  )["aria-label"];
  const setElementRef = useCallback((node: HTMLElement | null) => {
    elementRef.current = node;
  }, []);

  return (
    <Component
      {...rest}
      ref={setElementRef}
      className={`movable-shell${className ? ` ${className}` : ""}`}
      style={movableStyle}
      tabIndex={0}
      draggable={false}
      data-movable-id={movableId}
      aria-label={ariaLabel ?? nativeAriaLabel}
      aria-keyshortcuts="ArrowUp ArrowDown ArrowLeft ArrowRight Home"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={finishPointerDrag}
      onPointerCancel={finishPointerDrag}
      onLostPointerCapture={finishPointerDrag}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={finishDrag}
      onTouchCancel={finishDrag}
      onKeyDown={onKeyDown}
      onClickCapture={onClickCapture}
      onDragStart={onDragStart}
    >
      {children}
    </Component>
  );
}

export function ResetLayoutButton({
  className,
}: {
  className?: string;
}) {
  const store = useLayoutStore();
  const layout = useLayoutSnapshot();
  const movedCount = countMovedElements(layout);
  const [announcement, setAnnouncement] = useState("");

  const reset = () => {
    store.resetAll();
    setAnnouncement("");
    window.requestAnimationFrame(() => setAnnouncement("Layout reset"));
  };

  return (
    <Movable
      as="button"
      movableId="header-reset"
      className={className}
      type="button"
      data-reset-active={movedCount >= 4 ? "true" : "false"}
      data-moved-count={movedCount}
      onClick={reset}
      ariaLabel={`Reset movable layout. ${movedCount} non-sticker element${
        movedCount === 1 ? "" : "s"
      } moved.`}
    >
      <span aria-hidden="true">Reset</span>
      <span className="sr-only" aria-live="polite" aria-atomic="true">
        {announcement}
      </span>
    </Movable>
  );
}
