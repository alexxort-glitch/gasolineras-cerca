const hora = (d) => d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

function Estado({ abierta, llegada }) {
  if (abierta === true) return <span className="estado estado-ok">Abierta a las {hora(llegada)}</span>;
  if (abierta === false) return <span className="estado estado-no">Cerrada a las {hora(llegada)}</span>;
  return <span className="estado estado-na">Horario no interpretable</span>;
}

//Tarjeta con los datos formateados de una gasolinera
export default function StationCard({ e, etiqueta }) {
  const ruta = `https://www.google.com/maps/dir/?api=1&destination=${e.lat},${e.lon}`;
  return (
    <article className="tarjeta">
      <div className="tarjeta-cuerpo">
        {etiqueta && <p className="etiqueta">{etiqueta}</p>}
        <h3>{e.rotulo}</h3>
        <p className="direccion">
          {e.direccion}{e.direccion ? ', ' : ''}{e.cp} {e.municipio} ({e.provincia})
        </p>
        <p className="datos">
          <strong>{e.distancia.toFixed(1)} km</strong> · unos {Math.max(1, Math.round(e.minutos))} min
        </p>
        <p><Estado abierta={e.abierta} llegada={e.llegada} /></p>
        <p className="horario">Horario: {e.horario || 'no indicado'}</p>
        <a className="enlace" href={ruta} target="_blank" rel="noreferrer">Cómo llegar</a>
      </div>
      <div className="cartel" aria-label={`Precio ${e.precio.toFixed(3)} euros por litro`}>
        <span className="cartel-num">{e.precio.toFixed(3).replace('.', ',')}</span>
        <span className="cartel-uni">€/litro</span>
      </div>
    </article>
  );
}
