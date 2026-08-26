import { createRoot } from 'react-dom/client';
import { Contratti } from './pagine/Contratti';

const radice = document.getElementById('app');
if (!radice) throw new Error('Manca il contenitore #app nella pagina');

createRoot(radice).render(<Contratti />);
