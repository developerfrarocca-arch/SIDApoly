import './css/contratti.css';
import { htmlContrattiFronteRetro, montaContratti, montaRetri } from './render/contratti';

/** Legge un elemento richiesto dalla pagina, con un tipo già non nullable. */
function elemento(id: string): HTMLElement {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Manca il contenitore #${id} nella pagina`);
  return el;
}

const fogli = elemento('sheets');
const retri = elemento('sheets-retro');
const divisoreRetro = elemento('divisore-retro');
const istruzioni = elemento('istruzioni-stampa');

const fronteRetroEl = elemento('fronte-retro');
if (!(fronteRetroEl instanceof HTMLInputElement)) {
  throw new Error('Il selettore #fronte-retro deve essere un input nella pagina');
}
const fronteRetro = fronteRetroEl;

const ISTRUZIONI_PILE_SEPARATE =
  'Stampa prima i <b>fronti</b>, poi su un altro pacco di fogli i <b>retri</b>: ogni retro ' +
  'riporta il nome della sua carta, quindi va abbinato al fronte corrispondente — i due ' +
  'fogli hanno le carte nello stesso ordine. Formato <b>A4 verticale</b>.';

const ISTRUZIONI_FRONTE_RETRO =
  'Nella finestra di stampa attiva <b>Stampa fronte e retro</b> (bordo lungo): fronte e retro ' +
  'di ogni foglio combaceranno da soli, senza bisogno di abbinarli dopo il taglio. ' +
  'Formato <b>A4 verticale</b>.';

/** Rigenera i fogli secondo la modalità scelta (pile separate o fronte-retro allineato). */
function aggiorna(): void {
  fogli.innerHTML = '';
  retri.innerHTML = '';
  if (fronteRetro.checked) {
    istruzioni.innerHTML = ISTRUZIONI_FRONTE_RETRO;
    divisoreRetro.style.display = 'none';
    retri.style.display = 'none';
    fogli.insertAdjacentHTML('beforeend', htmlContrattiFronteRetro());
  } else {
    istruzioni.innerHTML = ISTRUZIONI_PILE_SEPARATE;
    divisoreRetro.style.display = '';
    retri.style.display = '';
    montaContratti(fogli);
    montaRetri(retri);
  }
}

fronteRetro.addEventListener('change', aggiorna);
aggiorna();
