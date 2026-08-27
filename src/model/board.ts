/* Board geometry: where each space goes in the 11x11 grid, how it rotates, and
   how prices are written. Pure functions, so the geometry stays verifiable
   without a browser; the markup is built by the components in
   src/components/board. */

import { SPACE_COUNT, SPACES, type Group, type Space } from '../data/spaces';

/** How a space's content is rotated: by board side, or diagonally for corners. */
export type Rotation = '' | 'rot45' | 'rot90' | 'rot135' | 'rot180' | 'rot225' | 'rot270' | 'rot315';

/** Where a space sits in the 11x11 grid (1-based columns and rows). */
export interface Placement {
  column: number;
  row: number;
  rotation: Rotation;
}

/**
 * Placement and rotation derived from the index, clockwise:
 *   0      bottom right corner (Avvio sprint!)
 *   1-9    bottom side, leftwards      (no rotation)
 *   10     bottom left corner
 *   11-19  left side, upwards          (rot90)
 *   20     top left corner
 *   21-29  top side, rightwards        (rot180)
 *   30     top right corner
 *   31-39  right side, downwards       (rot270)
 * Corners rotate 45 degrees towards the middle of the board.
 */
export function placementOf(index: number): Placement {
  if (!Number.isInteger(index) || index < 0 || index >= SPACE_COUNT) {
    throw new RangeError(`Space index out of range: ${index}`);
  }
  if (index === 0) return { column: 11, row: 11, rotation: 'rot315' };
  if (index < 10) return { column: 11 - index, row: 11, rotation: '' };
  if (index === 10) return { column: 1, row: 11, rotation: 'rot45' };
  if (index < 20) return { column: 1, row: 21 - index, rotation: 'rot90' };
  if (index === 20) return { column: 1, row: 1, rotation: 'rot135' };
  if (index < 30) return { column: index - 19, row: 1, rotation: 'rot180' };
  if (index === 30) return { column: 11, row: 1, rotation: 'rot225' };
  return { column: 11, row: index - 29, rotation: 'rot270' };
}

/**
 * Ties the currency to its number with a non-breaking space: "200 BP" is one
 * amount, and at the end of a line it must never split leaving "BP" orphaned.
 */
export function bindCurrency(text: string): string {
  return text.replace(/(\d)\s+BP/g, '$1\u00a0BP');
}

/** "60 BP" for numbers, unchanged text for strings ("Paga 200 BP"). */
export function priceLabel(price: number | string): string {
  return bindCurrency(typeof price === 'number' ? `${price} BP` : price);
}

/** The CSS classes of a cell: type, colour group, rotation, card deck. */
export function spaceCssClasses(space: Space, rotation: Rotation): string {
  const classes = ['cell'];
  if (space.type === 'corner') classes.push('corner');
  else if (space.type === 'property') classes.push('prop', space.group);
  else classes.push('special');
  if (rotation) classes.push(rotation);
  if (space.type === 'card') classes.push('card');
  return classes.join(' ');
}

/** A colour group as the legend shows it: the department and its spaces. */
export interface BusinessLine {
  group: Group;
  department: string;
  names: string[];
}

export function businessLines(spaces: readonly Space[] = SPACES): BusinessLine[] {
  const lines = new Map<Group, BusinessLine>();
  for (const space of spaces) {
    if (space.type !== 'property') continue;
    const line = lines.get(space.group);
    if (line) line.names.push(space.name);
    else lines.set(space.group, { group: space.group, department: space.department, names: [space.name] });
  }
  return [...lines.values()];
}
