import { useCallback, useEffect, useMemo, useState } from 'react';
import SearchForm from './components/SearchForm.jsx';
import Results from './components/Results.jsx';
import StatusBanner from './components/StatusBanner.jsx';
import { obtenerEstaciones } from './services/carburantesApi.js';
import { generarDemo } from './data/demo.js';
import { buscarGasolineras, listarMarcas } from './utils/procesado.js';

export default function App() {
  const [datos, setDatos] = useState({ estado: 'cargando', estaciones: [], fecha: '', origen: 'api', error: '' });
  const [resultado, setResultado] = useState(null);

  //Petición de AJAX a la API REST al abrir la página y al pulsar recargar
  const cargar = useCallback(async () => {
    setDatos((d) => ({ ...d, estado: 'cargando', error: '' }));
    try {
      const { estaciones, fecha } = await obtenerEstaciones();
      setDatos({ estado: 'listo', estaciones, fecha, origen: 'api', error: '' });
    } catch (e) {
      setDatos({ estado: 'error', estaciones: [], fecha: '', origen: 'api', error: e.message });
    }
  }, []);

  useEffect(() => { cargar(); }, [cargar]);

  const usarDemo = () =>
    setDatos({ estado: 'listo', estaciones: generarDemo(), fecha: '', origen: 'demo', error: '' });

  const cargarJson = ({ estaciones, fecha }, nombre) =>
    setDatos({ estado: 'listo', estaciones, fecha: fecha || nombre, origen: 'api', error: '' });

  const marcas = useMemo(() => listarMarcas(datos.estaciones), [datos.estaciones]);

  const buscar = (params) => {
    const r = buscarGasolineras(datos.estaciones, { ...params, ahora: new Date() });
    setResultado({ ...r, params });
  };

  return (
    <div className="pagina">
      <header className="cabecera">
        <h1>Gasolineras cercanas</h1>
        <p>Precios oficiales de carburantes en España: encuentra la más cercana, la más barata y si estará abierta cuando llegues.</p>
      </header>

      <StatusBanner datos={datos} onReintentar={cargar} onDemo={usarDemo} onCargarJson={cargarJson} />

      <main className="rejilla">
        <SearchForm marcasDisponibles={marcas} listo={datos.estado === 'listo'} onBuscar={buscar} />
        <Results resultado={resultado} />
      </main>

      <footer className="pie">
        Fuente: Ministerio para la Transformación Digital y de la Función Pública, vía datos.gob.es.
      </footer>
    </div>
  );
}
