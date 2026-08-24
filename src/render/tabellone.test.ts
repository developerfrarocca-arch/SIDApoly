import { describe, expect, it } from 'vitest';
import { CASELLE, NUMERO_CASELLE, type Casella, type Gruppo } from '../dati/caselle';
import { classi, contenuto, esc, htmlCasella, montaTabellone, posizione, prezzo } from './tabellone';

const indici = [...Array(NUMERO_CASELLE).keys()];
const ANGOLI = [0, 10, 20, 30];

describe('posizione', () => {
  it('mette tutte le caselle sul perimetro della griglia 11x11', () => {
    for (const i of indici) {
      const { col, row } = posizione(i);
      const sulBordo = col === 1 || col === 11 || row === 1 || row === 11;
      expect(sulBordo, `casella ${i} in col ${col} row ${row}`).toBe(true);
      expect(col).toBeGreaterThanOrEqual(1);
      expect(col).toBeLessThanOrEqual(11);
      expect(row).toBeGreaterThanOrEqual(1);
      expect(row).toBeLessThanOrEqual(11);
    }
  });

  it('non sovrappone due caselle nella stessa cella', () => {
    const usate = new Set(indici.map((i) => `${posizione(i).col}:${posizione(i).row}`));
    expect(usate.size).toBe(NUMERO_CASELLE);
  });

  it('procede in senso orario partendo dall angolo in basso a destra', () => {
    expect(posizione(0)).toEqual({ col: 11, row: 11, rot: '' });
    expect(posizione(10)).toEqual({ col: 1, row: 11, rot: '' });
    expect(posizione(20)).toEqual({ col: 1, row: 1, rot: '' });
    expect(posizione(30)).toEqual({ col: 11, row: 1, rot: '' });
    expect(posizione(39)).toEqual({ col: 11, row: 10, rot: 'rot270' });
  });

  it('ruota il contenuto secondo il lato, lasciando gli angoli diritti', () => {
    for (const i of ANGOLI) expect(posizione(i).rot).toBe('');
    for (const i of indici) {
      if (ANGOLI.includes(i)) continue;
      const atteso = i < 10 ? '' : i < 20 ? 'rot90' : i < 30 ? 'rot180' : 'rot270';
      expect(posizione(i).rot, `casella ${i}`).toBe(atteso);
    }
  });

  it('rifiuta gli indici fuori dal tabellone', () => {
    expect(() => posizione(-1)).toThrow(RangeError);
    expect(() => posizione(40)).toThrow(RangeError);
    expect(() => posizione(1.5)).toThrow(RangeError);
  });
});

describe('dati delle caselle', () => {
  it('ha 40 caselle', () => {
    expect(CASELLE).toHaveLength(NUMERO_CASELLE);
  });

  it('ha 4 angoli, 22 proprieta, 8 speciali e 6 caselle carta', () => {
    const per = (t: Casella['tipo']) => CASELLE.filter((c) => c.tipo === t).length;
    expect(per('angolo')).toBe(4);
    expect(per('proprieta')).toBe(22);
    expect(per('speciale')).toBe(8);
    expect(per('carta')).toBe(6);
  });

  it('mette gli angoli negli indici 0, 10, 20, 30', () => {
    expect(indici.filter((i) => CASELLE[i]!.tipo === 'angolo')).toEqual(ANGOLI);
  });

  it('rispetta la dimensione dei gruppi colore del Monopoli classico', () => {
    const attese: Record<Gruppo, number> = {
      brown: 2,
      lightblue: 3,
      pink: 3,
      orange: 3,
      red: 3,
      yellow: 3,
      green: 3,
      darkblue: 2,
    };
    for (const [gruppo, quante] of Object.entries(attese)) {
      const trovate = CASELLE.filter((c) => c.tipo === 'proprieta' && c.gruppo === gruppo);
      expect(trovate, gruppo).toHaveLength(quante);
      // dentro un gruppo il reparto deve essere sempre lo stesso
      const reparti = new Set(trovate.map((c) => (c.tipo === 'proprieta' ? c.reparto : '')));
      expect(reparti.size, `reparti di ${gruppo}`).toBe(1);
    }
  });

  it('mantiene la scala dei prezzi approvata (contratti aggiornati x2,5)', () => {
    const prezzi = CASELLE.filter((c) => c.tipo === 'proprieta').map((c) =>
      c.tipo === 'proprieta' ? c.prezzo : 0,
    );
    expect(prezzi).toEqual([
      150, 150, 250, 250, 300, 350, 350, 400, 450, 450, 500, 550, 550, 600, 650, 650, 700, 750,
      750, 800, 900, 1000,
    ]);
  });

  it('ha le 4 Consulenza e le 2 societa fra le caselle speciali', () => {
    const nomi = CASELLE.filter((c) => c.tipo === 'speciale').map((c) => c.nome);
    expect(nomi.filter((n) => n.startsWith('Consulenza '))).toHaveLength(4);
    expect(nomi).toContain('Enel');
    expect(nomi).toContain('Impianto clima');
  });

  it('ha 3 Imprevisti e 3 Probabilita', () => {
    const nomi = CASELLE.filter((c) => c.tipo === 'carta').map((c) => c.nome);
    expect(nomi.filter((n) => n === 'Imprevisti')).toHaveLength(3);
    expect(nomi.filter((n) => n === 'Probabilità')).toHaveLength(3);
  });

  it('non lascia campi vuoti', () => {
    for (const [i, c] of CASELLE.entries()) {
      expect(c.nome, `casella ${i}`).toBeTruthy();
      if (c.tipo !== 'proprieta') expect(c.icona, `casella ${i}`).toBeTruthy();
      if (c.tipo === 'angolo') expect(c.sotto, `casella ${i}`).toBeTruthy();
      if (c.tipo === 'proprieta') expect(c.reparto, `casella ${i}`).toBeTruthy();
    }
  });
});

describe('markup', () => {
  it('formatta il prezzo numerico in BP e lascia intatto quello testuale', () => {
    expect(prezzo(240)).toBe('240 BP');
    expect(prezzo('Paga 200 BP')).toBe('Paga 200 BP');
  });

  it('fa escape dei caratteri HTML', () => {
    expect(esc('R&D <sviluppo>')).toBe('R&amp;D &lt;sviluppo&gt;');
    const html = contenuto({
      tipo: 'proprieta',
      gruppo: 'red',
      reparto: 'R&D',
      nome: '<script>',
      prezzo: 100,
    });
    expect(html).toContain('R&amp;D');
    expect(html).not.toContain('<script>');
  });

  it('aggiunge la classe card solo alle caselle senza prezzo', () => {
    expect(classi({ tipo: 'carta', icona: '?', nome: 'Probabilità' }, 'rot90')).toBe(
      'cell special rot90 card',
    );
    expect(classi({ tipo: 'speciale', icona: '!', nome: 'Consulenza Nord', prezzo: 200 }, 'rot90')).toBe(
      'cell special rot90',
    );
  });

  it('rende le proprieta modificabili e le altre caselle no', () => {
    const proprieta = CASELLE.findIndex((c) => c.tipo === 'proprieta');
    const carta = CASELLE.findIndex((c) => c.tipo === 'carta');
    expect(htmlCasella(CASELLE[proprieta]!, proprieta)).toContain('contenteditable="true"');
    expect(htmlCasella(CASELLE[carta]!, carta)).not.toContain('contenteditable');
  });
});

describe('montaTabellone', () => {
  /** Firma del tabellone: classi + posizione + testo di ogni cella, ordinata. */
  function firma(board: HTMLElement): string {
    return [...board.querySelectorAll(':scope > .cell')]
      .map((c) => {
        const testo = [...c.querySelectorAll('.inner > *')]
          .map((e) => `${e.className}=${e.textContent?.trim()}`)
          .join('|');
        return `${c.className} [${c.getAttribute('style')}] ${testo}`;
      })
      .sort()
      .join('\n');
  }

  function hash(s: string): number {
    let h = 0;
    for (const ch of s) h = (h * 31 + ch.charCodeAt(0)) | 0;
    return h;
  }

  it('crea 40 celle senza toccare il centro già presente', () => {
    const board = document.createElement('div');
    board.className = 'board';
    board.innerHTML = '<div class="center">centro</div>';
    montaTabellone(board);

    expect(board.querySelectorAll(':scope > .cell')).toHaveLength(NUMERO_CASELLE);
    expect(board.querySelector('.center')).not.toBeNull();
    expect(board.querySelectorAll('.corner')).toHaveLength(4);
    expect(board.querySelectorAll('.prop')).toHaveLength(22);
    expect(board.querySelectorAll('.special')).toHaveLength(14);
    expect(board.querySelectorAll('.special.card')).toHaveLength(6);
  });

  it('produce lo stesso tabellone della versione statica verificata nel browser', () => {
    // Valori catturati dal tabellone approvato (con le 4 caselle Consulenza): se cambiano,
    // il tabellone stampato non è più identico a quello approvato.
    const board = document.createElement('div');
    montaTabellone(board);
    const f = firma(board);
    expect(f.length).toBe(3971);
    expect(hash(f)).toBe(2351148);
  });
});
