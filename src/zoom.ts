/* The board is an A3: 420mm do not fit in any window. On screen it shrinks; in
   print it comes out at full size because @media print cancels the zoom with
   `zoom:1 !important`.

   We use `zoom` and not `transform: scale()`: zoom redoes the layout, so the
   container shrinks with the page instead of leaving the void of the original
   footprint, and the text is painted at the reduced size instead of being
   rasterised and blurred. */

export const ZOOM_MIN = 0.2;
export const ZOOM_MAX = 2;
export const ZOOM_STEP = 0.1;

/** Never above 1: the page is not enlarged past its natural size. */
export function fitFactor(available: number, natural: number): number {
  if (!(available > 0) || !(natural > 0)) return 1;
  const truncatedToThreeDecimals = Math.floor((available / natural) * 1000) / 1000;
  return Math.min(1, truncatedToThreeDecimals);
}

export function nextStep(current: number, direction: 1 | -1, step = ZOOM_STEP): number {
  const withoutFloatingPointNoise = Math.round((current + direction * step) * 100) / 100;
  return Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, withoutFloatingPointNoise));
}

export function percent(factor: number): string {
  return `${Math.round(factor * 100)}%`;
}
