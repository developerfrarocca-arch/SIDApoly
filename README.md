# SIDApoly — Il Monopoli d'Ufficio

Generatore della plancia stampabile del Monopoli in versione SIDA Autosoft Multimedia:
un foglio A3 orizzontale con il tabellone da 40 caselle e il pannello del regolamento.

Le caselle non sono scritte a mano nell'HTML: sono generate da un file di dati
([`src/dati/caselle.ts`](src/dati/caselle.ts)), così per cambiare un nome o un prezzo
si modifica una riga sola e non si toccano griglia e rotazioni.

## Requisiti

- **Node.js 20.19+** (o 22.12+) — verifica con `node --version`
- Un browser Chromium (Chrome o Edge) per la stampa

## Avvio rapido

Installa le dipendenze la prima volta:

```bash
npm install
```

Avvia il server di sviluppo, con ricarica automatica a ogni salvataggio:

```bash
npm run dev
```

Poi apri **http://localhost:5173**.

> **Nota:** `index.html` nella radice **non** si apre col doppio clic. Carica TypeScript
> come modulo ES e il browser lo blocca dal protocollo `file://`. Per aprire la plancia
> senza server usa `npm run build` e apri `dist/index.html` (vedi sotto).

## Stampare la plancia

Dal browser: **Ctrl+P**, poi in "Altre impostazioni":

| Impostazione | Valore |
|---|---|
| Formato | **A3** |
| Orientamento | **Orizzontale** |
| Margini | **Nessuno** |
| Scala | **100%** (non "Adatta all'area stampabile") |
| Grafica di sfondo | **Attiva** |

L'ultima voce è la più importante: senza di essa Chrome scarta tutti i fondini colorati
delle caselle e il tabellone esce in bianco e nero.

I nomi delle caselle sono `contenteditable`: puoi correggerli cliccandoci sopra
direttamente nella pagina, subito prima di stampare. **Le modifiche fatte così non
vengono salvate**: se ricarichi la pagina tornano i valori del file di dati. Per renderle
permanenti modifica [`src/dati/caselle.ts`](src/dati/caselle.ts).

## Comandi

| Comando | Cosa fa |
|---|---|
| `npm run dev` | Server di sviluppo su http://localhost:5173 con ricarica automatica |
| `npm test` | Esegue i test una volta |
| `npm run test:watch` | Test in watch mode, si rilanciano a ogni salvataggio |
| `npm run build` | Controlla i tipi e genera `dist/` |
| `npm run preview` | Serve `dist/` in locale, per controllarlo prima di distribuirlo |

`npm run build` fa `tsc --noEmit` **prima** di buildare: se un dato è incoerente
(un colore di gruppo inesistente, un campo mancante) la build si ferma invece di
produrre una plancia sbagliata.

## Distribuire o stampare da un altro PC

```bash
npm run build
```

Genera la cartella `dist/`, autosufficiente e con percorsi relativi: `dist/index.html`
**si apre col doppio clic**, senza Node e senza server. È la cartella da copiare su
una chiavetta o da mandare a un collega — va copiata tutta, non il solo HTML.

## Struttura

```
index.html                    pagina: toolbar, centro del tabellone, pannello regole
src/main.ts                   entry: importa il CSS e monta le caselle
src/dati/caselle.ts           le 40 caselle e i loro tipi  <-- il file da modificare
src/render/tabellone.ts       genera il markup e calcola posizione/rotazione
src/render/tabellone.test.ts  test
src/css/tabellone.css         stile, in millimetri, con le regole @page per la stampa
public/resources/             immagini, copiate in dist/ senza rinomina
```

## Modificare il tabellone

Tutto sta in [`src/dati/caselle.ts`](src/dati/caselle.ts), un array di 40 elementi in
senso orario a partire dall'angolo "Avvio sprint!" (indice 0). Ci sono quattro tipi
di casella:

```ts
{ tipo: "angolo",    icona: "☕", nome: "Pausa caffè", sotto: "Sosta gratuita" }
{ tipo: "proprieta", gruppo: "red", reparto: "Didattica", nome: "Aula", prezzo: 220 }
{ tipo: "speciale",  icona: "📡", nome: "Fastweb", prezzo: 200 }
{ tipo: "carta",     icona: "🎲", nome: "Imprevisti" }
```

- `prezzo` numerico viene stampato come `"220 BP"`; se serve un testo diverso si passa
  una stringa, es. `prezzo: "Paga 200 BP"`.
- `gruppo` accetta solo gli otto colori del tabellone (`brown`, `lightblue`, `pink`,
  `orange`, `red`, `yellow`, `green`, `darkblue`): un valore sbagliato è un errore
  di compilazione, non una casella grigia.
- `tipo: "carta"` è una speciale senza prezzo (Imprevisti, Probabilità): il contenuto
  viene centrato verticalmente al posto di allineare l'importo in basso.

Posizione nella griglia e rotazione del testo sono calcolate dall'indice, quindi non
vanno indicate. Se aggiungi o togli caselle, però, salta la geometria del perimetro:
il tabellone è pensato per esattamente 40 posizioni.

I nomi dei gruppi colore (`Store`, `Simulatori`, `Consulenza`, `Trasporti`, `Didattica`,
`Servizi`, `Gestionale`, `Infrastruttura`) compaiono anche nella legenda dentro
[`index.html`](index.html): se li rinomini, allineali in entrambi i posti.

## Cambiare la foto centrale

Metti l'immagine in `public/resources/` e aggiorna il `src` dell'`<img class="team-photo">`
in [`index.html`](index.html). Il riquadro è quadrato e ruotato di 45°, con
`object-fit: cover`: un'immagine 4:3 viene quindi tagliata ai lati. Se il soggetto
risulta scentrato, ritocca `object-position` nella regola `.team-photo` di
[`src/css/tabellone.css`](src/css/tabellone.css).

## Test

```bash
npm test
```

Coprono tre cose:

1. **La geometria** — tutte e 40 le caselle cadono sul perimetro della griglia 11×11,
   nessuna si sovrappone, gli angoli non ruotano e ogni lato ha la rotazione giusta.
2. **I dati** — 4 angoli, 22 proprietà, 8 speciali e 6 caselle carta; i gruppi colore
   hanno le dimensioni del Monopoli classico (2-3-3-3-3-3-3-2); la scala dei prezzi
   è quella del tabellone originale; nessun campo vuoto.
3. **Il markup generato** — l'escape dell'HTML, la formattazione dei prezzi e una
   **firma del tabellone completo** (classi, posizione in griglia e testo di ogni cella).
   Quella firma è stata catturata dalla versione statica approvata: se un refactor
   cambia anche una sola cella, il test fallisce. È la rete di sicurezza che permette
   di rimaneggiare il renderer senza ristampare per controllare.

## Da fare

- Fogli di stampa per i mazzi Imprevisti e Probabilità
- Cartellini delle proprietà (generabili dagli stessi dati: servono le tabelle dei canoni)
