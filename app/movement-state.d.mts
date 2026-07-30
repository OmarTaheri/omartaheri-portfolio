export type Offset = { x: number; y: number };
export type LayoutState = Record<string, Offset>;
export type MovementBounds = {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
};

export const MOVEMENT_STORAGE_KEY: "omar-movable-layout:v1";
export const MOVABLE_IDS: readonly string[];
export const STICKER_IDS: ReadonlySet<string>;

export function isOffset(value: unknown): value is Offset;
export function parseStoredLayout(serialized: unknown): LayoutState;
export function clampOffset(
  offset: Offset,
  bounds: MovementBounds,
): Offset;
export function resetLayout(): LayoutState;
export function resetLayoutItem(
  layout: LayoutState,
  id: string,
): LayoutState;
export function countMovedElements(layout: LayoutState): number;
export function hasResetEffect(layout: LayoutState): boolean;
