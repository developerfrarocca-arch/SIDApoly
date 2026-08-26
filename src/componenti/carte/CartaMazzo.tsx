import type { CartaMazzo as CartaConMazzo } from '../../render/carte';
import { valuta } from '../../render/tabellone';

export function CartaMazzo({ carta }: { carta: CartaConMazzo }) {
  return (
    <article
      className={`card card-${carta.mazzo.chiave}`}
      data-mazzo={carta.mazzo.chiave}
      data-indice={carta.indice}
    >
      <div className="card-head">
        <span className="card-mazzo">{carta.mazzo.nome}</span>
      </div>
      <div className="card-testo">{valuta(carta.carta.testo)}</div>
    </article>
  );
}
