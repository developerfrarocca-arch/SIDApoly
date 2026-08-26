/* The Buoni Pasto bills: how many copies per denomination, the serials and the
   sheet layout. Pure functions; the markup is built by the component in
   src/components/money. */

import { COPIES_PER_DENOMINATION, DENOMINATIONS, type Denomination } from '../data/money';

/** Bills per A4 portrait sheet: a 2x5 grid. */
export const BILLS_PER_SHEET = 10;

/** One printed copy of a denomination, numbered like a real bill's serial. */
export interface BillCopy {
  denomination: Denomination;
  series: number;
}

/**
 * Every copy to print, one denomination at a time: this way each denomination
 * fills its own sheets and never mixes with the others.
 */
export function billCopies(
  denominations: readonly Denomination[] = DENOMINATIONS,
  copies = COPIES_PER_DENOMINATION,
): BillCopy[] {
  if (!Number.isInteger(copies) || copies < 1) {
    throw new RangeError(`Invalid copies per denomination: ${copies}`);
  }
  const out: BillCopy[] = [];
  for (const denomination of denominations) {
    for (let series = 1; series <= copies; series++) out.push({ denomination, series });
  }
  return out;
}

/** "SIDA-000500-007": the fake serial printed on every bill. */
export function serialOf({ denomination, series }: BillCopy): string {
  return `SIDA-${String(denomination.value).padStart(6, '0')}-${String(series).padStart(3, '0')}`;
}

/** Splits the copies into sheets, one denomination at a time. */
export function sheetsOf(copies: readonly BillCopy[], perSheet = BILLS_PER_SHEET): BillCopy[][] {
  if (!Number.isInteger(perSheet) || perSheet < 1) {
    throw new RangeError(`Invalid bills per sheet: ${perSheet}`);
  }
  const out: BillCopy[][] = [];
  for (let i = 0; i < copies.length; i += perSheet) out.push(copies.slice(i, i + perSheet));
  return out;
}
