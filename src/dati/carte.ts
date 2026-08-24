/* ============================================================
   Dati dei mazzi Probabilità e Imprevisti - Il Monopoli d'Ufficio
   Solo il testo delle carte: l'effetto lo applicano i giocatori,
   come nel Monopoli classico non c'è nessuna logica da eseguire.
   ============================================================ */

/** Una carta pescabile: solo il testo stampato sul fronte. */
export interface Carta {
  testo: string;
}

/** Le 16 carte del mazzo Probabilità (equivalente delle "Probabilità" classiche). */
export const CARTE_PROBABILITA: readonly Carta[] = [
  { testo: 'Un loop nelle chiamate a Firebase fa lievitare i consumi cloud: pagate 125 BP' },
  { testo: 'Un cliente segnala un bug bloccante subito dopo il rilascio: tornate a SIDA Connect' },
  { testo: 'Avete venduto le ultime licenze del vecchio gestionale: incassate 125 BP' },
  { testo: "Un'autoscuola salda finalmente una fattura data per dispersa: incassate 500 BP" },
  { testo: 'Il nuovo software supera il collaudo al primo tentativo: avanzate fino ad «Avvio sprint!»' },
  {
    testo:
      'Uscite gratis dalla riunione infinita: conservate questa carta fino al prossimo meeting ' +
      'senza ordine del giorno oppure vendetela',
  },
  { testo: 'Il Ministero approva il decreto simulatori. Si impennano le vendite SIDA Drive: incassate 250 BP' },
  { testo: "Verifica dell'Agenzia delle Entrate sulla contabilità: pagate una multa di 250 BP" },
  { testo: 'È nata vostra figlia: ogni socio vi regala 25 BP' },
  { testo: 'Il commerciale di fiducia convince un ex-cliente a tornare: incassate 250 BP' },
  {
    testo:
      'Un cliente con accento tedesco esige una nuova funzionalità entro la prossima settimana. ' +
      'Andate direttamente in Riunione, senza passare da «Avvio sprint!»',
  },
  { testo: 'Maturano i canoni annuali delle licenze: incassate 60 BP' },
  { testo: 'Un cliente lascia una recensione a 5 stelle sul Playstore: ritirate 25 BP' },
  { testo: "Rimborso per il credito d'imposta di ricerca e sviluppo: incassate 50 BP" },
  { testo: 'Un dipendente ha installato RAD Studio senza licenza: pagate 125 BP di sanzione' },
  {
    testo:
      'Il manuale è stato stampato con le immagini non aggiornate: pagate 25 BP oppure pescate ' +
      'un «Imprevisto aziendale»',
  },
];

/** Le 16 carte del mazzo Imprevisti (equivalente degli "Imprevisti" classici). */
export const CARTE_IMPREVISTI: readonly Carta[] = [
  {
    testo:
      'Il cliente in Beta approva il nuovo aggiornamento: andate a Gestione Millennium; ' +
      'se passate da «Avvio sprint!» incassate 500 BP',
  },
  {
    testo:
      'Moroni ha trovato un bug nelle app: andate a SIDA Tools; ' +
      'se passate da «Avvio sprint!» incassate 500 BP',
  },
  { testo: 'Il tester trova un bug il giorno prima della consegna: fate tre passi indietro nello sprint' },
  { testo: 'Nuovo aggiornamento di Windows: pagate 60 BP per ogni Aggiornamento e 250 BP per ogni Major Release posseduti' },
  { testo: 'Tre grossi clienti abbandonano la concorrenza: incassate 375 BP' },
  { testo: 'Il vostro SIDA QuizApp diventa virale tra i candidati: incassate 250 BP' },
  {
    testo:
      'Partecipate alla fiera nazionale delle autoscuole: andate alla casella Consulenza più vicina; ' +
      'se passate da «Avvio sprint!» incassate 500 BP',
  },
  { testo: 'Nuove specifiche ministeriali a progetto quasi finito: pagate 100 BP per ogni Aggiornamento e 250 BP per ogni Major Release posseduti' },
  { testo: 'La release passa tutti i test automatici: avanzate fino ad «Avvio sprint!»' },
  {
    testo:
      'Uscite gratis dalla riunione infinita: conservate questa carta fino al prossimo meeting ' +
      'senza ordine del giorno oppure vendetela',
  },
  { testo: 'Degli hacker crittografano il server di produzione: pagate 375 BP di riscatto' },
  { testo: 'Multa di 40 BP: il furgone dimostrativo era parcheggiato nello spazio riservato agli esaminatori' },
  { testo: 'Il cloud provider AWS vi riconosce un credito per il disservizio: incassate 125 BP' },
  { testo: 'Donate 50 BP al fondo per gli incidenti autostradali' },
  { testo: 'La build critica finisce in produzione senza revisione: andate direttamente in Riunione, senza passare da «Avvio sprint!»' },
  { testo: "Un cliente arrabbiato vi sequestra nella sua autoscuola. Gli fate causa e venite rimborsati di 150 BP" },
];
