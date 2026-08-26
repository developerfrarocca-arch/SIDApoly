/* Come nel Monopoli classico il retro riporta nome e importo dell'ipoteca, e la
   carta si gira da questo lato quando è ipotecata: essendo specifico della
   carta, ogni retro va abbinato al proprio fronte. */

import { bp, ipotecaCarta, type Contratto } from '../../render/contratti';

export function RetroContratto({ carta }: { carta: Contratto }) {
  return (
    <article className="contract-back" data-casella={carta.indice}>
      <div className="back-box">
        <div className="back-title">Ipotecato</div>
        <div className="back-name">{carta.casella.nome}</div>
        <div className="back-amount">
          <span>Importo ipoteca</span>
          <b>{bp(ipotecaCarta(carta))}</b>
        </div>
        <div className="back-star">★</div>
        <p className="back-note">
          Il contratto deve essere girato da questo lato se è ipotecato.
        </p>
      </div>
    </article>
  );
}

export function CellaSenzaCarta() {
  return <div className="back-vuoto"></div>;
}
