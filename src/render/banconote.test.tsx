import { describe, expect, it } from 'vitest';
import { COPIE_PER_TAGLIO, TAGLI } from '../dati/banconote';
import {
  BANCONOTE_PER_FOGLIO,
  elencoBanconote,
  fogli,
  seriale,
} from './banconote';
import { Banconota } from '../componenti/banconote/Banconota';
import { Banconote } from '../pagine/Banconote';
import { monta, rendi } from '../test/rendi';

describe('dati dei tagli', () => {
  it('ha i 7 tagli richiesti, in ordine crescente', () => {
    expect(TAGLI.map((t) => t.valore)).toEqual([5, 10, 20, 50, 100, 200, 500]);
  });

  it('assegna un colore diverso a ogni taglio', () => {
    const colori = new Set(TAGLI.map((t) => t.colore));
    expect(colori.size).toBe(TAGLI.length);
  });
});

describe('elencoBanconote', () => {
  it('genera COPIE_PER_TAGLIO copie di ogni taglio, un taglio dopo l altro', () => {
    const elenco = elencoBanconote();
    expect(elenco).toHaveLength(TAGLI.length * COPIE_PER_TAGLIO);
    for (let i = 0; i < TAGLI.length; i++) {
      const blocco = elenco.slice(i * COPIE_PER_TAGLIO, (i + 1) * COPIE_PER_TAGLIO);
      expect(blocco.every((c) => c.taglio.valore === TAGLI[i]!.valore)).toBe(true);
      expect(blocco.map((c) => c.serie)).toEqual(
        Array.from({ length: COPIE_PER_TAGLIO }, (_, n) => n + 1),
      );
    }
  });

  it('rifiuta un numero di copie non valido', () => {
    expect(() => elencoBanconote(TAGLI, 0)).toThrow(RangeError);
    expect(() => elencoBanconote(TAGLI, 2.5)).toThrow(RangeError);
  });
});

describe('seriale', () => {
  it('include valore e numero di serie con zeri iniziali', () => {
    expect(seriale({ taglio: { valore: 5, colore: '#000' }, serie: 1 })).toBe('SIDA-000005-001');
    expect(seriale({ taglio: { valore: 500, colore: '#000' }, serie: 10 })).toBe(
      'SIDA-000500-010',
    );
  });
});

describe('markup di una banconota', () => {
  it('stampa il valore, il taglio in BP e il logo Edenpurple', () => {
    const html = rendi(<Banconota copia={{ taglio: { valore: 50, colore: '#E4699D' }, serie: 3 }} />);
    expect(html).toContain('50');
    expect(html).toContain('BP');
    expect(html).toContain('Buoni Pasto');
    expect(html).toContain('Edenpurple');
    expect(html).toContain('--bill-color:#E4699D');
    expect(html).toContain('SIDA-000050-003');
  });
});

describe('impaginazione', () => {
  it('mette 10 banconote per foglio, un taglio a foglio', () => {
    const gruppi = fogli(elencoBanconote());
    expect(gruppi).toHaveLength(TAGLI.length);
    expect(gruppi.every((g) => g.length === BANCONOTE_PER_FOGLIO)).toBe(true);
    expect(BANCONOTE_PER_FOGLIO).toBe(COPIE_PER_TAGLIO);
    for (const g of gruppi) {
      expect(new Set(g.map((c) => c.taglio.valore)).size).toBe(1);
    }
  });

  it('rifiuta un numero di banconote per foglio non valido', () => {
    expect(() => fogli(elencoBanconote(), 0)).toThrow(RangeError);
  });

  it('numera i fogli e indica il taglio in ognuno', () => {
    const html = rendi(<Banconote />);
    expect(html).toContain('foglio 1');
    expect(html).toContain(`foglio ${TAGLI.length}`);
    expect(html).not.toContain(`foglio ${TAGLI.length + 1}`);
    expect(html).toContain('Buoni Pasto da 5\u00a0BP');
    expect(html).toContain('Buoni Pasto da 500\u00a0BP');
  });
});

describe('montaBanconote', () => {
  it('crea un foglio per taglio e tutte le banconote nel contenitore', () => {
    const root = monta(<Banconote />);
    expect(root.querySelectorAll('.sheet')).toHaveLength(TAGLI.length);
    expect(root.querySelectorAll('.bill')).toHaveLength(TAGLI.length * COPIE_PER_TAGLIO);
  });
});
