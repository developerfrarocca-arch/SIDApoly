import { describe, expect, it } from 'vitest';
import { ContractBack } from '../components/contracts/ContractBack';
import { ContractCard } from '../components/contracts/ContractCard';
import {
  CONSULTANT_INDEXES,
  CONSULTANT_MORTGAGE,
  CONSULTANT_RENTS,
  CONTRACTS,
  UTILITY_INDEXES,
  UTILITY_MORTGAGE,
  type ContractData,
} from '../data/contracts';
import { SPACES } from '../data/spaces';
import { ContractSheets } from '../pages/Contracts';
import { toDom, toHtml } from '../test/render';
import {
  CARDS_PER_SHEET,
  bp,
  contractCssClasses,
  contracts,
  mirrorRows,
  mortgageOf,
  sheetsOf,
  withThousands,
} from './contracts';

const CARDS = contracts();

describe('contract data', () => {
  it('has one contract for each of the 22 property spaces', () => {
    const propertyIndexes = [...SPACES.entries()]
      .filter(([, space]) => space.type === 'property')
      .map(([i]) => i);
    expect(propertyIndexes).toHaveLength(22);
    expect(
      Object.keys(CONTRACTS)
        .map(Number)
        .sort((a, b) => a - b),
    ).toEqual(propertyIndexes);
  });

  it('has no contract for spaces that are not properties', () => {
    for (const key of Object.keys(CONTRACTS)) {
      expect(SPACES[Number(key)]!.type, `space ${key}`).toBe('property');
    }
  });

  it('keeps the rents rising from the bare licence to the Major Release', () => {
    for (const [i, { rents }] of Object.entries(CONTRACTS) as [string, ContractData][]) {
      const scale = [rents.bare, ...rents.upgrades, rents.release];
      for (let n = 1; n < scale.length; n++) {
        expect(scale[n]!, `space ${i}, step ${n}`).toBeGreaterThan(scale[n - 1]!);
      }
    }
  });

  it('never makes the mortgage worth more than half the purchase price', () => {
    for (const [key, data] of Object.entries(CONTRACTS)) {
      const space = SPACES[Number(key)]!;
      const price = space.type === 'property' ? space.price : 0;
      expect(data.mortgage, `space ${key}`).toBe(Number(price) / 2);
    }
  });

  it('points at the right Consulenza and utility spaces', () => {
    for (const i of CONSULTANT_INDEXES) expect(SPACES[i]!.name).toMatch(/^Consulenza /);
    expect(UTILITY_INDEXES.map((i) => SPACES[i]!.name)).toEqual(['Enel', 'Impianto clima']);
  });

  it('doubles the Consulenza rent for every extra space', () => {
    for (let n = 1; n < CONSULTANT_RENTS.length; n++) {
      expect(CONSULTANT_RENTS[n]).toBe(CONSULTANT_RENTS[n - 1]! * 2);
    }
  });
});

describe('contracts', () => {
  it('produces 28 cards: 22 properties, 4 Consulenza and 2 utilities', () => {
    expect(CARDS).toHaveLength(28);
    const count = (kind: string) => CARDS.filter((c) => c.kind === kind).length;
    expect(count('property')).toBe(22);
    expect(count('consultant')).toBe(4);
    expect(count('utility')).toBe(2);
  });

  it('follows board order and never repeats a space', () => {
    const indexes = CARDS.map((c) => c.index);
    expect([...indexes].sort((a, b) => a - b)).toEqual(indexes);
    expect(new Set(indexes).size).toBe(indexes.length);
  });

  it('skips corners, card spaces, Tasse and Intrè', () => {
    const names = CARDS.map((c) => c.space.name);
    expect(names).not.toContain('Tasse');
    expect(names).not.toContain('Intrè');
    expect(names).not.toContain('Imprevisti');
    expect(names).not.toContain('Avvio sprint!');
  });

  it('notices a property with no contract', () => {
    const withoutRents = [
      { type: 'property', group: 'red', department: 'Didattica', name: 'Nuovo', price: 100 },
    ] as const;
    expect(() => contracts(withoutRents)).toThrow(/Missing contract/);
  });
});

describe('number formatting', () => {
  it('uses the dot as thousands separator', () => {
    expect(withThousands(60)).toBe('60');
    expect(withThousands(1150)).toBe('1.150');
    expect(withThousands(2000)).toBe('2.000');
    expect(bp(320)).toBe('320 BP');
  });
});

describe('the card front', () => {
  it('colours the band by group and uses white text only on the dark ones', () => {
    const byGroup = (g: string) =>
      contractCssClasses(CARDS.find((c) => c.kind === 'property' && c.space.group === g)!);
    expect(byGroup('yellow')).toBe('contract g-yellow');
    expect(byGroup('darkblue')).toBe('contract g-darkblue scuro');
    expect(byGroup('brown')).toBe('contract g-brown scuro');
    expect(contractCssClasses(CARDS.find((c) => c.kind === 'consultant')!)).toBe(
      'contract g-societa',
    );
  });

  it('prints price, rents, costs and mortgage of a property', () => {
    const html = toHtml(<ContractCard card={CARDS.find((c) => c.index === 39)!} />);
    expect(html).toContain('Questo contratto vale <b>1.000 BP</b>');
    expect(html).toContain('SIDA PagoPa');
    expect(html).toContain('Sportello');
    expect(html).toContain('125 BP'); // bare rent
    expect(html).toContain('5.000'); // rent with the Major Release
    expect(html).toContain('500 BP'); // upgrade cost and mortgage
    expect(html).toContain('Valore ipotecario');
  });

  it('uses the dice wording for Enel and Impianto clima', () => {
    const html = toHtml(<ContractCard card={CARDS.find((c) => c.kind === 'utility')!} />);
    expect(html).toContain('4 volte');
    expect(html).toContain('10 volte');
    expect(html).not.toContain('Aggiornamenti');
  });

  it('shrinks long names, which must stay on a single line', () => {
    const long = toHtml(
      <ContractCard card={CARDS.find((c) => c.space.name === 'SIDA Drive Controller')!} />,
    );
    const short = toHtml(<ContractCard card={CARDS.find((c) => c.space.name === 'Tachigrafo')!} />);
    expect(long).toContain('class="title lungo"');
    expect(short).toContain('class="title"');
  });

  it('has no name too long for the card', () => {
    for (const card of CARDS) {
      expect(card.space.name.length, card.space.name).toBeLessThanOrEqual(22);
    }
  });

  it('leaves the name as the data has it, without forcing uppercase', () => {
    const aeb = CARDS.find((c) => c.space.name === 'Manuale AeB')!;
    expect(toHtml(<ContractCard card={aeb} />)).toContain('Manuale AeB');
    expect(toHtml(<ContractBack card={aeb} />)).toContain('Manuale AeB');
  });

  it('makes no name editable', () => {
    expect(toHtml(<ContractCard card={CARDS[0]!} />)).not.toContain('contenteditable');
  });
});

describe('the big icon', () => {
  it('only appears on cards that already have an icon on the board', () => {
    const withIcon = CARDS.filter((c) =>
      toHtml(<ContractCard card={c} />).includes('class="mark"'),
    );
    expect(withIcon).toHaveLength(6);
    expect(withIcon.map((c) => c.kind).sort()).toEqual([
      'consultant',
      'consultant',
      'consultant',
      'consultant',
      'utility',
      'utility',
    ]);
  });

  it('uses the space icon, without repeating it in the department line', () => {
    const consultant = CARDS.find((c) => c.kind === 'consultant')!;
    const html = toHtml(<ContractCard card={consultant} />);
    expect(html).toContain(`<div class="mark">${consultant.space.icon}</div>`);
    expect(html).toContain('<div class="dept">Referente di zona</div>');
    const utility = CARDS.find((c) => c.kind === 'utility')!;
    expect(toHtml(<ContractCard card={utility} />)).toContain(
      '<div class="dept">Servizi di sede</div>',
    );
  });

  it('leaves properties without any icon container, not even an empty one', () => {
    for (const card of CARDS.filter((c) => c.kind === 'property')) {
      expect(toHtml(<ContractCard card={card} />), card.space.name).not.toContain('mark');
    }
  });
});

describe('sheet layout', () => {
  it('puts 9 cards on a sheet without losing any', () => {
    const sheets = sheetsOf(CARDS);
    expect(sheets).toHaveLength(4);
    expect(sheets.map((s) => s.length)).toEqual([9, 9, 9, 1]);
    expect(sheets.flat()).toEqual([...CARDS]);
    expect(CARDS_PER_SHEET).toBe(9);
  });

  it('rejects an invalid number of cards per sheet', () => {
    expect(() => sheetsOf(CARDS, 0)).toThrow(RangeError);
    expect(() => sheetsOf(CARDS, 2.5)).toThrow(RangeError);
  });

  it('numbers the sheets', () => {
    const html = toHtml(<ContractSheets duplex={false} />);
    expect(html).toContain('foglio 1');
    expect(html).toContain('foglio 4');
    expect(html).not.toContain('foglio 5');
  });
});

describe('separate piles', () => {
  it('builds the sheets and the 28 cards in the container', () => {
    const root = toDom(<ContractSheets duplex={false} />);
    expect(root.querySelectorAll('.sheet:not(.sheet-retro)')).toHaveLength(4);
    expect(root.querySelectorAll('.contract')).toHaveLength(28);
    expect(root.querySelectorAll('.contract .mortgage')).toHaveLength(28);
    const indexes = [...root.querySelectorAll('.contract')].map((c) =>
      Number(c.getAttribute('data-casella')),
    );
    expect(indexes).toEqual(CARDS.map((c) => c.index));
  });
});

describe('the card back', () => {
  it('carries the name and the mortgage amount of its own card', () => {
    const card = CARDS.find((c) => c.kind === 'property')!;
    const html = toHtml(<ContractBack card={card} />);
    expect(html).toContain('contract-back');
    expect(html).toContain(`data-casella="${card.index}"`);
    expect(html).toContain('Ipotecato');
    expect(html).toContain(card.space.name);
    expect(html).toContain(bp(mortgageOf(card)));
  });

  it('has a different back per card, paired with its own front', () => {
    const backs = CARDS.map((c) => toHtml(<ContractBack card={c} />));
    expect(new Set(backs).size).toBe(CARDS.length);
    const indexes = backs.map((b) => Number(/data-casella="(\d+)"/.exec(b)![1]));
    expect(indexes).toEqual(CARDS.map((c) => c.index));
  });

  it('takes the mortgage value from the card kind', () => {
    for (const card of CARDS) {
      const expected =
        card.kind === 'property'
          ? card.data.mortgage
          : card.kind === 'consultant'
            ? CONSULTANT_MORTGAGE
            : UTILITY_MORTGAGE;
      expect(mortgageOf(card), card.space.name).toBe(expected);
    }
  });

  it('keeps the order of the fronts when the piles are separate', () => {
    const root = toDom(<ContractSheets duplex={false} />);
    const indexes = [...root.querySelectorAll('.contract-back')].map((e) =>
      Number(e.getAttribute('data-casella')),
    );
    expect(indexes).toEqual(CARDS.map((c) => c.index));
  });

  it('follows the same sheet count and cards per sheet as the fronts', () => {
    const html = toHtml(<ContractSheets duplex={false} />);
    expect(html).toContain('retro 1');
    expect(html).toContain('retro 4');
    expect(html).not.toContain('retro 5');
  });

  it('builds as many backs as fronts, on separate sheets', () => {
    const root = toDom(<ContractSheets duplex={false} />);
    expect(root.querySelectorAll('.sheet-retro')).toHaveLength(4);
    expect(root.querySelectorAll('.contract-back')).toHaveLength(28);
  });
});

describe('mirrorRows', () => {
  it('reverses every row of 3, because flipping the sheet mirrors the columns', () => {
    const sheet = CARDS.slice(0, 9);
    const expected = [2, 1, 0, 5, 4, 3, 8, 7, 6].map((i) => sheet[i]);
    expect(mirrorRows(sheet)).toEqual(expected);
  });

  it('pads the incomplete row, so the last card lands in the right column', () => {
    const one = CARDS.slice(0, 1);
    expect(mirrorRows(one)).toEqual([null, null, one[0]]);
    const two = CARDS.slice(0, 2);
    expect(mirrorRows(two)).toEqual([null, two[1], two[0]]);
  });

  it('neither loses nor duplicates cards', () => {
    for (const sheet of [CARDS.slice(0, 9), CARDS.slice(0, 4), CARDS.slice(27)]) {
      const kept = mirrorRows(sheet).filter((c) => c !== null);
      expect(new Set(kept).size).toBe(sheet.length);
    }
  });

  it('rejects an invalid number of columns', () => {
    expect(() => mirrorRows(CARDS.slice(0, 3), 0)).toThrow(RangeError);
    expect(() => mirrorRows(CARDS.slice(0, 3), 1.5)).toThrow(RangeError);
  });
});

describe('duplex sheets', () => {
  it('puts every back behind its own front, mirroring the columns', () => {
    const root = toDom(<ContractSheets duplex />);
    const sections = [...root.querySelectorAll('section.sheet')];
    for (let i = 0; i < sections.length; i += 2) {
      const fronts = [...sections[i]!.querySelectorAll('.contract')].map((e) =>
        e.getAttribute('data-casella'),
      );
      const cells = [...sections[i + 1]!.querySelectorAll('.contract-back,.back-vuoto')].map((e) =>
        e.getAttribute('data-casella'),
      );
      for (let row = 0; row * 3 < fronts.length; row++) {
        const frontRow = fronts.slice(row * 3, row * 3 + 3);
        const backRow = cells.slice(row * 3, row * 3 + 3);
        expect(backRow.filter((v) => v !== null)).toEqual([...frontRow].reverse());
      }
    }
  });

  it('alternates one sheet of fronts and one of backs per group of cards', () => {
    const html = toHtml(<ContractSheets duplex />);
    expect(html.indexOf('foglio 1')).toBeLessThan(html.indexOf('retro 1'));
    expect(html.indexOf('retro 1')).toBeLessThan(html.indexOf('foglio 2'));
    expect(html.indexOf('foglio 4')).toBeLessThan(html.indexOf('retro 4'));
    expect(html).not.toContain('foglio 5');
    expect(html).not.toContain('retro 5');
  });

  it('builds as many fronts as backs, in the same container', () => {
    const root = toDom(<ContractSheets duplex />);
    expect(root.querySelectorAll('.sheet:not(.sheet-retro)')).toHaveLength(4);
    expect(root.querySelectorAll('.sheet-retro')).toHaveLength(4);
    expect(root.querySelectorAll('.contract')).toHaveLength(28);
    expect(root.querySelectorAll('.contract-back')).toHaveLength(28);
    const sections = [...root.querySelectorAll('section.sheet')];
    expect(sections[0]!.classList.contains('sheet-retro')).toBe(false);
    expect(sections[1]!.classList.contains('sheet-retro')).toBe(true);
  });
});
