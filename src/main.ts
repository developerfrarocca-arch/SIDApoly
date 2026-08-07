import './css/tabellone.css';
import { montaTabellone } from './render/tabellone';

const board = document.getElementById('board');
if (!board) throw new Error('Manca il contenitore #board nella pagina');

montaTabellone(board);
