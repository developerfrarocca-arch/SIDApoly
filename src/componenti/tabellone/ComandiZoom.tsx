import { percentuale } from '../../plancia';
import type { Zoom } from './usaZoom';

export function ComandiZoom({ zoom }: { zoom: Zoom }) {
  return (
    <>
      <div className="zoom">
        <button type="button" onClick={zoom.rimpicciolisci} title="Riduci">
          −
        </button>
        <span>{percentuale(zoom.valore)}</span>
        <button type="button" onClick={zoom.ingrandisci} title="Ingrandisci">
          +
        </button>
      </div>
      <button type="button" className="zoom-adatta" onClick={zoom.adattaAllaFinestra}>
        Adatta alla finestra
      </button>
    </>
  );
}
