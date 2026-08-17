/* Genera le carte contratto (le "carte proprietà" del Monopoli classico)
   a partire dalle caselle del tabellone e dai canoni in src/dati/contratti.ts.
   Come per il tabellone, le funzioni sono pure tranne montaContratti:
   così il foglio stampabile è verificabile senza aprire il browser. */

import { CASELLE, type Casella, type Proprieta, type Speciale } from '../dati/caselle';
import {
  CANONI_FASTWEB,
  CONTRATTI,
  INDICI_FASTWEB,
  INDICI_SERVIZI,
  IPOTECA_FASTWEB,
  IPOTECA_SERVIZIO,
  MOLTIPLICATORE_SERVIZI,
  MOLTIPLICATORE_SERVIZIO,
  type DatiContratto,
} from '../dati/contratti';
import { esc } from './tabellone';

/** Una carta contratto: prodotto/servizio, casella Fastweb o casella servizio. */
export type Contratto =
  | { tipo: 'proprieta'; indice: number; casella: Proprieta; dati: DatiContratto }
  | { tipo: 'fastweb'; indice: number; casella: Speciale }
  | { tipo: 'servizio'; indice: number; casella: Speciale };

/** Carte per foglio A4 verticale: griglia 3x3. */
export const CARTE_PER_FOGLIO = 9;

/** Oltre questa lunghezza il nome viene stampato più piccolo per stare in due righe. */
const NOME_LUNGO = 16;

/**
 * Tutte le carte contratto, nell'ordine del tabellone:
 * le 22 caselle prodotto/servizio, le 4 Fastweb e le 2 caselle servizio.
 */
export function contratti(caselle: readonly Casella[] = CASELLE): Contratto[] {
  const carte: Contratto[] = [];
  for (const [indice, casella] of caselle.entries()) {
    if (casella.tipo === 'proprieta') {
      const dati = CONTRATTI[indice];
      if (!dati) throw new Error(`Manca il contratto della casella ${indice} (${casella.nome})`);
      carte.push({ tipo: 'proprieta', indice, casella, dati });
    } else if (casella.tipo === 'speciale' && INDICI_FASTWEB.includes(indice)) {
      carte.push({ tipo: 'fastweb', indice, casella });
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
    `<h2 class="${classe}" contenteditable="true">${esc(nome)}</h2>` +
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

/** Corpo della carta Fastweb (le "stazioni"). */
export function corpoFastweb(): string {
  const [uno, due, tre, quattro] = CANONI_FASTWEB;
  const righe =
    riga('Canone', 'una sola casella', bp(uno)) +
    riga('»', 'con 2 caselle Fastweb', numero(due)) +
    riga('»', 'con 3 caselle Fastweb', numero(tre)) +
    riga('»', 'con 4 caselle Fastweb', numero(quattro));
  return (
    `<table class="rents"><tbody>${righe}</tbody></table>` +
    '<p class="rule">Il canone <b>raddoppia</b> per ogni casella Fastweb in più ' +
    'posseduta dallo stesso giocatore.</p>' +
    ipoteca(IPOTECA_FASTWEB)
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
      : c.tipo === 'fastweb'
        ? `${c.casella.icona} Connettività`
        : `${c.casella.icona} Servizi di sede`;
  const corpo =
    c.tipo === 'proprieta'
      ? corpoProprieta(c.dati)
      : c.tipo === 'fastweb'
        ? corpoFastweb()
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

/** Il markup di tutti i fogli di contratti. */
export function htmlContratti(
  carte: readonly Contratto[] = contratti(),
  perFoglio = CARTE_PER_FOGLIO,
): string {
  return fogli(carte, perFoglio)
    .map(
      (foglio, n) =>
        '<section class="sheet">' +
        `<div class="sheet-grid">${foglio.map(htmlContratto).join('')}</div>` +
        `<div class="sheet-foot">Il Monopoli d'Ufficio — SIDA Autosoft Multimedia · foglio ${n + 1}</div>` +
        '</section>',
    )
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
