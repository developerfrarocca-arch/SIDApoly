/* Dati dei tagli di Buoni Pasto (BP): valore nominale e colore di riconoscimento
   di ogni banconota, come nel Monopoli classico. */

export interface Taglio {
  valore: number;
  colore: string;
}

/** I 7 tagli richiesti, dal più piccolo al più grande. */
export const TAGLI: readonly Taglio[] = [
  { valore: 5, colore: '#6DBE8F' },
  { valore: 10, colore: '#4FA6D9' },
  { valore: 20, colore: '#F2A93B' },
  { valore: 50, colore: '#E4699D' },
  { valore: 100, colore: '#2FA6A6' },
  { valore: 200, colore: '#C9A227' },
  { valore: 500, colore: '#6C3483' },
];

/** Copie stampate per ogni taglio: un foglio intero a testa (vedi BANCONOTE_PER_FOGLIO). */
export const COPIE_PER_TAGLIO = 10;
