/* La plancia è un A3 orizzontale: 420mm non entrano in nessuna finestra, e
   scorrere di lato per leggerla è scomodo. A schermo si rimpicciolisce quanto
   serve perché ci stia tutta, e la si può poi regolare a mano con i comandi in
   barra laterale.

   Niente di tutto questo tocca la stampa: lo zoom vive in uno stile inline che
   @media print annulla con `zoom:1 !important`, quindi il foglio esce sempre a
   grandezza naturale, qualunque cosa si veda a schermo.

   Si usa `zoom` e non `transform: scale()`: lo zoom rifà il layout, quindi il
   contenitore si stringe con la pagina (con la scala resterebbe il vuoto
   dell'ingombro originale) e il testo viene disegnato alla misura ridotta
   invece di essere rasterizzato e sfocato. */

/** Limiti dello zoom manuale: sotto non si legge, sopra non serve. */
export const ZOOM_MIN = 0.2;
export const ZOOM_MAX = 2;

/** Di quanto si muove ogni pressione dei comandi + e −. */
export const ZOOM_PASSO = 0.1;

/** Il fattore che fa entrare `naturale` in `disponibile`, senza mai ingrandire. */
export function fattore(disponibile: number, naturale: number): number {
  if (!(disponibile > 0) || !(naturale > 0)) return 1;
  // tre decimali: più che sufficienti, e non fanno oscillare il layout
  return Math.min(1, Math.floor((disponibile / naturale) * 1000) / 1000);
}

/** Il valore dopo un passo in su o in giù, tenuto dentro i limiti. */
export function passo(attuale: number, verso: 1 | -1, ampiezza = ZOOM_PASSO): number {
  const grezzo = Math.round((attuale + verso * ampiezza) * 100) / 100;
  return Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, grezzo));
}

/** "0.609" -> "61%", come si scrive in un comando di zoom. */
export function percentuale(v: number): string {
  return `${Math.round(v * 100)}%`;
}

/** Lo spazio utile dentro il contenitore, al netto del suo padding. */
function spazioUtile(wrap: HTMLElement): { larghezza: number; altezza: number } {
  const stile = getComputedStyle(wrap);
  return {
    larghezza: wrap.clientWidth - parseFloat(stile.paddingLeft) - parseFloat(stile.paddingRight),
    altezza: wrap.clientHeight - parseFloat(stile.paddingTop) - parseFloat(stile.paddingBottom),
  };
}

/** Scrive il fattore sulla pagina; 1 significa nessuno stile, cioè misura naturale. */
function applica(pagina: HTMLElement, v: number): void {
  pagina.style.zoom = v === 1 ? '' : String(v);
}

/** L'ingombro della pagina senza zoom, misurato azzerandolo per un istante. */
function misuraNaturale(pagina: HTMLElement): { larghezza: number; altezza: number } {
  const prima = pagina.style.zoom;
  pagina.style.zoom = '1';
  const misura = { larghezza: pagina.offsetWidth, altezza: pagina.offsetHeight };
  pagina.style.zoom = prima;
  return misura;
}

/**
 * Adatta la plancia al contenitore e la applica.
 *
 * Si guarda a entrambe le dimensioni: adattando solo la larghezza la plancia
 * resterebbe più alta del riquadro, comparirebbe la barra verticale, che
 * togliendo larghezza farebbe ricalcolare l'adattamento — un inseguimento che
 * in certe misure non si fermerebbe mai. Stando dentro in altezza e larghezza,
 * di barre non ne serve nessuna.
 *
 * Torna il fattore usato (1 se la pagina ci sta già così com'è).
 */
export function adattaPlancia(wrap: HTMLElement, pagina: HTMLElement): number {
  const spazio = spazioUtile(wrap);
  const naturale = misuraNaturale(pagina);
  const scala = Math.min(
    fattore(spazio.larghezza, naturale.larghezza),
    fattore(spazio.altezza, naturale.altezza),
  );
  applica(pagina, scala);
  return scala;
}

/** I comandi in barra laterale, se la pagina li ha. */
export interface ComandiZoom {
  meno?: HTMLElement | null;
  piu?: HTMLElement | null;
  valore?: HTMLElement | null;
  adatta?: HTMLElement | null;
}

/**
 * Collega adattamento automatico e comandi manuali.
 *
 * Finché non si tocca nulla la plancia segue il contenitore: si osserva quello
 * e non la finestra, perché la larghezza utile può cambiare anche senza un
 * ridimensionamento (la comparsa di una barra di scorrimento, per esempio). Il
 * ciclo non si autoalimenta: il contenitore è dimensionato dal layout, non
 * dalla pagina che sta dentro. Al primo comando manuale l'inseguimento si
 * ferma, e "Adatta alla finestra" lo fa ripartire.
 */
export function montaAdattamento(
  wrap: HTMLElement,
  pagina: HTMLElement,
  comandi: ComandiZoom = {},
): void {
  let manuale: number | null = null;

  const mostra = (v: number): void => {
    if (comandi.valore) comandi.valore.textContent = percentuale(v);
  };

  const auto = (): void => {
    if (manuale !== null) return;
    mostra(adattaPlancia(wrap, pagina));
  };

  const manda = (v: number): void => {
    manuale = v;
    applica(pagina, v);
    mostra(v);
  };

  const attuale = (): number => Number(pagina.style.zoom) || 1;

  comandi.meno?.addEventListener('click', () => manda(passo(attuale(), -1)));
  comandi.piu?.addEventListener('click', () => manda(passo(attuale(), 1)));
  comandi.adatta?.addEventListener('click', () => {
    manuale = null;
    auto();
  });

  auto();
  if (typeof ResizeObserver === 'function') {
    new ResizeObserver(auto).observe(wrap);
  } else {
    window.addEventListener('resize', auto);
  }
}
