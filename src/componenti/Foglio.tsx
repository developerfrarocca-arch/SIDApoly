import type { ReactNode } from 'react';

export const FIRMA_IN_PIEDE = 'Il Monopoli di SIDA — SIDA Autosoft Multimedia';

interface FoglioProps {
  classeAggiuntiva?: string | undefined;
  piede: string;
  mazzoDelFoglio?: string | undefined;
  children: ReactNode;
}

export function Foglio({ classeAggiuntiva, piede, mazzoDelFoglio, children }: FoglioProps) {
  return (
    <section
      className={classeAggiuntiva ? `sheet ${classeAggiuntiva}` : 'sheet'}
      data-mazzo={mazzoDelFoglio}
    >
      <div className="sheet-grid">{children}</div>
      <div className="sheet-foot">{piede}</div>
    </section>
  );
}
