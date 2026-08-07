/* Genera le 40 caselle del tabellone a partire da CASELLE (js/caselle.js).
   Posizione e rotazione derivano dall'indice:
     0-10  lato basso (nessuna rotazione)    11-19 lato sinistro (rot90)
     21-29 lato alto  (rot180)               31-39 lato destro   (rot270)
   Gli angoli (0, 10, 20, 30) non ruotano. */
(function () {
  'use strict';

  const board = document.getElementById('board');
  if (!board) return;

  function posizione(i) {
    if (i === 0)  return { col: 11, row: 11, rot: '' };
    if (i < 10)   return { col: 11 - i, row: 11, rot: '' };
    if (i === 10) return { col: 1, row: 11, rot: '' };
    if (i < 20)   return { col: 1, row: 21 - i, rot: 'rot90' };
    if (i === 20) return { col: 1, row: 1, rot: '' };
    if (i < 30)   return { col: i - 19, row: 1, rot: 'rot180' };
    if (i === 30) return { col: 11, row: 1, rot: '' };
    return { col: 11, row: i - 29, rot: 'rot270' };
  }

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function prezzo(v) {
    return typeof v === 'number' ? v + ' BP' : v;
  }

  function contenuto(c) {
    if (c.tipo === 'angolo') {
      return '<div class="icon">' + esc(c.icona) + '</div>' +
             '<div class="label">' + esc(c.nome) + '</div>' +
             '<div class="sub">' + esc(c.sotto) + '</div>';
    }
    if (c.tipo === 'proprieta') {
      return '<div class="bar"></div>' +
             '<div class="dept">' + esc(c.reparto) + '</div>' +
             '<div class="name" contenteditable="true">' + esc(c.nome) + '</div>' +
             '<div class="price">' + esc(prezzo(c.prezzo)) + '</div>';
    }
    return '<div class="icon">' + esc(c.icona) + '</div>' +
           '<div class="label">' + esc(c.nome) + '</div>' +
           (c.prezzo == null ? '' : '<div class="price">' + esc(prezzo(c.prezzo)) + '</div>');
  }

  function classi(c, rot) {
    const cl = ['cell'];
    if (c.tipo === 'angolo') cl.push('corner');
    else if (c.tipo === 'proprieta') cl.push('prop', c.gruppo);
    else cl.push('special');
    if (rot) cl.push(rot);
    if (c.tipo === 'carta') cl.push('card');
    return cl.join(' ');
  }

  board.insertAdjacentHTML('beforeend', CASELLE.map(function (c, i) {
    const p = posizione(i);
    return '<div class="' + classi(c, p.rot) + '" style="grid-column:' + p.col + '/' + (p.col + 1) +
           ';grid-row:' + p.row + '/' + (p.row + 1) + ';">' +
           '<div class="inner">' + contenuto(c) + '</div></div>';
  }).join(''));
})();
