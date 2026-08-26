/* Genera le carte dei mazzi Probabilità e Imprevisti a partire dai testi in
   src/dati/carte.ts. Come per tabellone, contratti e banconote, le funzioni
   sono pure tranne montaCarte/montaRetri: così il foglio stampabile è
   verificabile senza aprire il browser. */

import { CARTE_IMPREVISTI, CARTE_PROBABILITA, type Carta } from '../dati/carte';
import { esc } from './tabellone';

/** Chiave di un mazzo: usata come classe CSS e attributo dati. */
export type ChiaveMazzo = 'probabilita' | 'imprevisti';

/** Un mazzo pescabile: nome, icona (le stesse della casella sul tabellone) e carte. */
export interface Mazzo {
  chiave: ChiaveMazzo;
  nome: string;
  icona: string;
  carte: readonly Carta[];
}

/** I due mazzi, nell'ordine in cui compaiono sul tabellone (Probabilità, poi Imprevisti). */
export const MAZZI: readonly Mazzo[] = [
  { chiave: 'probabilita', nome: 'Probabilità', icona: '❓', carte: CARTE_PROBABILITA },
  { chiave: 'imprevisti', nome: 'Imprevisti', icona: '🎲', carte: CARTE_IMPREVISTI },
];

/** Carte per foglio A4 verticale: griglia 3x6 (18 carte orizzontali per foglio). */
export const CARTE_PER_FOGLIO = 18;

/** Una carta legata al proprio mazzo, con la posizione nel mazzo (per il conteggio). */
export interface CartaMazzo {
  mazzo: Mazzo;
  carta: Carta;
  indice: number;
}

/** Tutte le carte dei mazzi indicati, un mazzo intero dopo l'altro. */
export function carteMazzi(mazzi: readonly Mazzo[] = MAZZI): CartaMazzo[] {
  const out: CartaMazzo[] = [];
  for (const mazzo of mazzi) {
    mazzo.carte.forEach((carta, i) => out.push({ mazzo, carta, indice: i + 1 }));
  }
  return out;
}

/** Il markup del fronte di una carta: orizzontale, testo centrato in larghezza. */
export function htmlCartaFronte(c: CartaMazzo): string {
  return (
    `<article class="card card-${c.mazzo.chiave}" data-mazzo="${c.mazzo.chiave}" data-indice="${c.indice}">` +
    '<div class="card-head">' +
    `<span class="card-icon">${c.mazzo.icona}</span>` +
    `<span class="card-mazzo">${esc(c.mazzo.nome)}</span>` +
    '</div>' +
    `<div class="card-testo">${esc(c.carta.testo)}</div>` +
    '</article>'
  );
}

/**
 * Il retro di una carta: uguale per tutte le carte dello stesso mazzo (un colore
 * per mazzo), così non serve abbinare un retro preciso a ogni fronte, ma solo
 * non mescolare i retri di un mazzo con quelli dell'altro.
 */
export function htmlCartaRetro(mazzo: Mazzo): string {
  return (
    `<article class="card card-retro card-${mazzo.chiave}" data-mazzo="${mazzo.chiave}">` +
    `<div class="card-icon card-icon-grande">${mazzo.icona}</div>` +
    `<div class="card-mazzo-retro">${esc(mazzo.nome)}</div>` +
    '<div class="card-brand">SIDA Autosoft Multimedia</div>' +
    '</article>'
  );
}

/** Divide le carte in fogli da CARTE_PER_FOGLIO, così schermo e stampa coincidono. */
export function fogli(carte: readonly CartaMazzo[], perFoglio = CARTE_PER_FOGLIO): CartaMazzo[][] {
  if (!Number.isInteger(perFoglio) || perFoglio < 1) {
    throw new RangeError(`Carte per foglio non valido: ${perFoglio}`);
  }
  const out: CartaMazzo[][] = [];
  for (let i = 0; i < carte.length; i += perFoglio) out.push(carte.slice(i, i + perFoglio));
  return out;
}

/** Il markup di tutti i fogli di fronti. */
export function htmlCarte(
  carte: readonly CartaMazzo[] = carteMazzi(),
  perFoglio = CARTE_PER_FOGLIO,
): string {
  return fogli(carte, perFoglio)
    .map(
      (foglio, n) =>
        '<section class="sheet">' +
        `<div class="sheet-grid">${foglio.map(htmlCartaFronte).join('')}</div>` +
        `<div class="sheet-foot">Il Monopoli di SIDA — SIDA Autosoft Multimedia · foglio ${n + 1}</div>` +
        '</section>',
    )
    .join('');
}

/** Inserisce i fogli di fronti nel contenitore della pagina. */
export function montaCarte(
  root: HTMLElement,
  carte: readonly CartaMazzo[] = carteMazzi(),
  perFoglio = CARTE_PER_FOGLIO,
): void {
  root.insertAdjacentHTML('beforeend', htmlCarte(carte, perFoglio));
}

/**
 * Il markup di tutti i fogli di retro, nello stesso ordine e con lo stesso
 * numero di carte per foglio dei fronti: la carta alla posizione N di un
 * foglio di retro è del mazzo giusto per la carta alla posizione N del
 * corrispondente foglio di fronti.
 */
export function htmlRetri(
  carte: readonly CartaMazzo[] = carteMazzi(),
  perFoglio = CARTE_PER_FOGLIO,
): string {
  return fogli(carte, perFoglio)
    .map(
      (foglio, n) =>
        '<section class="sheet sheet-retro">' +
        `<div class="sheet-grid">${foglio.map((c) => htmlCartaRetro(c.mazzo)).join('')}</div>` +
        `<div class="sheet-foot">Il Monopoli di SIDA — SIDA Autosoft Multimedia · retro ${n + 1}</div>` +
        '</section>',
    )
    .join('');
}

/** Inserisce i fogli di retro nel contenitore della pagina. */
export function montaRetri(
  root: HTMLElement,
  carte: readonly CartaMazzo[] = carteMazzi(),
  perFoglio = CARTE_PER_FOGLIO,
): void {
  root.insertAdjacentHTML('beforeend', htmlRetri(carte, perFoglio));
}
