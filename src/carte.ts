import './css/carte.css';
import { montaCarte, montaRetri } from './render/carte';

const fogli = document.getElementById('sheets');
if (!fogli) throw new Error('Manca il contenitore #sheets nella pagina');
montaCarte(fogli);

const retri = document.getElementById('sheets-retro');
if (!retri) throw new Error('Manca il contenitore #sheets-retro nella pagina');
montaRetri(retri);
