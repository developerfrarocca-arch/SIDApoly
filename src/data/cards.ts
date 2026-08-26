/* The two decks, Probabilità and Imprevisti. Only the printed text: players
   apply the effect themselves, so there is no logic to run here. */

/** A drawable card: just the text printed on its front. */
export interface Card {
  text: string;
}

/** The 16 cards of the Probabilità deck. */
export const CHANCE_CARDS: readonly Card[] = [
  { text: 'Un loop nelle chiamate a Firebase fa lievitare i consumi cloud: pagate 125 BP' },
  { text: 'Un cliente segnala un bug bloccante subito dopo il rilascio: tornate a SIDA Connect' },
  { text: 'Avete venduto le ultime licenze del vecchio gestionale: incassate 125 BP' },
  { text: "Un'autoscuola salda finalmente una fattura data per dispersa: incassate 500 BP" },
  { text: 'Il nuovo software supera il collaudo al primo tentativo: avanzate fino ad «Avvio sprint!»' },
  {
    text:
      'Uscite gratis dalla riunione infinita: conservate questa carta fino al prossimo meeting ' +
      'senza ordine del giorno oppure vendetela',
  },
  { text: 'Il Ministero approva il decreto simulatori. Si impennano le vendite SIDA Drive: incassate 250 BP' },
  { text: "Verifica dell'Agenzia delle Entrate sulla contabilità: pagate una multa di 250 BP" },
  { text: 'È nata vostra figlia: ogni socio vi regala 25 BP' },
  { text: 'Il commerciale di fiducia convince un ex-cliente a tornare: incassate 250 BP' },
  {
    text:
      'Un cliente con accento tedesco esige una nuova funzionalità entro la prossima settimana. ' +
      'Andate direttamente in Riunione, senza passare da «Avvio sprint!»',
  },
  { text: 'Maturano i canoni annuali delle licenze: incassate 60 BP' },
  { text: 'Un influencer si appropria delle nostre videolezioni: causa vinta, incassate 25 BP' },
  { text: "Rimborso per il credito d'imposta di ricerca e sviluppo: incassate 50 BP" },
  { text: 'Un dipendente ha installato un software senza licenza: pagate 125 BP di sanzione' },
  {
    text:
      'Il manuale è stato stampato con le immagini non aggiornate: pagate 25 BP oppure pescate ' +
      'un «Imprevisto»',
  },
];

/** The 16 cards of the Imprevisti deck. */
export const CHEST_CARDS: readonly Card[] = [
  {
    text:
      'Il cliente in Beta approva il nuovo aggiornamento: andate a Gestione Millennium; ' +
      'se passate da «Avvio sprint!» incassate 500 BP',
  },
  {
    text:
      'Moroni ha trovato un bug nelle app: andate a SIDA Tools; ' +
      'se passate da «Avvio sprint!» incassate 500 BP',
  },
  { text: 'Il tester trova un bug il giorno prima della consegna: fate tre passi indietro nello sprint' },
  { text: 'Nuovo aggiornamento di Windows: pagate 60 BP per ogni Aggiornamento e 250 BP per ogni Major Release posseduti' },
  { text: 'Tre grossi clienti abbandonano la concorrenza: incassate 375 BP' },
  { text: 'Il vostro SIDA QuizApp diventa virale tra i candidati: incassate 250 BP' },
  {
    text:
      'Partecipate alla fiera nazionale delle autoscuole: andate alla casella Consulenza più vicina; ' +
      'se passate da «Avvio sprint!» incassate 500 BP',
  },
  { text: 'Nuove specifiche ministeriali a progetto quasi finito: pagate 100 BP per ogni Aggiornamento e 250 BP per ogni Major Release posseduti' },
  { text: 'La release passa tutti i test automatici: avanzate fino ad «Avvio sprint!»' },
  {
    text:
      'Uscite gratis dalla riunione infinita: conservate questa carta fino al prossimo meeting ' +
      'senza ordine del giorno oppure vendetela',
  },
  { text: 'Degli hacker crittografano il server di produzione: pagate 375 BP di riscatto' },
  { text: 'Multa di 40 BP: il furgone simulatori era parcheggiato nel posto disabili' },
  { text: 'Il cloud provider AWS vi riconosce un credito per il disservizio: incassate 125 BP' },
  {
    text:
      "L'installazione dei pannelli solari buca il tetto: dopo la pioggia gli uffici " +
      'sono allagati, pagate 50 BP',
  },
  { text: 'La build critica finisce in produzione senza revisione: andate direttamente in Riunione, senza passare da «Avvio sprint!»' },
  { text: "Un cliente arrabbiato vi sequestra nella sua autoscuola. Gli fate causa e venite rimborsati di 150 BP" },
];
