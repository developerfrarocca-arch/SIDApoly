import { useCallback, useEffect, useRef, useState } from 'react';
import { fitFactor, nextStep } from '../../zoom';

interface Size {
  width: number;
  height: number;
}

function availableSpaceIn(container: HTMLElement): Size {
  const style = getComputedStyle(container);
  return {
    width: container.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight),
    height: container.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom),
  };
}

export interface Zoom {
  factor: number;
  zoomIn: () => void;
  zoomOut: () => void;
  fitToWindow: () => void;
}

/** A zoom chosen by hand, remembered together with the paper it was chosen for. */
interface Chosen {
  format: unknown;
  factor: number;
}

/**
 * Keeps the sheet inside its container in both width and height, so no scrollbar
 * is needed. It observes the container and not the window, because the usable
 * space can change without a resize.
 *
 * `format` is anything that tells one paper from another (one A3, or two): when
 * it changes the zoom goes back to fitting the window, because the sheet that
 * has to fit is a different one.
 */
export function useZoom(
  container: React.RefObject<HTMLElement>,
  sheet: React.RefObject<HTMLElement>,
  format?: unknown,
): Zoom {
  const [fittedFactor, setFittedFactor] = useState(1);
  const [chosen, setChosen] = useState<Chosen | null>(null);
  // a zoom chosen for another paper is dropped instead of being carried over
  const factor = chosen && chosen.format === format ? chosen.factor : fittedFactor;

  /* The factor in force is read from a ref and not from the closure, so that
     refit() never changes: were it rebuilt at every zoom step, the effect below
     would measure again in a loop. */
  const zoomInForce = useRef(factor);
  useEffect(() => {
    zoomInForce.current = factor;
  }, [factor]);

  /* The sheet is measured through the zoom already applied to it: `zoom` scales
     the box, so dividing the measured size by the factor in force gives the size
     the sheet would have at 100%. Measuring every time instead of remembering
     the first measurement lets the paper change format without dragging a stale
     size along. */
  const refit = useCallback(() => {
    const box = container.current;
    const paper = sheet.current;
    if (!box || !paper) return;
    const available = availableSpaceIn(box);
    const measured = paper.getBoundingClientRect();
    const natural = {
      width: measured.width / zoomInForce.current,
      height: measured.height / zoomInForce.current,
    };
    setFittedFactor(Math.min(fitFactor(available.width, natural.width), fitFactor(available.height, natural.height)));
  }, [container, sheet]);

  /* `format` is among the dependencies so that changing paper measures again:
     the container has not resized, so the observer alone would not notice.
     The first measurement is taken in a microtask and not here, because setting
     state in the body of an effect makes React render twice in a row. */
  useEffect(() => {
    const observed = container.current;
    if (!observed) return;
    let live = true;
    queueMicrotask(() => live && refit());
    if (typeof ResizeObserver !== 'function') {
      window.addEventListener('resize', refit);
      return () => {
        live = false;
        window.removeEventListener('resize', refit);
      };
    }
    const observer = new ResizeObserver(refit);
    observer.observe(observed);
    return () => {
      live = false;
      observer.disconnect();
    };
  }, [container, refit, format]);

  return {
    factor,
    zoomIn: () => setChosen({ format, factor: nextStep(factor, 1) }),
    zoomOut: () => setChosen({ format, factor: nextStep(factor, -1) }),
    fitToWindow: () => {
      setChosen(null);
      refit();
    },
  };
}
