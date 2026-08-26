/* I due mazzi Probabilità e Imprevisti: composizione dei mazzi e impaginazione.
   Funzioni pure, verificabili senza browser; il markup lo fa il componente in
   src/componenti/carte. */

import { CARTE_IMPREVISTI, CARTE_PROBABILITA, type Carta } from '../dati/carte';

/** Chiave di un mazzo: usata come classe CSS e attributo dati. */
export type ChiaveMazzo = 'probabilita' | 'imprevisti';

/** Un mazzo pescabile: nome (come la casella sul tabellone) e carte. */
export interface Mazzo {
  chiave: ChiaveMazzo;
  nome: string;
  carte: readonly Carta[];
}

/**
 * I due mazzi, nell'ordine in cui compaiono sul tabellone (Probabilità, poi
 * Imprevisti). Sulla carta si stampa solo il nome: le icone del tabellone sono
 * emoji con parti bianche, e il bianco su cartoncino colorato è la carta, non
 * inchiostro.
 */
export const MAZZI: readonly Mazzo[] = [
  { chiave: 'probabilita', nome: 'Probabilità', carte: CARTE_PROBABILITA },
  { chiave: 'imprevisti', nome: 'Imprevisti', carte: CARTE_IMPREVISTI },
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

/** Divide le carte in fogli da CARTE_PER_FOGLIO, così schermo e stampa coincidono. */
export function fogli(carte: readonly CartaMazzo[], perFoglio = CARTE_PER_FOGLIO): CartaMazzo[][] {
  if (!Number.isInteger(perFoglio) || perFoglio < 1) {
    throw new RangeError(`Carte per foglio non valido: ${perFoglio}`);
  }
  const out: CartaMazzo[][] = [];
  for (let i = 0; i < carte.length; i += perFoglio) out.push(carte.slice(i, i + perFoglio));
  return out;
}

/**
 * Come fogli, ma un foglio non mescola mai carte di mazzi diversi: ogni mazzo
 * riparte da un foglio nuovo, così si può stampare ciascuno sul proprio
 * cartoncino senza dover ritagliare due mazzi dallo stesso foglio.
 */
export function fogliPerMazzo(
  carte: readonly CartaMazzo[] = carteMazzi(),
  perFoglio = CARTE_PER_FOGLIO,
): CartaMazzo[][] {
  const gruppi = new Map<ChiaveMazzo, CartaMazzo[]>();
  for (const c of carte) {
    const gruppo = gruppi.get(c.mazzo.chiave);
    if (gruppo) gruppo.push(c);
    else gruppi.set(c.mazzo.chiave, [c]);
  }
  return [...gruppi.values()].flatMap((gruppo) => fogli(gruppo, perFoglio));
}
