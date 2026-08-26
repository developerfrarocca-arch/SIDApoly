import type { ReactNode } from 'react';

export const FOOTER_SIGNATURE = 'Il Monopoli di SIDA — SIDA Autosoft Multimedia';

interface SheetProps {
  extraClass?: string | undefined;
  footer: string;
  deck?: string | undefined;
  children: ReactNode;
}

export function Sheet({ extraClass, footer, deck, children }: SheetProps) {
  return (
    <section className={extraClass ? `sheet ${extraClass}` : 'sheet'} data-mazzo={deck}>
      <div className="sheet-grid">{children}</div>
      <div className="sheet-foot">{footer}</div>
    </section>
  );
}
