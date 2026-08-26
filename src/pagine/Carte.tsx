import { useState } from 'react';
import { Barra, Opzione, Pannello } from '../componenti/Barra';
import { CartaMazzo } from '../componenti/carte/CartaMazzo';
import { FIRMA_IN_PIEDE, Foglio } from '../componenti/Foglio';
import { CARTE_PER_FOGLIO, carteMazzi, fogliPerMazzo } from '../render/carte';

export function Carte() {
  const [sfondo, setSfondo] = useState(true);
  const gruppi = fogliPerMazzo(carteMazzi(), CARTE_PER_FOGLIO);

  return (
    <div className={sfondo ? 'app' : 'app senza-sfondo'}>
      <Barra paginaCorrente="carte" titoloPagina="Imprevisti e Probabilità" etichettaStampa="Stampa tutto">
        <Pannello titolo="Opzioni">
          <Opzione
            etichetta="Sfondo colorato"
            attiva={sfondo}
            alCambio={setSfondo}
            spiegazione="Togli la spunta se stampi su cartoncino già colorato: le carte escono senza fondo."
          />
        </Pannello>
        <Pannello titolo="Come stampare">
          <p>
            Carte a una faccia, <b>un mazzo per foglio</b>: stampa ogni foglio sul suo cartoncino e
            taglia lungo i bordi. Formato <b>A4 verticale</b>.
          </p>
        </Pannello>
      </Barra>

      <main className="app-main">
        <div className="sheets">
          {gruppi.map((foglio, n) => (
            <Foglio
              key={n}
              mazzoDelFoglio={foglio[0]?.mazzo.chiave}
              piede={`${FIRMA_IN_PIEDE} · ${foglio[0]?.mazzo.nome ?? ''} · foglio ${n + 1}`}
            >
              {foglio.map((carta) => (
                <CartaMazzo key={`${carta.mazzo.chiave}-${carta.indice}`} carta={carta} />
              ))}
            </Foglio>
          ))}
        </div>
      </main>
    </div>
  );
}
