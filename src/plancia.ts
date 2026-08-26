/* La plancia è un A3: 420mm non entrano in nessuna finestra. A schermo si
   rimpicciolisce, in stampa esce a grandezza naturale perché @media print
   annulla lo zoom con `zoom:1 !important`.

   Si usa `zoom` e non `transform: scale()`: lo zoom rifà il layout, quindi il
   contenitore si stringe con la pagina invece di lasciare il vuoto
   dell'ingombro originale, e il testo viene disegnato alla misura ridotta
   invece di essere rasterizzato e sfocato. */

export const ZOOM_MINIMO = 0.2;
export const ZOOM_MASSIMO = 2;
export const AMPIEZZA_DEL_PASSO = 0.1;

/** Mai sopra 1: la pagina non va ingrandita oltre la sua misura naturale. */
export function fattoreDiAdattamento(disponibile: number, naturale: number): number {
  if (!(disponibile > 0) || !(naturale > 0)) return 1;
  const troncatoATreDecimali = Math.floor((disponibile / naturale) * 1000) / 1000;
  return Math.min(1, troncatoATreDecimali);
}

export function passoSuccessivo(
  attuale: number,
  verso: 1 | -1,
  ampiezza = AMPIEZZA_DEL_PASSO,
): number {
  const senzaErroriDiVirgola = Math.round((attuale + verso * ampiezza) * 100) / 100;
  return Math.min(ZOOM_MASSIMO, Math.max(ZOOM_MINIMO, senzaErroriDiVirgola));
}

export function percentuale(fattore: number): string {
  return `${Math.round(fattore * 100)}%`;
}
