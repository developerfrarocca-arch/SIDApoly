export type PageId = 'board' | 'contracts' | 'cards' | 'money';

interface MenuEntry {
  page: PageId;
  href: string;
  label: string;
}

const MENU: readonly MenuEntry[] = [
  { page: 'board', href: './index.html', label: '🎲 Tabellone' },
  { page: 'contracts', href: './contracts.html', label: '📄 Contratti' },
  { page: 'cards', href: './cards.html', label: '🎴 Imprevisti/Probabilità' },
  { page: 'money', href: './money.html', label: '💶 Banconote' },
];

export function Nav({ currentPage }: { currentPage: PageId }) {
  return (
    <nav className="nav">
      {MENU.map((entry) => (
        <a
          key={entry.page}
          href={entry.href}
          aria-current={entry.page === currentPage ? 'page' : undefined}
        >
          {entry.label}
        </a>
      ))}
    </nav>
  );
}
