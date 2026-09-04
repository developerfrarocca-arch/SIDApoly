/* One A3 landscape sheet with the lid of the box on it: the artwork is a
   396x268mm rectangle — the size of the lid — centred on the paper, so there is
   12mm of white down each side and 14.5mm top and bottom to cut away by hand.
   Nothing reaches the edge of the paper, so no borderless printing is needed. */

import { useRef, useState, type CSSProperties } from 'react';
import { Option, Panel, Sidebar } from '../components/Sidebar';
import { ZoomControls } from '../components/board/ZoomControls';
import { useZoom } from '../components/board/useZoom';
import { CoverArt } from '../components/cover/CoverArt';

export function Cover() {
  const container = useRef<HTMLDivElement>(null);
  const sheet = useRef<HTMLDivElement>(null);
  const zoom = useZoom(container, sheet);
  const [sheen, setSheen] = useState(true);
  const [cropMarks, setCropMarks] = useState(true);

  return (
    <div className="app">
      <Sidebar currentPage="cover" pageTitle="Copertina della scatola" printLabel="Stampa copertina">
        <Panel title="Opzioni">
          <Option
            label="Oro sfumato"
            checked={sheen}
            onChange={setSheen}
            hint="La lucentezza metallica del marchio, come sulla scatola. Togli la spunta per un oro pieno: alcune stampanti rendono le sfumature a bande."
          />
          <Option
            label="Crocini di taglio"
            checked={cropMarks}
            onChange={setCropMarks}
            hint="Quattro coppie di trattini grigi appena fuori dal rifilo: sono le linee lungo cui tagliare per arrivare a 39,6×26,8 cm."
          />
        </Panel>
        <Panel title="Zoom">
          <ZoomControls zoom={zoom} />
        </Panel>
        <Panel title="Come stampare">
          <p>
            Un foglio <b>A3 orizzontale</b>, <b>margini nessuno</b> e <b>scala 100%</b>. Serve la{' '}
            <b>grafica di sfondo</b> attiva, altrimenti il fondo blu non viene stampato.
          </p>
          <p>
            La copertina finita misura <b>39,6×26,8 cm</b>: dopo la stampa taglia lungo i crocini, 1,2 cm di carta per
            lato e 1,45 cm sopra e sotto.
          </p>
          <p>A schermo il foglio è rimpicciolito per stare nella finestra; in stampa esce a grandezza naturale.</p>
        </Panel>
      </Sidebar>

      <main className="app-main">
        <div className="cover-wrap" ref={container}>
          {/* Lo zoom a schermo passa come proprietà personalizzata e lo legge solo
              @media screen: in stampa il foglio esce sempre a misura. */}
          <div className="cover-pages" style={{ '--screen-zoom': String(zoom.factor) } as CSSProperties}>
            <div className="cover-page" ref={sheet}>
              <CoverArt sheen={sheen} cropMarks={cropMarks} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
