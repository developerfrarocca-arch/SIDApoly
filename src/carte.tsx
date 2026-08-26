import { createRoot } from 'react-dom/client';
import { Carte } from './pagine/Carte';

const radice = document.getElementById('app');
if (!radice) throw new Error('Manca il contenitore #app nella pagina');

createRoot(radice).render(<Carte />);
