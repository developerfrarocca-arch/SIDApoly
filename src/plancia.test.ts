import { describe, expect, it } from 'vitest';
import {
  ZOOM_MAX,
  ZOOM_MIN,
  adattaPlancia,
  fattore,
  montaAdattamento,
  passo,
  percentuale,
} from './plancia';

describe('fattore', () => {
  it('rimpicciolisce quanto serve perché la pagina ci stia', () => {
    expect(fattore(800, 1600)).toBe(0.5);
    expect(fattore(726, 1587)).toBeCloseTo(0.457, 3);
  });

  it('non ingrandisce mai: al massimo grandezza naturale', () => {
    expect(fattore(2000, 1587)).toBe(1);
    expect(fattore(1587, 1587)).toBe(1);
  });

  it('arrotonda per difetto, così non sborda di un pixel', () => {
    expect(fattore(999, 1000)).toBe(0.999);
    expect(fattore(1, 3)).toBe(0.333);
  });

  it('davanti a misure assurde non fa danni', () => {
    for (const [d, n] of [[0, 1587], [1000, 0], [-10, 100], [NaN, 100], [100, NaN]]) {
      expect(fattore(d!, n!), `${d}/${n}`).toBe(1);
    }
  });
});

describe('passo', () => {
  it('si muove di un decimo per volta, senza errori di virgola', () => {
    expect(passo(0.6, 1)).toBe(0.7);
    expect(passo(0.7, -1)).toBe(0.6);
    expect(passo(0.609, 1)).toBe(0.71);
  });

  it('non esce dai limiti', () => {
    expect(passo(ZOOM_MAX, 1)).toBe(ZOOM_MAX);
    expect(passo(ZOOM_MIN, -1)).toBe(ZOOM_MIN);
    expect(passo(0.25, -1)).toBe(ZOOM_MIN);
  });
});

describe('percentuale', () => {
  it('scrive il fattore come lo si legge in un comando di zoom', () => {
    expect(percentuale(0.609)).toBe('61%');
    expect(percentuale(1)).toBe('100%');
    expect(percentuale(1.5)).toBe('150%');
  });
});

describe('adattaPlancia', () => {
  it('prende la dimensione più stretta fra larghezza e altezza', () => {
    // la larghezza starebbe a 0.5, l'altezza no: vince l'altezza
    expect(Math.min(fattore(800, 1600), fattore(300, 1200))).toBe(0.25);
    // e viceversa
    expect(Math.min(fattore(400, 1600), fattore(900, 1200))).toBe(0.25);
  });

  it('lascia la pagina a grandezza naturale se non riesce a misurare', () => {
    // in jsdom offsetWidth è 0: il caso vale anche nel browser se la pagina è nascosta
    const wrap = document.createElement('div');
    const pagina = document.createElement('div');
    wrap.appendChild(pagina);
    document.body.appendChild(wrap);
    expect(adattaPlancia(wrap, pagina)).toBe(1);
    expect(pagina.style.zoom).toBe('');
  });
});

describe('montaAdattamento', () => {
  /** Una pagina finta con i comandi, come la barra laterale del tabellone. */
  function pagina() {
    document.body.innerHTML =
      '<div class="page-wrap"><div class="page"></div></div>' +
      '<button id="m">-</button><span id="v"></span><button id="p">+</button>' +
      '<button id="a">adatta</button>';
    const wrap = document.querySelector('.page-wrap') as HTMLElement;
    const pag = document.querySelector('.page') as HTMLElement;
    const comandi = {
      meno: document.getElementById('m'),
      piu: document.getElementById('p'),
      valore: document.getElementById('v'),
      adatta: document.getElementById('a'),
    };
    montaAdattamento(wrap, pag, comandi);
    return { pag, comandi };
  }

  it('mostra subito la percentuale in uso', () => {
    const { comandi } = pagina();
    expect(comandi.valore!.textContent).toBe('100%');
  });

  it('i comandi + e − muovono lo zoom di un passo', () => {
    const { pag, comandi } = pagina();
    comandi.piu!.click();
    expect(pag.style.zoom).toBe('1.1');
    expect(comandi.valore!.textContent).toBe('110%');
    comandi.meno!.click();
    expect(pag.style.zoom).toBe('');
    expect(comandi.valore!.textContent).toBe('100%');
    comandi.meno!.click();
    expect(pag.style.zoom).toBe('0.9');
  });

  it('non scende sotto il minimo a forza di premere', () => {
    const { pag, comandi } = pagina();
    for (let i = 0; i < 30; i++) comandi.meno!.click();
    expect(Number(pag.style.zoom)).toBe(ZOOM_MIN);
  });

  it('"Adatta alla finestra" riprende l\'inseguimento automatico', () => {
    const { pag, comandi } = pagina();
    comandi.piu!.click();
    expect(pag.style.zoom).toBe('1.1');
    comandi.adatta!.click();
    // in jsdom non ci sono misure: l'adattamento torna a grandezza naturale
    expect(pag.style.zoom).toBe('');
    expect(comandi.valore!.textContent).toBe('100%');
  });
});
