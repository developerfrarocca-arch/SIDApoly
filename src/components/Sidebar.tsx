/* Never printed (see common.css): everything that only makes sense on screen
   lives in here. */

import type { ReactNode } from 'react';
import { Nav, type PageId } from './Nav';

interface SidebarProps {
  currentPage: PageId;
  pageTitle: string;
  printLabel: string;
  children?: ReactNode;
}

export function Sidebar({ currentPage, pageTitle, printLabel, children }: SidebarProps) {
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
      <h1>{pageTitle}</h1>
      <Nav currentPage={currentPage} />
      {children}
      <button type="button" className="stampa" onClick={() => window.print()}>
        🖨️ {printLabel}
      </button>
    </aside>
  );
}

export function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="pannello">
      <h2>{title}</h2>
      {children}
    </div>
  );
}

export function Option({
  label,
  checked,
  onChange,
  hint,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  hint?: string | undefined;
}) {
  return (
    <label className="opzione" title={hint}>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span>{label}</span>
    </label>
  );
}
