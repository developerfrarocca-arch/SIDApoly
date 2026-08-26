import { montaAdattamento } from './plancia';
import { montaTabellone } from './render/tabellone';

function elemento(selettore: string): HTMLElement {
  const el = document.querySelector(selettore);
  if (!(el instanceof HTMLElement)) throw new Error(`Manca ${selettore} nella pagina`);
  return el;
}

const board = document.getElementById('board');
if (!board) throw new Error('Manca il contenitore #board nella pagina');

montaTabellone(board);
montaAdattamento(elemento('.page-wrap'), elemento('.page'), {
  meno: document.getElementById('zoom-meno'),
  piu: document.getElementById('zoom-piu'),
  valore: document.getElementById('zoom-valore'),
  adatta: document.getElementById('zoom-adatta'),
});
