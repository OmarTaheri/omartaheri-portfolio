import assert from "node:assert/strict";
import test from "node:test";
import {
  clampOffset,
  countMovedElements,
  hasResetEffect,
  MOVEMENT_STORAGE_KEY,
  parseStoredLayout,
  resetLayout,
  resetLayoutItem,
} from "../app/movement-state.mjs";

test("uses a versioned persistence key and safely parses known positions", () => {
  assert.equal(MOVEMENT_STORAGE_KEY, "omar-movable-layout:v3");
  assert.deepEqual(parseStoredLayout("not-json"), {});
  assert.deepEqual(parseStoredLayout("[]"), {});
  assert.deepEqual(
    parseStoredLayout(
      JSON.stringify({
        "hero-intro": { x: 12.4, y: -9.6 },
        "unknown-card": { x: 100, y: 100 },
        "project-card-1": { x: 40, y: 40 },
        "project-card-heynotai": { x: 8.4, y: -3.6 },
        "story-heading": { x: "bad", y: 2 },
        "now-card": { x: 0, y: 0 },
      }),
    ),
    {
      "hero-intro": { x: 12, y: -10 },
      "project-card-heynotai": { x: 8, y: -4 },
    },
  );
});

test("clamps an offset inside the current document bounds", () => {
  const bounds = { minX: -20, maxX: 80, minY: -30, maxY: 120 };
  assert.deepEqual(clampOffset({ x: -90, y: 400 }, bounds), {
    x: -20,
    y: 120,
  });
  assert.deepEqual(clampOffset({ x: 25, y: 40 }, bounds), { x: 25, y: 40 });
});

test("counts unique moved blocks while excluding hero stickers", () => {
  const layout = {
    "hero-intro": { x: 1, y: 0 },
    "story-heading": { x: 0, y: 1 },
    "project-card-heynotai": { x: 8, y: 8 },
    "header-reset": { x: 2, y: 2 },
    "hero-sticker-1": { x: 30, y: 30 },
    "hero-sticker-17": { x: -24, y: 12 },
    "hero-sticker-19": { x: 18, y: -12 },
    "project-card-1": { x: 10, y: 10 },
    "unknown-card": { x: 10, y: 10 },
  };

  assert.equal(countMovedElements(layout), 4);
  assert.equal(hasResetEffect(layout), true);
  assert.equal(
    hasResetEffect({ ...layout, "header-reset": { x: 0, y: 0 } }),
    false,
  );
});

test("resets one block without touching others and globally resets all", () => {
  const layout = {
    "hero-intro": { x: 10, y: 5 },
    "now-card": { x: -8, y: 12 },
  };

  assert.deepEqual(resetLayoutItem(layout, "hero-intro"), {
    "now-card": { x: -8, y: 12 },
  });
  assert.deepEqual(resetLayout(), {});
  assert.deepEqual(layout, {
    "hero-intro": { x: 10, y: 5 },
    "now-card": { x: -8, y: 12 },
  });
});
