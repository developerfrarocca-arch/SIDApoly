import { createRoot } from 'react-dom/client';
import { Cards } from './pages/Cards';

const root = document.getElementById('app');
if (!root) throw new Error('Missing the #app container in the page');

createRoot(root).render(<Cards />);
