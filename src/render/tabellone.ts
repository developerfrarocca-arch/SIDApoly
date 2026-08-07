/* Genera le 40 caselle del tabellone a partire dai dati in src/dati/caselle.ts.
   Le funzioni qui sono pure (stringhe in, stringhe out) tranne montaTabellone:
   così la geometria e il markup sono verificabili senza aprire il browser. */

import { CASELLE, NUMERO_CASELLE, type Casella } from '../dati/caselle';

/** Rotazione del contenuto di una casella, in base al lato del tabellone. */
export type Rotazione = '' | 'rot90' | 'rot180' | 'rot270';

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
 * Gli angoli non ruotano.
 */
export function posizione(i: number): Posizione {
  if (!Number.isInteger(i) || i < 0 || i >= NUMERO_CASELLE) {
    throw new RangeError(`Indice casella fuori range: ${i}`);
  }
  if (i <= 10) return { col: 11 - i, row: 11, rot: '' };
  if (i < 20) return { col: 1, row: 21 - i, rot: 'rot90' };
  if (i === 20) return { col: 1, row: 1, rot: '' };
  if (i < 30) return { col: i - 19, row: 1, rot: 'rot180' };
  if (i === 30) return { col: 11, row: 1, rot: '' };
  return { col: 11, row: i - 29, rot: 'rot270' };
}

/** Escape del testo inserito nel markup (i nomi arrivano dai dati, non da HTML). */
export function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/** "60 BP" per i numeri, testo invariato per le stringhe ("Paga 200 BP"). */
export function prezzo(v: number | string): string {
  return typeof v === 'number' ? `${v} BP` : v;
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

/** Il contenuto interno della casella, diverso per ogni tipo. */
export function contenuto(c: Casella): string {
  switch (c.tipo) {
    case 'angolo':
      return (
        `<div class="icon">${esc(c.icona)}</div>` +
        `<div class="label">${esc(c.nome)}</div>` +
        `<div class="sub">${esc(c.sotto)}</div>`
      );
    case 'proprieta':
      return (
        '<div class="bar"></div>' +
        `<div class="dept">${esc(c.reparto)}</div>` +
        `<div class="name" contenteditable="true">${esc(c.nome)}</div>` +
        `<div class="price">${esc(prezzo(c.prezzo))}</div>`
      );
    case 'speciale':
      return (
        `<div class="icon">${esc(c.icona)}</div>` +
        `<div class="label">${esc(c.nome)}</div>` +
        `<div class="price">${esc(prezzo(c.prezzo))}</div>`
      );
    case 'carta':
      return `<div class="icon">${esc(c.icona)}</div>` + `<div class="label">${esc(c.nome)}</div>`;
  }
}

/** Il markup di una singola casella, già posizionata nella griglia. */
export function htmlCasella(c: Casella, i: number): string {
  const { col, row, rot } = posizione(i);
  return (
    `<div class="${classi(c, rot)}" style="grid-column:${col}/${col + 1};grid-row:${row}/${row + 1};">` +
    `<div class="inner">${contenuto(c)}</div></div>`
  );
}

/** Il markup di tutte le caselle passate (per default il tabellone completo). */
export function htmlTabellone(caselle: readonly Casella[] = CASELLE): string {
  return caselle.map(htmlCasella).join('');
}

/** Aggiunge le caselle al tabellone, dopo il centro già presente nell'HTML. */
export function montaTabellone(board: HTMLElement, caselle: readonly Casella[] = CASELLE): void {
  board.insertAdjacentHTML('beforeend', htmlTabellone(caselle));
}
