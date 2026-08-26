import { createRoot } from 'react-dom/client';
import { Tabellone } from './pagine/Tabellone';

const radice = document.getElementById('app');
if (!radice) throw new Error('Manca il contenitore #app nella pagina');

createRoot(radice).render(<Tabellone />);
