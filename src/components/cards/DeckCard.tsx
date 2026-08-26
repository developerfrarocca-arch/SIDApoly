import { bindCurrency } from '../../model/board';
import type { DeckCardData } from '../../model/cards';

export function DeckCard({ card }: { card: DeckCardData }) {
  return (
    <article
      className={`card card-${card.deck.id}`}
      data-mazzo={card.deck.id}
      data-indice={card.index}
    >
      <div className="card-head">
        <span className="card-mazzo">{card.deck.name}</span>
      </div>
      <div className="card-testo">{bindCurrency(card.card.text)}</div>
    </article>
  );
}
