import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { fattoreDiAdattamento, passoSuccessivo } from '../../plancia';

interface Ingombro {
  larghezza: number;
  altezza: number;
}

function spazioDisponibileDentro(contenitore: HTMLElement): Ingombro {
  const stile = getComputedStyle(contenitore);
  return {
    larghezza:
      contenitore.clientWidth - parseFloat(stile.paddingLeft) - parseFloat(stile.paddingRight),
    altezza:
      contenitore.clientHeight - parseFloat(stile.paddingTop) - parseFloat(stile.paddingBottom),
  };
}

export interface Zoom {
  valore: number;
  ingrandisci: () => void;
  rimpicciolisci: () => void;
  adattaAllaFinestra: () => void;
}

/**
 * Tiene la plancia dentro il contenitore in larghezza e in altezza, così non
 * serve nessuna barra di scorrimento. Osserva il contenitore e non la finestra,
 * perché lo spazio utile può cambiare anche senza un ridimensionamento.
 */
export function usaZoom(
  contenitore: React.RefObject<HTMLElement>,
  pagina: React.RefObject<HTMLElement>,
): Zoom {
  const [zoomAdattato, setZoomAdattato] = useState(1);
  const [zoomScelto, setZoomScelto] = useState<number | null>(null);
  const ingombroNaturale = useRef<Ingombro | null>(null);

  // un A3 non cambia mai misura: si legge al primo layout, quando lo zoom è 1
  useLayoutEffect(() => {
    const el = pagina.current;
    if (el && !ingombroNaturale.current && el.offsetWidth > 0) {
      ingombroNaturale.current = { larghezza: el.offsetWidth, altezza: el.offsetHeight };
    }
  }, [pagina]);

  const riadatta = useCallback(() => {
    const spazio = contenitore.current && spazioDisponibileDentro(contenitore.current);
    const naturale = ingombroNaturale.current;
    if (!spazio || !naturale) return;
    setZoomAdattato(
      Math.min(
        fattoreDiAdattamento(spazio.larghezza, naturale.larghezza),
        fattoreDiAdattamento(spazio.altezza, naturale.altezza),
      ),
    );
  }, [contenitore]);

  useEffect(() => {
    const daOsservare = contenitore.current;
    if (!daOsservare) return;
    riadatta();
    if (typeof ResizeObserver !== 'function') {
      window.addEventListener('resize', riadatta);
      return () => window.removeEventListener('resize', riadatta);
    }
    const osservatore = new ResizeObserver(riadatta);
    osservatore.observe(daOsservare);
    return () => osservatore.disconnect();
  }, [contenitore, riadatta]);

  const valore = zoomScelto ?? zoomAdattato;
  return {
    valore,
    ingrandisci: () => setZoomScelto(passoSuccessivo(valore, 1)),
    rimpicciolisci: () => setZoomScelto(passoSuccessivo(valore, -1)),
    adattaAllaFinestra: () => {
      setZoomScelto(null);
      riadatta();
    },
  };
}
