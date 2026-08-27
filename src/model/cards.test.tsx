import { describe, expect, it } from 'vitest';
import { DeckCard } from '../components/cards/DeckCard';
import { CHANCE_CARDS, CHEST_CARDS } from '../data/cards';
import { Cards } from '../pages/Cards';
import { toDom, toHtml } from '../test/render';
import { bindCurrency } from './board';
import { CARDS_PER_SHEET, DECKS, deckCards, sheetsOf, sheetsPerDeck } from './cards';

const CARDS = deckCards();

describe('deck data', () => {
  it('has 16 cards per deck, as in the classic game', () => {
    expect(CHANCE_CARDS).toHaveLength(16);
    expect(CHEST_CARDS).toHaveLength(16);
  });

  it('exposes the two decks with the names used on the board', () => {
    expect(DECKS.map((d) => d.id)).toEqual(['probabilita', 'imprevisti']);
    expect(DECKS.map((d) => d.name)).toEqual(['Probabilità', 'Imprevisti']);
  });
});

describe('deckCards', () => {
  it('lists every card, one whole deck after the other', () => {
    expect(CARDS).toHaveLength(32);
    expect(CARDS.slice(0, 16).every((c) => c.deck.id === 'probabilita')).toBe(true);
    expect(CARDS.slice(16).every((c) => c.deck.id === 'imprevisti')).toBe(true);
  });

  it('numbers the cards from 1 inside each deck', () => {
    const oneToSixteen = Array.from({ length: 16 }, (_, i) => i + 1);
    expect(CARDS.slice(0, 16).map((c) => c.index)).toEqual(oneToSixteen);
    expect(CARDS.slice(16).map((c) => c.index)).toEqual(oneToSixteen);
  });
});

describe('the card front', () => {
  it('prints the text and the deck name in the header', () => {
    const html = toHtml(<DeckCard card={CARDS[0]!} />);
    expect(html).toContain('card-probabilita');
    expect(html).toContain(bindCurrency(CHANCE_CARDS[0]!.text));
    expect(html).toContain('Probabilità');
    expect(html).toContain('data-mazzo="probabilita"');
    expect(html).toContain('data-indice="1"');
  });

  it('never separates BP from its number, not even at the end of a line', () => {
    const html = toHtml(<Cards />);
    expect(html).not.toMatch(/\d BP/);
    const withAmounts = CARDS.filter((c) => /\d\s+BP/.test(c.card.text));
    expect(withAmounts.length).toBeGreaterThan(0);
    for (const card of withAmounts) {
      expect(toHtml(<DeckCard card={card} />), card.card.text).toMatch(/\d BP/);
    }
  });

  it('prints no emoji: on coloured card stock white is not ink', () => {
    const cards = CARDS.map((card) => toHtml(<DeckCard card={card} />)).join('');
    expect(cards).not.toContain('❓');
    expect(cards).not.toContain('🎲');
    expect(cards).not.toContain('card-icon');
  });

  it('escapes the card text', () => {
    const html = toHtml(<DeckCard card={{ deck: DECKS[0]!, card: { text: '<script>x</script> & co' }, index: 1 }} />);
    expect(html).not.toContain('<script>');
    expect(html).toContain('&lt;script&gt;');
    expect(html).toContain('&amp; co');
  });
});

describe('sheet layout', () => {
  it('puts 18 cards on a sheet without losing any', () => {
    const sheets = sheetsOf(CARDS);
    expect(sheets).toHaveLength(2);
    expect(sheets.map((s) => s.length)).toEqual([18, 14]);
    expect(sheets.flat()).toEqual(CARDS);
    expect(CARDS_PER_SHEET).toBe(18);
  });

  it('rejects an invalid number of cards per sheet', () => {
    expect(() => sheetsOf(CARDS, 0)).toThrow(RangeError);
    expect(() => sheetsOf(CARDS, 2.5)).toThrow(RangeError);
  });

  it('numbers the sheets', () => {
    const html = toHtml(<Cards />);
    expect(html).toContain('foglio 1');
    expect(html).toContain('foglio 2');
    expect(html).not.toContain('foglio 3');
  });

  it('never puts two decks on the same sheet', () => {
    const sheets = sheetsPerDeck(CARDS);
    expect(sheets).toHaveLength(2);
    expect(sheets.map((s) => s.length)).toEqual([16, 16]);
    for (const sheet of sheets) {
      expect(new Set(sheet.map((c) => c.deck.id)).size).toBe(1);
    }
    expect(sheets.flat()).toEqual(CARDS);
  });

  it('starts a new sheet per deck even when a deck spans several sheets', () => {
    const sheets = sheetsPerDeck(CARDS, 6);
    expect(sheets.map((s) => s.length)).toEqual([6, 6, 4, 6, 6, 4]);
    for (const sheet of sheets) {
      expect(new Set(sheet.map((c) => c.deck.id)).size).toBe(1);
    }
  });

  it('writes the deck name in each sheet footer', () => {
    const html = toHtml(<Cards />);
    expect(html).toContain('Probabilità · foglio 1');
    expect(html).toContain('Imprevisti · foglio 2');
  });
});

describe('the page', () => {
  it('builds the sheets with every card and no backs', () => {
    const fronts = toDom(<Cards />);
    expect(fronts.querySelectorAll('.sheet')).toHaveLength(2);
    expect(fronts.querySelectorAll('.card')).toHaveLength(32);
    expect(fronts.querySelectorAll('.sheet-retro')).toHaveLength(0);
    expect(fronts.querySelectorAll('.card-retro')).toHaveLength(0);
  });

  it('keeps the decks in blocks, Probabilità then Imprevisti', () => {
    const fronts = toDom(<Cards />);
    const decks = [...fronts.querySelectorAll('.card')].map((c) => c.getAttribute('data-mazzo'));
    expect(decks.slice(0, 16).every((d) => d === 'probabilita')).toBe(true);
    expect(decks.slice(16).every((d) => d === 'imprevisti')).toBe(true);
  });

  it('gives each sheet a single deck, marked on the sheet itself', () => {
    const fronts = toDom(<Cards />);
    const sections = [...fronts.querySelectorAll('section.sheet')];
    expect(sections.map((s) => s.getAttribute('data-mazzo'))).toEqual(['probabilita', 'imprevisti']);
    for (const section of sections) {
      const decks = new Set([...section.querySelectorAll('.card')].map((c) => c.getAttribute('data-mazzo')));
      expect(decks.size, section.getAttribute('data-mazzo') ?? '').toBe(1);
      expect([...decks][0]).toBe(section.getAttribute('data-mazzo'));
    }
  });
});
