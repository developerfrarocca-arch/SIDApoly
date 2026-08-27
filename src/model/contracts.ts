/* The contract cards (the "property cards" of the classic game): which ones
   exist, how they are laid out, and how the backs are mirrored for duplex
   printing. Pure functions; the markup is built by the components in
   src/components/contracts. */

import { SPACES, type Property, type Space, type Special } from '../data/spaces';
import {
  CONSULTANT_INDEXES,
  CONSULTANT_MORTGAGE,
  CONTRACTS,
  UTILITY_INDEXES,
  UTILITY_MORTGAGE,
  type ContractData,
} from '../data/contracts';
import { bindCurrency } from './board';

/** A contract card: a product/service, a Consulenza space or a utility space. */
export type Contract =
  | { kind: 'property'; index: number; space: Property; data: ContractData }
  | { kind: 'consultant'; index: number; space: Special }
  | { kind: 'utility'; index: number; space: Special };

/** Cards per A4 portrait sheet: a 3x3 grid. */
export const CARDS_PER_SHEET = 9;

/** Columns of a sheet grid (see .sheet-grid in contracts.css). */
export const COLUMNS = 3;

/**
 * Cards per A3 landscape sheet: a 6x3 grid, i.e. two A4 grids side by side —
 * same row count and row height as A4, twice the columns.
 */
export const CARDS_PER_SHEET_A3 = 18;

/** Columns of an A3 sheet grid (see .sheet-a3 in contracts.css). */
export const COLUMNS_A3 = 6;

/**
 * Every contract card, in board order: the 22 product/service spaces, the 4
 * Consulenza spaces and the 2 utility spaces.
 */
export function contracts(spaces: readonly Space[] = SPACES): Contract[] {
  const cards: Contract[] = [];
  for (const [index, space] of spaces.entries()) {
    if (space.type === 'property') {
      const data = CONTRACTS[index];
      if (!data) throw new Error(`Missing contract for space ${index} (${space.name})`);
      cards.push({ kind: 'property', index, space, data });
    } else if (space.type === 'special' && CONSULTANT_INDEXES.includes(index)) {
      cards.push({ kind: 'consultant', index, space });
    } else if (space.type === 'special' && UTILITY_INDEXES.includes(index)) {
      cards.push({ kind: 'utility', index, space });
    }
  }
  return cards;
}

/** 1150 -> "1.150" (Italian thousands separator, without relying on the locale). */
export function withThousands(value: number): string {
  return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

/** 260 -> "260 BP", with the currency tied to the number. */
export function bp(value: number): string {
  return bindCurrency(`${withThousands(value)} BP`);
}

/** The mortgage value of a card, whatever its kind. */
export function mortgageOf(card: Contract): number {
  if (card.kind === 'property') return card.data.mortgage;
  return card.kind === 'consultant' ? CONSULTANT_MORTGAGE : UTILITY_MORTGAGE;
}

/** The CSS classes of a card: business line colour, or the neutral band. */
export function contractCssClasses(card: Contract): string {
  if (card.kind !== 'property') return 'contract g-societa';
  const darkGroups = ['brown', 'darkblue'];
  const classes = ['contract', `g-${card.space.group}`];
  if (darkGroups.includes(card.space.group)) classes.push('scuro');
  return classes.join(' ');
}

/** Splits the cards into sheets, so screen and print agree. */
export function sheetsOf(cards: readonly Contract[], perSheet = CARDS_PER_SHEET): Contract[][] {
  if (!Number.isInteger(perSheet) || perSheet < 1) {
    throw new RangeError(`Invalid cards per sheet: ${perSheet}`);
  }
  const out: Contract[][] = [];
  for (let i = 0; i < cards.length; i += perSheet) out.push(cards.slice(i, i + perSheet));
  return out;
}

/**
 * The cards of a sheet in the order they must be printed on the back for duplex
 * printing: flipping the sheet on its long edge mirrors the columns, so every
 * row is reversed. Incomplete rows are padded before reversing, otherwise the
 * last card ends up in the wrong column.
 */
export function mirrorRows(sheet: readonly Contract[], columns = COLUMNS): (Contract | null)[] {
  if (!Number.isInteger(columns) || columns < 1) {
    throw new RangeError(`Invalid number of columns: ${columns}`);
  }
  const out: (Contract | null)[] = [];
  for (let i = 0; i < sheet.length; i += columns) {
    const row: (Contract | null)[] = sheet.slice(i, i + columns);
    while (row.length < columns) row.push(null);
    out.push(...row.reverse());
  }
  return out;
}
