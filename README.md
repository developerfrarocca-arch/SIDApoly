# SIDApoly — Il Monopoli d'Ufficio

Generatore delle stampe del Monopoli in versione SIDA Autosoft Multimedia. Quattro pagine:

- **`index.html`** — la plancia: un foglio A3 orizzontale con il tabellone da 40 caselle
  e il pannello del regolamento.
- **`contratti.html`** — i contratti delle proprietà: 28 carte in stile Monopoli classico
  (22 prodotti/servizi, 4 Fastweb, 2 caselle servizio) su 4 fogli A4 verticali da ritagliare.
- **`carte.html`** — i mazzi Probabilità e Imprevisti: 32 carte orizzontali (16 per mazzo,
  58×38mm, proporzioni dei due segnaposto al centro della plancia) su 2 fogli A4
  verticali, più i retri (un colore pieno per mazzo).
- **`banconote.html`** — le banconote dei Buoni Pasto: 7 tagli, 10 banconote a foglio.

Si passa da una all'altra coi link nella toolbar in alto.

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

## Stampare

Dal browser: **Ctrl+P**, poi in "Altre impostazioni":

| Impostazione | Plancia (`index.html`) | Contratti (`contratti.html`) / Carte (`carte.html`) / Banconote (`banconote.html`) |
|---|---|---|
| Formato | **A3** | **A4** |
| Orientamento | **Orizzontale** | **Verticale** |
| Margini | **Nessuno** | **Nessuno** |
| Scala | **100%** (non "Adatta all'area stampabile") | **100%** |
| Grafica di sfondo | **Attiva** | **Attiva** |

L'ultima voce è la più importante: senza di essa Chrome scarta tutti i fondini colorati
delle caselle e delle carte, e la stampa esce in bianco e nero.

Le carte contratto misurano 60×88 mm e sono già distanziate di 4 mm: si taglia lungo
il bordo nero di ogni carta.

I nomi delle caselle e delle carte sono `contenteditable`: puoi correggerli cliccandoci sopra
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

Genera la cartella `dist/`, autosufficiente e con percorsi relativi: `dist/index.html`,
`dist/contratti.html`, `dist/carte.html` e `dist/banconote.html` **si aprono col doppio
clic**, senza Node e senza server, e i link della toolbar continuano a funzionare. È la
cartella da copiare su una chiavetta o da mandare a un collega — va copiata tutta, non
il solo HTML.

## Struttura

```
index.html                    pagina plancia: toolbar, centro del tabellone, regole
contratti.html                pagina contratti: solo toolbar e contenitore dei fogli
carte.html                    pagina carte Probabilità/Imprevisti: toolbar e contenitori fronti/retri
banconote.html                pagina banconote: solo toolbar e contenitore dei fogli
src/main.ts                   entry plancia: importa il CSS e monta le caselle
src/contratti.ts              entry contratti: importa il CSS e monta le carte
src/carte.ts                  entry carte: importa il CSS e monta fronti e retri dei due mazzi
src/dati/caselle.ts           le 40 caselle e i loro tipi  <-- il file da modificare
src/dati/contratti.ts         canoni, costo Aggiornamenti e ipoteche, per indice di casella
src/dati/carte.ts             i testi delle 16+16 carte Probabilità e Imprevisti
src/render/tabellone.ts       genera il markup e calcola posizione/rotazione
src/render/contratti.ts       genera le carte contratto e le impagina 9 per foglio
src/render/carte.ts           genera fronti e retri dei mazzi Probabilità/Imprevisti, 9 per foglio
src/render/*.test.ts          test
src/css/comune.css            palette, reset e toolbar: condivisi da tutte le pagine
src/css/tabellone.css         stile della plancia, in mm, con le @page per l'A3
src/css/contratti.css         stile delle carte contratto, in mm, con le @page per l'A4
src/css/carte.css             stile delle carte Probabilità/Imprevisti, in mm, con le @page per l'A4
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

I nomi dei gruppi colore (`Configurazione`, `Formazione`, `Web`, `Mobile`, `Didattica`,
`Simulatori`, `Ufficio`, `Sportello`) compaiono anche nella legenda dentro
[`index.html`](index.html): se li rinomini, allineali in entrambi i posti.

## Modificare i contratti

Le carte prendono nome, reparto, colore e prezzo d'acquisto da `src/dati/caselle.ts`:
se rinomini un prodotto sul tabellone, la sua carta si aggiorna da sola.

Canoni, costo degli Aggiornamenti e valore ipotecario stanno invece in
[`src/dati/contratti.ts`](src/dati/contratti.ts), indicizzati per **numero di casella**
(non per colore: nel Monopoli originale i canoni dipendono dalla posizione):

```ts
26: { canoni: { solo: 22, aggiornamenti: [110, 330, 800, 975], release: 1150 },
      costoAggiornamento: 150, ipoteca: 130 },
```

- `solo` è il canone della licenza senza migliorie, `aggiornamenti` i quattro canoni
  con 1-4 Aggiornamenti (le "case"), `release` quello con la Major Release (l'"albergo").
- Se aggiungi una casella `proprieta` al tabellone senza darle un contratto, la pagina
  si ferma con un errore esplicito invece di stampare una carta vuota.
- Fastweb (le "stazioni") e Enel / Impianto clima (le "società") hanno canoni fissi,
  in fondo allo stesso file, e sono agganciate agli indici `INDICI_FASTWEB` e
  `INDICI_SERVIZI`: se le sposti sul tabellone, aggiorna quelle due liste.

## Modificare le carte Probabilità/Imprevisti

I testi stanno in [`src/dati/carte.ts`](src/dati/carte.ts), due liste separate
(`CARTE_PROBABILITA` e `CARTE_IMPREVISTI`) di 16 elementi ciascuna: per cambiare, aggiungere
o togliere una carta basta modificare quella lista, senza toccare il renderer. Ogni carta
è solo testo (`{ testo: "..." }`): l'effetto lo applicano i giocatori a voce, come nel
Monopoli classico non c'è nessuna logica da eseguire in automatico.

Il retro è uguale per tutte le carte dello stesso mazzo (un colore pieno, come le carte
proprietà del Monopoli classico), quindi non serve abbinare un fronte preciso al suo
retro: si tagliano le due pile separatamente, basta non mescolare i retri dei due mazzi.

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

Per la plancia coprono tre cose:

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

Per i contratti: c'è una carta per ogni casella acquistabile e nessuna di troppo, i canoni
crescono sempre dal solo servizio alla Major Release, l'ipoteca è la metà del prezzo
d'acquisto, il canone Fastweb raddoppia a ogni casella in più, e le 28 carte finiscono
su 4 fogli senza perderne nessuna.

Per le carte Probabilità/Imprevisti: 16 carte per mazzo, il retro non dipende dal
contenuto della singola carta ma solo dal mazzo, e ogni retro corrisponde al mazzo
della carta nella stessa posizione sul fronte, foglio per foglio.
