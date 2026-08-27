import { useId, type CSSProperties } from 'react';
import { withThousands } from '../../model/contracts';
import { FOOTER_SIGNATURE } from '../Sheet';
import { serialOf, type BillCopy } from '../../model/money';

const MARK_FONT = 'Arial, Helvetica, sans-serif';

export function EdenbluLogo() {
  const clipId = useId();
  return (
    <svg className="bill-logo" viewBox="0 0 754 474" role="img" aria-label="Edenblu">
      <defs>
        <clipPath id={clipId}>
          <circle cx="237" cy="237" r="229" />
        </clipPath>
      </defs>
      <circle cx="237" cy="237" r="229" className="mark-disc" />
      <text x="8" y="296" fontFamily={MARK_FONT} fontWeight="800" fontSize="168" className="mark-word">
        Edenblu
      </text>
      <text
        x="8"
        y="296"
        fontFamily={MARK_FONT}
        fontWeight="800"
        fontSize="168"
        fill="#fff"
        clipPath={`url(#${clipId})`}
      >
        Edenblu
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
        <EdenbluLogo />
        <div className="bill-title">Buoni Pasto</div>
        <div className="bill-value">
          {figure} <span>BP</span>
        </div>
        <div className="bill-sub">{FOOTER_SIGNATURE}</div>
      </div>
      <div className="corner corner-bl">{figure}</div>
      <div className="corner corner-br">{figure}</div>
      <div className="bill-serial">{serialOf(copy)}</div>
    </article>
  );
}
