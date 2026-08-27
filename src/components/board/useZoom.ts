import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
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

/**
 * Keeps the board inside its container in both width and height, so no scrollbar
 * is needed. It observes the container and not the window, because the usable
 * space can change without a resize.
 */
export function useZoom(container: React.RefObject<HTMLElement>, page: React.RefObject<HTMLElement>): Zoom {
  const [fittedFactor, setFittedFactor] = useState(1);
  const [chosenFactor, setChosenFactor] = useState<number | null>(null);
  const naturalSize = useRef<Size | null>(null);

  // an A3 never changes size: measured at the first layout, while zoom is still 1
  useLayoutEffect(() => {
    const el = page.current;
    if (el && !naturalSize.current && el.offsetWidth > 0) {
      naturalSize.current = { width: el.offsetWidth, height: el.offsetHeight };
    }
  }, [page]);

  const refit = useCallback(() => {
    const available = container.current && availableSpaceIn(container.current);
    const natural = naturalSize.current;
    if (!available || !natural) return;
    setFittedFactor(Math.min(fitFactor(available.width, natural.width), fitFactor(available.height, natural.height)));
  }, [container]);

  useEffect(() => {
    const observed = container.current;
    if (!observed) return;
    refit();
    if (typeof ResizeObserver !== 'function') {
      window.addEventListener('resize', refit);
      return () => window.removeEventListener('resize', refit);
    }
    const observer = new ResizeObserver(refit);
    observer.observe(observed);
    return () => observer.disconnect();
  }, [container, refit]);

  const factor = chosenFactor ?? fittedFactor;
  return {
    factor,
    zoomIn: () => setChosenFactor(nextStep(factor, 1)),
    zoomOut: () => setChosenFactor(nextStep(factor, -1)),
    fitToWindow: () => {
      setChosenFactor(null);
      refit();
    },
  };
}
