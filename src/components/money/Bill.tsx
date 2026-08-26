import type { CSSProperties } from 'react';
import { withThousands } from '../../model/contracts';
import { serialOf, type BillCopy } from '../../model/money';

/**
 * The "Edenpurple" mark: same layout as the Edenred logo (circle plus two-tone
 * wordmark), with "red" swapped for "purple" and the palette moved onto violet.
 */
export function EdenpurpleLogo() {
  return (
    <svg className="bill-logo" viewBox="0 0 360 110" role="img" aria-label="Edenpurple">
      <circle cx="52" cy="55" r="58" fill="#6C3483" />
      <text
        x="8"
        y="76"
        fontFamily="Arial, Helvetica, sans-serif"
        fontWeight="800"
        fontSize="58"
        fill="#fff"
      >
        Ed
      </text>
      <text
        x="86"
        y="72"
        fontFamily="Arial, Helvetica, sans-serif"
        fontWeight="800"
        fontSize="42"
        fill="#6C3483"
      >
        enpurple
      </text>
    </svg>
  );
}

export function Bill({ copy }: { copy: BillCopy }) {
  const { value, color } = copy.denomination;
  const figure = withThousands(value);
  // the denomination colour travels as a CSS variable
  const style = { '--bill-color': color } as CSSProperties;
  return (
    <article className="bill" style={style} data-valore={value}>
      <div className="corner corner-tl">{figure}</div>
      <div className="corner corner-tr">{figure}</div>
      <div className="bill-center">
        <EdenpurpleLogo />
        <div className="bill-title">Buoni Pasto</div>
        <div className="bill-value">
          {figure} <span>BP</span>
        </div>
        <div className="bill-sub">Il Monopoli d&apos;Ufficio — SIDA Autosoft Multimedia</div>
      </div>
      <div className="corner corner-bl">{figure}</div>
      <div className="corner corner-br">{figure}</div>
      <div className="bill-serial">{serialOf(copy)}</div>
    </article>
  );
}
