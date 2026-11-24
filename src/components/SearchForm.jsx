import { useState } from 'react';
import LocationPicker from './LocationPicker.jsx';
import BrandFilter from './BrandFilter.jsx';
import { COMBUSTIBLES } from '../services/carburantesApi.js';

const VACIO = { lat: '', lon: '' };

//entrada de datos
export default function SearchForm({ marcasDisponibles, listo, onBuscar }) {
  const [origen, setOrigen] = useState({ lat: '40.41680', lon: '-3.70380' });
  const [conRuta, setConRuta] = useState(false);
  const [destino, setDestino] = useState(VACIO);
  const [radioKm, setRadioKm] = useState(10);
  const [corredorKm, setCorredorKm] = useState(3);
  const [velocidad, setVelocidad] = useState(50);
  const [combustible, setCombustible] = useState('gasolina95');
  const [modoMarcas, setModoMarcas] = useState('todas');
  const [marcas, setMarcas] = useState([]);
  const [soloAbiertas, setSoloAbiertas] = useState(true);
  const [orden, setOrden] = useState('distancia');
  const [error, setError] = useState('');

  const enviar = (e) => {
    e.preventDefault();
    const o = { lat: parseFloat(origen.lat), lon: parseFloat(origen.lon) };
    const d = { lat: parseFloat(destino.lat), lon: parseFloat(destino.lon) };
    const valida = (p) => Number.isFinite(p.lat) && Number.isFinite(p.lon) &&
      Math.abs(p.lat) <= 90 && Math.abs(p.lon) <= 180;

    if (!valida(o)) return setError('Las coordenadas de origen no son válidas (latitud −90 a 90, longitud −180 a 180).');
    if (conRuta && !valida(d)) return setError('Las coordenadas de destino no son válidas.');
    if (modoMarcas !== 'todas' && marcas.length === 0)
      return setError('Elige al menos una empresa o selecciona “Todas”.');

    setError('');
    onBuscar({
      origen: o,
      destino: conRuta ? d : null,
      radioKm: Number(radioKm),
      corredorKm: Number(corredorKm),
      velocidadKmh: Math.max(5, Number(velocidad)),
      combustible, modoMarcas, marcas, soloAbiertas, orden,
    });
  };

  return (
    <form className="panel" onSubmit={enviar} noValidate>
      <h2>Tu búsqueda</h2>

      <LocationPicker legend="¿Desde dónde sales?" valor={origen} onChange={setOrigen} />

      <label className="check">
        <input type="checkbox" checked={conRuta} onChange={(e) => setConRuta(e.target.checked)} />
        Tengo un destino: buscar a lo largo de la ruta
      </label>
      {conRuta && (
        <>
          <LocationPicker legend="¿A dónde vas?" valor={destino} onChange={setDestino} permitirAutomatica={false} />
          <label>
            Desvío máximo respecto a la ruta: <strong>{corredorKm} km</strong>
            <input type="range" min="1" max="15" value={corredorKm}
              onChange={(e) => setCorredorKm(e.target.value)} />
          </label>
        </>
      )}

      {!conRuta && (
        <label>
          Distancia máxima: <strong>{radioKm} km</strong>
          <input type="range" min="1" max="50" value={radioKm}
            onChange={(e) => setRadioKm(e.target.value)} />
        </label>
      )}

      <div className="fila-2">
        <label>
          Carburante
          <select value={combustible} onChange={(e) => setCombustible(e.target.value)}>
            {COMBUSTIBLES.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
          </select>
        </label>
        <label>
          Velocidad media (km/h)
          <input type="number" min="5" max="130" value={velocidad}
            onChange={(e) => setVelocidad(e.target.value)} />
        </label>
      </div>

      <BrandFilter marcasDisponibles={marcasDisponibles} modo={modoMarcas} onModo={setModoMarcas}
        seleccion={marcas} onSeleccion={setMarcas} />

      <label className="check">
        <input type="checkbox" checked={soloAbiertas} onChange={(e) => setSoloAbiertas(e.target.checked)} />
        Mostrar solo las que estarán abiertas cuando llegue
      </label>

      <label>
        Ordenar por
        <select value={orden} onChange={(e) => setOrden(e.target.value)}>
          <option value="distancia">Más cercana primero</option>
          <option value="precio">Más barata primero</option>
        </select>
      </label>

      {error && <p className="error-form" role="alert">{error}</p>}

      <button type="submit" className="btn btn-principal" disabled={!listo}>
        {listo ? 'Buscar gasolineras' : 'Esperando los datos…'}
      </button>
    </form>
  );
}
