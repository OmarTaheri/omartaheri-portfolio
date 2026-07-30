"use client";

import { useEffect } from "react";

type ItemSnapshot = {
  id: string;
  classes: string[];
  translate: { x: number; y: number };
  rect: { left: number; top: number; width: number; height: number };
  baseRect: { left: number; top: number };
  viewportPercent: { left: number; top: number };
  parent: {
    id: string | null;
    classes: string[];
    left: number;
    top: number;
    width: number;
    height: number;
  } | null;
  parentPercent: { left: number; top: number } | null;
  inlineSize: { width: string; height: string };
};

type LayoutSnapshot = {
  capturedAt: string;
  viewport: {
    width: number;
    height: number;
    devicePixelRatio: number;
    scrollX: number;
    scrollY: number;
    breakpoint: "phone" | "tablet" | "desktop";
  };
  items: ItemSnapshot[];
};

type LayoutTrackerApi = {
  help: () => void;
  list: () => string[];
  snapshot: () => LayoutSnapshot;
  print: () => LayoutSnapshot;
  copy: () => Promise<string>;
  setSize: (id: string, width: number | string) => ItemSnapshot | null;
  resetSize: (id: string) => ItemSnapshot | null;
};

declare global {
  interface Window {
    layoutTracker?: LayoutTrackerApi;
    copyLayoutSnapshot?: () => Promise<string>;
  }
}

const round = (value: number) => Math.round(value * 10) / 10;

function parseTranslate(element: HTMLElement) {
  const value = window.getComputedStyle(element).translate;
  if (!value || value === "none") return { x: 0, y: 0 };

  const [x = "0", y = "0"] = value.split(/\s+/);
  return {
    x: round(Number.parseFloat(x) || 0),
    y: round(Number.parseFloat(y) || 0),
  };
}

function getBreakpoint(width: number): "phone" | "tablet" | "desktop" {
  if (width <= 400) return "phone";
  if (width <= 820) return "tablet";
  return "desktop";
}

function getItemSnapshot(element: HTMLElement): ItemSnapshot {
  const rect = element.getBoundingClientRect();
  const translate = parseTranslate(element);
  const parent = element.parentElement;
  const parentRect = parent?.getBoundingClientRect() ?? null;

  return {
    id: element.dataset.movableId ?? "unknown",
    classes: Array.from(element.classList),
    translate,
    rect: {
      left: round(rect.left),
      top: round(rect.top),
      width: round(rect.width),
      height: round(rect.height),
    },
    baseRect: {
      left: round(rect.left - translate.x),
      top: round(rect.top - translate.y),
    },
    viewportPercent: {
      left: round((rect.left / window.innerWidth) * 100),
      top: round((rect.top / window.innerHeight) * 100),
    },
    parent: parentRect
      ? {
          id: parent?.dataset.movableId ?? null,
          classes: parent ? Array.from(parent.classList) : [],
          left: round(parentRect.left),
          top: round(parentRect.top),
          width: round(parentRect.width),
          height: round(parentRect.height),
        }
      : null,
    parentPercent:
      parentRect && parentRect.width > 0 && parentRect.height > 0
        ? {
            left: round(((rect.left - parentRect.left) / parentRect.width) * 100),
            top: round(((rect.top - parentRect.top) / parentRect.height) * 100),
          }
        : null,
    inlineSize: {
      width: element.style.width,
      height: element.style.height,
    },
  };
}

function findMovable(id: string) {
  return Array.from(
    document.querySelectorAll<HTMLElement>("[data-movable-id]"),
  ).find((element) => element.dataset.movableId === id);
}

function createSnapshot(): LayoutSnapshot {
  return {
    capturedAt: new Date().toISOString(),
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight,
      devicePixelRatio: window.devicePixelRatio,
      scrollX: round(window.scrollX),
      scrollY: round(window.scrollY),
      breakpoint: getBreakpoint(window.innerWidth),
    },
    items: Array.from(
      document.querySelectorAll<HTMLElement>("[data-movable-id]"),
    )
      .map(getItemSnapshot)
      .sort((a, b) => a.id.localeCompare(b.id)),
  };
}

function isSafeSize(value: string) {
  return /^\d+(?:\.\d+)?(?:px|rem|vw|vh|%)$/.test(value);
}

export function LayoutTracker() {
  useEffect(() => {
    let resizeTimer = 0;
    let moveTimer = 0;

    const printItem = (element: HTMLElement) => {
      console.info("[layout-tracker] item updated", getItemSnapshot(element));
    };

    const printTargetAfterUpdate = (target: EventTarget | null) => {
      const element =
        target instanceof Element
          ? target.closest<HTMLElement>("[data-movable-id]")
          : null;
      if (!element) return;
      window.clearTimeout(moveTimer);
      moveTimer = window.setTimeout(() => printItem(element), 40);
    };

    const onKeyUp = (event: globalThis.KeyboardEvent) => {
      if (
        event.key === "Home" ||
        event.key === "ArrowLeft" ||
        event.key === "ArrowRight" ||
        event.key === "ArrowUp" ||
        event.key === "ArrowDown"
      ) {
        printTargetAfterUpdate(event.target);
      }
    };

    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        console.info("[layout-tracker] viewport updated", {
          width: window.innerWidth,
          height: window.innerHeight,
          devicePixelRatio: window.devicePixelRatio,
          breakpoint: getBreakpoint(window.innerWidth),
        });
      }, 180);
    };

    const onPointerUp = (event: globalThis.PointerEvent) => {
      printTargetAfterUpdate(event.target);
    };

    const onTouchEnd = (event: globalThis.TouchEvent) => {
      printTargetAfterUpdate(event.target);
    };

    const api: LayoutTrackerApi = {
      help: () => {
        console.info(
          [
            "Layout tracker commands:",
            "layoutTracker.list()",
            'layoutTracker.setSize("hero-sticker-1", 130)',
            'layoutTracker.resetSize("hero-sticker-1")',
            "layoutTracker.print()",
            "await layoutTracker.copy()",
            "await copyLayoutSnapshot()",
          ].join("\n"),
        );
      },
      list: () =>
        Array.from(
          document.querySelectorAll<HTMLElement>("[data-movable-id]"),
        )
          .map((element) => element.dataset.movableId ?? "")
          .filter(Boolean)
          .sort(),
      snapshot: createSnapshot,
      print: () => {
        const snapshot = createSnapshot();
        console.log("[layout-tracker] snapshot", snapshot);
        console.table(
          snapshot.items.map((item) => ({
            id: item.id,
            left: item.rect.left,
            top: item.rect.top,
            width: item.rect.width,
            height: item.rect.height,
            moveX: item.translate.x,
            moveY: item.translate.y,
          })),
        );
        return snapshot;
      },
      copy: async () => {
        const text = JSON.stringify(createSnapshot(), null, 2);
        try {
          await navigator.clipboard.writeText(text);
          console.info("[layout-tracker] snapshot copied to clipboard");
        } catch {
          console.info(
            "[layout-tracker] clipboard unavailable; copy the JSON below",
          );
        }
        console.log(text);
        return text;
      },
      setSize: (id, width) => {
        const element = findMovable(id);
        if (!element) {
          console.warn(`[layout-tracker] unknown movable id: ${id}`);
          return null;
        }

        const value = typeof width === "number" ? `${width}px` : width.trim();
        if (!isSafeSize(value)) {
          console.warn(
            "[layout-tracker] size must be a positive CSS length such as 130, 130px, 20vw, or 8rem",
          );
          return null;
        }

        element.style.width = value;
        const snapshot = getItemSnapshot(element);
        console.info("[layout-tracker] item resized", snapshot);
        return snapshot;
      },
      resetSize: (id) => {
        const element = findMovable(id);
        if (!element) {
          console.warn(`[layout-tracker] unknown movable id: ${id}`);
          return null;
        }
        element.style.removeProperty("width");
        const snapshot = getItemSnapshot(element);
        console.info("[layout-tracker] item size reset", snapshot);
        return snapshot;
      },
    };

    window.layoutTracker = api;
    window.copyLayoutSnapshot = api.copy;
    document.addEventListener("pointerup", onPointerUp);
    document.addEventListener("touchend", onTouchEnd);
    document.addEventListener("keyup", onKeyUp);
    window.addEventListener("resize", onResize);

    console.info(
      "[layout-tracker] ready — arrange items, resize with layoutTracker.setSize(id, px), then run await copyLayoutSnapshot()",
    );

    return () => {
      window.clearTimeout(resizeTimer);
      window.clearTimeout(moveTimer);
      delete window.layoutTracker;
      delete window.copyLayoutSnapshot;
      document.removeEventListener("pointerup", onPointerUp);
      document.removeEventListener("touchend", onTouchEnd);
      document.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return null;
}
