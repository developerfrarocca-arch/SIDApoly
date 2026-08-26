import { describe, expect, it } from 'vitest';
import {
  ZOOM_MASSIMO,
  ZOOM_MINIMO,
  fattoreDiAdattamento,
  passoSuccessivo,
  percentuale,
} from './plancia';

describe('fattoreDiAdattamento', () => {
  it('rimpicciolisce quanto serve perché la pagina ci stia', () => {
    expect(fattoreDiAdattamento(800, 1600)).toBe(0.5);
    expect(fattoreDiAdattamento(726, 1587)).toBeCloseTo(0.457, 3);
  });

  it('non ingrandisce mai: al massimo grandezza naturale', () => {
    expect(fattoreDiAdattamento(2000, 1587)).toBe(1);
    expect(fattoreDiAdattamento(1587, 1587)).toBe(1);
  });

  it('arrotonda per difetto, così non sborda di un pixel', () => {
    expect(fattoreDiAdattamento(999, 1000)).toBe(0.999);
    expect(fattoreDiAdattamento(1, 3)).toBe(0.333);
  });

  it('davanti a misure assurde non fa danni', () => {
    for (const [d, n] of [[0, 1587], [1000, 0], [-10, 100], [NaN, 100], [100, NaN]]) {
      expect(fattoreDiAdattamento(d!, n!), `${d}/${n}`).toBe(1);
    }
  });
});

describe('passoSuccessivo', () => {
  it('si muove di un decimo per volta, senza errori di virgola', () => {
    expect(passoSuccessivo(0.6, 1)).toBe(0.7);
    expect(passoSuccessivo(0.7, -1)).toBe(0.6);
    expect(passoSuccessivo(0.609, 1)).toBe(0.71);
  });

  it('non esce dai limiti', () => {
    expect(passoSuccessivo(ZOOM_MASSIMO, 1)).toBe(ZOOM_MASSIMO);
    expect(passoSuccessivo(ZOOM_MINIMO, -1)).toBe(ZOOM_MINIMO);
    expect(passoSuccessivo(0.25, -1)).toBe(ZOOM_MINIMO);
  });
});

describe('percentuale', () => {
  it('scrive il fattore come lo si legge in un comando di zoom', () => {
    expect(percentuale(0.609)).toBe('61%');
    expect(percentuale(1)).toBe('100%');
    expect(percentuale(1.5)).toBe('150%');
  });
});
