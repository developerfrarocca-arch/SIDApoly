import { createRoot } from 'react-dom/client';
import { Banconote } from './pagine/Banconote';

const radice = document.getElementById('app');
if (!radice) throw new Error('Manca il contenitore #app nella pagina');

createRoot(radice).render(<Banconote />);
