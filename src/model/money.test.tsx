import { describe, expect, it } from 'vitest';
import { Bill } from '../components/money/Bill';
import { COPIES_PER_DENOMINATION, DENOMINATIONS } from '../data/money';
import { Money } from '../pages/Money';
import { toDom, toHtml } from '../test/render';
import { BILLS_PER_SHEET, billCopies, serialOf, sheetsOf } from './money';

describe('denomination data', () => {
  it('has the 7 required denominations, in ascending order', () => {
    expect(DENOMINATIONS.map((d) => d.value)).toEqual([5, 10, 20, 50, 100, 200, 500]);
  });

  it('gives every denomination its own colour', () => {
    const colors = new Set(DENOMINATIONS.map((d) => d.color));
    expect(colors.size).toBe(DENOMINATIONS.length);
  });
});

describe('billCopies', () => {
  it('makes COPIES_PER_DENOMINATION copies of each denomination, one after the other', () => {
    const copies = billCopies();
    expect(copies).toHaveLength(DENOMINATIONS.length * COPIES_PER_DENOMINATION);
    for (let i = 0; i < DENOMINATIONS.length; i++) {
      const block = copies.slice(i * COPIES_PER_DENOMINATION, (i + 1) * COPIES_PER_DENOMINATION);
      expect(block.every((c) => c.denomination.value === DENOMINATIONS[i]!.value)).toBe(true);
      expect(block.map((c) => c.series)).toEqual(
        Array.from({ length: COPIES_PER_DENOMINATION }, (_, n) => n + 1),
      );
    }
  });

  it('rejects an invalid number of copies', () => {
    expect(() => billCopies(DENOMINATIONS, 0)).toThrow(RangeError);
    expect(() => billCopies(DENOMINATIONS, 2.5)).toThrow(RangeError);
  });
});

describe('serialOf', () => {
  it('includes value and series number, zero padded', () => {
    expect(serialOf({ denomination: { value: 5, color: '#000' }, series: 1 })).toBe(
      'SIDA-000005-001',
    );
    expect(serialOf({ denomination: { value: 500, color: '#000' }, series: 10 })).toBe(
      'SIDA-000500-010',
    );
  });
});

describe('one bill', () => {
  it('prints the value, the amount in BP and the Edenpurple mark', () => {
    const html = toHtml(
      <Bill copy={{ denomination: { value: 50, color: '#E4699D' }, series: 3 }} />,
    );
    expect(html).toContain('50');
    expect(html).toContain('BP');
    expect(html).toContain('Buoni Pasto');
    expect(html).toContain('Edenpurple');
    expect(html).toContain('--bill-color:#E4699D');
    expect(html).toContain('SIDA-000050-003');
  });
});

describe('sheet layout', () => {
  it('puts 10 bills on a sheet, one denomination per sheet', () => {
    const sheets = sheetsOf(billCopies());
    expect(sheets).toHaveLength(DENOMINATIONS.length);
    expect(sheets.every((s) => s.length === BILLS_PER_SHEET)).toBe(true);
    expect(BILLS_PER_SHEET).toBe(COPIES_PER_DENOMINATION);
    for (const sheet of sheets) {
      expect(new Set(sheet.map((c) => c.denomination.value)).size).toBe(1);
    }
  });

  it('rejects an invalid number of bills per sheet', () => {
    expect(() => sheetsOf(billCopies(), 0)).toThrow(RangeError);
  });

  it('numbers the sheets and names the denomination on each', () => {
    const html = toHtml(<Money />);
    expect(html).toContain('foglio 1');
    expect(html).toContain(`foglio ${DENOMINATIONS.length}`);
    expect(html).not.toContain(`foglio ${DENOMINATIONS.length + 1}`);
    expect(html).toContain('Buoni Pasto da 5 BP');
    expect(html).toContain('Buoni Pasto da 500 BP');
  });
});

describe('the page', () => {
  it('builds one sheet per denomination and every bill in the container', () => {
    const root = toDom(<Money />);
    expect(root.querySelectorAll('.sheet')).toHaveLength(DENOMINATIONS.length);
    expect(root.querySelectorAll('.bill')).toHaveLength(
      DENOMINATIONS.length * COPIES_PER_DENOMINATION,
    );
  });
});
