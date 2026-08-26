import type { CSSProperties } from 'react';
import { numero } from '../../render/contratti';
import { seriale, type Copia } from '../../render/banconote';

/**
 * Il marchio "Edenpurple": stessa impostazione grafica del logo Edenred
 * (cerchio + scritta a due colori), con "red" sostituito da "purple" e la
 * palette portata sul viola invece che sul rosso.
 */
export function LogoEdenpurple() {
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

export function Banconota({ copia }: { copia: Copia }) {
  const { valore, colore } = copia.taglio;
  const cifra = numero(valore);
  // il colore del taglio arriva come variabile CSS, come faceva il markup a stringhe
  const stile = { '--bill-color': colore } as CSSProperties;
  return (
    <article className="bill" style={stile} data-valore={valore}>
      <div className="corner corner-tl">{cifra}</div>
      <div className="corner corner-tr">{cifra}</div>
      <div className="bill-center">
        <LogoEdenpurple />
        <div className="bill-title">Buoni Pasto</div>
        <div className="bill-value">
          {cifra} <span>BP</span>
        </div>
        <div className="bill-sub">Il Monopoli d&apos;Ufficio — SIDA Autosoft Multimedia</div>
      </div>
      <div className="corner corner-bl">{cifra}</div>
      <div className="corner corner-br">{cifra}</div>
      <div className="bill-serial">{seriale(copia)}</div>
    </article>
  );
}
