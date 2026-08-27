/* As in the classic game the back carries the name and the mortgage amount, and
   the card is turned to this side once mortgaged: being specific to the card,
   every back must be paired with its own front. */

import { bp, mortgageOf, type Contract } from '../../model/contracts';

export function ContractBack({ card }: { card: Contract }) {
  return (
    <article className="contract-back" data-casella={card.index}>
      <div className="back-box">
        <div className="back-title">Ipotecato</div>
        <div className="back-name">{card.space.name}</div>
        <div className="back-amount">
          <span>Importo ipoteca</span>
          <b>{bp(mortgageOf(card))}</b>
        </div>
        <div className="back-star">★</div>
        <p className="back-note">Il contratto deve essere girato da questo lato se è ipotecato.</p>
      </div>
    </article>
  );
}

export function EmptyCell() {
  return <div className="back-vuoto"></div>;
}
