/* Two ways of printing the board:
   - one A3 landscape: board and rules panel side by side on the same sheet,
     the board at its natural 275mm;
   - two A3 portrait: the board blown up to a 400mm square (the height of an A3
     minus 1cm of margin above and below) and cut down the middle, half a sheet
     each, plus a third sheet with the rules alone. The two halves are pushed
     against the edge where they join, so after printing there is only 1cm of
     paper to trim before glueing them together. */

import { useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { Option, Panel, Sidebar } from '../components/Sidebar';
import { Cell } from '../components/board/Cell';
import { Center } from '../components/board/Center';
import { Legend } from '../components/board/Legend';
import { ZoomControls } from '../components/board/ZoomControls';
import { useZoom } from '../components/board/useZoom';
import { SPACES } from '../data/spaces';

/** The 40 spaces plus the middle: the board on its own, without any paper around it. */
function BoardGrid() {
  return (
    <div className="board">
      <Center />
      {SPACES.map((space, index) => (
        <Cell key={index} space={space} index={index} />
      ))}
    </div>
  );
}

/** One A3 landscape: board and rules panel side by side. */
function SingleSheet({ sheet }: { sheet: React.RefObject<HTMLDivElement> }) {
  return (
    <div className="page" ref={sheet}>
      <BoardGrid />
      <Legend />
    </div>
  );
}

function SplitSheet({
  side,
  tag,
  children,
  sheet,
}: {
  side: 'left' | 'right' | 'rules';
  tag?: string;
  children: ReactNode;
  sheet?: React.RefObject<HTMLDivElement>;
}) {
  return (
    <div className={`split-page split-${side}`} ref={sheet}>
      {children}
      {tag && <p className="split-tag">{tag}</p>}
    </div>
  );
}

/** Three A3 portrait: left half, right half, rules. */
function SplitSheets({ sheet }: { sheet: React.RefObject<HTMLDivElement> }) {
  return (
    <>
      <SplitSheet side="left" tag="Metà sinistra · taglia lungo il tratteggio e incolla alla metà destra" sheet={sheet}>
        <div className="split-window">
          <BoardGrid />
        </div>
      </SplitSheet>
      <SplitSheet side="right" tag="Metà destra · taglia lungo il tratteggio e incolla alla metà sinistra">
        <div className="split-window">
          <BoardGrid />
        </div>
      </SplitSheet>
      <SplitSheet side="rules">
        <div className="split-rules-box">
          <Legend />
        </div>
      </SplitSheet>
    </>
  );
}

function howToPrint(split: boolean) {
  if (!split) {
    return (
      <>
        <p>
          Un foglio solo, formato <b>A3 orizzontale</b>: plancia e pannello delle regole stanno affiancati sullo stesso
          foglio.
        </p>
        <p>A schermo la plancia è rimpicciolita per stare nella finestra; in stampa esce a grandezza naturale.</p>
      </>
    );
  }
  return (
    <>
      <p>
        Tre fogli <b>A3 verticali</b>, <b>margini nessuno</b> e <b>scala 100%</b>: le due metà della plancia e, a parte,
        le regole.
      </p>
      <p>
        La plancia finita è un quadrato di <b>40×40 cm</b>. Ogni metà tocca il bordo della cucitura a 1 cm: taglia lungo
        il <b>tratteggio</b> e incolla le due metà accostandole.
      </p>
      <p>
        Gli spazi dei due mazzi al centro misurano <b>64×42 mm</b>: è la misura a cui portare le carte Imprevisti e
        Probabilità.
      </p>
    </>
  );
}

export function Board() {
  const container = useRef<HTMLDivElement>(null);
  const sheet = useRef<HTMLDivElement>(null);
  const [split, setSplit] = useState(false);
  const zoom = useZoom(container, sheet, split);

  return (
    <div className={split ? 'app split' : 'app'}>
      {/* @page cannot be switched from a class: the rule is written here so the
          paper follows the option chosen in the sidebar. */}
      <style>{`@page { size: A3 ${split ? 'portrait' : 'landscape'}; margin: 0; }`}</style>

      <Sidebar currentPage="board" pageTitle="Tabellone" printLabel={split ? 'Stampa i tre fogli' : 'Stampa tabellone'}>
        <Panel title="Opzioni">
          <Option
            label="Plancia grande su due A3"
            checked={split}
            onChange={setSplit}
            hint="La plancia esce quadrata di 40 cm, divisa a metà su due A3 verticali da incollare; le regole vanno su un terzo foglio."
          />
        </Panel>
        <Panel title="Zoom">
          <ZoomControls zoom={zoom} />
        </Panel>
        <Panel title="Come stampare">{howToPrint(split)}</Panel>
      </Sidebar>

      <main className="app-main">
        <div className="page-wrap" ref={container}>
          {/* The screen zoom is handed over as a custom property and used only by
              `@media screen`: print must never see it. An inline `zoom` would be
              carried into the print too, where `zoom: 1 !important` turned out
              not to be enough (Chrome kept the reduced scale on paper). */}
          <div className="pages" style={{ '--screen-zoom': String(zoom.factor) } as CSSProperties}>
            {split ? <SplitSheets sheet={sheet} /> : <SingleSheet sheet={sheet} />}
          </div>
        </div>
      </main>
    </div>
  );
}
