import { useState } from 'react';
import { ubicacionPorDispositivo, ubicacionPorIP } from '../utils/geo.js';

//entrada de coordenadas manual, por GPS del dispositivo o por IP
export default function LocationPicker({ legend, valor, onChange, permitirAutomatica = true }) {
  const [aviso, setAviso] = useState('');
  const [ocupado, setOcupado] = useState(false);

  const fijar = (pos) => onChange({ lat: pos.lat.toFixed(5), lon: pos.lon.toFixed(5) });

  const usar = async (funcion, etiqueta) => {
    setOcupado(true);
    setAviso(`Obteniendo ubicación por ${etiqueta}…`);
    try {
      const pos = await funcion();
      fijar(pos);
      setAviso(`Ubicación obtenida por ${etiqueta}.`);
    } catch (e) {
      setAviso(e.message);
    } finally {
      setOcupado(false);
    }
  };

  return (
    <fieldset className="grupo">
      <legend>{legend}</legend>
      <div className="fila-2">
        <label>
          Latitud
          <input type="number" step="any" inputMode="decimal" value={valor.lat}
            onChange={(e) => onChange({ ...valor, lat: e.target.value })} placeholder="40.4168" required />
        </label>
        <label>
          Longitud
          <input type="number" step="any" inputMode="decimal" value={valor.lon}
            onChange={(e) => onChange({ ...valor, lon: e.target.value })} placeholder="-3.7038" required />
        </label>
      </div>
      {permitirAutomatica && (
        <div className="acciones">
          <button type="button" className="btn btn-sec" disabled={ocupado}
            onClick={() => usar(ubicacionPorDispositivo, 'GPS del dispositivo')}>
            Usar mi ubicación
          </button>
          <button type="button" className="btn btn-sec" disabled={ocupado}
            onClick={() => usar(ubicacionPorIP, 'IP')}>
            Localizar por IP
          </button>
        </div>
      )}
      {aviso && <p className="ayuda" aria-live="polite">{aviso}</p>}
    </fieldset>
  );
}
