import { useRef } from 'react';
import { parsearRespuesta } from '../services/carburantesApi.js';

export default function StatusBanner({ datos, onReintentar, onDemo, onCargarJson }) {
  const inputRef = useRef(null);

  const leerArchivo = async (e) => {
    const archivo = e.target.files?.[0];
    if (!archivo) return;
    try {
      const texto = (await archivo.text()).replace(/^\uFEFF/, '');
      onCargarJson(parsearRespuesta(JSON.parse(texto)), archivo.name);
    } catch (err) {
      alert('No se pudo leer el archivo: ' + err.message);
    }
    e.target.value = '';
  };

  if (datos.estado === 'cargando') {
    return (
      <div className="banner banner-info" role="status">
        <span className="spinner" aria-hidden="true" />
        Descargando precios del Ministerio… (son unos 10 000 puntos de venta, puede tardar unos segundos)
      </div>
    );
  }

  if (datos.estado === 'error') {
    return (
      <div className="banner banner-error" role="alert">
        <p>
          <strong>No se pudieron descargar los precios.</strong> {datos.error}
          {' '}Puede deberse a la conexión o a que el navegador bloquea la petición (CORS).
        </p>
        <div className="acciones">
          <button type="button" className="btn" onClick={onReintentar}>Reintentar</button>
          <button type="button" className="btn btn-sec" onClick={() => inputRef.current?.click()}>
            Cargar un JSON descargado
          </button>
          <button type="button" className="btn btn-sec" onClick={onDemo}>Usar datos de demostración</button>
          <input ref={inputRef} type="file" accept=".json,application/json" hidden onChange={leerArchivo} />
        </div>
      </div>
    );
  }

  return (
    <div className={`banner ${datos.origen === 'api' ? 'banner-ok' : 'banner-aviso'}`} role="status">
      <span>
        {datos.origen === 'api' ? 'Datos oficiales cargados' : 'Datos de demostración (ficticios)'}
        {' · '}{datos.estaciones.length.toLocaleString('es-ES')} gasolineras
        {datos.fecha ? ` · Actualización: ${datos.fecha}` : ''}
      </span>
      <button type="button" className="btn btn-link" onClick={onReintentar}>Recargar desde la API</button>
    </div>
  );
}
