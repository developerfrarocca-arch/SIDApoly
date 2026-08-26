/* Two ways of printing:
   - separate piles: all the fronts first, then all the backs, in the same order;
   - duplex: front and back of the same sheet one after the other, with the
     back's columns mirrored because flipping the sheet on its long edge turns
     the first column into the last one. */

import { Fragment, useState } from 'react';
import { Option, Panel, Sidebar } from '../components/Sidebar';
import { ContractCard } from '../components/contracts/ContractCard';
import { ContractBack, EmptyCell } from '../components/contracts/ContractBack';
import { FOOTER_SIGNATURE, Sheet } from '../components/Sheet';
import {
  CARDS_PER_SHEET,
  contracts,
  mirrorRows,
  sheetsOf,
  type Contract,
} from '../model/contracts';

const SEPARATE_PILES_INSTRUCTIONS = (
  <>
    Stampa prima i <b>fronti</b>, poi su un altro pacco di fogli i <b>retri</b>: ogni retro riporta
    il nome della sua carta, quindi va abbinato al fronte corrispondente — i due fogli hanno le
    carte nello stesso ordine. Formato <b>A4 verticale</b>.
  </>
);

const DUPLEX_INSTRUCTIONS = (
  <>
    Nella finestra di stampa attiva <b>Stampa fronte e retro</b> (bordo lungo): fronte e retro di
    ogni foglio combaceranno da soli, senza bisogno di abbinarli dopo il taglio. Formato{' '}
    <b>A4 verticale</b>.
  </>
);

function FrontSheet({ cards, number }: { cards: readonly Contract[]; number: number }) {
  return (
    <Sheet footer={`${FOOTER_SIGNATURE} · foglio ${number + 1}`}>
      {cards.map((card) => (
        <ContractCard key={card.index} card={card} />
      ))}
    </Sheet>
  );
}

function BackSheet({
  cards,
  number,
  mirrored,
}: {
  cards: readonly Contract[];
  number: number;
  mirrored: boolean;
}) {
  const cells = mirrored ? mirrorRows(cards) : [...cards];
  return (
    <Sheet extraClass="sheet-retro" footer={`${FOOTER_SIGNATURE} · retro ${number + 1}`}>
      {cells.map((card, i) =>
        card ? <ContractBack key={card.index} card={card} /> : <EmptyCell key={`empty-${i}`} />,
      )}
    </Sheet>
  );
}

export function ContractSheets({ duplex }: { duplex: boolean }) {
  const sheets = sheetsOf(contracts(), CARDS_PER_SHEET);
  if (duplex) {
    return (
      <div className="sheets">
        {sheets.map((cards, n) => (
          <Fragment key={n}>
            <FrontSheet cards={cards} number={n} />
            <BackSheet cards={cards} number={n} mirrored />
          </Fragment>
        ))}
      </div>
    );
  }
  return (
    <>
      <div className="sheets">
        {sheets.map((cards, n) => (
          <FrontSheet key={n} cards={cards} number={n} />
        ))}
      </div>
      <div className="sheets-divider">Retro delle carte — uno per carta, da stampare a parte</div>
      <div className="sheets">
        {sheets.map((cards, n) => (
          <BackSheet key={n} cards={cards} number={n} mirrored={false} />
        ))}
      </div>
    </>
  );
}

export function Contracts() {
  const [duplex, setDuplex] = useState(false);

  return (
    <div className="app">
      <Sidebar
        currentPage="contracts"
        pageTitle="Contratti delle proprietà"
        printLabel="Stampa tutto"
      >
        <Panel title="Opzioni">
          <Option label="Stampa fronte-retro allineata" checked={duplex} onChange={setDuplex} />
        </Panel>
        <Panel title="Come stampare">
          <p>{duplex ? DUPLEX_INSTRUCTIONS : SEPARATE_PILES_INSTRUCTIONS}</p>
        </Panel>
      </Sidebar>

      <main className="app-main">
        <ContractSheets duplex={duplex} />
      </main>
    </div>
  );
}
