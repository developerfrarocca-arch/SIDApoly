import { describe, expect, it } from 'vitest';
import { CARTE_IMPREVISTI, CARTE_PROBABILITA } from '../dati/carte';
import {
  CARTE_PER_FOGLIO,
  MAZZI,
  carteMazzi,
  fogli,
  htmlCarte,
  htmlCartaFronte,
  fogliPerMazzo,
  montaCarte,
} from './carte';
import { valuta } from './tabellone';

const CARTE = carteMazzi();

describe('dati dei mazzi', () => {
  it('ha 16 carte per mazzo, come il Monopoli classico', () => {
    expect(CARTE_PROBABILITA).toHaveLength(16);
    expect(CARTE_IMPREVISTI).toHaveLength(16);
  });

  it('espone i due mazzi con i nomi delle caselle del tabellone', () => {
    expect(MAZZI.map((m) => m.chiave)).toEqual(['probabilita', 'imprevisti']);
    expect(MAZZI.map((m) => m.nome)).toEqual(['Probabilità', 'Imprevisti']);
  });
});

describe('carteMazzi', () => {
  it('mette tutte le carte, un mazzo intero dopo l altro', () => {
    expect(CARTE).toHaveLength(32);
    expect(CARTE.slice(0, 16).every((c) => c.mazzo.chiave === 'probabilita')).toBe(true);
    expect(CARTE.slice(16).every((c) => c.mazzo.chiave === 'imprevisti')).toBe(true);
  });

  it('numera le carte a partire da 1 dentro ogni mazzo', () => {
    expect(CARTE.slice(0, 16).map((c) => c.indice)).toEqual(Array.from({ length: 16 }, (_, i) => i + 1));
    expect(CARTE.slice(16).map((c) => c.indice)).toEqual(Array.from({ length: 16 }, (_, i) => i + 1));
  });
});

describe('markup del fronte', () => {
  it('stampa il testo e il nome del mazzo in testa', () => {
    const html = htmlCartaFronte(CARTE[0]!);
    expect(html).toContain('card-probabilita');
    expect(html).toContain(valuta(CARTE_PROBABILITA[0]!.testo));
    expect(html).toContain('Probabilità');
    expect(html).toContain('data-mazzo="probabilita"');
    expect(html).toContain('data-indice="1"');
  });

  it('non stacca mai BP dal suo numero, nemmeno a fine riga', () => {
    const html = htmlCarte();
    // in tutte e 32 le carte, un importo non deve avere spazi normali fra numero e valuta
    expect(html).not.toMatch(/\d BP/);
    const conImporti = CARTE.filter((c) => /\d\s+BP/.test(c.carta.testo));
    expect(conImporti.length).toBeGreaterThan(0);
    for (const c of conImporti) {
      expect(htmlCartaFronte(c), c.carta.testo).toMatch(/\d\u00a0BP/);
    }
  });

  it('non stampa emoji: sul cartoncino colorato il bianco non è inchiostro', () => {
    const html = htmlCarte();
    expect(html).not.toContain('❓');
    expect(html).not.toContain('🎲');
    expect(html).not.toContain('card-icon');
  });

  it('rende sicuro il testo delle carte', () => {
    const html = htmlCartaFronte({
      mazzo: MAZZI[0]!,
      carta: { testo: '<script>x</script> & co' },
      indice: 1,
    });
    expect(html).not.toContain('<script>');
    expect(html).toContain('&lt;script&gt;');
    expect(html).toContain('&amp; co');
  });
});

describe('impaginazione', () => {
  it('mette 18 carte per foglio senza perderne nessuna', () => {
    const gruppi = fogli(CARTE);
    expect(gruppi).toHaveLength(2);
    expect(gruppi.map((g) => g.length)).toEqual([18, 14]);
    expect(gruppi.flat()).toEqual(CARTE);
    expect(CARTE_PER_FOGLIO).toBe(18);
  });

  it('rifiuta un numero di carte per foglio non valido', () => {
    expect(() => fogli(CARTE, 0)).toThrow(RangeError);
    expect(() => fogli(CARTE, 2.5)).toThrow(RangeError);
  });

  it('numera i fogli', () => {
    const html = htmlCarte();
    expect(html).toContain('foglio 1');
    expect(html).toContain('foglio 2');
    expect(html).not.toContain('foglio 3');
  });

  it('non mette due mazzi sullo stesso foglio', () => {
    const gruppi = fogliPerMazzo(CARTE);
    expect(gruppi).toHaveLength(2);
    expect(gruppi.map((g) => g.length)).toEqual([16, 16]);
    for (const gruppo of gruppi) {
      expect(new Set(gruppo.map((c) => c.mazzo.chiave)).size).toBe(1);
    }
    expect(gruppi.flat()).toEqual(CARTE);
  });

  it('apre un foglio nuovo per ogni mazzo anche quando il mazzo sta in più fogli', () => {
    const gruppi = fogliPerMazzo(CARTE, 6);
    expect(gruppi.map((g) => g.length)).toEqual([6, 6, 4, 6, 6, 4]);
    for (const gruppo of gruppi) {
      expect(new Set(gruppo.map((c) => c.mazzo.chiave)).size).toBe(1);
    }
  });

  it('scrive il nome del mazzo nel piede di ogni foglio', () => {
    const html = htmlCarte();
    expect(html).toContain('Probabilità · foglio 1');
    expect(html).toContain('Imprevisti · foglio 2');
  });
});

describe('montaCarte', () => {
  it('crea i fogli con tutte le carte, senza retri', () => {
    const fronti = document.createElement('div');
    montaCarte(fronti);
    expect(fronti.querySelectorAll('.sheet')).toHaveLength(2);
    expect(fronti.querySelectorAll('.card')).toHaveLength(32);
    expect(fronti.querySelectorAll('.sheet-retro')).toHaveLength(0);
    expect(fronti.querySelectorAll('.card-retro')).toHaveLength(0);
  });

  it('tiene i due mazzi in blocco, Probabilità e poi Imprevisti', () => {
    const fronti = document.createElement('div');
    montaCarte(fronti);
    const mazzi = [...fronti.querySelectorAll('.card')].map((c) => c.getAttribute('data-mazzo'));
    expect(mazzi.slice(0, 16).every((m) => m === 'probabilita')).toBe(true);
    expect(mazzi.slice(16).every((m) => m === 'imprevisti')).toBe(true);
  });

  it('dà a ogni foglio un solo mazzo, marcato sul foglio stesso', () => {
    const fronti = document.createElement('div');
    montaCarte(fronti);
    const sezioni = [...fronti.querySelectorAll('section.sheet')];
    expect(sezioni.map((s) => s.getAttribute('data-mazzo'))).toEqual(['probabilita', 'imprevisti']);
    for (const s of sezioni) {
      const mazzi = new Set([...s.querySelectorAll('.card')].map((c) => c.getAttribute('data-mazzo')));
      expect(mazzi.size, s.getAttribute('data-mazzo') ?? '').toBe(1);
      expect([...mazzi][0]).toBe(s.getAttribute('data-mazzo'));
    }
  });
});
