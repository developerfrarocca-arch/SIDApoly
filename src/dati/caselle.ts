/* ============================================================
   Dati delle 40 caselle - Il Monopoli d'Ufficio (SIDA)
   Ordine: dalla casella 0 (Avvio sprint!) in senso orario.
   ============================================================ */

/** Le otto linee di business, nell'ordine del tabellone. */
export type Gruppo =
  | 'brown'
  | 'lightblue'
  | 'pink'
  | 'orange'
  | 'red'
  | 'yellow'
  | 'green'
  | 'darkblue';

/** Numero -> stampato come "<n> BP"; stringa -> stampata cosi' com'e'. */
export type Prezzo = number | string;

/** Angolo: Avvio sprint, Riunione, Pausa caffe', Convocazione. */
export interface Angolo {
  tipo: 'angolo';
  icona: string;
  nome: string;
  sotto: string;
}

/** Casella acquistabile, appartenente a una linea di business. */
export interface Proprieta {
  tipo: 'proprieta';
  gruppo: Gruppo;
  reparto: string;
  nome: string;
  prezzo: Prezzo;
}

/** Casella speciale con un importo: Fastweb, Enel, Impianto clima, Tasse, Intre'. */
export interface Speciale {
  tipo: 'speciale';
  icona: string;
  nome: string;
  prezzo: Prezzo;
}

/** Casella pesca-carta, senza importo: Imprevisti, Probabilita'. */
export interface CasellaCarta {
  tipo: 'carta';
  icona: string;
  nome: string;
}

export type Casella = Angolo | Proprieta | Speciale | CasellaCarta;

/** Il tabellone ha sempre 40 caselle: indici 0-39 in senso orario. */
export const NUMERO_CASELLE = 40;

export const CASELLE: readonly Casella[] = [
  /*  0 */ { tipo: "angolo", icona: "▶️", nome: "Avvio sprint!", sotto: "Ritira 200 BP" },
  /*  1 */ { tipo: "proprieta", gruppo: "pink", reparto: "Configurazione", nome: "SIDA Sync Test", prezzo: 60 },
  /*  2 */ { tipo: "carta", icona: "❓", nome: "Probabilità" },
  /*  3 */ { tipo: "proprieta", gruppo: "pink", reparto: "Configurazione", nome: "SIDA Connect", prezzo: 60 },
  /*  4 */ { tipo: "speciale", icona: "💶", nome: "Tasse", prezzo: "Paga 200 BP" },
  /*  5 */ { tipo: "speciale", icona: "📡", nome: "Fastweb", prezzo: 200 },
  /*  6 */ { tipo: "proprieta", gruppo: "lightblue", reparto: "Formazione", nome: "Tachigrafo", prezzo: 100 },
  /*  7 */ { tipo: "carta", icona: "🎲", nome: "Imprevisti" },
  /*  8 */ { tipo: "proprieta", gruppo: "lightblue", reparto: "Formazione", nome: "Carico Sicuro", prezzo: 100 },
  /*  9 */ { tipo: "proprieta", gruppo: "lightblue", reparto: "Formazione", nome: "Guida Sicura", prezzo: 120 },
  /* 10 */ { tipo: "angolo", icona: "👥", nome: "Riunione / Transito", sotto: "Di passaggio o convocato" },
  /* 11 */ { tipo: "proprieta", gruppo: "orange", reparto: "Web", nome: "patenteonline.it", prezzo: 140 },
  /* 12 */ { tipo: "speciale", icona: "⚡", nome: "Enel", prezzo: 150 },
  /* 13 */ { tipo: "proprieta", gruppo: "orange", reparto: "Web", nome: "patente.it", prezzo: 140 },
  /* 14 */ { tipo: "proprieta", gruppo: "orange", reparto: "Web", nome: "sida.patente.it", prezzo: 160 },
  /* 15 */ { tipo: "speciale", icona: "📡", nome: "Fastweb", prezzo: 200 },
  /* 16 */ { tipo: "proprieta", gruppo: "brown", reparto: "Mobile", nome: "SIDA QuizApp", prezzo: 180 },
  /* 17 */ { tipo: "carta", icona: "❓", nome: "Probabilità" },
  /* 18 */ { tipo: "proprieta", gruppo: "brown", reparto: "Mobile", nome: "SIDA Tools", prezzo: 180 },
  /* 19 */ { tipo: "proprieta", gruppo: "brown", reparto: "Mobile", nome: "SIDA Drive Controller", prezzo: 200 },
  /* 20 */ { tipo: "angolo", icona: "☕", nome: "Pausa caffè", sotto: "Sosta gratuita" },
  /* 21 */ { tipo: "proprieta", gruppo: "red", reparto: "Didattica", nome: "Manuale AeB", prezzo: 220 },
  /* 22 */ { tipo: "carta", icona: "🎲", nome: "Imprevisti" },
  /* 23 */ { tipo: "proprieta", gruppo: "red", reparto: "Didattica", nome: "Manuale Superiori", prezzo: 220 },
  /* 24 */ { tipo: "proprieta", gruppo: "red", reparto: "Didattica", nome: "Manuale CQC", prezzo: 240 },
  /* 25 */ { tipo: "speciale", icona: "📡", nome: "Fastweb", prezzo: 200 },
  /* 26 */ { tipo: "proprieta", gruppo: "yellow", reparto: "Simulatori", nome: "DRIVE 180°", prezzo: 260 },
  /* 27 */ { tipo: "proprieta", gruppo: "yellow", reparto: "Simulatori", nome: "DRIVE 360°", prezzo: 260 },
  /* 28 */ { tipo: "speciale", icona: "❄️", nome: "Impianto clima", prezzo: 150 },
  /* 29 */ { tipo: "proprieta", gruppo: "yellow", reparto: "Simulatori", nome: "DRIVE CML", prezzo: 280 },
  /* 30 */ { tipo: "angolo", icona: "⏰", nome: "Convocazione in riunione!", sotto: "Vai dritto in riunione" },
  /* 31 */ { tipo: "proprieta", gruppo: "green", reparto: "Ufficio", nome: "Aula Sida Millennium", prezzo: 300 },
  /* 32 */ { tipo: "proprieta", gruppo: "green", reparto: "Ufficio", nome: "Quiz Sida Millennium", prezzo: 300 },
  /* 33 */ { tipo: "carta", icona: "❓", nome: "Probabilità" },
  /* 34 */ { tipo: "proprieta", gruppo: "green", reparto: "Ufficio", nome: "Gestione Sida Millennium", prezzo: 320 },
  /* 35 */ { tipo: "speciale", icona: "📡", nome: "Fastweb", prezzo: 200 },
  /* 36 */ { tipo: "carta", icona: "🎲", nome: "Imprevisti" },
  /* 37 */ { tipo: "proprieta", gruppo: "darkblue", reparto: "Sportello", nome: "TuttoPrenota", prezzo: 350 },
  /* 38 */ { tipo: "speciale", icona: "📄", nome: "Intrè", prezzo: "Paga 100 BP" },
  /* 39 */ { tipo: "proprieta", gruppo: "darkblue", reparto: "Sportello", nome: "SIDA PagoPa", prezzo: 400 },
];
