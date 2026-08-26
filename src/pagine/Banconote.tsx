import { Barra, Pannello } from '../componenti/Barra';
import { Banconota } from '../componenti/banconote/Banconota';
import { Foglio } from '../componenti/Foglio';
import { BANCONOTE_PER_FOGLIO, elencoBanconote, fogli } from '../render/banconote';
import { numero } from '../render/contratti';
import { valuta } from '../render/tabellone';

export function Banconote() {
  const gruppi = fogli(elencoBanconote(), BANCONOTE_PER_FOGLIO);
  return (
    <div className="app">
      <Barra paginaCorrente="banconote" titoloPagina="Banconote dei Buoni Pasto" etichettaStampa="Stampa tutto">
        <Pannello titolo="Come stampare">
          <p>
            Un foglio per ogni taglio (5, 10, 20, 50, 100, 200, 500 BP), 10 banconote a foglio,
            tutte attaccate: taglia lungo le <b>linee tratteggiate</b>. Formato{' '}
            <b>A4 verticale</b>.
          </p>
          <p>Se ti servono più copie di un taglio, ristampa solo quel foglio.</p>
        </Pannello>
      </Barra>

      <main className="app-main">
        <div className="sheets">
          {gruppi.map((foglio, n) => (
            <Foglio
              key={n}
              piede={`Il Monopoli di SIDA — Buoni Pasto da ${valuta(
                `${numero(foglio[0]?.taglio.valore ?? 0)} BP`,
              )} · foglio ${n + 1}`}
            >
              {foglio.map((copia) => (
                <Banconota key={`${copia.taglio.valore}-${copia.serie}`} copia={copia} />
              ))}
            </Foglio>
          ))}
        </div>
      </main>
    </div>
  );
}
