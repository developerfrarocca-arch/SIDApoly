import {
  CONSULTANT_MORTGAGE,
  CONSULTANT_RENTS,
  UTILITIES_MULTIPLIER,
  UTILITY_MORTGAGE,
  UTILITY_MULTIPLIER,
  type ContractData,
} from '../../data/contracts';
import { bp, contractCssClasses, withThousands, type Contract } from '../../model/contracts';

/** Past this length the name does not fit on one line at full size. */
const NAME_TOO_LONG_FOR_ONE_LINE = 18;

function RentRow({ label, description, amount }: { label: string; description: string; amount: string }) {
  return (
    <tr>
      <th>{label}</th>
      <td>{description}</td>
      <td className="v">{amount}</td>
    </tr>
  );
}

function MortgageRow({ value }: { value: number }) {
  return (
    <div className="mortgage">
      <span>Valore ipotecario</span>
      <span className="dots"></span>
      <b>{bp(value)}</b>
    </div>
  );
}

/** Like the locomotive on the stations of the classic game. */
function BigIcon({ icon }: { icon: string }) {
  return <div className="mark">{icon}</div>;
}

function Header({ value, name, subtitle }: { value: string; name: string; subtitle: string }) {
  return (
    <>
      <div className="value">
        Questo contratto vale <b>{value}</b>
      </div>
      <header className="head">
        <div className="kind">Contratto</div>
        <h2 className={name.length > NAME_TOO_LONG_FOR_ONE_LINE ? 'title lungo' : 'title'}>{name}</h2>
        <div className="dept">{subtitle}</div>
      </header>
    </>
  );
}

function PropertyBody({ data }: { data: ContractData }) {
  const { rents, upgradeCost, mortgage } = data;
  const [withOne, withTwo, withThree, withFour] = rents.upgrades;
  const cost = bp(upgradeCost);
  return (
    <>
      <table className="rents">
        <tbody>
          <RentRow label="Canone" description="solo licenza" amount={bp(rents.bare)} />
          <RentRow label="»" description="con 1 Aggiornamento" amount={withThousands(withOne)} />
          <RentRow label="»" description="con 2 Aggiornamenti" amount={withThousands(withTwo)} />
          <RentRow label="»" description="con 3 Aggiornamenti" amount={withThousands(withThree)} />
          <RentRow label="»" description="con 4 Aggiornamenti" amount={withThousands(withFour)} />
          <RentRow label="»" description="con Major Release" amount={withThousands(rents.release)} />
        </tbody>
      </table>
      <p className="rule">
        Se un giocatore possiede tutte le caselle della stessa <b>Linea di business</b> (colore), il canone della sola
        licenza viene raddoppiato.
      </p>
      <table className="costs">
        <tbody>
          <tr>
            <th>Costo di ogni Aggiornamento</th>
            <td className="v">{cost}</td>
          </tr>
          <tr>
            <th>» di una Major Release</th>
            <td className="v">{cost}</td>
          </tr>
          <tr>
            <td className="plus" colSpan={2}>
              più 4 Aggiornamenti
            </td>
          </tr>
        </tbody>
      </table>
      <MortgageRow value={mortgage} />
    </>
  );
}

function ConsultantBody({ icon }: { icon: string }) {
  const [withOne, withTwo, withThree, withFour] = CONSULTANT_RENTS;
  return (
    <>
      <BigIcon icon={icon} />
      <table className="rents">
        <tbody>
          <RentRow label="Canone" description="una sola casella" amount={bp(withOne)} />
          <RentRow label="»" description="con 2 caselle Consulenza" amount={withThousands(withTwo)} />
          <RentRow label="»" description="con 3 caselle Consulenza" amount={withThousands(withThree)} />
          <RentRow label="»" description="con 4 caselle Consulenza" amount={withThousands(withFour)} />
        </tbody>
      </table>
      <p className="rule">
        Il canone <b>raddoppia</b> per ogni casella Consulenza in più posseduta dallo stesso giocatore.
      </p>
      <MortgageRow value={CONSULTANT_MORTGAGE} />
    </>
  );
}

function UtilityBody({ icon }: { icon: string }) {
  return (
    <>
      <BigIcon icon={icon} />
      <div className="dice">
        <p className="rule">
          Se un giocatore possiede <b>una sola</b> casella servizio, il canone è pari a{' '}
          <b>{UTILITY_MULTIPLIER} volte</b> il numero mostrato dai dadi.
        </p>
        <p className="rule">
          Se possiede <b>entrambe</b> le caselle servizio, il canone è pari a <b>{UTILITIES_MULTIPLIER} volte</b> il
          numero mostrato dai dadi.
        </p>
      </div>
      <MortgageRow value={UTILITY_MORTGAGE} />
    </>
  );
}

export function ContractCard({ card }: { card: Contract }) {
  const value = typeof card.space.price === 'number' ? bp(card.space.price) : String(card.space.price);
  const subtitle =
    card.kind === 'property'
      ? card.space.department
      : card.kind === 'consultant'
        ? 'Referente di zona'
        : 'Servizi di sede';
  return (
    <article className={contractCssClasses(card)} data-casella={card.index}>
      <Header value={value} name={card.space.name} subtitle={subtitle} />
      <div className="body">
        {card.kind === 'property' ? (
          <PropertyBody data={card.data} />
        ) : card.kind === 'consultant' ? (
          <ConsultantBody icon={card.space.icon} />
        ) : (
          <UtilityBody icon={card.space.icon} />
        )}
      </div>
    </article>
  );
}
