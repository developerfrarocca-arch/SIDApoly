/* Le carte contratto (le "carte proprietà" del Monopoli classico): quali sono,
   come si impaginano e come si specchiano i retri per la stampa fronte-retro.
   Funzioni pure, verificabili senza browser; il markup lo fanno i componenti in
   src/componenti/contratti. */

import { CASELLE, type Casella, type Proprieta, type Speciale } from '../dati/caselle';
import {
  CONTRATTI,
  INDICI_CONSULENZA,
  INDICI_SERVIZI,
  IPOTECA_CONSULENZA,
  IPOTECA_SERVIZIO,
  type DatiContratto,
} from '../dati/contratti';
import { valuta } from './tabellone';

/** Una carta contratto: prodotto/servizio, casella Consulenza o casella servizio. */
export type Contratto =
  | { tipo: 'proprieta'; indice: number; casella: Proprieta; dati: DatiContratto }
  | { tipo: 'consulenza'; indice: number; casella: Speciale }
  | { tipo: 'servizio'; indice: number; casella: Speciale };

/** Carte per foglio A4 verticale: griglia 3x3. */
export const CARTE_PER_FOGLIO = 9;

/** Colonne della griglia di un foglio (vedi .sheet-grid in contratti.css). */
export const COLONNE = 3;

/**
 * Tutte le carte contratto, nell'ordine del tabellone:
 * le 22 caselle prodotto/servizio, le 4 Consulenza e le 2 caselle servizio.
 */
export function contratti(caselle: readonly Casella[] = CASELLE): Contratto[] {
  const carte: Contratto[] = [];
  for (const [indice, casella] of caselle.entries()) {
    if (casella.tipo === 'proprieta') {
      const dati = CONTRATTI[indice];
      if (!dati) throw new Error(`Manca il contratto della casella ${indice} (${casella.nome})`);
      carte.push({ tipo: 'proprieta', indice, casella, dati });
    } else if (casella.tipo === 'speciale' && INDICI_CONSULENZA.includes(indice)) {
      carte.push({ tipo: 'consulenza', indice, casella });
    } else if (casella.tipo === 'speciale' && INDICI_SERVIZI.includes(indice)) {
      carte.push({ tipo: 'servizio', indice, casella });
    }
  }
  return carte;
}

/** 1150 -> "1.150" (separatore delle migliaia italiano, senza dipendere dal locale). */
export function numero(v: number): string {
  return String(v).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

/** 260 -> "260 BP", con la valuta legata al numero. */
export function bp(v: number): string {
  return valuta(`${numero(v)} BP`);
}

/** Il valore ipotecario di una carta, qualunque sia il suo tipo. */
export function ipotecaCarta(c: Contratto): number {
  if (c.tipo === 'proprieta') return c.dati.ipoteca;
  return c.tipo === 'consulenza' ? IPOTECA_CONSULENZA : IPOTECA_SERVIZIO;
}

/** Le classi CSS della carta: colore della linea di business o fascia neutra. */
export function classiCarta(c: Contratto): string {
  if (c.tipo !== 'proprieta') return 'contract g-societa';
  const scuri = ['brown', 'darkblue'];
  const cl = ['contract', `g-${c.casella.gruppo}`];
  if (scuri.includes(c.casella.gruppo)) cl.push('scuro');
  return cl.join(' ');
}

/** Divide le carte in fogli da CARTE_PER_FOGLIO, così schermo e stampa coincidono. */
export function fogli(carte: readonly Contratto[], perFoglio = CARTE_PER_FOGLIO): Contratto[][] {
  if (!Number.isInteger(perFoglio) || perFoglio < 1) {
    throw new RangeError(`Carte per foglio non valido: ${perFoglio}`);
  }
  const out: Contratto[][] = [];
  for (let i = 0; i < carte.length; i += perFoglio) out.push(carte.slice(i, i + perFoglio));
  return out;
}

/**
 * Le carte di un foglio nell'ordine in cui vanno stampate sul retro con la
 * stampa fronte-retro: girando il foglio sul bordo lungo le colonne si
 * specchiano, quindi ogni riga va rovesciata. Le righe incomplete vengono
 * riempite prima di rovesciarle, altrimenti l'ultima carta finisce nella
 * colonna sbagliata.
 */
export function specchiaRighe(
  foglio: readonly Contratto[],
  colonne = COLONNE,
): (Contratto | null)[] {
  if (!Number.isInteger(colonne) || colonne < 1) {
    throw new RangeError(`Numero di colonne non valido: ${colonne}`);
  }
  const out: (Contratto | null)[] = [];
  for (let i = 0; i < foglio.length; i += colonne) {
    const riga: (Contratto | null)[] = foglio.slice(i, i + colonne);
    while (riga.length < colonne) riga.push(null);
    out.push(...riga.reverse());
  }
  return out;
}
