/* Two ways of printing:
   - separate piles: all the fronts first, then all the backs, in the same order;
   - duplex: front and back of the same sheet one after the other, with the
     back's columns mirrored to match the flip.
   Two paper sizes: A4 portrait (3x3, 9 cards/sheet) or A3 landscape (6x3, 18
   cards/sheet, two A4 grids side by side). The duplex flip edge differs
   between them: on A4 (portrait) the long edge of the sheet is vertical, so
   flipping on it mirrors columns left-right — on A3 landscape the long edge
   is horizontal instead, so getting the same column mirror requires flipping
   on the SHORT edge; see the instructions shown to the user, and the "page"
   rule in contracts.css. */

import { Fragment, useState } from 'react';
import { Option, Panel, Sidebar } from '../components/Sidebar';
import { ContractCard } from '../components/contracts/ContractCard';
import { ContractBack, EmptyCell } from '../components/contracts/ContractBack';
import { FOOTER_SIGNATURE, Sheet } from '../components/Sheet';
import {
  CARDS_PER_SHEET,
  CARDS_PER_SHEET_A3,
  COLUMNS,
  COLUMNS_A3,
  contracts,
  mirrorRows,
  sheetsOf,
  type Contract,
} from '../model/contracts';

function instructionsFor(duplex: boolean, a3: boolean) {
  const format = a3 ? 'A3 orizzontale' : 'A4 verticale';
  if (!duplex) {
    return (
      <>
        Stampa prima i <b>fronti</b>, poi su un altro pacco di fogli i <b>retri</b>: ogni retro riporta il nome della
        sua carta, quindi va abbinato al fronte corrispondente — i due fogli hanno le carte nello stesso ordine.
        Formato <b>{format}</b>.
      </>
    );
  }
  const edge = a3 ? 'corto' : 'lungo';
  return (
    <>
      Nella finestra di stampa attiva <b>Stampa fronte e retro</b> (bordo <b>{edge}</b>
      {a3 && <> — non quello lungo usato per l&apos;A4</>}): fronte e retro di ogni foglio combaceranno da soli, senza
      bisogno di abbinarli dopo il taglio. Formato <b>{format}</b>.
    </>
  );
}

function FrontSheet({ cards, number, a3 }: { cards: readonly Contract[]; number: number; a3: boolean }) {
  return (
    <Sheet extraClass={a3 ? 'sheet-a3' : undefined} footer={`${FOOTER_SIGNATURE} · foglio ${number + 1}`}>
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
  a3,
}: {
  cards: readonly Contract[];
  number: number;
  mirrored: boolean;
  a3: boolean;
}) {
  const cells = mirrored ? mirrorRows(cards, a3 ? COLUMNS_A3 : COLUMNS) : [...cards];
  const extraClass = a3 ? 'sheet-retro sheet-a3' : 'sheet-retro';
  return (
    <Sheet extraClass={extraClass} footer={`${FOOTER_SIGNATURE} · retro ${number + 1}`}>
      {cells.map((card, i) =>
        card ? <ContractBack key={card.index} card={card} /> : <EmptyCell key={`empty-${i}`} />,
      )}
    </Sheet>
  );
}

export function ContractSheets({ duplex, a3 = false }: { duplex: boolean; a3?: boolean }) {
  const sheets = sheetsOf(contracts(), a3 ? CARDS_PER_SHEET_A3 : CARDS_PER_SHEET);
  if (duplex) {
    return (
      <div className="sheets">
        {sheets.map((cards, n) => (
          <Fragment key={n}>
            <FrontSheet cards={cards} number={n} a3={a3} />
            <BackSheet cards={cards} number={n} mirrored a3={a3} />
          </Fragment>
        ))}
      </div>
    );
  }
  return (
    <>
      <div className="sheets">
        {sheets.map((cards, n) => (
          <FrontSheet key={n} cards={cards} number={n} a3={a3} />
        ))}
      </div>
      <div className="sheets-divider">Retro delle carte — uno per carta, da stampare a parte</div>
      <div className="sheets">
        {sheets.map((cards, n) => (
          <BackSheet key={n} cards={cards} number={n} mirrored={false} a3={a3} />
        ))}
      </div>
    </>
  );
}

export function Contracts() {
  const [duplex, setDuplex] = useState(false);
  const [a3, setA3] = useState(false);

  return (
    <div className="app">
      <Sidebar currentPage="contracts" pageTitle="Contratti delle proprietà" printLabel="Stampa tutto">
        <Panel title="Opzioni">
          <Option label="Stampa fronte-retro allineata" checked={duplex} onChange={setDuplex} />
          <Option
            label={a3 ? 'Foglio A3 (18 carte a foglio)' : 'Foglio A4 (9 carte a foglio)'}
            checked={a3}
            onChange={setA3}
          />
        </Panel>
        <Panel title="Come stampare">
          <p>{instructionsFor(duplex, a3)}</p>
        </Panel>
      </Sidebar>

      <main className="app-main">
        <ContractSheets duplex={duplex} a3={a3} />
      </main>
    </div>
  );
}
