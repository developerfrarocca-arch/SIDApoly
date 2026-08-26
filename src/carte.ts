import './css/carte.css';
import { montaCarte } from './render/carte';

const fogli = document.getElementById('sheets');
if (!fogli) throw new Error('Manca il contenitore #sheets nella pagina');
montaCarte(fogli);

const sfondoEl = document.getElementById('sfondo-colorato');
if (!(sfondoEl instanceof HTMLInputElement)) {
  throw new Error('Il selettore #sfondo-colorato deve essere un input nella pagina');
}
const sfondoColorato = sfondoEl;

/** Spento il selettore, le carte perdono il fondo colorato (vedi carte.css). */
function aggiornaSfondo(): void {
  document.body.classList.toggle('senza-sfondo', !sfondoColorato.checked);
}

sfondoColorato.addEventListener('change', aggiornaSfondo);
aggiornaSfondo();
