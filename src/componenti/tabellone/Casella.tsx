import type { Casella as DatiCasella } from '../../dati/caselle';
import { classi, posizione, prezzo } from '../../render/tabellone';

function ContenutoDellaCasella({ casella }: { casella: DatiCasella }) {
  switch (casella.tipo) {
    case 'angolo':
      return (
        <>
          <div className="icon">{casella.icona}</div>
          <div className="label">{casella.nome}</div>
          <div className="sub">{casella.sotto}</div>
        </>
      );
    case 'proprieta':
      return (
        <>
          <div className="bar"></div>
          <div className="dept">{casella.reparto}</div>
          <div className="name">{casella.nome}</div>
          <div className="price">{prezzo(casella.prezzo)}</div>
        </>
      );
    case 'speciale':
      return (
        <>
          <div className="icon">{casella.icona}</div>
          <div className="label">{casella.nome}</div>
          <div className="price">{prezzo(casella.prezzo)}</div>
        </>
      );
    case 'carta':
      return (
        <>
          <div className="icon">{casella.icona}</div>
          <div className="label">{casella.nome}</div>
        </>
      );
  }
}

export function Casella({ casella, indice }: { casella: DatiCasella; indice: number }) {
  const { col, row, rot } = posizione(indice);
  return (
    <div
      className={classi(casella, rot)}
      style={{ gridColumn: `${col}/${col + 1}`, gridRow: `${row}/${row + 1}` }}
    >
      <div className="inner">
        <ContenutoDellaCasella casella={casella} />
      </div>
    </div>
  );
}
