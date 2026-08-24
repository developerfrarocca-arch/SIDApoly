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
  1: { canoni: { solo: 5, aggiornamenti: [25, 75, 225, 400], release: 625 }, costoAggiornamento: 125, ipoteca: 75 },
  3: { canoni: { solo: 10, aggiornamenti: [50, 150, 450, 800], release: 1125 }, costoAggiornamento: 500, ipoteca: 75 },
  6: { canoni: { solo: 15, aggiornamenti: [75, 225, 675, 1000], release: 1375 }, costoAggiornamento: 125, ipoteca: 125 },
  8: { canoni: { solo: 15, aggiornamenti: [75, 225, 675, 1000], release: 1375 }, costoAggiornamento: 125, ipoteca: 125 },
  9: { canoni: { solo: 20, aggiornamenti: [100, 250, 750, 1125], release: 1500 }, costoAggiornamento: 125, ipoteca: 150 },
  11: { canoni: { solo: 25, aggiornamenti: [125, 360, 1025, 1435], release: 1875 }, costoAggiornamento: 250, ipoteca: 175 },
  13: { canoni: { solo: 25, aggiornamenti: [125, 360, 1025, 1435], release: 1875 }, costoAggiornamento: 250, ipoteca: 175 },
  14: { canoni: { solo: 30, aggiornamenti: [150, 400, 1125, 1565], release: 2000 }, costoAggiornamento: 250, ipoteca: 200 },
  16: { canoni: { solo: 35, aggiornamenti: [175, 500, 1375, 1875], release: 2375 }, costoAggiornamento: 250, ipoteca: 225 },
  18: { canoni: { solo: 35, aggiornamenti: [175, 500, 1375, 1875], release: 2375 }, costoAggiornamento: 250, ipoteca: 225 },
  19: { canoni: { solo: 40, aggiornamenti: [200, 550, 1500, 2000], release: 2500 }, costoAggiornamento: 250, ipoteca: 250 },
  21: { canoni: { solo: 45, aggiornamenti: [225, 625, 1750, 2200], release: 2625 }, costoAggiornamento: 375, ipoteca: 275 },
  23: { canoni: { solo: 45, aggiornamenti: [225, 625, 1750, 2200], release: 2625 }, costoAggiornamento: 375, ipoteca: 275 },
  24: { canoni: { solo: 50, aggiornamenti: [250, 750, 1875, 2250], release: 2750 }, costoAggiornamento: 375, ipoteca: 300 },
  26: { canoni: { solo: 55, aggiornamenti: [275, 825, 2000, 2500], release: 3000 }, costoAggiornamento: 375, ipoteca: 325 },
  27: { canoni: { solo: 55, aggiornamenti: [275, 825, 2000, 2500], release: 3000 }, costoAggiornamento: 375, ipoteca: 325 },
  29: { canoni: { solo: 60, aggiornamenti: [300, 900, 2125, 2625], release: 3125 }, costoAggiornamento: 375, ipoteca: 350 },
  31: { canoni: { solo: 65, aggiornamenti: [325, 1000, 2250, 2750], release: 3250 }, costoAggiornamento: 500, ipoteca: 375 },
  32: { canoni: { solo: 65, aggiornamenti: [325, 1000, 2250, 2750], release: 3250 }, costoAggiornamento: 500, ipoteca: 375 },
  34: { canoni: { solo: 70, aggiornamenti: [375, 1125, 2500, 3000], release: 3500 }, costoAggiornamento: 500, ipoteca: 400 },
  37: { canoni: { solo: 90, aggiornamenti: [500, 1250, 2750, 3250], release: 3750 }, costoAggiornamento: 500, ipoteca: 450 },
  39: { canoni: { solo: 125, aggiornamenti: [500, 1500, 3500, 4250], release: 5000 }, costoAggiornamento: 500, ipoteca: 500 },
};

/** Le 4 caselle Consulenza (i referenti di zona): le "stazioni" del Monopoli classico. */
export const INDICI_CONSULENZA: readonly number[] = [5, 15, 25, 35];

/** Canone Consulenza con 1, 2, 3 e 4 caselle possedute dallo stesso giocatore. */
export const CANONI_CONSULENZA: readonly [number, number, number, number] = [60, 120, 240, 480];

export const IPOTECA_CONSULENZA = 240;

/** Enel e Impianto clima: le "società" del Monopoli classico. */
export const INDICI_SERVIZI: readonly number[] = [12, 28];

/** Moltiplicatore del tiro di dado con una sola casella servizio posseduta. */
export const MOLTIPLICATORE_SERVIZIO = 4;

/** Moltiplicatore del tiro di dado con entrambe le caselle servizio. */
export const MOLTIPLICATORE_SERVIZI = 10;

export const IPOTECA_SERVIZIO = 190;
