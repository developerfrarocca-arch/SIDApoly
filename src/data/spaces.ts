/* The 40 board spaces, clockwise from space 0 (Avvio sprint!).
   Names, prices and subtitles are printed as they are, so they stay in
   Italian: they are the game itself. */

/** The eight business lines, in board order. */
export type Group = 'brown' | 'lightblue' | 'pink' | 'orange' | 'red' | 'yellow' | 'green' | 'darkblue';

/** A number is printed as "<n> BP"; a string is printed verbatim. */
export type Price = number | string;

/** Corner space: Avvio sprint, Riunione, Pausa caffe, Convocazione. */
export interface Corner {
  type: 'corner';
  icon: string;
  name: string;
  subtitle: string;
}

/** A space that can be bought, belonging to a business line. */
export interface Property {
  type: 'property';
  group: Group;
  department: string;
  name: string;
  price: Price;
}

/** Special space with an amount: Consulenza, Enel, Impianto clima, Tasse, Intre. */
export interface Special {
  type: 'special';
  icon: string;
  name: string;
  price: Price;
}

/** Draw-a-card space, with no amount: Imprevisti, Probabilita. */
export interface CardSpace {
  type: 'card';
  icon: string;
  name: string;
}

export type Space = Corner | Property | Special | CardSpace;

/** The board always has 40 spaces: indexes 0-39, clockwise. */
export const SPACE_COUNT = 40;

export const SPACES: readonly Space[] = [
  /*  0 */ { type: 'corner', icon: '▶️', name: 'Avvio sprint!', subtitle: 'Ritira 500 BP' },
  /*  1 */ { type: 'property', group: 'brown', department: 'Configurazione', name: 'SIDA Sync Test', price: 150 },
  /*  2 */ { type: 'card', icon: '❓', name: 'Probabilità' },
  /*  3 */ { type: 'property', group: 'brown', department: 'Configurazione', name: 'SIDA Connect', price: 150 },
  /*  4 */ { type: 'special', icon: '💶', name: 'Tasse', price: 'Paga 500 BP' },
  /*  5 */ { type: 'special', icon: '👩🏿‍💼', name: 'Consulenza Sud', price: 480 },
  /*  6 */ { type: 'property', group: 'lightblue', department: 'Formazione', name: 'Tachigrafo', price: 250 },
  /*  7 */ { type: 'card', icon: '🎲', name: 'Imprevisti' },
  /*  8 */ { type: 'property', group: 'lightblue', department: 'Formazione', name: 'Carico Sicuro', price: 250 },
  /*  9 */ { type: 'property', group: 'lightblue', department: 'Formazione', name: 'Guida Sicura', price: 300 },
  /* 10 */ { type: 'corner', icon: '👥', name: 'Riunione / Transito', subtitle: 'Di passaggio o convocato' },
  /* 11 */ { type: 'property', group: 'pink', department: 'Web', name: 'patenteonline.it', price: 350 },
  /* 12 */ { type: 'special', icon: '⚡', name: 'Enel', price: 380 },
  /* 13 */ { type: 'property', group: 'pink', department: 'Web', name: 'patente.it', price: 350 },
  /* 14 */ { type: 'property', group: 'pink', department: 'Web', name: 'sida.patente.it', price: 400 },
  /* 15 */ { type: 'special', icon: '👩🏽‍💼', name: 'Consulenza Ovest', price: 480 },
  /* 16 */ { type: 'property', group: 'orange', department: 'Mobile', name: 'SIDA QuizApp', price: 450 },
  /* 17 */ { type: 'card', icon: '❓', name: 'Probabilità' },
  /* 18 */ { type: 'property', group: 'orange', department: 'Mobile', name: 'SIDA Tools', price: 450 },
  /* 19 */ { type: 'property', group: 'orange', department: 'Mobile', name: 'SIDA Drive Controller', price: 500 },
  /* 20 */ { type: 'corner', icon: '☕', name: 'Pausa caffè', subtitle: 'Sosta gratuita' },
  /* 21 */ { type: 'property', group: 'red', department: 'Didattica', name: 'Manuale AeB', price: 550 },
  /* 22 */ { type: 'card', icon: '🎲', name: 'Imprevisti' },
  /* 23 */ { type: 'property', group: 'red', department: 'Didattica', name: 'Manuale Superiori', price: 550 },
  /* 24 */ { type: 'property', group: 'red', department: 'Didattica', name: 'Manuale CQC', price: 600 },
  /* 25 */ { type: 'special', icon: '🧑‍💼', name: 'Consulenza Nord', price: 480 },
  /* 26 */ { type: 'property', group: 'yellow', department: 'Simulatori', name: 'DRIVE 180°', price: 650 },
  /* 27 */ { type: 'property', group: 'yellow', department: 'Simulatori', name: 'DRIVE 360°', price: 650 },
  /* 28 */ { type: 'special', icon: '❄️', name: 'Impianto clima', price: 380 },
  /* 29 */ { type: 'property', group: 'yellow', department: 'Simulatori', name: 'DRIVE CML', price: 700 },
  /* 30 */ { type: 'corner', icon: '⏰', name: 'Convocazione in riunione!', subtitle: 'Vai dritto in riunione' },
  /* 31 */ { type: 'property', group: 'green', department: 'Ufficio', name: 'Aula Millennium', price: 750 },
  /* 32 */ { type: 'property', group: 'green', department: 'Ufficio', name: 'Quiz Millennium', price: 750 },
  /* 33 */ { type: 'card', icon: '❓', name: 'Probabilità' },
  /* 34 */ { type: 'property', group: 'green', department: 'Ufficio', name: 'Gestione Millennium', price: 800 },
  /* 35 */ { type: 'special', icon: '🧑🏻‍💼', name: 'Consulenza Est', price: 480 },
  /* 36 */ { type: 'card', icon: '🎲', name: 'Imprevisti' },
  /* 37 */ { type: 'property', group: 'darkblue', department: 'Sportello', name: 'TuttoPrenota', price: 900 },
  /* 38 */ { type: 'special', icon: '📄', name: 'Intrè', price: 'Paga 250 BP' },
  /* 39 */ { type: 'property', group: 'darkblue', department: 'Sportello', name: 'SIDA PagoPa', price: 1000 },
];
