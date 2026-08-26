/* Non va in stampa (vedi comune.css): qui dentro sta tutto ciò che serve solo
   a schermo. */

import type { ReactNode } from 'react';
import { Nav, type Pagina } from './Nav';

interface BarraProps {
  paginaCorrente: Pagina;
  titoloPagina: string;
  etichettaStampa: string;
  children?: ReactNode;
}

export function Barra({ paginaCorrente, titoloPagina, etichettaStampa, children }: BarraProps) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <img
          className="brand-logo"
          src="/resources/logo-sida.svg"
          alt="SIDA Autosoft Multimedia"
          width={34}
          height={17}
        />
        <span className="brand-name">Il Monopoli di SIDA</span>
      </div>
      <h1>{titoloPagina}</h1>
      <Nav paginaCorrente={paginaCorrente} />
      {children}
      <button type="button" className="stampa" onClick={() => window.print()}>
        🖨️ {etichettaStampa}
      </button>
    </aside>
  );
}

export function Pannello({ titolo, children }: { titolo: string; children: ReactNode }) {
  return (
    <div className="pannello">
      <h2>{titolo}</h2>
      {children}
    </div>
  );
}

export function Opzione({
  etichetta,
  attiva,
  alCambio,
  spiegazione,
}: {
  etichetta: string;
  attiva: boolean;
  alCambio: (attiva: boolean) => void;
  spiegazione?: string | undefined;
}) {
  return (
    <label className="opzione" title={spiegazione}>
      <input type="checkbox" checked={attiva} onChange={(e) => alCambio(e.target.checked)} />
      <span>{etichetta}</span>
    </label>
  );
}
