import { useEffect, useState } from 'react';
import StationCard from './StationCard.jsx';
import { COMBUSTIBLES } from '../services/carburantesApi.js';

const PAGINA = 15;

//salida de datos
export default function Results({ resultado }) {
  const [visibles, setVisibles] = useState(PAGINA);
  useEffect(() => setVisibles(PAGINA), [resultado]);

  if (!resultado) {
    return (
      <section className="panel vacio" aria-live="polite">
        <h2>Resultados</h2>
        <p>Indica tu posición y el carburante, y pulsa <strong>Buscar gasolineras</strong>.</p>
      </section>
    );
  }

  const { lista, masCercana, masBarata, sinPrecio, params } = resultado;
  const nombre = COMBUSTIBLES.find((c) => c.id === params.combustible)?.nombre;

  if (lista.length === 0) {
    return (
      <section className="panel vacio" aria-live="polite">
        <h2>Resultados</h2>
        <p>No hay gasolineras con {nombre} que cumplan tus condiciones.</p>
        <p className="ayuda">Prueba a ampliar la distancia, quitar el filtro de empresas o desmarcar “solo abiertas”.</p>
      </section>
    );
  }

  const mismaEstacion = masCercana.id === masBarata.id;
  return (
    <section className="panel" aria-live="polite">
      <h2>Resultados</h2>
      <p className="resumen">
        {lista.length} gasolineras con {nombre}
        {params.destino ? ' en tu ruta' : ` en ${params.radioKm} km`}.
        {sinPrecio > 0 && ` (${sinPrecio.toLocaleString('es-ES')} no ofrecen este carburante.)`}
      </p>

      <div className="destacadas">
        {mismaEstacion ? (
          <StationCard e={masCercana} etiqueta="La más cercana y también la más barata" />
        ) : (
          <>
            <StationCard e={masCercana} etiqueta="La más cercana" />
            <StationCard e={masBarata} etiqueta="La más barata" />
          </>
        )}
      </div>

      <h3 className="subtitulo">Todas ({params.orden === 'precio' ? 'por precio' : 'por distancia'})</h3>
      <div className="lista">
        {lista.slice(0, visibles).map((e) => <StationCard key={e.id} e={e} />)}
      </div>
      {visibles < lista.length && (
        <button type="button" className="btn btn-sec" onClick={() => setVisibles((v) => v + PAGINA)}>
          Mostrar más ({lista.length - visibles} restantes)
        </button>
      )}
    </section>
  );
}
