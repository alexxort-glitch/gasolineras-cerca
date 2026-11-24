export const API_URL =
  'https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/';

//Combustibles soportados
export const COMBUSTIBLES = [
  { id: 'gasolina95', nombre: 'Gasolina 95 E5', campo: 'Precio Gasolina 95 E5' },
  { id: 'gasolina95e10', nombre: 'Gasolina 95 E10', campo: 'Precio Gasolina 95 E10' },
  { id: 'gasolina95prem', nombre: 'Gasolina 95 E5 Premium', campo: 'Precio Gasolina 95 E5 Premium' },
  { id: 'gasolina98', nombre: 'Gasolina 98 E5', campo: 'Precio Gasolina 98 E5' },
  { id: 'gasoleoA', nombre: 'Gasóleo A', campo: 'Precio Gasoleo A' },
  { id: 'gasoleoPrem', nombre: 'Gasóleo Premium', campo: 'Precio Gasoleo Premium' },
  { id: 'gasoleoB', nombre: 'Gasóleo B (agrícola)', campo: 'Precio Gasoleo B' },
  { id: 'glp', nombre: 'Gases licuados (GLP)', campo: 'Precio Gases licuados del petróleo' },
  { id: 'gnc', nombre: 'Gas natural comprimido', campo: 'Precio Gas Natural Comprimido' },
];

//la API devuelve los números con coma decimál y como texto 
export function aNumero(texto) {
  if (texto === undefined || texto === null || String(texto).trim() === '') return null;
  const n = parseFloat(String(texto).replace(',', '.'));
  return Number.isFinite(n) ? n : null;
}

//convierte un registro en bruto de la API a un objeto limpio y manejable
export function normalizarEstacion(raw) {
  const precios = {};
  for (const c of COMBUSTIBLES) precios[c.id] = aNumero(raw[c.campo]);
  return {
    id: raw.IDEESS,
    rotulo: (raw['Rótulo'] || 'SIN ROTULAR').trim().toUpperCase(),
    direccion: (raw['Dirección'] || '').trim(),
    cp: raw['C.P.'] || '',
    localidad: (raw.Localidad || '').trim(),
    municipio: (raw.Municipio || '').trim(),
    provincia: (raw.Provincia || '').trim(),
    horario: (raw.Horario || '').trim(),
    lat: aNumero(raw.Latitud),
    lon: aNumero(raw['Longitud (WGS84)']),
    precios,
  };
}

//Procesa el JSON completo de la API 
export function parsearRespuesta(datos) {
  if (!datos || !Array.isArray(datos.ListaEESSPrecio)) {
    throw new Error('La respuesta no tiene el formato esperado (falta ListaEESSPrecio).');
  }
  const estaciones = datos.ListaEESSPrecio.map(normalizarEstacion).filter(
    (e) => e.lat !== null && e.lon !== null
  );
  return { fecha: datos.Fecha || '', estaciones };
}

//Llamada AJAX a la API REST
export async function obtenerEstaciones({ signal } = {}) {
  const respuesta = await fetch(API_URL, {
    method: 'GET',
    headers: { Accept: 'application/json' },
    signal,
  });
  if (!respuesta.ok) {
    throw new Error(`El servicio respondió con el código HTTP ${respuesta.status}.`);
  }
  
  const texto = (await respuesta.text()).replace(/^\uFEFF/, '');
  return parsearRespuesta(JSON.parse(texto));
}
