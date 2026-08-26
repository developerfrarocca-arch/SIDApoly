/* La pagina dei contratti. Due modi di stampare:
   - pile separate: prima tutti i fronti, poi tutti i retri, nello stesso ordine;
   - fronte-retro allineata: fronte e retro dello stesso foglio uno dopo l'altro,
     con le colonne del retro specchiate perché girando il foglio sul bordo
     lungo la prima colonna diventa l'ultima. */

import { Fragment, useState } from 'react';
import { Barra, Opzione, Pannello } from '../componenti/Barra';
import { CartaContratto } from '../componenti/contratti/CartaContratto';
import { CellaSenzaCarta, RetroContratto } from '../componenti/contratti/RetroContratto';
import { FIRMA_IN_PIEDE, Foglio } from '../componenti/Foglio';
import {
  CARTE_PER_FOGLIO,
  contratti,
  fogli,
  specchiaRighe,
  type Contratto,
} from '../render/contratti';

const ISTRUZIONI_PILE_SEPARATE = (
  <>
    Stampa prima i <b>fronti</b>, poi su un altro pacco di fogli i <b>retri</b>: ogni retro riporta
    il nome della sua carta, quindi va abbinato al fronte corrispondente — i due fogli hanno le
    carte nello stesso ordine. Formato <b>A4 verticale</b>.
  </>
);

const ISTRUZIONI_FRONTE_RETRO = (
  <>
    Nella finestra di stampa attiva <b>Stampa fronte e retro</b> (bordo lungo): fronte e retro di
    ogni foglio combaceranno da soli, senza bisogno di abbinarli dopo il taglio. Formato{' '}
    <b>A4 verticale</b>.
  </>
);

function FoglioDiFronti({ foglio, n }: { foglio: readonly Contratto[]; n: number }) {
  return (
    <Foglio piede={`${FIRMA_IN_PIEDE} · foglio ${n + 1}`}>
      {foglio.map((c) => (
        <CartaContratto key={c.indice} carta={c} />
      ))}
    </Foglio>
  );
}

function FoglioDiRetri({
  foglio,
  n,
  conColonneSpecchiate,
}: {
  foglio: readonly Contratto[];
  n: number;
  conColonneSpecchiate: boolean;
}) {
  const celle = conColonneSpecchiate ? specchiaRighe(foglio) : [...foglio];
  return (
    <Foglio classeAggiuntiva="sheet-retro" piede={`${FIRMA_IN_PIEDE} · retro ${n + 1}`}>
      {celle.map((c, i) =>
        c ? <RetroContratto key={c.indice} carta={c} /> : <CellaSenzaCarta key={`vuota-${i}`} />,
      )}
    </Foglio>
  );
}

export function FogliContratti({ fronteRetro }: { fronteRetro: boolean }) {
  const gruppi = fogli(contratti(), CARTE_PER_FOGLIO);
  if (fronteRetro) {
    return (
      <div className="sheets">
        {gruppi.map((foglio, n) => (
          <Fragment key={n}>
            <FoglioDiFronti foglio={foglio} n={n} />
            <FoglioDiRetri foglio={foglio} n={n} conColonneSpecchiate />
          </Fragment>
        ))}
      </div>
    );
  }
  return (
    <>
      <div className="sheets">
        {gruppi.map((foglio, n) => (
          <FoglioDiFronti key={n} foglio={foglio} n={n} />
        ))}
      </div>
      <div className="sheets-divider">Retro delle carte — uno per carta, da stampare a parte</div>
      <div className="sheets">
        {gruppi.map((foglio, n) => (
          <FoglioDiRetri key={n} foglio={foglio} n={n} conColonneSpecchiate={false} />
        ))}
      </div>
    </>
  );
}

export function Contratti() {
  const [fronteRetro, setFronteRetro] = useState(false);

  return (
    <div className="app">
      <Barra paginaCorrente="contratti" titoloPagina="Contratti delle proprietà" etichettaStampa="Stampa tutto">
        <Pannello titolo="Opzioni">
          <Opzione
            etichetta="Stampa fronte-retro allineata"
            attiva={fronteRetro}
            alCambio={setFronteRetro}
          />
        </Pannello>
        <Pannello titolo="Come stampare">
          <p>{fronteRetro ? ISTRUZIONI_FRONTE_RETRO : ISTRUZIONI_PILE_SEPARATE}</p>
        </Pannello>
      </Barra>

      <main className="app-main">
        <FogliContratti fronteRetro={fronteRetro} />
      </main>
    </div>
  );
}
