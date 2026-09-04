/* The measurements of the box lid, in millimetres.

   They were read off the original artwork in src/images/cover.png, an A3 plate
   where one pixel is one millimetre: pixel by pixel, so the numbers here are the
   drawing's own and not guesses. src/components/cover/CoverArt.tsx does nothing
   but draw them.

   Two things had to move, because the finished lid is shorter than an A3 — 268mm
   instead of 297: the gold rules keep an 11mm margin all round instead of 12,
   which is the same share of the paper as before, while the plaques, the titles
   and the anniversary mark stay at their natural size, hung off the rules exactly
   as they were hung off them in the original. Nothing is scaled, so nothing comes
   out distorted. */

/** The paper it is printed on, and the piece cut out of it. */
export const SHEET = { width: 420, height: 297 } as const;
export const TRIM = { width: 396, height: 268 } as const;

/** Where the lid sits on the paper: 12mm of white each side, 14.5mm top and bottom. */
export const TRIM_X = (SHEET.width - TRIM.width) / 2;
export const TRIM_Y = (SHEET.height - TRIM.height) / 2;

/** A straight gold stroke: `x1,y1` to `x2,y2`, this thick. */
export interface Rule {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  stroke: number;
}

/* ---------- The two rules round the edge ---------- */
/* `inset` is where the *outer* edge of the rule falls. SVG centres a stroke on
   its path, so the path itself has to run half a stroke further in. */

export const OUTER_RULE = { inset: 11, stroke: 4 } as const;
export const INNER_RULE = { inset: 18, stroke: 2 } as const;

export function ruleRect({ inset, stroke }: { inset: number; stroke: number }) {
  const edge = inset + stroke / 2;
  return { x: edge, y: edge, width: TRIM.width - 2 * edge, height: TRIM.height - 2 * edge, strokeWidth: stroke };
}

/* ---------- The two plaques ----------
   They straddle the outer rule and are filled with blue, so the rule disappears
   behind them instead of running across the words. In the original the top one
   sits 5mm below the middle of the rule and the bottom one 6mm above it, and the
   two are not the same size: the drawing is not perfectly symmetrical, and
   copying it is the point. */

export const PLAQUE_STROKE = 2;
export const TOP_PLAQUE = { width: 126, height: 26, offset: 5 } as const;
export const BOTTOM_PLAQUE = { width: 133, height: 22, offset: 6 } as const;

const TOP_RULE_MIDDLE = OUTER_RULE.inset + OUTER_RULE.stroke / 2;
const BOTTOM_RULE_MIDDLE = TRIM.height - TOP_RULE_MIDDLE;
export const TOP_PLAQUE_MIDDLE = TOP_RULE_MIDDLE + TOP_PLAQUE.offset;
export const BOTTOM_PLAQUE_MIDDLE = BOTTOM_RULE_MIDDLE - BOTTOM_PLAQUE.offset;

export function plaqueRect(plaque: { width: number; height: number }, middle: number) {
  const edge = PLAQUE_STROKE / 2;
  return {
    x: (TRIM.width - plaque.width) / 2 + edge,
    y: middle - plaque.height / 2 + edge,
    width: plaque.width - PLAQUE_STROKE,
    height: plaque.height - PLAQUE_STROKE,
  };
}

/* ---------- The two titles ----------
   Sized on the cap height read off the original, and pinned to the width read off
   it as well: the drawing sets `textLength` from it, so the words stay exactly as
   long as they are on the box even on a machine that resolves Arial to something
   slightly different. */

/** Cap height of Arial Bold, as a share of the font size. */
export const ARIAL_BOLD_CAP = 0.716;

export const TOP_TITLE = { text: 'MONOPOLY', cap: 14, width: 116 } as const;
export const BOTTOM_TITLE = { text: 'LIMITED EDITION', cap: 10, width: 117 } as const;

/* ---------- The fortieth-anniversary mark ----------
   Still in the coordinates of cover.png: the drawing shifts the whole group by
   MARK_SHIFT, which lands the middle of the mark in the middle of the lid.

   The "4" is four strokes — the slant, the bar that crosses it, the rule that
   runs above the "0" and the stem that drops below the bar — and the "0" is the
   circle, with the two years stacked inside it. A hairline divides the anniversary
   figure from the SIDA wordmark. */

export const MARK_BOX = { left: 115, top: 122, right: 306, bottom: 175 } as const;

export const MARK_SHIFT = {
  x: TRIM.width / 2 - (MARK_BOX.left + MARK_BOX.right) / 2,
  y: TRIM.height / 2 - (MARK_BOX.top + MARK_BOX.bottom) / 2,
};

export const SLANT: Rule = { x1: 139.2, y1: 122.6, x2: 115.3, y2: 158.9, stroke: 1.7 };
export const BAR: Rule = { x1: 115, y1: 158.9, x2: 184.3, y2: 158.9, stroke: 2.1 };
export const OVERBAR: Rule = { x1: 146, y1: 123.6, x2: 184.3, y2: 123.6, stroke: 1.7 };
export const STEM: Rule = { x1: 137.7, y1: 140, x2: 137.7, y2: 173.5, stroke: 1.8 };
export const DIVIDER: Rule = { x1: 195, y1: 122, x2: 195, y2: 175, stroke: 1.4 };
export const ZERO = { cx: 164.5, cy: 148.2, r: 19.25, stroke: 1.7 } as const;

/** The two years, one under the other inside the "0". */
export const YEARS = {
  x: ZERO.cx,
  width: 21,
  cap: 7,
  lines: [
    { text: '1986', baseline: 145.5 },
    { text: '2026', baseline: 154.5 },
  ],
} as const;

/** Where the wordmark goes; its height follows from the outlines' own proportions. */
export const WORDMARK = { x: 208, y: 124, width: 98 } as const;

/** The registered mark, over the shoulder of the "A". */
export const REGISTERED = { cx: 301.5, cy: 127.2, r: 3.3, stroke: 0.7, cap: 3.7, width: 4 } as const;

/* ---------- Crop marks ---------- */
/* Eight grey ticks, two at each corner of the lid: the line to cut along. They
   are drawn on the white paper and never on the blue, so they leave no mark on
   the finished cover — `gap` is how far they stand off the trim. */

export const MARKS = { stroke: 0.3, gap: 1.2, length: 5 } as const;

export function cropTicks(): string {
  const left = TRIM_X;
  const right = TRIM_X + TRIM.width;
  const top = TRIM_Y;
  const bottom = TRIM_Y + TRIM.height;
  const { gap, length } = MARKS;
  return [
    `M${left} ${top - gap}v${-length}`,
    `M${right} ${top - gap}v${-length}`,
    `M${left} ${bottom + gap}v${length}`,
    `M${right} ${bottom + gap}v${length}`,
    `M${left - gap} ${top}h${-length}`,
    `M${left - gap} ${bottom}h${-length}`,
    `M${right + gap} ${top}h${length}`,
    `M${right + gap} ${bottom}h${length}`,
  ].join(' ');
}
