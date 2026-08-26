import {
  CANONI_CONSULENZA,
  IPOTECA_CONSULENZA,
  IPOTECA_SERVIZIO,
  MOLTIPLICATORE_SERVIZI,
  MOLTIPLICATORE_SERVIZIO,
  type DatiContratto,
} from '../../dati/contratti';
import { bp, classiCarta, numero, type Contratto } from '../../render/contratti';

/** Oltre questa lunghezza il nome non sta su una riga alla misura piena. */
const NOME_TROPPO_LUNGO_PER_UNA_RIGA = 18;

function RigaDeiCanoni({
  etichetta,
  descrizione,
  importo,
}: {
  etichetta: string;
  descrizione: string;
  importo: string;
}) {
  return (
    <tr>
      <th>{etichetta}</th>
      <td>{descrizione}</td>
      <td className="v">{importo}</td>
    </tr>
  );
}

function RigaIpoteca({ valore }: { valore: number }) {
  return (
    <div className="mortgage">
      <span>Valore ipotecario</span>
      <span className="dots"></span>
      <b>{bp(valore)}</b>
    </div>
  );
}

/** Come la locomotiva delle stazioni nel Monopoli classico. */
function IconaGrande({ icona }: { icona: string }) {
  return <div className="mark">{icona}</div>;
}

function Intestazione({ valore, nome, sotto }: { valore: string; nome: string; sotto: string }) {
  return (
    <>
      <div className="value">
        Questo contratto vale <b>{valore}</b>
      </div>
      <header className="head">
        <div className="kind">Contratto</div>
        <h2 className={nome.length > NOME_TROPPO_LUNGO_PER_UNA_RIGA ? 'title lungo' : 'title'}>
          {nome}
        </h2>
        <div className="dept">{sotto}</div>
      </header>
    </>
  );
}

function CorpoProprieta({ dati }: { dati: DatiContratto }) {
  const { canoni, costoAggiornamento, ipoteca } = dati;
  const [conUnAggiornamento, conDue, conTre, conQuattro] = canoni.aggiornamenti;
  const costo = bp(costoAggiornamento);
  return (
    <>
      <table className="rents">
        <tbody>
          <RigaDeiCanoni etichetta="Canone" descrizione="solo licenza" importo={bp(canoni.solo)} />
          <RigaDeiCanoni
            etichetta="»"
            descrizione="con 1 Aggiornamento"
            importo={numero(conUnAggiornamento)}
          />
          <RigaDeiCanoni etichetta="»" descrizione="con 2 Aggiornamenti" importo={numero(conDue)} />
          <RigaDeiCanoni etichetta="»" descrizione="con 3 Aggiornamenti" importo={numero(conTre)} />
          <RigaDeiCanoni
            etichetta="»"
            descrizione="con 4 Aggiornamenti"
            importo={numero(conQuattro)}
          />
          <RigaDeiCanoni
            etichetta="»"
            descrizione="con Major Release"
            importo={numero(canoni.release)}
          />
        </tbody>
      </table>
      <p className="rule">
        Se un giocatore possiede tutte le caselle della stessa <b>Linea di business</b> (colore), il
        canone della sola licenza viene raddoppiato.
      </p>
      <table className="costs">
        <tbody>
          <tr>
            <th>Costo di ogni Aggiornamento</th>
            <td className="v">{costo}</td>
          </tr>
          <tr>
            <th>» di una Major Release</th>
            <td className="v">{costo}</td>
          </tr>
          <tr>
            <td className="plus" colSpan={2}>
              più 4 Aggiornamenti
            </td>
          </tr>
        </tbody>
      </table>
      <RigaIpoteca valore={ipoteca} />
    </>
  );
}

function CorpoConsulenza({ icona }: { icona: string }) {
  const [conUnaCasella, conDue, conTre, conQuattro] = CANONI_CONSULENZA;
  return (
    <>
      <IconaGrande icona={icona} />
      <table className="rents">
        <tbody>
          <RigaDeiCanoni
            etichetta="Canone"
            descrizione="una sola casella"
            importo={bp(conUnaCasella)}
          />
          <RigaDeiCanoni
            etichetta="»"
            descrizione="con 2 caselle Consulenza"
            importo={numero(conDue)}
          />
          <RigaDeiCanoni
            etichetta="»"
            descrizione="con 3 caselle Consulenza"
            importo={numero(conTre)}
          />
          <RigaDeiCanoni
            etichetta="»"
            descrizione="con 4 caselle Consulenza"
            importo={numero(conQuattro)}
          />
        </tbody>
      </table>
      <p className="rule">
        Il canone <b>raddoppia</b> per ogni casella Consulenza in più posseduta dallo stesso
        giocatore.
      </p>
      <RigaIpoteca valore={IPOTECA_CONSULENZA} />
    </>
  );
}

function CorpoServizio({ icona }: { icona: string }) {
  return (
    <>
      <IconaGrande icona={icona} />
      <div className="dice">
        <p className="rule">
          Se un giocatore possiede <b>una sola</b> casella servizio, il canone è pari a{' '}
          <b>{MOLTIPLICATORE_SERVIZIO} volte</b> il numero mostrato dai dadi.
        </p>
        <p className="rule">
          Se possiede <b>entrambe</b> le caselle servizio, il canone è pari a{' '}
          <b>{MOLTIPLICATORE_SERVIZI} volte</b> il numero mostrato dai dadi.
        </p>
      </div>
      <RigaIpoteca valore={IPOTECA_SERVIZIO} />
    </>
  );
}

export function CartaContratto({ carta }: { carta: Contratto }) {
  const valore =
    typeof carta.casella.prezzo === 'number'
      ? bp(carta.casella.prezzo)
      : String(carta.casella.prezzo);
  const sottotitolo =
    carta.tipo === 'proprieta'
      ? carta.casella.reparto
      : carta.tipo === 'consulenza'
        ? 'Referente di zona'
        : 'Servizi di sede';
  return (
    <article className={classiCarta(carta)} data-casella={carta.indice}>
      <Intestazione valore={valore} nome={carta.casella.nome} sotto={sottotitolo} />
      <div className="body">
        {carta.tipo === 'proprieta' ? (
          <CorpoProprieta dati={carta.dati} />
        ) : carta.tipo === 'consulenza' ? (
          <CorpoConsulenza icona={carta.casella.icona} />
        ) : (
          <CorpoServizio icona={carta.casella.icona} />
        )}
      </div>
    </article>
  );
}
