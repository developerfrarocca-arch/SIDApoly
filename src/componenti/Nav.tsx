export type Pagina = 'tabellone' | 'contratti' | 'carte' | 'banconote';

interface VoceDiMenu {
  pagina: Pagina;
  href: string;
  etichetta: string;
}

const VOCI_DI_MENU: readonly VoceDiMenu[] = [
  { pagina: 'tabellone', href: './index.html', etichetta: '🎲 Tabellone' },
  { pagina: 'contratti', href: './contratti.html', etichetta: '📄 Contratti' },
  { pagina: 'carte', href: './carte.html', etichetta: '🎴 Imprevisti/Probabilità' },
  { pagina: 'banconote', href: './banconote.html', etichetta: '💶 Banconote' },
];

export function Nav({ paginaCorrente }: { paginaCorrente: Pagina }) {
  return (
    <nav className="nav">
      {VOCI_DI_MENU.map((voce) => (
        <a
          key={voce.pagina}
          href={voce.href}
          aria-current={voce.pagina === paginaCorrente ? 'page' : undefined}
        >
          {voce.etichetta}
        </a>
      ))}
    </nav>
  );
}
