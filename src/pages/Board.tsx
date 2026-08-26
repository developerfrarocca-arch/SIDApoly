import { useRef } from 'react';
import { Panel, Sidebar } from '../components/Sidebar';
import { Cell } from '../components/board/Cell';
import { Center } from '../components/board/Center';
import { Legend } from '../components/board/Legend';
import { ZoomControls } from '../components/board/ZoomControls';
import { useZoom } from '../components/board/useZoom';
import { SPACES } from '../data/spaces';

export function Board() {
  const container = useRef<HTMLDivElement>(null);
  const page = useRef<HTMLDivElement>(null);
  const zoom = useZoom(container, page);

  return (
    <div className="app">
      <Sidebar currentPage="board" pageTitle="Tabellone" printLabel="Stampa tabellone">
        <Panel title="Zoom">
          <ZoomControls zoom={zoom} />
        </Panel>
        <Panel title="Come stampare">
          <p>
            Un foglio solo, formato <b>A3 orizzontale</b>: plancia e pannello delle regole stanno
            affiancati sullo stesso foglio.
          </p>
          <p>
            A schermo la plancia è rimpicciolita per stare nella finestra; in stampa esce a
            grandezza naturale.
          </p>
        </Panel>
      </Sidebar>

      <main className="app-main">
        <div className="page-wrap" ref={container}>
          <div
            className="page"
            ref={page}
            style={zoom.factor === 1 ? undefined : { zoom: zoom.factor }}
          >
            <div className="board">
              <Center />
              {SPACES.map((space, index) => (
                <Cell key={index} space={space} index={index} />
              ))}
            </div>
            <Legend />
          </div>
        </div>
      </main>
    </div>
  );
}
