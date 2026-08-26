/* Genera le carte contratto (le "carte proprietà" del Monopoli classico)
   a partire dalle caselle del tabellone e dai canoni in src/dati/contratti.ts.
   Come per il tabellone, le funzioni sono pure tranne montaContratti:
   così il foglio stampabile è verificabile senza aprire il browser. */

import { CASELLE, type Casella, type Proprieta, type Speciale } from '../dati/caselle';
import {
  CANONI_CONSULENZA,
  CONTRATTI,
  INDICI_CONSULENZA,
  INDICI_SERVIZI,
  IPOTECA_CONSULENZA,
  IPOTECA_SERVIZIO,
  MOLTIPLICATORE_SERVIZI,
  MOLTIPLICATORE_SERVIZIO,
  type DatiContratto,
} from '../dati/contratti';
import { esc } from './tabellone';

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
 * Oltre questa lunghezza il nome viene stampato più piccolo, per restare su una
 * riga sola: "SIDA Drive Controller" (21 caratteri) è il nome più lungo che la
 * carta riesce a contenere, vedi il test sulla larghezza dei nomi.
 */
const NOME_LUNGO = 18;

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

/** 260 -> "260 BP". */
export function bp(v: number): string {
  return `${numero(v)} BP`;
}

/** Riga dei canoni: etichetta a sinistra, descrizione, importo a destra. */
function riga(chiave: string, voce: string, valore: string): string {
  return (
    `<tr><th>${esc(chiave)}</th><td>${esc(voce)}</td><td class="v">${esc(valore)}</td></tr>`
  );
}

/** Intestazione comune a tutte le carte: valore, fascia colorata, nome, reparto. */
function testa(valore: string, nome: string, sotto: string): string {
  const classe = nome.length > NOME_LUNGO ? 'title lungo' : 'title';
  return (
    `<div class="value">Questo contratto vale <b>${esc(valore)}</b></div>` +
    '<header class="head">' +
    '<div class="kind">Contratto</div>' +
    `<h2 class="${classe}">${esc(nome)}</h2>` +
    `<div class="dept">${esc(sotto)}</div>` +
    '</header>'
  );
}

/** Piede comune: valore ipotecario con la linea puntinata del Monopoli classico. */
function ipoteca(v: number): string {
  return (
    '<div class="mortgage"><span>Valore ipotecario</span>' +
    `<span class="dots"></span><b>${esc(bp(v))}</b></div>`
  );
}

/** Il valore ipotecario di una carta, qualunque sia il suo tipo. */
export function ipotecaCarta(c: Contratto): number {
  if (c.tipo === 'proprieta') return c.dati.ipoteca;
  return c.tipo === 'consulenza' ? IPOTECA_CONSULENZA : IPOTECA_SERVIZIO;
}

/** Corpo della carta di una casella prodotto/servizio. */
export function corpoProprieta({ canoni, costoAggiornamento, ipoteca: mutuo }: DatiContratto): string {
  const [uno, due, tre, quattro] = canoni.aggiornamenti;
  const righe =
    riga('Canone', 'solo licenza', bp(canoni.solo)) +
    riga('»', 'con 1 Aggiornamento', numero(uno)) +
    riga('»', 'con 2 Aggiornamenti', numero(due)) +
    riga('»', 'con 3 Aggiornamenti', numero(tre)) +
    riga('»', 'con 4 Aggiornamenti', numero(quattro)) +
    riga('»', 'con Major Release', numero(canoni.release));
  return (
    `<table class="rents"><tbody>${righe}</tbody></table>` +
    '<p class="rule">Se un giocatore possiede tutte le caselle della stessa ' +
    '<b>Linea di business</b> (colore), il canone della sola licenza viene raddoppiato.</p>' +
    '<table class="costs"><tbody>' +
    `<tr><th>Costo di ogni Aggiornamento</th><td class="v">${esc(bp(costoAggiornamento))}</td></tr>` +
    `<tr><th>» di una Major Release</th><td class="v">${esc(bp(costoAggiornamento))}</td></tr>` +
    '<tr><td class="plus" colspan="2">più 4 Aggiornamenti</td></tr>' +
    '</tbody></table>' +
    ipoteca(mutuo)
  );
}

/** Corpo della carta Consulenza (le "stazioni"). */
export function corpoConsulenza(): string {
  const [uno, due, tre, quattro] = CANONI_CONSULENZA;
  const righe =
    riga('Canone', 'una sola casella', bp(uno)) +
    riga('»', 'con 2 caselle Consulenza', numero(due)) +
    riga('»', 'con 3 caselle Consulenza', numero(tre)) +
    riga('»', 'con 4 caselle Consulenza', numero(quattro));
  return (
    `<table class="rents"><tbody>${righe}</tbody></table>` +
    '<p class="rule">Il canone <b>raddoppia</b> per ogni casella Consulenza in più ' +
    'posseduta dallo stesso giocatore.</p>' +
    ipoteca(IPOTECA_CONSULENZA)
  );
}

/** Corpo della carta Enel / Impianto clima (le "società"). */
export function corpoServizio(): string {
  return (
    '<div class="dice">' +
    `<p class="rule">Se un giocatore possiede <b>una sola</b> casella servizio, il canone è pari a <b>${MOLTIPLICATORE_SERVIZIO} volte</b> il numero mostrato dai dadi.</p>` +
    `<p class="rule">Se possiede <b>entrambe</b> le caselle servizio, il canone è pari a <b>${MOLTIPLICATORE_SERVIZI} volte</b> il numero mostrato dai dadi.</p>` +
    '</div>' +
    ipoteca(IPOTECA_SERVIZIO)
  );
}

/** Le classi CSS della carta: colore della linea di business o fascia neutra. */
export function classiCarta(c: Contratto): string {
  if (c.tipo !== 'proprieta') return 'contract g-societa';
  const scuri = ['brown', 'darkblue'];
  const cl = ['contract', `g-${c.casella.gruppo}`];
  if (scuri.includes(c.casella.gruppo)) cl.push('scuro');
  return cl.join(' ');
}

/** Il markup di una singola carta contratto. */
export function htmlContratto(c: Contratto): string {
  const prezzo = typeof c.casella.prezzo === 'number' ? bp(c.casella.prezzo) : String(c.casella.prezzo);
  const sotto =
    c.tipo === 'proprieta'
      ? c.casella.reparto
      : c.tipo === 'consulenza'
        ? `${c.casella.icona} Referente di zona`
        : `${c.casella.icona} Servizi di sede`;
  const corpo =
    c.tipo === 'proprieta'
      ? corpoProprieta(c.dati)
      : c.tipo === 'consulenza'
        ? corpoConsulenza()
        : corpoServizio();
  return (
    `<article class="${classiCarta(c)}" data-casella="${c.indice}">` +
    testa(prezzo, c.casella.nome, sotto) +
    `<div class="body">${corpo}</div>` +
    '</article>'
  );
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

/** Il foglio di fronti n. n (0-based) di un gruppo di carte. */
function htmlFoglioFronte(foglio: readonly Contratto[], n: number): string {
  return (
    '<section class="sheet">' +
    `<div class="sheet-grid">${foglio.map(htmlContratto).join('')}</div>` +
    `<div class="sheet-foot">Il Monopoli di SIDA — SIDA Autosoft Multimedia · foglio ${n + 1}</div>` +
    '</section>'
  );
}

/** Il markup di tutti i fogli di contratti. */
export function htmlContratti(
  carte: readonly Contratto[] = contratti(),
  perFoglio = CARTE_PER_FOGLIO,
): string {
  return fogli(carte, perFoglio)
    .map(htmlFoglioFronte)
    .join('');
}

/** Inserisce i fogli di contratti nel contenitore della pagina. */
export function montaContratti(
  root: HTMLElement,
  carte: readonly Contratto[] = contratti(),
  perFoglio = CARTE_PER_FOGLIO,
): void {
  root.insertAdjacentHTML('beforeend', htmlContratti(carte, perFoglio));
}

/**
 * Il retro della carta: come nel Monopoli classico riporta il nome e l'importo
 * dell'ipoteca, e si gira da questo lato quando il contratto è ipotecato.
 * Essendo specifico della carta, ogni retro va abbinato al proprio fronte.
 */
export function htmlRetroCarta(c: Contratto): string {
  return (
    `<article class="contract-back" data-casella="${c.indice}">` +
    '<div class="back-box">' +
    '<div class="back-title">Ipotecato</div>' +
    `<div class="back-name">${esc(c.casella.nome)}</div>` +
    '<div class="back-amount"><span>Importo ipoteca</span>' +
    `<b>${esc(bp(ipotecaCarta(c)))}</b></div>` +
    '<div class="back-star">★</div>' +
    '<p class="back-note">Il contratto deve essere girato da questo lato ' +
    'se è ipotecato.</p>' +
    '</div>' +
    '</article>'
  );
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

/**
 * Il foglio di retro n. n (0-based), con lo stesso numero di carte del foglio
 * di fronti. Con `speculare` le righe vengono rovesciate, per la stampa
 * fronte-retro; senza, l'ordine resta quello dei fronti (pile separate).
 */
function htmlFoglioRetro(
  foglio: readonly Contratto[],
  n: number,
  speculare = false,
): string {
  const carte: (Contratto | null)[] = speculare ? specchiaRighe(foglio) : [...foglio];
  const celle = carte
    .map((c) => (c ? htmlRetroCarta(c) : '<div class="back-vuoto"></div>'))
    .join('');
  return (
    '<section class="sheet sheet-retro">' +
    `<div class="sheet-grid">${celle}</div>` +
    `<div class="sheet-foot">Il Monopoli di SIDA — SIDA Autosoft Multimedia · retro ${n + 1}</div>` +
    '</section>'
  );
}

/** Il markup di tutti i fogli di retro, uno per ogni foglio di fronti. */
export function htmlRetri(
  carte: readonly Contratto[] = contratti(),
  perFoglio = CARTE_PER_FOGLIO,
): string {
  return fogli(carte, perFoglio)
    .map((foglio, n) => htmlFoglioRetro(foglio, n))
    .join('');
}

/** Inserisce i fogli di retro nel contenitore della pagina. */
export function montaRetri(
  root: HTMLElement,
  carte: readonly Contratto[] = contratti(),
  perFoglio = CARTE_PER_FOGLIO,
): void {
  root.insertAdjacentHTML('beforeend', htmlRetri(carte, perFoglio));
}

/**
 * Il markup dei fogli con fronte e retro alternati (foglio 1 fronte, foglio 1
 * retro, foglio 2 fronte, ...): usando la stampa fronte-retro del browser
 * (bordo lungo), ogni foglio fisico esce già con fronte e retro allineati,
 * senza bisogno di tagliare due pile separate.
 */
export function htmlContrattiFronteRetro(
  carte: readonly Contratto[] = contratti(),
  perFoglio = CARTE_PER_FOGLIO,
): string {
  return fogli(carte, perFoglio)
    .map((foglio, n) => htmlFoglioFronte(foglio, n) + htmlFoglioRetro(foglio, n, true))
    .join('');
}

/** Inserisce i fogli con fronte e retro alternati nel contenitore della pagina. */
export function montaContrattiFronteRetro(
  root: HTMLElement,
  carte: readonly Contratto[] = contratti(),
  perFoglio = CARTE_PER_FOGLIO,
): void {
  root.insertAdjacentHTML('beforeend', htmlContrattiFronteRetro(carte, perFoglio));
}
