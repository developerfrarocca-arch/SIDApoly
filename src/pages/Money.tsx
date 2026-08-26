import { Panel, Sidebar } from '../components/Sidebar';
import { Bill } from '../components/money/Bill';
import { Sheet } from '../components/Sheet';
import { bindCurrency } from '../model/board';
import { withThousands } from '../model/contracts';
import { BILLS_PER_SHEET, billCopies, sheetsOf } from '../model/money';

export function Money() {
  const sheets = sheetsOf(billCopies(), BILLS_PER_SHEET);
  return (
    <div className="app">
      <Sidebar currentPage="money" pageTitle="Banconote dei Buoni Pasto" printLabel="Stampa tutto">
        <Panel title="Come stampare">
          <p>
            Un foglio per ogni taglio (5, 10, 20, 50, 100, 200, 500 BP), 10 banconote a foglio,
            tutte attaccate: taglia lungo le <b>linee tratteggiate</b>. Formato{' '}
            <b>A4 verticale</b>.
          </p>
          <p>Se ti servono più copie di un taglio, ristampa solo quel foglio.</p>
        </Panel>
      </Sidebar>

      <main className="app-main">
        <div className="sheets">
          {sheets.map((sheet, n) => (
            <Sheet
              key={n}
              footer={`Il Monopoli di SIDA — Buoni Pasto da ${bindCurrency(
                `${withThousands(sheet[0]?.denomination.value ?? 0)} BP`,
              )} · foglio ${n + 1}`}
            >
              {sheet.map((copy) => (
                <Bill key={`${copy.denomination.value}-${copy.series}`} copy={copy} />
              ))}
            </Sheet>
          ))}
        </div>
      </main>
    </div>
  );
}
