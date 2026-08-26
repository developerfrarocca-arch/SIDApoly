/* Tests assert on the markup, as they did when it was built by hand with
   strings: that keeps them readable and needs no browser. */

import type { ReactElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

export function toHtml(component: ReactElement): string {
  return renderToStaticMarkup(component);
}

export function toDom(component: ReactElement): HTMLElement {
  const container = document.createElement('div');
  container.innerHTML = toHtml(component);
  return container;
}
