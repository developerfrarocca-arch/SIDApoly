/* Two card sizes, chosen in the sidebar:
   - 58x38mm, the size that goes with the board printed on one A3;
   - 64x42mm, the size of the deck slots on the big board split over two A3
     (see the "Plancia grande su due A3" section of board.css). The big cards
     have a 3mm gap between them for easier cutting. */

import { useState } from 'react';
import { Option, Panel, Sidebar } from '../components/Sidebar';
import { DeckCard } from '../components/cards/DeckCard';
import { FOOTER_SIGNATURE, Sheet } from '../components/Sheet';
import { CARDS_PER_SHEET, deckCards, sheetsPerDeck } from '../model/cards';

function howToPrint(big: boolean) {
  return (
    <>
      <p>
        Carte a una faccia, <b>un mazzo per foglio</b>: stampa ogni foglio sul suo cartoncino e taglia lungo i bordi.
        Formato <b>A4 verticale</b>.
      </p>
      <p>
        {big ? (
          <>
            Carte da <b>64×42 mm</b>, distanziate di 3 mm: si taglia lungo il bordo nero di ogni carta. È la misura
            degli spazi dei mazzi sulla <b>plancia grande su due A3</b>.
          </>
        ) : (
          <>
            Carte da <b>58×38 mm</b>, distanziate di 4 mm: si taglia lungo il bordo nero di ogni carta. È la misura che
            va con la plancia su <b>un foglio A3</b>.
          </>
        )}
      </p>
    </>
  );
}

export function Cards() {
  const [coloredBackground, setColoredBackground] = useState(true);
  const [big, setBig] = useState(false);
  const sheets = sheetsPerDeck(deckCards(), CARDS_PER_SHEET);
  const classes = ['app', coloredBackground ? '' : 'senza-sfondo', big ? 'carte-grandi' : ''].filter(Boolean);

  return (
    <div className={classes.join(' ')}>
      <Sidebar currentPage="cards" pageTitle="Imprevisti e Probabilità" printLabel="Stampa tutto">
        <Panel title="Opzioni">
          <Option
            label="Carte grandi (64×42 mm)"
            checked={big}
            onChange={setBig}
            hint="La misura degli spazi dei mazzi sulla plancia grande su due A3. Restano 18 carte a foglio, distanziate di 3 mm per facilitarne il taglio."
          />
          <Option
            label="Sfondo colorato"
            checked={coloredBackground}
            onChange={setColoredBackground}
            hint="Togli la spunta se stampi su cartoncino già colorato: le carte escono senza fondo."
          />
        </Panel>
        <Panel title="Come stampare">{howToPrint(big)}</Panel>
      </Sidebar>

      <main className="app-main">
        <div className="sheets">
          {sheets.map((sheet, n) => (
            <Sheet
              key={n}
              deck={sheet[0]?.deck.id}
              footer={`${FOOTER_SIGNATURE} · ${sheet[0]?.deck.name ?? ''} · foglio ${n + 1}`}
            >
              {sheet.map((card) => (
                <DeckCard key={`${card.deck.id}-${card.index}`} card={card} />
              ))}
            </Sheet>
          ))}
        </div>
      </main>
    </div>
  );
}
