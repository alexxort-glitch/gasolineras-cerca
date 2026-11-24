import { distanciaKm, distanciaASegmentoKm } from './geo.js';
import { estaAbierta } from './horario.js';

//marcas ordenadas por número de gasolineras 
export function listarMarcas(estaciones, max = 24) {
  const cuenta = new Map();
  for (const e of estaciones) cuenta.set(e.rotulo, (cuenta.get(e.rotulo) || 0) + 1);
  return [...cuenta.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, max)
    .map(([marca]) => marca);
}


export function buscarGasolineras(estaciones, params) {
  const {
    origen, destino, radioKm, corredorKm, velocidadKmh, combustible,
    modoMarcas, marcas, soloAbiertas, orden, ahora,
  } = params;
  const lista = [];
  let sinPrecio = 0;

  for (const e of estaciones) {
    // filtro por tipo de carburante
    const precio = e.precios[combustible];
    if (precio === null || precio === undefined) { sinPrecio++; continue; }

    //filtro por empresa (lista blanca o lista negra)
    if (modoMarcas === 'incluir' && marcas.length > 0 && !marcas.includes(e.rotulo)) continue;
    if (modoMarcas === 'excluir' && marcas.includes(e.rotulo)) continue;

    //Filtro geográfico, adio alrededor del origen o corredor a lo largo de la ruta
    const distancia = distanciaKm(origen, e);
    if (destino) {
      if (distanciaASegmentoKm(e, origen, destino) > corredorKm) continue;
    } else if (distancia > radioKm) continue;

    // estará abierta cuando lleguemos?
    const minutos = (distancia / velocidadKmh) * 60;
    const llegada = new Date(ahora.getTime() + minutos * 60000);
    const abierta = estaAbierta(e.horario, llegada);
    if (soloAbiertas && abierta === false) continue;

    lista.push({ ...e, precio, distancia, minutos, llegada, abierta });
  }

  const porDistancia = (a, b) => a.distancia - b.distancia;
  const porPrecio = (a, b) => a.precio - b.precio || a.distancia - b.distancia;
  lista.sort(orden === 'precio' ? porPrecio : porDistancia);

  const masCercana = [...lista].sort(porDistancia)[0] || null;
  const masBarata = [...lista].sort(porPrecio)[0] || null;
  return { lista, masCercana, masBarata, sinPrecio };
}
