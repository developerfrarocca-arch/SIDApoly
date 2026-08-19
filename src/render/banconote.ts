/* Genera le banconote dei Buoni Pasto (BP) a partire dai tagli in
   src/dati/banconote.ts. Come per contratti e tabellone, le funzioni sono
   pure tranne montaBanconote: così il foglio stampabile è verificabile
   senza aprire il browser. */

import { COPIE_PER_TAGLIO, TAGLI, type Taglio } from '../dati/banconote';
import { numero } from './contratti';
import { esc } from './tabellone';

/** Banconote per foglio A4 verticale: griglia 2x5. */
export const BANCONOTE_PER_FOGLIO = 10;

/** Una copia stampata di un taglio, numerata come il seriale di una banconota vera. */
export interface Copia {
  taglio: Taglio;
  serie: number;
}

/**
 * Tutte le copie da stampare, taglio per taglio: così ogni taglio riempie
 * per intero i suoi fogli e non si mescola con gli altri.
 */
export function elencoBanconote(
  tagli: readonly Taglio[] = TAGLI,
  copie = COPIE_PER_TAGLIO,
): Copia[] {
  if (!Number.isInteger(copie) || copie < 1) {
    throw new RangeError(`Copie per taglio non valide: ${copie}`);
  }
  const out: Copia[] = [];
  for (const taglio of tagli) {
    for (let serie = 1; serie <= copie; serie++) out.push({ taglio, serie });
  }
  return out;
}

/** "SIDA-000500-007": il seriale finto stampato su ogni banconota. */
export function seriale({ taglio, serie }: Copia): string {
  return `SIDA-${String(taglio.valore).padStart(6, '0')}-${String(serie).padStart(3, '0')}`;
}

/**
 * Il marchio "Edenpurple": stessa impostazione grafica del logo Edenred
 * (cerchio + scritta a due colori), con "red" sostituito da "purple" e la
 * palette portata sul viola invece che sul rosso.
 */
export function logoEdenpurple(): string {
  return (
    '<svg class="bill-logo" viewBox="0 0 360 110" role="img" aria-label="Edenpurple">' +
    '<circle cx="52" cy="55" r="58" fill="#6C3483"/>' +
    '<text x="8" y="76" font-family="Arial, Helvetica, sans-serif" font-weight="800" font-size="58" fill="#fff">Ed</text>' +
    '<text x="86" y="72" font-family="Arial, Helvetica, sans-serif" font-weight="800" font-size="42" fill="#6C3483">enpurple</text>' +
    '</svg>'
  );
}

/** Il markup di una singola banconota. */
export function htmlBanconota(c: Copia): string {
  const { valore, colore } = c.taglio;
  const cifra = numero(valore);
  return (
    `<article class="bill" style="--bill-color:${esc(colore)}" data-valore="${valore}">` +
    `<div class="corner corner-tl">${cifra}</div>` +
    `<div class="corner corner-tr">${cifra}</div>` +
    '<div class="bill-center">' +
    logoEdenpurple() +
    '<div class="bill-title">Buoni Pasto</div>' +
    `<div class="bill-value">${cifra} <span>BP</span></div>` +
    '<div class="bill-sub">Il Monopoli d\'Ufficio — SIDA Autosoft Multimedia</div>' +
    '</div>' +
    `<div class="corner corner-bl">${cifra}</div>` +
    `<div class="corner corner-br">${cifra}</div>` +
    `<div class="bill-serial">${esc(seriale(c))}</div>` +
    '</article>'
  );
}

/** Divide le copie in fogli da BANCONOTE_PER_FOGLIO, un taglio alla volta. */
export function fogli(copie: readonly Copia[], perFoglio = BANCONOTE_PER_FOGLIO): Copia[][] {
  if (!Number.isInteger(perFoglio) || perFoglio < 1) {
    throw new RangeError(`Banconote per foglio non valido: ${perFoglio}`);
  }
  const out: Copia[][] = [];
  for (let i = 0; i < copie.length; i += perFoglio) out.push(copie.slice(i, i + perFoglio));
  return out;
}

/** Il markup di tutti i fogli di banconote. */
export function htmlBanconote(
  copie: readonly Copia[] = elencoBanconote(),
  perFoglio = BANCONOTE_PER_FOGLIO,
): string {
  return fogli(copie, perFoglio)
    .map((foglio, n) => {
      const valore = foglio[0]?.taglio.valore;
      return (
        '<section class="sheet">' +
        `<div class="sheet-grid">${foglio.map(htmlBanconota).join('')}</div>` +
        `<div class="sheet-foot">Il Monopoli d'Ufficio — Buoni Pasto da ${esc(numero(valore ?? 0))} BP · foglio ${n + 1}</div>` +
        '</section>'
      );
    })
    .join('');
}

/** Inserisce i fogli di banconote nel contenitore della pagina. */
export function montaBanconote(
  root: HTMLElement,
  copie: readonly Copia[] = elencoBanconote(),
  perFoglio = BANCONOTE_PER_FOGLIO,
): void {
  root.insertAdjacentHTML('beforeend', htmlBanconote(copie, perFoglio));
}
