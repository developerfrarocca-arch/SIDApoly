/* I test asseriscono sul markup, come quando era costruito a mano con le
   stringhe: così restano leggibili e non serve un browser. */

import type { ReactElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

export function rendi(componente: ReactElement): string {
  return renderToStaticMarkup(componente);
}

export function monta(componente: ReactElement): HTMLElement {
  const contenitore = document.createElement('div');
  contenitore.innerHTML = rendi(componente);
  return contenitore;
}
