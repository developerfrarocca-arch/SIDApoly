/* The two decks, Probabilità and Imprevisti: how the decks are composed and how
   they are laid out on sheets. Pure functions; the markup is built by the
   component in src/components/cards. */

import { CHANCE_CARDS, CHEST_CARDS, type Card } from '../data/cards';

/** A deck id: used as a CSS class and as a data attribute. */
export type DeckId = 'probabilita' | 'imprevisti';

/** A drawable deck: its printed name and its cards. */
export interface Deck {
  id: DeckId;
  name: string;
  cards: readonly Card[];
}

/**
 * The two decks, in the order they appear on the board. Only the name is
 * printed on the card: the board icons are emoji with white parts, and white on
 * coloured card stock is the paper, not ink.
 */
export const DECKS: readonly Deck[] = [
  { id: 'probabilita', name: 'Probabilità', cards: CHANCE_CARDS },
  { id: 'imprevisti', name: 'Imprevisti', cards: CHEST_CARDS },
];

/** Cards per A4 portrait sheet: a 3x6 grid of 18 landscape cards. */
export const CARDS_PER_SHEET = 18;

/** A card tied to its deck, with its position in the deck. */
export interface DeckCardData {
  deck: Deck;
  card: Card;
  index: number;
}

/** Every card of the given decks, one whole deck after the other. */
export function deckCards(decks: readonly Deck[] = DECKS): DeckCardData[] {
  const out: DeckCardData[] = [];
  for (const deck of decks) {
    deck.cards.forEach((card, i) => out.push({ deck, card, index: i + 1 }));
  }
  return out;
}

/** Splits the cards into sheets, so screen and print agree. */
export function sheetsOf(
  cards: readonly DeckCardData[],
  perSheet = CARDS_PER_SHEET,
): DeckCardData[][] {
  if (!Number.isInteger(perSheet) || perSheet < 1) {
    throw new RangeError(`Invalid cards per sheet: ${perSheet}`);
  }
  const out: DeckCardData[][] = [];
  for (let i = 0; i < cards.length; i += perSheet) out.push(cards.slice(i, i + perSheet));
  return out;
}

/**
 * Like sheetsOf, but a sheet never mixes cards of different decks: each deck
 * starts a new sheet, so every deck can be printed on its own card stock
 * without cutting two decks out of the same sheet.
 */
export function sheetsPerDeck(
  cards: readonly DeckCardData[] = deckCards(),
  perSheet = CARDS_PER_SHEET,
): DeckCardData[][] {
  const groups = new Map<DeckId, DeckCardData[]>();
  for (const c of cards) {
    const group = groups.get(c.deck.id);
    if (group) group.push(c);
    else groups.set(c.deck.id, [c]);
  }
  return [...groups.values()].flatMap((group) => sheetsOf(group, perSheet));
}
