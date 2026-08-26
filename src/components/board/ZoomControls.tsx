import { percent } from '../../zoom';
import type { Zoom } from './useZoom';

export function ZoomControls({ zoom }: { zoom: Zoom }) {
  return (
    <>
      <div className="zoom">
        <button type="button" onClick={zoom.zoomOut} title="Riduci">
          −
        </button>
        <span>{percent(zoom.factor)}</span>
        <button type="button" onClick={zoom.zoomIn} title="Ingrandisci">
          +
        </button>
      </div>
      <button type="button" className="zoom-adatta" onClick={zoom.fitToWindow}>
        Adatta alla finestra
      </button>
    </>
  );
}
