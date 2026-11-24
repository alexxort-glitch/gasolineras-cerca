import { useState } from 'react';

//Filtro por empresa
export default function BrandFilter({ marcasDisponibles, modo, onModo, seleccion, onSeleccion }) {
  const [otra, setOtra] = useState('');

  const alternar = (marca) =>
    onSeleccion(seleccion.includes(marca) ? seleccion.filter((m) => m !== marca) : [...seleccion, marca]);

  const anadirOtra = () => {
    const marca = otra.trim().toUpperCase();
    if (marca && !seleccion.includes(marca)) onSeleccion([...seleccion, marca]);
    setOtra('');
  };

  const todas = [...new Set([...marcasDisponibles, ...seleccion])];

  return (
    <fieldset className="grupo">
      <legend>Empresas suministradoras</legend>
      <div className="radios">
        {[
          ['todas', 'Todas'],
          ['incluir', 'Solo estas (p. ej. mi tarjeta de fidelidad)'],
          ['excluir', 'Todas menos estas'],
        ].map(([valor, texto]) => (
          <label key={valor} className="radio">
            <input type="radio" name="modoMarcas" value={valor} checked={modo === valor}
              onChange={() => onModo(valor)} />
            {texto}
          </label>
        ))}
      </div>

      {modo !== 'todas' && (
        <>
          <div className="chips" role="group" aria-label="Marcas">
            {todas.map((marca) => (
              <button key={marca} type="button"
                className={`chip ${seleccion.includes(marca) ? 'chip-on' : ''}`}
                aria-pressed={seleccion.includes(marca)} onClick={() => alternar(marca)}>
                {marca}
              </button>
            ))}
          </div>
          <div className="fila-add">
            <input type="text" value={otra} placeholder="Otra marca (ej. AVIA)"
              onChange={(e) => setOtra(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); anadirOtra(); } }} />
            <button type="button" className="btn btn-sec" onClick={anadirOtra}>Añadir</button>
          </div>
        </>
      )}
    </fieldset>
  );
}
