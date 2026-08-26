/* Le banconote dei Buoni Pasto: quante copie per taglio, i seriali e
   l'impaginazione. Funzioni pure; il markup lo fa il componente in
   src/componenti/banconote. */

import { COPIE_PER_TAGLIO, TAGLI, type Taglio } from '../dati/banconote';

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

/** Divide le copie in fogli da BANCONOTE_PER_FOGLIO, un taglio alla volta. */
export function fogli(copie: readonly Copia[], perFoglio = BANCONOTE_PER_FOGLIO): Copia[][] {
  if (!Number.isInteger(perFoglio) || perFoglio < 1) {
    throw new RangeError(`Banconote per foglio non valido: ${perFoglio}`);
  }
  const out: Copia[][] = [];
  for (let i = 0; i < copie.length; i += perFoglio) out.push(copie.slice(i, i + perFoglio));
  return out;
}
