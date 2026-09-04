import { createRoot } from 'react-dom/client';
import { Cover } from './pages/Cover';

const root = document.getElementById('app');
if (!root) throw new Error('Missing the #app container in the page');

createRoot(root).render(<Cover />);
