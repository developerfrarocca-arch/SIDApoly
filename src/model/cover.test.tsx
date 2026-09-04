import { describe, expect, it } from 'vitest';
import { CoverArt } from '../components/cover/CoverArt';
import { toDom, toHtml } from '../test/render';
import {
  BOTTOM_PLAQUE,
  BOTTOM_PLAQUE_MIDDLE,
  INNER_RULE,
  MARK_BOX,
  MARK_SHIFT,
  OUTER_RULE,
  SHEET,
  TOP_PLAQUE,
  TOP_PLAQUE_MIDDLE,
  TRIM,
  TRIM_X,
  TRIM_Y,
  cropTicks,
  plaqueRect,
  ruleRect,
} from './cover';

describe('the size of the lid', () => {
  it('is the 396x268mm asked for, on an A3 landscape sheet', () => {
    expect(TRIM).toEqual({ width: 396, height: 268 });
    expect(SHEET).toEqual({ width: 420, height: 297 });
  });

  it('leaves the same paper to cut away on opposite sides', () => {
    expect(TRIM_X).toBe(12);
    expect(TRIM_Y).toBe(14.5);
    expect(TRIM_X + TRIM.width + TRIM_X).toBe(SHEET.width);
    expect(TRIM_Y + TRIM.height + TRIM_Y).toBe(SHEET.height);
  });
});

describe('the gold rules', () => {
  it('put their outer edge where the inset says, not the middle of the stroke', () => {
    const outer = ruleRect(OUTER_RULE);
    expect(outer.x - outer.strokeWidth / 2).toBe(OUTER_RULE.inset);
    expect(outer.x + outer.width + outer.strokeWidth / 2).toBe(TRIM.width - OUTER_RULE.inset);
  });

  it('leaves 3mm of blue between the two, as on the box', () => {
    const outer = ruleRect(OUTER_RULE);
    const inner = ruleRect(INNER_RULE);
    const outerInnerEdge = outer.x + outer.strokeWidth / 2;
    const innerOuterEdge = inner.x - inner.strokeWidth / 2;
    expect(innerOuterEdge - outerInnerEdge).toBe(3);
  });
});

describe('the two plaques', () => {
  it('straddles the rule it hangs off', () => {
    const top = plaqueRect(TOP_PLAQUE, TOP_PLAQUE_MIDDLE);
    const bottom = plaqueRect(BOTTOM_PLAQUE, BOTTOM_PLAQUE_MIDDLE);
    // the top one starts above the outer edge of the rule, the bottom one below it
    expect(top.y).toBeLessThan(OUTER_RULE.inset);
    expect(bottom.y + bottom.height).toBeGreaterThan(TRIM.height - OUTER_RULE.inset);
  });

  it('sits in the middle of the lid, left to right', () => {
    for (const [plaque, middle] of [
      [TOP_PLAQUE, TOP_PLAQUE_MIDDLE],
      [BOTTOM_PLAQUE, BOTTOM_PLAQUE_MIDDLE],
    ] as const) {
      const rect = plaqueRect(plaque, middle);
      expect(rect.x + rect.width / 2).toBe(TRIM.width / 2);
    }
  });
});

describe('the anniversary mark', () => {
  it('lands in the middle of the lid once shifted', () => {
    const middleX = (MARK_BOX.left + MARK_BOX.right) / 2 + MARK_SHIFT.x;
    const middleY = (MARK_BOX.top + MARK_BOX.bottom) / 2 + MARK_SHIFT.y;
    expect(middleX).toBe(TRIM.width / 2);
    expect(middleY).toBe(TRIM.height / 2);
  });

  it('stays well inside the inner rule', () => {
    const width = MARK_BOX.right - MARK_BOX.left;
    const height = MARK_BOX.bottom - MARK_BOX.top;
    expect(width).toBeLessThan(TRIM.width - 2 * INNER_RULE.inset);
    expect(height).toBeLessThan(TRIM.height - 2 * INNER_RULE.inset);
  });
});

describe('the crop marks', () => {
  it('draws eight ticks, two at each corner', () => {
    expect(cropTicks().match(/M/g)).toHaveLength(8);
  });

  it('never touches the blue', () => {
    const left = TRIM_X;
    const top = TRIM_Y;
    // the two ticks of the top left corner stop short of the corner itself
    expect(cropTicks()).toContain(`M${left} ${top - 1.2}v-5`);
    expect(cropTicks()).toContain(`M${left - 1.2} ${top}h-5`);
  });
});

describe('the drawing', () => {
  it('is one A3 sheet with the lid centred on it', () => {
    const svg = toDom(<CoverArt sheen cropMarks />).querySelector('svg');
    expect(svg?.getAttribute('viewBox')).toBe('0 0 420 297');
    expect(svg?.querySelector('g[transform="translate(12 14.5)"]')).not.toBeNull();
  });

  it('leaves out the crop marks when they are not wanted', () => {
    expect(toHtml(<CoverArt sheen cropMarks />)).toContain(cropTicks());
    expect(toHtml(<CoverArt sheen cropMarks={false} />)).not.toContain(cropTicks());
  });

  it('paints flat gold instead of the sheen when the sidebar says so', () => {
    expect(toHtml(<CoverArt sheen cropMarks />)).toContain('url(#oro-sida)');
    expect(toHtml(<CoverArt sheen={false} cropMarks />)).not.toContain('url(#oro-');
  });
});
