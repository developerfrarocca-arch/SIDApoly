import { describe, expect, it } from 'vitest';
import { CARTE_IMPREVISTI, CARTE_PROBABILITA } from '../dati/carte';
import {
  CARTE_PER_FOGLIO,
  MAZZI,
  carteMazzi,
  fogli,
  htmlCarte,
  htmlCartaFronte,
  htmlCartaRetro,
  htmlRetri,
  montaCarte,
  montaRetri,
} from './carte';

const CARTE = carteMazzi();

describe('dati dei mazzi', () => {
  it('ha 16 carte per mazzo, come il Monopoli classico', () => {
    expect(CARTE_PROBABILITA).toHaveLength(16);
    expect(CARTE_IMPREVISTI).toHaveLength(16);
  });

  it('espone i due mazzi con nome e icona coerenti col tabellone', () => {
    expect(MAZZI.map((m) => m.chiave)).toEqual(['probabilita', 'imprevisti']);
    expect(MAZZI.find((m) => m.chiave === 'probabilita')!.icona).toBe('❓');
    expect(MAZZI.find((m) => m.chiave === 'imprevisti')!.icona).toBe('🎲');
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
  it('stampa icona, testo e nome del mazzo', () => {
    const html = htmlCartaFronte(CARTE[0]!);
    expect(html).toContain('card-probabilita');
    expect(html).toContain('❓');
    expect(html).toContain(CARTE_PROBABILITA[0]!.testo);
    expect(html).toContain('Probabilità');
    expect(html).toContain('data-mazzo="probabilita"');
    expect(html).toContain('data-indice="1"');
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

describe('markup del retro', () => {
  it('non dipende dal contenuto della singola carta', () => {
    const retro = htmlCartaRetro(MAZZI[0]!);
    expect(retro).toContain('card-retro');
    expect(retro).toContain('card-probabilita');
    expect(retro).toContain('Probabilità');
    expect(retro).not.toContain(CARTE_PROBABILITA[0]!.testo);
  });

  it('distingue i due mazzi', () => {
    const probabilita = htmlCartaRetro(MAZZI[0]!);
    const imprevisti = htmlCartaRetro(MAZZI[1]!);
    expect(probabilita).not.toBe(imprevisti);
    expect(imprevisti).toContain('card-imprevisti');
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

  it('i retri seguono lo stesso numero di fogli e carte per foglio dei fronti', () => {
    const html = htmlRetri();
    expect(html).toContain('retro 1');
    expect(html).toContain('retro 2');
    expect(html).not.toContain('retro 3');
  });
});

describe('montaCarte e montaRetri', () => {
  it('creano gli stessi fogli e lo stesso numero di carte', () => {
    const fronti = document.createElement('div');
    montaCarte(fronti);
    expect(fronti.querySelectorAll('.sheet')).toHaveLength(2);
    expect(fronti.querySelectorAll('.card')).toHaveLength(32);

    const retri = document.createElement('div');
    montaRetri(retri);
    expect(retri.querySelectorAll('.sheet-retro')).toHaveLength(2);
    expect(retri.querySelectorAll('.card-retro')).toHaveLength(32);
  });

  it('abbina ogni retro al mazzo della carta nella stessa posizione', () => {
    const fronti = document.createElement('div');
    montaCarte(fronti);
    const retri = document.createElement('div');
    montaRetri(retri);

    const mazziFronti = [...fronti.querySelectorAll('.card')].map((c) => c.getAttribute('data-mazzo'));
    const mazziRetri = [...retri.querySelectorAll('.card-retro')].map((c) => c.getAttribute('data-mazzo'));
    expect(mazziRetri).toEqual(mazziFronti);
  });
});
