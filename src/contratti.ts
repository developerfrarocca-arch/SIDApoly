import './css/contratti.css';
import { montaContratti, montaRetri } from './render/contratti';

const fogli = document.getElementById('sheets');
if (!fogli) throw new Error('Manca il contenitore #sheets nella pagina');
montaContratti(fogli);

const retri = document.getElementById('sheets-retro');
if (!retri) throw new Error('Manca il contenitore #sheets-retro nella pagina');
montaRetri(retri);
