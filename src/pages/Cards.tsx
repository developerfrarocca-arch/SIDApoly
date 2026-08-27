import { useState } from 'react';
import { Option, Panel, Sidebar } from '../components/Sidebar';
import { DeckCard } from '../components/cards/DeckCard';
import { FOOTER_SIGNATURE, Sheet } from '../components/Sheet';
import { CARDS_PER_SHEET, deckCards, sheetsPerDeck } from '../model/cards';

export function Cards() {
  const [coloredBackground, setColoredBackground] = useState(true);
  const sheets = sheetsPerDeck(deckCards(), CARDS_PER_SHEET);

  return (
    <div className={coloredBackground ? 'app' : 'app senza-sfondo'}>
      <Sidebar currentPage="cards" pageTitle="Imprevisti e Probabilità" printLabel="Stampa tutto">
        <Panel title="Opzioni">
          <Option
            label="Sfondo colorato"
            checked={coloredBackground}
            onChange={setColoredBackground}
            hint="Togli la spunta se stampi su cartoncino già colorato: le carte escono senza fondo."
          />
        </Panel>
        <Panel title="Come stampare">
          <p>
            Carte a una faccia, <b>un mazzo per foglio</b>: stampa ogni foglio sul suo cartoncino e taglia lungo i
            bordi. Formato <b>A4 verticale</b>.
          </p>
        </Panel>
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
