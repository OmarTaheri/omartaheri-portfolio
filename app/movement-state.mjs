export const MOVEMENT_STORAGE_KEY = "omar-movable-layout:v3";

export const MOVABLE_IDS = Object.freeze([
  "header-monogram",
  "header-menu",
  "header-nav-profile",
  "header-nav-story",
  "header-nav-projects",
  "header-nav-now",
  "header-nav-contact",
  "header-email",
  "header-reset",
  "header-theme",
  "hero-card-back-left",
  "hero-card-back-right",
  "hero-card-front",
  "hero-intro",
  "hero-sticker-1",
  "hero-sticker-2",
  "hero-sticker-3",
  "hero-sticker-4",
  "hero-sticker-5",
  "hero-sticker-6",
  "hero-sticker-7",
  "hero-sticker-8",
  "hero-sticker-9",
  "hero-sticker-10",
  "hero-sticker-11",
  "hero-sticker-12",
  "hero-sticker-13",
  "hero-sticker-14",
  "hero-sticker-15",
  "hero-sticker-16",
  "hero-sticker-17",
  "hero-sticker-18",
  "hero-sticker-19",
  "story-heading",
  "story-card-1",
  "story-card-2",
  "story-card-3",
  "story-card-4",
  "story-card-5",
  "story-card-6",
  "story-annotation",
  "stats-heading",
  "metric-card-1",
  "metric-card-2",
  "metric-card-3",
  "metric-card-4",
  "skill-card-1",
  "skill-card-2",
  "skill-card-3",
  "skill-card-4",
  "skill-card-5",
  "skill-card-6",
  "skill-card-7",
  "projects-heading",
  "project-card-heynotai",
  "project-card-roseden",
  "project-card-portfolio-omartaheri",
  "project-card-see-more",
  "now-card",
  "contact-card",
]);

export const STICKER_IDS = new Set([
  "hero-sticker-1",
  "hero-sticker-2",
  "hero-sticker-3",
  "hero-sticker-4",
  "hero-sticker-5",
  "hero-sticker-6",
  "hero-sticker-7",
  "hero-sticker-8",
  "hero-sticker-9",
  "hero-sticker-10",
  "hero-sticker-11",
  "hero-sticker-12",
  "hero-sticker-13",
  "hero-sticker-14",
  "hero-sticker-15",
  "hero-sticker-16",
  "hero-sticker-17",
  "hero-sticker-18",
  "hero-sticker-19",
]);

const knownIds = new Set(MOVABLE_IDS);

export function isOffset(value) {
  return (
    value !== null &&
    typeof value === "object" &&
    Number.isFinite(value.x) &&
    Number.isFinite(value.y)
  );
}

export function parseStoredLayout(serialized) {
  if (typeof serialized !== "string" || serialized.length === 0) return {};

  try {
    const parsed = JSON.parse(serialized);
    if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) {
      return {};
    }

    return Object.fromEntries(
      Object.entries(parsed)
        .filter(([id, offset]) => knownIds.has(id) && isOffset(offset))
        .map(([id, offset]) => [
          id,
          {
            x: Math.round(offset.x),
            y: Math.round(offset.y),
          },
        ])
        .filter(([, offset]) => offset.x !== 0 || offset.y !== 0),
    );
  } catch {
    return {};
  }
}

export function clampOffset(offset, bounds) {
  return {
    x: Math.min(Math.max(offset.x, bounds.minX), bounds.maxX),
    y: Math.min(Math.max(offset.y, bounds.minY), bounds.maxY),
  };
}

export function resetLayout() {
  return {};
}

export function resetLayoutItem(layout, id) {
  const next = { ...layout };
  delete next[id];
  return next;
}

export function countMovedElements(layout) {
  return Object.entries(layout).reduce((count, [id, offset]) => {
    if (
      !knownIds.has(id) ||
      STICKER_IDS.has(id) ||
      !isOffset(offset) ||
      (offset.x === 0 && offset.y === 0)
    ) {
      return count;
    }

    return count + 1;
  }, 0);
}

export function hasResetEffect(layout) {
  return countMovedElements(layout) >= 4;
}
