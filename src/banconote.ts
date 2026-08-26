import { montaBanconote } from './render/banconote';

const fogli = document.getElementById('sheets');
if (!fogli) throw new Error('Manca il contenitore #sheets nella pagina');
montaBanconote(fogli);
