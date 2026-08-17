import './css/contratti.css';
import { montaContratti } from './render/contratti';

const fogli = document.getElementById('sheets');
if (!fogli) throw new Error('Manca il contenitore #sheets nella pagina');

montaContratti(fogli);
