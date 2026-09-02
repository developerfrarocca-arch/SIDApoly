# SIDApoly — Il Monopoli di SIDA

Generatore delle stampe del Monopoli in versione SIDA Autosoft Multimedia. Quattro pagine:

- **`index.html`** — la plancia: un foglio A3 orizzontale con il tabellone da 40 caselle
  e il pannello del regolamento, oppure — con l'opzione **Plancia grande su due A3** —
  la stessa plancia quadrata di 40 cm divisa a metà su due A3 verticali da incollare,
  con il regolamento su un terzo foglio.
- **`contracts.html`** — i contratti delle proprietà: 28 carte in stile Monopoli classico
  (22 prodotti/servizi, 4 Consulenza, 2 caselle servizio) su 4 fogli A4 verticali da ritagliare.
- **`cards.html`** — i mazzi Probabilità e Imprevisti: 32 carte orizzontali (16 per mazzo,
  58×38mm, proporzioni dei due segnaposto al centro della plancia) su 2 fogli A4
  verticali, più i retri (un colore pieno per mazzo).
- **`money.html`** — le banconote dei Buoni Pasto: 7 tagli, 10 banconote a foglio.

Si passa da una all'altra coi link nella barra laterale a sinistra, che contiene anche
il pulsante di stampa e i controlli di zoom.

L'applicazione è in **React + TypeScript**, costruita con Vite. Le caselle non sono
scritte a mano nell'HTML: sono generate da un file di dati
([`src/data/spaces.ts`](src/data/spaces.ts)), così per cambiare un nome o un prezzo
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

| Impostazione      | Plancia (`index.html`)                      | Plancia su due A3 | Contratti / Carte / Banconote |
| ----------------- | ------------------------------------------- | ----------------- | ----------------------------- |
| Formato           | **A3**                                      | **A3**            | **A4**                        |
| Orientamento      | **Orizzontale**                             | **Verticale**     | **Verticale**                 |
| Margini           | **Nessuno**                                 | **Nessuno**       | **Nessuno**                   |
| Scala             | **100%** (non "Adatta all'area stampabile") | **100%**          | **100%**                      |
| Grafica di sfondo | **Attiva**                                  | **Attiva**        | **Attiva**                    |

L'ultima voce è la più importante: senza di essa Chrome scarta i fondini colorati delle
barre dei gruppi, dei cartellini prezzo e delle carte, e la stampa esce quasi tutta in
bianco e nero.

Lo zoom a schermo non influisce sulla stampa: `@media print` lo azzera con
`zoom:1 !important`, quindi la plancia esce sempre a grandezza reale.

### Plancia grande su due A3

L'opzione **Plancia grande su due A3** nella barra laterale sostituisce il foglio unico
con tre fogli **A3 verticali**: la metà sinistra della plancia, la metà destra e il
regolamento da solo. La plancia esce quadrata di **400 mm** — l'altezza di un A3 meno
1 cm di margine sopra e sotto — quindi ogni metà è larga 200 mm ed è accostata al lato
della cucitura: dopo la stampa si taglia lungo il **tratteggio** (1 cm di carta sul lato
da incollare) e si accostano le due metà. La divisione cade esattamente al centro, come
richiesto, quindi taglia in due la casella centrale del lato in alto e di quello in basso.

Gli spazi dei due mazzi al centro della plancia non seguono l'ingrandimento: sono fissati
a **64×42 mm** reali (orizzontali, come le carte), la misura a cui portare le carte
Imprevisti e Probabilità. Si cambiano da `--deck-w` / `--deck-h` in
[`src/css/board.css`](src/css/board.css).

La regola `@page` non sta nel CSS ma in [`src/pages/Board.tsx`](src/pages/Board.tsx): il
formato della carta cambia con l'opzione (A3 orizzontale o A3 verticale) e da CSS non si
potrebbe scegliere.

#### Tre trappole della stampa, se qualcuno tocca questo CSS

Quel che si vede a schermo non basta a garantire la stampa: la plancia grande ne ha
azzoppate tre, tutte corrette in [`src/css/board.css`](src/css/board.css) e da non
reintrodurre.

1. **`zoom` a schermo sì, in stampa no.** Chrome ignora `zoom` quando pagina per la
   stampa: la plancia usciva a 275 mm invece di 400 e il disegno del centro sbordava dal
   suo ritaglio. L'ingrandimento è quindi un `transform: scale`, e lo zoom "adatta alla
   finestra" arriva in `--screen-zoom`, usato solo dentro `@media screen` (`zoom: 1
!important` in `@media print` non bastava a fermarlo).
2. **Se qualcosa sporge a destra della pagina, Chrome rimpicciolisce tutto.** Una
   scatola larga 275 mm che parte a 87 mm dal bordo di un A3 verticale sporge, e la
   stampa usciva all'80% (32 cm invece di 40) senza alcun avviso. Per questo la scatola
   di layout della plancia è _parcheggiata_ a sinistra della finestra (`left: -275mm`) e
   riportata al suo posto dal `translateX`: il `transform` non tocca il layout, quindi
   niente sporge e la stampa esce a misura.
3. **`overflow: hidden` non ritaglia il contenuto trasformato.** Con la plancia
   ingrandita da un `transform`, in stampa il disegno del centro finiva sopra le caselle
   in basso e oltre la linea di taglio. Il ritaglio è quindi anche un `clip-path:
inset(0)`, che la stampa rispetta.

Come si verifica: stampa in PDF e **misura**. Un quadrato di 100 mm messo per prova nel
foglio deve uscire di 100 mm, e le caselle devono misurare 33,5 mm (49,5 mm gli angoli);
se escono più piccole è tornata la trappola 1 o la 2.

Le carte contratto misurano 60×88 mm e sono già distanziate di 4 mm: si taglia lungo
il bordo nero di ogni carta.

I nomi delle caselle e delle carte non sono modificabili dal browser: per cambiarli
modifica [`src/data/spaces.ts`](src/data/spaces.ts).

## Comandi

| Comando                | Cosa fa                                                             |
| ---------------------- | ------------------------------------------------------------------- |
| `npm run dev`          | Server di sviluppo su http://localhost:5173 con ricarica automatica |
| `npm test`             | Esegue i test una volta                                             |
| `npm run test:watch`   | Test in watch mode, si rilanciano a ogni salvataggio                |
| `npm run lint`         | ESLint su tutto il progetto                                         |
| `npm run lint:fix`     | Come sopra, correggendo il correggibile                             |
| `npm run format`       | Riformatta con Prettier                                             |
| `npm run format:check` | Verifica la formattazione senza modificare i file                   |
| `npm run build`        | Controlla i tipi e genera `dist/`                                   |
| `npm run preview`      | Serve `dist/` in locale, per controllarlo prima di distribuirlo     |

`npm run build` fa `tsc --noEmit` **prima** di buildare: se un dato è incoerente
(un colore di gruppo inesistente, un campo mancante) la build si ferma invece di
produrre una plancia sbagliata.

### Stile del codice

Prettier formatta TypeScript, HTML e Markdown; ESLint usa la flat config in
[`eslint.config.js`](eslint.config.js) con i preset di typescript-eslint e le regole
degli hook di React. Tre scelte da sapere prima di toccare la configurazione:

- **`src/css` è escluso da Prettier** ([`.prettierignore`](.prettierignore)), perché i
  fogli di stile erano scritti in stile compatto — dichiarazioni accorpate su una riga,
  misure in mm allineate in colonna — e Prettier li avrebbe esplosi. Attenzione: lo
  stile non è più uniforme, `board.css` e `common.css` sono stati riformattati espansi
  mentre `cards.css`, `contracts.css` e `money.css` sono ancora compatti. Se si sceglie
  lo stile espanso, la cosa pulita è togliere l'esclusione e lasciare uniformare tutto
  a Prettier.
- **`printWidth` è 120, non 100.** [`src/data/spaces.ts`](src/data/spaces.ts) è una
  tabella di 40 righe, una per casella, con l'indice in commento: a 100 colonne Prettier
  ne spezzerebbe più della metà distruggendo l'allineamento.
- **`endOfLine` è `auto`.** Il repository è su Windows con `core.autocrlf` attivo: forzare
  `lf` farebbe riscrivere ogni file a ogni formattazione.

La regola `react-hooks/preserve-manual-memoization` è disattivata: appartiene al React
Compiler, che qui non è configurato, e segnalava come errore il pattern corretto usato
in `useZoom.ts`. Il motivo è scritto nella config.

## Distribuire o stampare da un altro PC

```bash
npm run build
```

Genera la cartella `dist/`, autosufficiente e con percorsi relativi: `dist/index.html`,
`dist/contracts.html`, `dist/cards.html` e `dist/money.html` **si aprono col doppio
clic**, senza Node e senza server, e i link della barra laterale continuano a funzionare.
È la cartella da copiare su una chiavetta o da mandare a un collega — va copiata tutta,
non il solo HTML.

## Struttura

```
index.html                        pagina plancia (monta src/main.tsx)
contracts.html                    pagina contratti (monta src/contracts.tsx)
cards.html                        pagina carte Probabilità/Imprevisti (monta src/cards.tsx)
money.html                        pagina banconote (monta src/money.tsx)

src/main.tsx                      entry plancia
src/contracts.tsx                 entry contratti
src/cards.tsx                     entry carte
src/money.tsx                     entry banconote

src/data/spaces.ts                le 40 caselle e i loro tipi  <-- il file da modificare
src/data/contracts.ts             canoni, costo Aggiornamenti e ipoteche, per indice di casella
src/data/cards.ts                 i testi delle 16+16 carte Probabilità e Imprevisti
src/data/money.ts                 i 7 tagli delle banconote e i loro colori

src/model/board.ts                posizione e rotazione di ogni casella, formattazione prezzi
src/model/contracts.ts            costruisce le carte contratto dai dati delle caselle
src/model/cards.ts                impagina fronti e retri dei due mazzi
src/model/money.ts                genera le copie delle banconote e le impagina
src/model/*.test.tsx              test
src/zoom.ts                       aritmetica dello zoom, senza React
src/test/render.tsx               utility condivise dai test

src/pages/Board.tsx               compone tabellone, centro, legenda, controlli zoom e i fogli
                                  della stampa su due A3
src/pages/Contracts.tsx           fogli delle carte contratto
src/pages/Cards.tsx               fogli dei mazzi
src/pages/Money.tsx               fogli delle banconote

src/components/Sidebar.tsx        barra laterale: marchio, navigazione, stampa, opzioni
src/components/Nav.tsx            link fra le quattro pagine
src/components/Sheet.tsx          foglio A4 con piè di pagina, condiviso dalle stampe
src/components/board/Cell.tsx     una casella del perimetro
src/components/board/Center.tsx   centro della plancia: fascia del titolo, mazzi, targa
src/components/board/Legend.tsx   pannello regolamento, legenda colori, valuta, logo
src/components/board/useZoom.ts   hook dello zoom: adatta il foglio in uso alla finestra
src/components/board/ZoomControls.tsx   i pulsanti dello zoom
src/components/cards/DeckCard.tsx       una carta Probabilità/Imprevisti
src/components/contracts/ContractCard.tsx   fronte di una carta contratto
src/components/contracts/ContractBack.tsx   retro di una carta contratto
src/components/money/Bill.tsx           una banconota

src/css/common.css                palette, reset e barra laterale: condivisi da tutte le pagine
src/css/board.css                 stile della plancia, in mm, foglio unico e due A3
src/css/contracts.css             stile delle carte contratto, in mm, con le @page per l'A4
src/css/cards.css                 stile delle carte Probabilità/Imprevisti
src/css/money.css                 stile delle banconote

src/images/                       artwork del centro della plancia (importato dal CSS)
public/resources/                 logo e favicon, copiati in dist/ senza rinomina
```

## Colori

La palette sta in `:root` dentro [`src/css/common.css`](src/css/common.css). Quattro
variabili si somigliano ma hanno ruoli diversi, e vanno tenute distinte:

| Variabile     | Valore    | A cosa serve                                                        |
| ------------- | --------- | ------------------------------------------------------------------- |
| `--sida-blue` | `#004E90` | **colore aziendale ufficiale**: titolo del pannello, barra laterale |
| `--darkblue`  | `#28527A` | **colore di gioco**: linea di business "Sportello"                  |
| `--surface`   | `#FFFFFF` | fondo neutro di plancia, caselle e pannello regole                  |
| `--panel`     | `#FFFDF7` | bianco caldo, ormai solo base delle tinte in `cards.css`            |

`--darkblue` compare nei dati delle caselle come nome di gruppo e nei test: cambiarlo
ricolora un gruppo di proprietà del tabellone, non il marchio.

Il logo esiste in due file: [`logo-sida.svg`](public/resources/logo-sida.svg) nel nero
originale e `logo-sida-blue.svg` nel blu aziendale. Il colore è dentro l'SVG, quindi se
cambi `--sida-blue` va riallineato anche lì.

## Modificare il tabellone

Tutto sta in [`src/data/spaces.ts`](src/data/spaces.ts), un array di 40 elementi in
senso orario a partire dall'angolo "Avvio sprint!" (indice 0). Ci sono quattro tipi
di casella:

```ts
const esempi = [
  /* 20 */ { type: 'corner', icon: '☕', name: 'Pausa caffè', subtitle: 'Sosta gratuita' },
  /* 21 */ { type: 'property', group: 'red', department: 'Didattica', name: 'Manuale AeB', price: 550 },
  /* 25 */ { type: 'special', icon: '🧑‍💼', name: 'Consulenza Nord', price: 480 },
  /*  7 */ { type: 'card', icon: '🎲', name: 'Imprevisti' },
];
```

- `price` numerico viene stampato come `"220 BP"`; se serve un testo diverso si passa
  una stringa, es. `price: 'Paga 200 BP'`.
- `group` accetta solo gli otto colori del tabellone (`brown`, `lightblue`, `pink`,
  `orange`, `red`, `yellow`, `green`, `darkblue`): un valore sbagliato è un errore
  di compilazione, non una casella grigia.
- `type: 'card'` è una speciale senza prezzo (Imprevisti, Probabilità): il contenuto
  viene centrato verticalmente al posto di allineare l'importo in basso.

### Il Monopoli classico è l'autorità

Questo gioco è una reskin: dove i due divergono, **vince il tabellone originale**. In
particolare i gruppi colore stanno alle posizioni classiche — `brown` alle caselle 1 e 3
e `darkblue` alle 37 e 39 sono i due gruppi da 2 proprietà, gli altri sei ne hanno 3 —
e il test "respects the colour group sizes of the classic game" in
[`src/model/board.test.tsx`](src/model/board.test.tsx) lo verifica. Se sposti un reparto
su un altro colore, la legenda segue da sé; va invece ri-baselinata la firma del
tabellone (vedi la sezione Test).

Posizione nella griglia e rotazione del testo sono calcolate dall'indice da
[`src/model/board.ts`](src/model/board.ts), quindi non vanno indicate. Se aggiungi o
togli caselle, però, salta la geometria del perimetro: il tabellone è pensato per
esattamente 40 posizioni.

La legenda delle linee di business **non** ripete nulla a mano: reparti, nomi delle
caselle e ordine dei colori li ricava da `SPACES` tramite `businessLines()` in
[`src/model/board.ts`](src/model/board.ts). Se rinomini un reparto o una casella, o se
sposti un gruppo su un altro colore, la legenda si aggiorna da sé — compreso l'ordine,
che segue la prima comparsa di ogni colore sul tabellone.

## Modificare i contratti

Le carte prendono nome, reparto, colore e prezzo d'acquisto da `src/data/spaces.ts`:
se rinomini un prodotto sul tabellone, la sua carta si aggiorna da sola.

Canoni, costo degli Aggiornamenti e valore ipotecario stanno invece in
[`src/data/contracts.ts`](src/data/contracts.ts), indicizzati per **numero di casella**
(non per colore: nel Monopoli originale i canoni dipendono dalla posizione):

```ts
const esempio = {
  26: { rents: { bare: 55, upgrades: [275, 825, 2000, 2500], release: 3000 }, upgradeCost: 375, mortgage: 325 },
};
```

- `bare` è il canone della licenza senza migliorie, `upgrades` i quattro canoni
  con 1-4 Aggiornamenti (le "case"), `release` quello con la Major Release (l'"albergo").
- Se aggiungi una casella `property` al tabellone senza darle un contratto, la pagina
  si ferma con un errore esplicito invece di stampare una carta vuota.
- Le quattro caselle Consulenza (i referenti di zona Nord/Sud/Est/Ovest, le "stazioni")
  e Enel / Impianto clima (le "società") hanno canoni fissi, in fondo allo stesso file,
  e sono agganciate agli indici `CONSULTANT_INDEXES` e `UTILITY_INDEXES`: se le sposti
  sul tabellone, aggiorna quelle due liste.

## Modificare le carte Probabilità/Imprevisti

I testi stanno in [`src/data/cards.ts`](src/data/cards.ts), due liste separate
(`CHANCE_CARDS` per Probabilità e `CHEST_CARDS` per Imprevisti) di 16 elementi ciascuna:
per cambiare, aggiungere o togliere una carta basta modificare quella lista, senza
toccare il renderer. Ogni carta è solo testo (`{ text: '...' }`): l'effetto lo applicano
i giocatori a voce, come nel Monopoli classico non c'è nessuna logica da eseguire in
automatico.

Il retro è uguale per tutte le carte dello stesso mazzo (un colore pieno, come le carte
proprietà del Monopoli classico), quindi non serve abbinare un fronte preciso al suo
retro: si tagliano le due pile separatamente, basta non mescolare i retri dei due mazzi.

## Modificare le banconote

I tagli e i loro colori stanno in [`src/data/money.ts`](src/data/money.ts)
(`DENOMINATIONS`); `COPIES_PER_DENOMINATION` decide quante copie stampare per taglio,
`BILLS_PER_SHEET` in [`src/model/money.ts`](src/model/money.ts) quante ne stanno su un
foglio.

L'elenco dei tagli che compare a testo — nel regolamento della plancia e nelle istruzioni
di stampa della pagina banconote — **non è scritto a mano**: è `DENOMINATION_LIST` in
[`src/model/money.ts`](src/model/money.ts), derivato da `DENOMINATIONS`. Aggiungere o
togliere un taglio aggiorna da sé entrambi i testi.

## Cambiare l'immagine al centro della plancia

L'illustrazione al centro **non** è un `<img>`: è il `background-image` di
`.diagonal-card`, un quadrato ruotato di 45° dentro
[`src/css/board.css`](src/css/board.css), e il file sta in `src/images/`
(importato dal CSS, non da `public/`). Con `background-size: cover` un'immagine 4:3
viene tagliata ai lati: se il soggetto risulta scentrato, ritocca `background-position`
nella stessa regola.

Sul paraurti dell'auto c'è una targa col logo SIDA (`.license-plate`, in
[`src/components/board/Center.tsx`](src/components/board/Center.tsx)). È posizionata in
percentuale della card partendo dai pixel dell'artwork, quindi **se sostituisci
l'immagine la targa va riposizionata**. Il calcolo che lega pixel dell'immagine e
percentuali è spiegato nel commento sopra la regola `.license-plate` in `board.css`.

## Test

```bash
npm test
```

I test stanno accanto al modello, in `src/model/*.test.tsx`.

Per la plancia coprono tre cose:

1. **La geometria** — tutte e 40 le caselle cadono sul perimetro della griglia 11×11,
   nessuna si sovrappone, gli angoli non ruotano e ogni lato ha la rotazione giusta.
2. **I dati** — 4 angoli, 22 proprietà, 8 speciali e 6 caselle carta; i gruppi colore
   con le dimensioni e i colori del Monopoli classico, un solo reparto per gruppo, la
   scala dei prezzi del tabellone originale, nessun campo vuoto.
3. **Il markup generato** — l'escape dell'HTML, la formattazione dei prezzi e una
   **firma del tabellone completo** (classi, posizione in griglia e testo di ogni cella).
   Quella firma è stata catturata dalla versione statica approvata: se un refactor
   cambia anche una sola cella, il test fallisce. È la rete di sicurezza che permette
   di rimaneggiare il renderer senza ristampare per controllare. Va ri-baselinata solo
   quando la plancia cambia **di proposito**: in quel caso aggiorna lunghezza e hash e
   scrivi nel commento perché.

Per i contratti: c'è una carta per ogni casella acquistabile e nessuna di troppo, i canoni
crescono sempre dal solo servizio alla Major Release, l'ipoteca è la metà del prezzo
d'acquisto, il canone Consulenza raddoppia a ogni casella in più, e le 28 carte finiscono
su 4 fogli senza perderne nessuna.

Per le carte Probabilità/Imprevisti: 16 carte per mazzo, il retro non dipende dal
contenuto della singola carta ma solo dal mazzo, e ogni retro corrisponde al mazzo
della carta nella stessa posizione sul fronte, foglio per foglio.

La suite è verde: **86 test su 86**.
