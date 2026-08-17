/* ============================================================
   Dati dei contratti (le "carte proprietà") - Il Monopoli d'Ufficio
   Canoni, costo degli Aggiornamenti e valore ipotecario del
   Monopoli classico, riferiti all'indice della casella sul
   tabellone (vedi src/dati/caselle.ts).
   ============================================================ */

/** Canoni di una casella prodotto/servizio, in Buoni Pasto. */
export interface Canoni {
  /** Canone base: licenza senza Aggiornamenti. */
  solo: number;
  /** Canone con 1, 2, 3 e 4 Aggiornamenti (le "case"). */
  aggiornamenti: readonly [number, number, number, number];
  /** Canone con la Major Release (l'"albergo"). */
  release: number;
}

/** Tutto quello che serve per stampare il contratto di una proprietà. */
export interface DatiContratto {
  canoni: Canoni;
  /** Costo di un Aggiornamento (e di una Major Release, come nel classico). */
  costoAggiornamento: number;
  ipoteca: number;
}

/**
 * Contratti delle 22 caselle prodotto/servizio, per indice di casella.
 * I valori sono quelli del tabellone originale: dipendono dalla posizione,
 * non dal colore, quindi la chiave è l'indice.
 */
export const CONTRATTI: Readonly<Record<number, DatiContratto>> = {
  1: { canoni: { solo: 2, aggiornamenti: [10, 30, 90, 160], release: 250 }, costoAggiornamento: 50, ipoteca: 30 },
  3: { canoni: { solo: 4, aggiornamenti: [20, 60, 180, 320], release: 450 }, costoAggiornamento: 50, ipoteca: 30 },
  6: { canoni: { solo: 6, aggiornamenti: [30, 90, 270, 400], release: 550 }, costoAggiornamento: 50, ipoteca: 50 },
  8: { canoni: { solo: 6, aggiornamenti: [30, 90, 270, 400], release: 550 }, costoAggiornamento: 50, ipoteca: 50 },
  9: { canoni: { solo: 8, aggiornamenti: [40, 100, 300, 450], release: 600 }, costoAggiornamento: 50, ipoteca: 60 },
  11: { canoni: { solo: 10, aggiornamenti: [50, 150, 450, 625], release: 750 }, costoAggiornamento: 100, ipoteca: 70 },
  13: { canoni: { solo: 10, aggiornamenti: [50, 150, 450, 625], release: 750 }, costoAggiornamento: 100, ipoteca: 70 },
  14: { canoni: { solo: 12, aggiornamenti: [60, 180, 500, 700], release: 900 }, costoAggiornamento: 100, ipoteca: 80 },
  16: { canoni: { solo: 14, aggiornamenti: [70, 200, 550, 750], release: 950 }, costoAggiornamento: 100, ipoteca: 90 },
  18: { canoni: { solo: 14, aggiornamenti: [70, 200, 550, 750], release: 950 }, costoAggiornamento: 100, ipoteca: 90 },
  19: { canoni: { solo: 16, aggiornamenti: [80, 220, 600, 800], release: 1000 }, costoAggiornamento: 100, ipoteca: 100 },
  21: { canoni: { solo: 18, aggiornamenti: [90, 250, 700, 875], release: 1050 }, costoAggiornamento: 150, ipoteca: 110 },
  23: { canoni: { solo: 18, aggiornamenti: [90, 250, 700, 875], release: 1050 }, costoAggiornamento: 150, ipoteca: 110 },
  24: { canoni: { solo: 20, aggiornamenti: [100, 300, 750, 925], release: 1100 }, costoAggiornamento: 150, ipoteca: 120 },
  26: { canoni: { solo: 22, aggiornamenti: [110, 330, 800, 975], release: 1150 }, costoAggiornamento: 150, ipoteca: 130 },
  27: { canoni: { solo: 22, aggiornamenti: [110, 330, 800, 975], release: 1150 }, costoAggiornamento: 150, ipoteca: 130 },
  29: { canoni: { solo: 24, aggiornamenti: [120, 360, 850, 1025], release: 1200 }, costoAggiornamento: 150, ipoteca: 140 },
  31: { canoni: { solo: 26, aggiornamenti: [130, 390, 900, 1100], release: 1275 }, costoAggiornamento: 200, ipoteca: 150 },
  32: { canoni: { solo: 26, aggiornamenti: [130, 390, 900, 1100], release: 1275 }, costoAggiornamento: 200, ipoteca: 150 },
  34: { canoni: { solo: 28, aggiornamenti: [150, 450, 1000, 1200], release: 1400 }, costoAggiornamento: 200, ipoteca: 160 },
  37: { canoni: { solo: 35, aggiornamenti: [175, 500, 1100, 1300], release: 1500 }, costoAggiornamento: 200, ipoteca: 175 },
  39: { canoni: { solo: 50, aggiornamenti: [200, 600, 1400, 1700], release: 2000 }, costoAggiornamento: 200, ipoteca: 200 },
};

/** Le 4 caselle Fastweb: le "stazioni" del Monopoli classico. */
export const INDICI_FASTWEB: readonly number[] = [5, 15, 25, 35];

/** Canone Fastweb con 1, 2, 3 e 4 caselle possedute dallo stesso giocatore. */
export const CANONI_FASTWEB: readonly [number, number, number, number] = [25, 50, 100, 200];

export const IPOTECA_FASTWEB = 100;

/** Enel e Impianto clima: le "società" del Monopoli classico. */
export const INDICI_SERVIZI: readonly number[] = [12, 28];

/** Moltiplicatore del tiro di dado con una sola casella servizio posseduta. */
export const MOLTIPLICATORE_SERVIZIO = 4;

/** Moltiplicatore del tiro di dado con entrambe le caselle servizio. */
export const MOLTIPLICATORE_SERVIZI = 10;

export const IPOTECA_SERVIZIO = 75;
