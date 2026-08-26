import { useRef } from 'react';
import { Barra, Pannello } from '../componenti/Barra';
import { Casella } from '../componenti/tabellone/Casella';
import { Centro } from '../componenti/tabellone/Centro';
import { ComandiZoom } from '../componenti/tabellone/ComandiZoom';
import { Legenda } from '../componenti/tabellone/Legenda';
import { usaZoom } from '../componenti/tabellone/usaZoom';
import { CASELLE } from '../dati/caselle';

export function Tabellone() {
  const wrap = useRef<HTMLDivElement>(null);
  const pagina = useRef<HTMLDivElement>(null);
  const zoom = usaZoom(wrap, pagina);

  return (
    <div className="app">
      <Barra paginaCorrente="tabellone" titoloPagina="Tabellone" etichettaStampa="Stampa tabellone">
        <Pannello titolo="Zoom">
          <ComandiZoom zoom={zoom} />
        </Pannello>
        <Pannello titolo="Come stampare">
          <p>
            Un foglio solo, formato <b>A3 orizzontale</b>: plancia e pannello delle regole stanno
            affiancati sullo stesso foglio.
          </p>
          <p>
            A schermo la plancia è rimpicciolita per stare nella finestra; in stampa esce a
            grandezza naturale.
          </p>
        </Pannello>
      </Barra>

      <main className="app-main">
        <div className="page-wrap" ref={wrap}>
          <div className="page" ref={pagina} style={zoom.valore === 1 ? undefined : { zoom: zoom.valore }}>
            <div className="board">
              <Centro />
              {CASELLE.map((casella, i) => (
                <Casella key={i} casella={casella} indice={i} />
              ))}
            </div>
            <Legenda />
          </div>
        </div>
      </main>
    </div>
  );
}
