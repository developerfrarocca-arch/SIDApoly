/* The lid of the box, drawn on one A3 landscape sheet: a 396x268mm rectangle —
   the size of the lid — centred on the paper, with crop marks in the white that
   is left round it.

   Every measurement lives in src/model/cover.ts, read off the original artwork in
   src/images/cover.png. This file only paints them.

   It is one SVG and not the usual div-and-millimetre layout of the other pages
   because the mark is line art: a circle, a few straight strokes and two words.
   In SVG they come out at any size without a single rounded pixel, and the gold
   can carry the metallic sheen of the original. */

import { SIDA_CAPS, SIDA_CAPS_BAND, SIDA_TAGLINE, SIDA_TAGLINE_BAND, SIDA_VIEWBOX } from '../../data/sidaWordmark';
import {
  ARIAL_BOLD_CAP,
  BAR,
  BOTTOM_PLAQUE,
  BOTTOM_PLAQUE_MIDDLE,
  BOTTOM_TITLE,
  DIVIDER,
  INNER_RULE,
  MARKS,
  MARK_SHIFT,
  OUTER_RULE,
  OVERBAR,
  PLAQUE_STROKE,
  REGISTERED,
  SHEET,
  SLANT,
  STEM,
  TOP_PLAQUE,
  TOP_PLAQUE_MIDDLE,
  TOP_TITLE,
  TRIM,
  TRIM_X,
  TRIM_Y,
  WORDMARK,
  YEARS,
  ZERO,
  cropTicks,
  plaqueRect,
  ruleRect,
  type Rule,
} from '../../model/cover';

/** Blue field and gold: the lid has no other colour. The grey is only for the ticks. */
const BLUE = '#003E7D';
const GOLD = '#E6B604';
const TICK_GREY = '#8A8A8A';

/* ---------- The metallic sheen ----------
   The gold of the mark is not flat: it darkens at the two ends of every stroke
   and goes pale in the middle. These stops were read down the stem of the "I" of
   SIDA, one pixel at a time, and each stroke gets them poured along its own
   length — that is how the original does it, so the pale spot of a horizontal
   rule sits halfway along it and not halfway up it. */

const SHEEN: readonly (readonly [number, string])[] = [
  [0, '#C89516'],
  [15, '#C89515'],
  [24, '#EABB05'],
  [33, '#F0D15A'],
  [42, '#F5E67C'],
  [52, '#FCF565'],
  [61, '#F4E380'],
  [70, '#F0CE4E'],
  [79, '#E6B605'],
  [88, '#C89515'],
  [100, '#C89516'],
];

/** Where a sheen starts and ends. A stroke's own length doubles as its axis. */
interface Axis {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

function Sheen({ id, axis }: { id: string; axis: Axis }) {
  return (
    <linearGradient id={id} gradientUnits="userSpaceOnUse" x1={axis.x1} y1={axis.y1} x2={axis.x2} y2={axis.y2}>
      {SHEEN.map(([offset, colour]) => (
        <stop key={offset} offset={`${offset}%`} stopColor={colour} />
      ))}
    </linearGradient>
  );
}

/** Sheened gold, or flat gold when the sidebar asks for it. */
function gold(sheen: boolean, id: string) {
  return sheen ? `url(#${id})` : GOLD;
}

function GoldRule({ rule, paint }: { rule: Rule; paint: string }) {
  return <line x1={rule.x1} y1={rule.y1} x2={rule.x2} y2={rule.y2} stroke={paint} strokeWidth={rule.stroke} />;
}

/** Arial Bold, as tall and as long as it is on the box. */
function Words({
  words,
  x,
  baseline,
  paint,
}: {
  words: { text: string; cap: number; width: number };
  x: number;
  baseline: number;
  paint: string;
}) {
  return (
    <text
      x={x}
      y={baseline}
      textAnchor="middle"
      textLength={words.width}
      lengthAdjust="spacing"
      fontFamily="Arial, Helvetica, sans-serif"
      fontWeight={700}
      fontSize={words.cap / ARIAL_BOLD_CAP}
      fill={paint}
    >
      {words.text}
    </text>
  );
}

/* The axes of the sheens that are not simply a stroke's own length. */
const ZERO_AXIS: Axis = { x1: ZERO.cx, y1: ZERO.cy - ZERO.r, x2: ZERO.cx, y2: ZERO.cy + ZERO.r };
const YEARS_AXIS: Axis = { x1: YEARS.x, y1: 138, x2: YEARS.x, y2: 155 };
const REGISTERED_AXIS: Axis = {
  x1: REGISTERED.cx,
  y1: REGISTERED.cy - REGISTERED.r,
  x2: REGISTERED.cx,
  y2: REGISTERED.cy + REGISTERED.r,
};

/** The wordmark is scaled from its own 816x410 grid down to the width on the box. */
const WORDMARK_SCALE = WORDMARK.width / SIDA_VIEWBOX.width;

function Mark({ sheen }: { sheen: boolean }) {
  return (
    <g transform={`translate(${MARK_SHIFT.x} ${MARK_SHIFT.y})`}>
      <GoldRule rule={SLANT} paint={gold(sheen, 'oro-slant')} />
      <GoldRule rule={BAR} paint={gold(sheen, 'oro-bar')} />
      <GoldRule rule={OVERBAR} paint={gold(sheen, 'oro-overbar')} />
      <GoldRule rule={STEM} paint={gold(sheen, 'oro-stem')} />
      <circle
        cx={ZERO.cx}
        cy={ZERO.cy}
        r={ZERO.r}
        fill="none"
        stroke={gold(sheen, 'oro-zero')}
        strokeWidth={ZERO.stroke}
      />

      {YEARS.lines.map((line) => (
        <Words
          key={line.text}
          words={{ text: line.text, cap: YEARS.cap, width: YEARS.width }}
          x={YEARS.x}
          baseline={line.baseline}
          paint={gold(sheen, 'oro-years')}
        />
      ))}

      <GoldRule rule={DIVIDER} paint={gold(sheen, 'oro-divider')} />

      <g transform={`translate(${WORDMARK.x} ${WORDMARK.y}) scale(${WORDMARK_SCALE})`}>
        <g fill={gold(sheen, 'oro-sida')}>
          {SIDA_CAPS.map((outline, n) => (
            <path key={n} d={outline} />
          ))}
        </g>
        <g fill={gold(sheen, 'oro-tagline')}>
          {SIDA_TAGLINE.map((outline, n) => (
            <path key={n} d={outline} />
          ))}
        </g>
      </g>

      <circle
        cx={REGISTERED.cx}
        cy={REGISTERED.cy}
        r={REGISTERED.r}
        fill="none"
        stroke={gold(sheen, 'oro-registered')}
        strokeWidth={REGISTERED.stroke}
      />
      <Words
        words={{ text: 'R', cap: REGISTERED.cap, width: REGISTERED.width }}
        x={REGISTERED.cx}
        baseline={REGISTERED.cy + REGISTERED.cap / 2}
        paint={gold(sheen, 'oro-registered')}
      />
    </g>
  );
}

export function CoverArt({ sheen, cropMarks }: { sheen: boolean; cropMarks: boolean }) {
  return (
    <svg
      className="cover-art"
      viewBox={`0 0 ${SHEET.width} ${SHEET.height}`}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Copertina della scatola: Monopoly SIDA Limited Edition"
    >
      <defs>
        <Sheen id="oro-slant" axis={SLANT} />
        <Sheen id="oro-bar" axis={BAR} />
        <Sheen id="oro-overbar" axis={OVERBAR} />
        <Sheen id="oro-stem" axis={STEM} />
        <Sheen id="oro-divider" axis={DIVIDER} />
        <Sheen id="oro-zero" axis={ZERO_AXIS} />
        <Sheen id="oro-years" axis={YEARS_AXIS} />
        <Sheen id="oro-registered" axis={REGISTERED_AXIS} />
        {/* These two are used inside the scaled group, so their axes are in the
            outlines' own coordinates and not in millimetres. */}
        <Sheen id="oro-sida" axis={{ x1: 0, y1: SIDA_CAPS_BAND.top, x2: 0, y2: SIDA_CAPS_BAND.bottom }} />
        <Sheen id="oro-tagline" axis={{ x1: 0, y1: SIDA_TAGLINE_BAND.top, x2: 0, y2: SIDA_TAGLINE_BAND.bottom }} />
      </defs>

      {cropMarks && <path d={cropTicks()} fill="none" stroke={TICK_GREY} strokeWidth={MARKS.stroke} />}

      <g transform={`translate(${TRIM_X} ${TRIM_Y})`}>
        <rect width={TRIM.width} height={TRIM.height} fill={BLUE} />

        <g fill="none" stroke={GOLD}>
          <rect {...ruleRect(OUTER_RULE)} />
          <rect {...ruleRect(INNER_RULE)} />
        </g>

        <Mark sheen={sheen} />

        {/* Last, so the blue of the plaques covers the rule that runs behind them. */}
        <g fill={BLUE} stroke={GOLD} strokeWidth={PLAQUE_STROKE}>
          <rect {...plaqueRect(TOP_PLAQUE, TOP_PLAQUE_MIDDLE)} />
          <rect {...plaqueRect(BOTTOM_PLAQUE, BOTTOM_PLAQUE_MIDDLE)} />
        </g>
        <Words words={TOP_TITLE} x={TRIM.width / 2} baseline={TOP_PLAQUE_MIDDLE + TOP_TITLE.cap / 2} paint={GOLD} />
        <Words
          words={BOTTOM_TITLE}
          x={TRIM.width / 2}
          baseline={BOTTOM_PLAQUE_MIDDLE + BOTTOM_TITLE.cap / 2}
          paint={GOLD}
        />
      </g>
    </svg>
  );
}
