/* Geometria del tabellone: dove va ogni casella nella griglia 11x11, come
   ruota, e la formattazione dei prezzi. Sono funzioni pure, quindi la geometria
   resta verificabile senza aprire il browser; il markup lo costruiscono i
   componenti in src/componenti/tabellone. */

import { NUMERO_CASELLE, type Casella } from '../dati/caselle';

/** Rotazione del contenuto di una casella, in base al lato del tabellone (o alla diagonale, per gli angoli). */
export type Rotazione = '' | 'rot45' | 'rot90' | 'rot135' | 'rot180' | 'rot225' | 'rot270' | 'rot315';

/** Posizione di una casella nella griglia 11x11 (colonne e righe 1-based). */
export interface Posizione {
  col: number;
  row: number;
  rot: Rotazione;
}

/**
 * Posizione e rotazione derivate dall'indice, in senso orario:
 *   0      angolo in basso a destra (Avvio sprint!)
 *   1-9    lato basso, verso sinistra   (nessuna rotazione)
 *   10     angolo in basso a sinistra
 *   11-19  lato sinistro, verso l'alto  (rot90)
 *   20     angolo in alto a sinistra
 *   21-29  lato alto, verso destra      (rot180)
 *   30     angolo in alto a destra
 *   31-39  lato destro, verso il basso  (rot270)
 * Gli angoli ruotano di 45° verso l'interno del tabellone (rot45/rot135/rot225/rot315).
 */
export function posizione(i: number): Posizione {
  if (!Number.isInteger(i) || i < 0 || i >= NUMERO_CASELLE) {
    throw new RangeError(`Indice casella fuori range: ${i}`);
  }
  if (i === 0) return { col: 11, row: 11, rot: 'rot315' };
  if (i < 10) return { col: 11 - i, row: 11, rot: '' };
  if (i === 10) return { col: 1, row: 11, rot: 'rot45' };
  if (i < 20) return { col: 1, row: 21 - i, rot: 'rot90' };
  if (i === 20) return { col: 1, row: 1, rot: 'rot135' };
  if (i < 30) return { col: i - 19, row: 1, rot: 'rot180' };
  if (i === 30) return { col: 11, row: 1, rot: 'rot225' };
  return { col: 11, row: i - 29, rot: 'rot270' };
}

/**
 * Lega la valuta al suo numero con uno spazio insecabile: "200 BP" è un importo,
 * e a fine riga non deve mai spezzarsi lasciando "BP" orfano sulla riga dopo.
 */
export function valuta(s: string): string {
  return s.replace(/(\d)\s+BP/g, '$1\u00a0BP');
}

/** "60 BP" per i numeri, testo invariato per le stringhe ("Paga 200 BP"). */
export function prezzo(v: number | string): string {
  return valuta(typeof v === 'number' ? `${v} BP` : v);
}

/** Le classi CSS della cella: tipo, gruppo colore, rotazione, mazzo carte. */
export function classi(c: Casella, rot: Rotazione): string {
  const cl = ['cell'];
  if (c.tipo === 'angolo') cl.push('corner');
  else if (c.tipo === 'proprieta') cl.push('prop', c.gruppo);
  else cl.push('special');
  if (rot) cl.push(rot);
  if (c.tipo === 'carta') cl.push('card');
  return cl.join(' ');
}
