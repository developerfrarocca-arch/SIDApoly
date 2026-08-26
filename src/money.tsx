import { createRoot } from 'react-dom/client';
import { Money } from './pages/Money';

const root = document.getElementById('app');
if (!root) throw new Error('Missing the #app container in the page');

createRoot(root).render(<Money />);
