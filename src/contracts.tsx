import { createRoot } from 'react-dom/client';
import { Contracts } from './pages/Contracts';

const root = document.getElementById('app');
if (!root) throw new Error('Missing the #app container in the page');

createRoot(root).render(<Contracts />);
