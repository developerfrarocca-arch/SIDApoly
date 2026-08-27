import { describe, expect, it } from 'vitest';
import { Cell } from '../components/board/Cell';
import { SPACES, SPACE_COUNT, type Group, type Space } from '../data/spaces';
import { toHtml } from '../test/render';
import { bindCurrency, placementOf, priceLabel, spaceCssClasses, type Rotation } from './board';

const indexes = [...Array(SPACE_COUNT).keys()];
const CORNERS = [0, 10, 20, 30];

describe('placementOf', () => {
  it('keeps every space on the perimeter of the 11x11 grid', () => {
    for (const i of indexes) {
      const { column, row } = placementOf(i);
      const onTheEdge = column === 1 || column === 11 || row === 1 || row === 11;
      expect(onTheEdge, `space ${i} at column ${column} row ${row}`).toBe(true);
      expect(column).toBeGreaterThanOrEqual(1);
      expect(column).toBeLessThanOrEqual(11);
      expect(row).toBeGreaterThanOrEqual(1);
      expect(row).toBeLessThanOrEqual(11);
    }
  });

  it('never puts two spaces in the same cell', () => {
    const used = new Set(indexes.map((i) => `${placementOf(i).column}:${placementOf(i).row}`));
    expect(used.size).toBe(SPACE_COUNT);
  });

  it('goes clockwise starting from the bottom right corner', () => {
    expect(placementOf(0)).toEqual({ column: 11, row: 11, rotation: 'rot315' });
    expect(placementOf(10)).toEqual({ column: 1, row: 11, rotation: 'rot45' });
    expect(placementOf(20)).toEqual({ column: 1, row: 1, rotation: 'rot135' });
    expect(placementOf(30)).toEqual({ column: 11, row: 1, rotation: 'rot225' });
    expect(placementOf(39)).toEqual({ column: 11, row: 10, rotation: 'rot270' });
  });

  it('rotates by side, and corners 45 degrees towards the middle', () => {
    const expectedCorners: Record<number, Rotation> = {
      0: 'rot315',
      10: 'rot45',
      20: 'rot135',
      30: 'rot225',
    };
    for (const i of CORNERS) expect(placementOf(i).rotation).toBe(expectedCorners[i]);
    for (const i of indexes) {
      if (CORNERS.includes(i)) continue;
      const expected = i < 10 ? '' : i < 20 ? 'rot90' : i < 30 ? 'rot180' : 'rot270';
      expect(placementOf(i).rotation, `space ${i}`).toBe(expected);
    }
  });

  it('rejects indexes outside the board', () => {
    expect(() => placementOf(-1)).toThrow(RangeError);
    expect(() => placementOf(40)).toThrow(RangeError);
    expect(() => placementOf(1.5)).toThrow(RangeError);
  });
});

describe('space data', () => {
  it('has 40 spaces', () => {
    expect(SPACES).toHaveLength(SPACE_COUNT);
  });

  it('has 4 corners, 22 properties, 8 specials and 6 card spaces', () => {
    const count = (type: Space['type']) => SPACES.filter((s) => s.type === type).length;
    expect(count('corner')).toBe(4);
    expect(count('property')).toBe(22);
    expect(count('special')).toBe(8);
    expect(count('card')).toBe(6);
  });

  it('puts the corners at indexes 0, 10, 20, 30', () => {
    expect(indexes.filter((i) => SPACES[i]!.type === 'corner')).toEqual(CORNERS);
  });

  it('respects the colour group sizes of the classic game', () => {
    const expectedSizes: Record<Group, number> = {
      brown: 2,
      lightblue: 3,
      pink: 3,
      orange: 3,
      red: 3,
      yellow: 3,
      green: 3,
      darkblue: 2,
    };
    for (const [group, size] of Object.entries(expectedSizes)) {
      const found = SPACES.filter((s) => s.type === 'property' && s.group === group);
      expect(found, group).toHaveLength(size);
      // inside a group the department must always be the same
      const departments = new Set(found.map((s) => (s.type === 'property' ? s.department : '')));
      expect(departments.size, `departments of ${group}`).toBe(1);
    }
  });

  it('keeps the approved price scale', () => {
    const prices = SPACES.filter((s) => s.type === 'property').map((s) => (s.type === 'property' ? s.price : 0));
    expect(prices).toEqual([
      150, 150, 250, 250, 300, 350, 350, 400, 450, 450, 500, 550, 550, 600, 650, 650, 700, 750, 750, 800, 900, 1000,
    ]);
  });

  it('has the 4 Consulenza and the 2 utilities among the special spaces', () => {
    const names = SPACES.filter((s) => s.type === 'special').map((s) => s.name);
    expect(names.filter((n) => n.startsWith('Consulenza '))).toHaveLength(4);
    expect(names).toContain('Enel');
    expect(names).toContain('Impianto clima');
  });

  it('has 3 Imprevisti and 3 Probabilità', () => {
    const names = SPACES.filter((s) => s.type === 'card').map((s) => s.name);
    expect(names.filter((n) => n === 'Imprevisti')).toHaveLength(3);
    expect(names.filter((n) => n === 'Probabilità')).toHaveLength(3);
  });

  it('leaves no field empty', () => {
    for (const [i, space] of SPACES.entries()) {
      expect(space.name, `space ${i}`).toBeTruthy();
      if (space.type !== 'property') expect(space.icon, `space ${i}`).toBeTruthy();
      if (space.type === 'corner') expect(space.subtitle, `space ${i}`).toBeTruthy();
      if (space.type === 'property') expect(space.department, `space ${i}`).toBeTruthy();
    }
  });
});

describe('bindCurrency', () => {
  it('ties BP to its number with a non-breaking space', () => {
    expect(bindCurrency('200 BP')).toBe('200 BP');
    expect(bindCurrency('pagate 125 BP di sanzione')).toBe('pagate 125 BP di sanzione');
    expect(bindCurrency('60 BP per Aggiornamento e 250 BP per Major Release')).toBe(
      '60 BP per Aggiornamento e 250 BP per Major Release',
    );
  });

  it('leaves the text alone where BP is not an amount', () => {
    expect(bindCurrency('Buoni Pasto (BP)')).toBe('Buoni Pasto (BP)');
    expect(bindCurrency('BP')).toBe('BP');
    expect(bindCurrency('Pausa caffè')).toBe('Pausa caffè');
  });
});

describe('the cell markup', () => {
  it('formats the price in BP, with the currency tied to the number', () => {
    expect(priceLabel(240)).toBe('240 BP');
    expect(priceLabel('Paga 200 BP')).toBe('Paga 200 BP');
  });

  it('escapes HTML characters coming from the data', () => {
    const html = toHtml(
      <Cell
        index={1}
        space={{
          type: 'property',
          group: 'red',
          department: 'R&D',
          name: '<script>',
          price: 100,
        }}
      />,
    );
    expect(html).toContain('R&amp;D');
    expect(html).not.toContain('<script>');
  });

  it('adds the card class only to spaces with no price', () => {
    expect(spaceCssClasses({ type: 'card', icon: '?', name: 'Probabilità' }, 'rot90')).toBe('cell special rot90 card');
    expect(spaceCssClasses({ type: 'special', icon: '!', name: 'Consulenza Nord', price: 200 }, 'rot90')).toBe(
      'cell special rot90',
    );
  });

  it('makes no space editable', () => {
    const property = SPACES.findIndex((s) => s.type === 'property');
    const card = SPACES.findIndex((s) => s.type === 'card');
    expect(toHtml(<Cell space={SPACES[property]!} index={property} />)).not.toContain('contenteditable');
    expect(toHtml(<Cell space={SPACES[card]!} index={card} />)).not.toContain('contenteditable');
  });
});

describe('the 40 cells', () => {
  /** The board as the page builds it: just the cells, without the centre. */
  function board(): HTMLElement {
    const el = document.createElement('div');
    el.className = 'board';
    for (const [index, space] of SPACES.entries()) {
      el.insertAdjacentHTML('beforeend', toHtml(<Cell space={space} index={index} />));
    }
    return el;
  }

  /** Signature of the board: classes, placement and text of every cell, sorted. */
  function signature(el: HTMLElement): string {
    return [...el.querySelectorAll(':scope > .cell')]
      .map((cell) => {
        const text = [...cell.querySelectorAll('.inner > *')]
          .map((e) => `${e.className}=${e.textContent?.trim()}`)
          .join('|');
        return `${cell.className} [${cell.getAttribute('style')}] ${text}`;
      })
      .sort()
      .join('\n');
  }

  function hash(s: string): number {
    let h = 0;
    for (const ch of s) h = (h * 31 + ch.charCodeAt(0)) | 0;
    return h;
  }

  it('are 40, with the right types', () => {
    const el = board();
    expect(el.querySelectorAll(':scope > .cell')).toHaveLength(SPACE_COUNT);
    expect(el.querySelectorAll('.corner')).toHaveLength(4);
    expect(el.querySelectorAll('.prop')).toHaveLength(22);
    expect(el.querySelectorAll('.special')).toHaveLength(14);
    expect(el.querySelectorAll('.special.card')).toHaveLength(6);
  });

  it('still produce the board that was approved in the browser', () => {
    // Captured from the approved board: if these change, the printed board is no
    // longer the one that was signed off.
    // Re-baselined when the colour groups were rotated onto the classic Monopoly
    // layout (brown and darkblue are the two-property groups): Configurazione
    // became brown, Web pink and Mobile orange.
    const s = signature(board());
    expect(s.length).toBe(3957);
    expect(hash(s)).toBe(1312534784);
  });
});
