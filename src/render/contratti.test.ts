import { describe, expect, it } from 'vitest';
import { CASELLE } from '../dati/caselle';
import {
  CANONI_CONSULENZA,
  CONTRATTI,
  INDICI_CONSULENZA,
  INDICI_SERVIZI,
  type DatiContratto,
} from '../dati/contratti';
import {
  CARTE_PER_FOGLIO,
  bp,
  classiCarta,
  contratti,
  fogli,
  htmlContratti,
  htmlContrattiFronteRetro,
  htmlContratto,
  htmlRetri,
  htmlRetroCarta,
  montaContratti,
  montaContrattiFronteRetro,
  montaRetri,
  numero,
} from './contratti';

const CARTE = contratti();

describe('dati dei contratti', () => {
  it('ha un contratto per ognuna delle 22 caselle prodotto/servizio', () => {
    const indiciProprieta = [...CASELLE.entries()]
      .filter(([, c]) => c.tipo === 'proprieta')
      .map(([i]) => i);
    expect(indiciProprieta).toHaveLength(22);
    expect(Object.keys(CONTRATTI).map(Number).sort((a, b) => a - b)).toEqual(indiciProprieta);
  });

  it('non ha contratti per caselle che non sono proprietà', () => {
    for (const chiave of Object.keys(CONTRATTI)) {
      expect(CASELLE[Number(chiave)]!.tipo, `casella ${chiave}`).toBe('proprieta');
    }
  });

  it('tiene i canoni crescenti dal solo servizio alla Major Release', () => {
    for (const [i, { canoni }] of Object.entries(CONTRATTI) as [string, DatiContratto][]) {
      const scala = [canoni.solo, ...canoni.aggiornamenti, canoni.release];
      for (let n = 1; n < scala.length; n++) {
        expect(scala[n]!, `casella ${i}, passo ${n}`).toBeGreaterThan(scala[n - 1]!);
      }
    }
  });

  it('non fa mai costare l ipoteca più della metà del prezzo di acquisto', () => {
    for (const [chiave, dati] of Object.entries(CONTRATTI)) {
      const casella = CASELLE[Number(chiave)]!;
      const prezzo = casella.tipo === 'proprieta' ? casella.prezzo : 0;
      expect(dati.ipoteca, `casella ${chiave}`).toBe(Number(prezzo) / 2);
    }
  });

  it('punta alle caselle Consulenza e servizio giuste', () => {
    for (const i of INDICI_CONSULENZA) expect(CASELLE[i]!.nome).toMatch(/^Consulenza /);
    expect(INDICI_SERVIZI.map((i) => CASELLE[i]!.nome)).toEqual(['Enel', 'Impianto clima']);
  });

  it('raddoppia il canone Consulenza a ogni casella in più', () => {
    for (let n = 1; n < CANONI_CONSULENZA.length; n++) {
      expect(CANONI_CONSULENZA[n]).toBe(CANONI_CONSULENZA[n - 1]! * 2);
    }
  });
});

describe('contratti', () => {
  it('produce 28 carte: 22 proprietà, 4 Consulenza e 2 servizi', () => {
    expect(CARTE).toHaveLength(28);
    const per = (t: string) => CARTE.filter((c) => c.tipo === t).length;
    expect(per('proprieta')).toBe(22);
    expect(per('consulenza')).toBe(4);
    expect(per('servizio')).toBe(2);
  });

  it('segue l ordine del tabellone e non ripete le caselle', () => {
    const indici = CARTE.map((c) => c.indice);
    expect([...indici].sort((a, b) => a - b)).toEqual(indici);
    expect(new Set(indici).size).toBe(indici.length);
  });

  it('salta angoli, carte, Tasse e Intrè', () => {
    const esclusi = CARTE.map((c) => c.casella.nome);
    expect(esclusi).not.toContain('Tasse');
    expect(esclusi).not.toContain('Intrè');
    expect(esclusi).not.toContain('Imprevisti');
    expect(esclusi).not.toContain('Avvio sprint!');
  });

  it('si accorge se manca il contratto di una proprietà', () => {
    const senzaCanoni = [
      { tipo: 'proprieta', gruppo: 'red', reparto: 'Didattica', nome: 'Nuovo', prezzo: 100 },
    ] as const;
    expect(() => contratti(senzaCanoni)).toThrow(/Manca il contratto/);
  });
});

describe('formattazione', () => {
  it('usa il punto come separatore delle migliaia', () => {
    expect(numero(60)).toBe('60');
    expect(numero(1150)).toBe('1.150');
    expect(numero(2000)).toBe('2.000');
    expect(bp(320)).toBe('320 BP');
  });
});

describe('markup delle carte', () => {
  it('colora la fascia col gruppo e usa il testo bianco solo sui colori scuri', () => {
    const perGruppo = (g: string) =>
      classiCarta(CARTE.find((c) => c.tipo === 'proprieta' && c.casella.gruppo === g)!);
    expect(perGruppo('yellow')).toBe('contract g-yellow');
    expect(perGruppo('darkblue')).toBe('contract g-darkblue scuro');
    expect(perGruppo('brown')).toBe('contract g-brown scuro');
    expect(classiCarta(CARTE.find((c) => c.tipo === 'consulenza')!)).toBe('contract g-societa');
  });

  it('stampa prezzo, canoni, costi e ipoteca di una proprietà', () => {
    const carta = htmlContratto(CARTE.find((c) => c.indice === 39)!);
    expect(carta).toContain('Questo contratto vale <b>1.000 BP</b>');
    expect(carta).toContain('SIDA PagoPa');
    expect(carta).toContain('Sportello');
    expect(carta).toContain('125 BP'); // canone base
    expect(carta).toContain('5.000'); // canone con Major Release
    expect(carta).toContain('500 BP'); // costo Aggiornamento e ipoteca
    expect(carta).toContain('Valore ipotecario');
  });

  it('usa il testo dei dadi per Enel e Impianto clima', () => {
    const carta = htmlContratto(CARTE.find((c) => c.tipo === 'servizio')!);
    expect(carta).toContain('4 volte');
    expect(carta).toContain('10 volte');
    expect(carta).not.toContain('Aggiornamenti');
  });

  it('rimpicciolisce i nomi lunghi', () => {
    const lungo = htmlContratto(CARTE.find((c) => c.casella.nome === 'SIDA Drive Controller')!);
    const corto = htmlContratto(CARTE.find((c) => c.casella.nome === 'Tachigrafo')!);
    expect(lungo).toContain('class="title lungo"');
    expect(corto).toContain('class="title"');
  });

  it('rende i nomi modificabili come sul tabellone', () => {
    expect(htmlContratto(CARTE[0]!)).toContain('contenteditable="true"');
  });
});

describe('impaginazione', () => {
  it('mette 9 carte per foglio senza perderne nessuna', () => {
    const gruppi = fogli(CARTE);
    expect(gruppi).toHaveLength(4);
    expect(gruppi.map((g) => g.length)).toEqual([9, 9, 9, 1]);
    expect(gruppi.flat()).toEqual([...CARTE]);
    expect(CARTE_PER_FOGLIO).toBe(9);
  });

  it('rifiuta un numero di carte per foglio non valido', () => {
    expect(() => fogli(CARTE, 0)).toThrow(RangeError);
    expect(() => fogli(CARTE, 2.5)).toThrow(RangeError);
  });

  it('numera i fogli', () => {
    const html = htmlContratti();
    expect(html).toContain('foglio 1');
    expect(html).toContain('foglio 4');
    expect(html).not.toContain('foglio 5');
  });
});

describe('montaContratti', () => {
  it('crea i fogli e le 28 carte nel contenitore', () => {
    const root = document.createElement('div');
    montaContratti(root);
    expect(root.querySelectorAll('.sheet')).toHaveLength(4);
    expect(root.querySelectorAll('.contract')).toHaveLength(28);
    expect(root.querySelectorAll('.contract .mortgage')).toHaveLength(28);
    // ogni carta è collegata alla sua casella sul tabellone
    const indici = [...root.querySelectorAll('.contract')].map((c) =>
      Number(c.getAttribute('data-casella')),
    );
    expect(indici).toEqual(CARTE.map((c) => c.indice));
  });
});

describe('retro delle carte', () => {
  it('è identico per ogni carta, senza dati della casella', () => {
    const retro = htmlRetroCarta();
    expect(retro).toContain('contract-back');
    expect(retro).not.toContain('data-casella');
  });

  it('segue lo stesso numero di fogli e carte per foglio dei fronti', () => {
    const html = htmlRetri();
    expect(html).toContain('retro 1');
    expect(html).toContain('retro 4');
    expect(html).not.toContain('retro 5');
  });

  it('monta lo stesso numero di retri dei fronti, in fogli separati', () => {
    const root = document.createElement('div');
    montaRetri(root);
    expect(root.querySelectorAll('.sheet-retro')).toHaveLength(4);
    expect(root.querySelectorAll('.contract-back')).toHaveLength(28);
  });
});

describe('fogli fronte-retro allineati', () => {
  it('alterna un foglio di fronti e uno di retro per ogni gruppo di carte', () => {
    const html = htmlContrattiFronteRetro();
    expect(html.indexOf('foglio 1')).toBeLessThan(html.indexOf('retro 1'));
    expect(html.indexOf('retro 1')).toBeLessThan(html.indexOf('foglio 2'));
    expect(html.indexOf('foglio 4')).toBeLessThan(html.indexOf('retro 4'));
    expect(html).not.toContain('foglio 5');
    expect(html).not.toContain('retro 5');
  });

  it('monta lo stesso numero di fronti e retri, nello stesso contenitore', () => {
    const root = document.createElement('div');
    montaContrattiFronteRetro(root);
    expect(root.querySelectorAll('.sheet:not(.sheet-retro)')).toHaveLength(4);
    expect(root.querySelectorAll('.sheet-retro')).toHaveLength(4);
    expect(root.querySelectorAll('.contract')).toHaveLength(28);
    expect(root.querySelectorAll('.contract-back')).toHaveLength(28);
    // il primo foglio di fronti precede il primo foglio di retro nel DOM
    const sezioni = [...root.querySelectorAll('section.sheet')];
    expect(sezioni[0]!.classList.contains('sheet-retro')).toBe(false);
    expect(sezioni[1]!.classList.contains('sheet-retro')).toBe(true);
  });
});
