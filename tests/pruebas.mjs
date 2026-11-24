//Pruebas rápidas de la lógica
import assert from 'node:assert/strict';
import { estaAbierta, parsearHorario } from '../src/utils/horario.js';
import { distanciaKm, distanciaASegmentoKm } from '../src/utils/geo.js';
import { aNumero, normalizarEstacion, parsearRespuesta } from '../src/services/carburantesApi.js';
import { buscarGasolineras, listarMarcas } from '../src/utils/procesado.js';
import { generarDemo } from '../src/data/demo.js';

const lunes10 = new Date(2026, 10, 23, 10, 0);
const lunes23 = new Date(2026, 10, 23, 23, 30);
const domingo23 = new Date(2026, 10, 29, 23, 30);

assert.equal(estaAbierta('L-D: 24H', domingo23), true);
assert.equal(estaAbierta('L-V: 06:00-22:00; S-D: 07:00-15:00', lunes10), true);
assert.equal(estaAbierta('L-V: 06:00-22:00; S-D: 07:00-15:00', lunes23), false);
assert.equal(estaAbierta('L-V: 06:00-22:00; S-D: 07:00-15:00', domingo23), false);
assert.equal(estaAbierta('L-S: 07:00-14:00 y 16:00-21:00; D: 09:00-14:00', new Date(2026, 10, 23, 15, 0)), false);
assert.equal(estaAbierta('L-S: 07:00-14:00 y 16:00-21:00; D: 09:00-14:00', new Date(2026, 10, 23, 17, 0)), true);
assert.equal(estaAbierta('L-D: 22:00-02:00', new Date(2026, 10, 24, 1, 0)), true); // cruza medianoche
assert.equal(estaAbierta('texto raro', lunes10), null);
assert.equal(parsearHorario(''), null);


const mad = { lat: 40.4168, lon: -3.7038 }, bcn = { lat: 41.3874, lon: 2.1686 };
const d = distanciaKm(mad, bcn);
assert.ok(d > 495 && d < 515, `distancia Madrid-Barcelona: ${d}`);
// Punto sobre la ruta → ~0 km al segmento
const medio = { lat: (mad.lat + bcn.lat) / 2, lon: (mad.lon + bcn.lon) / 2 };
assert.ok(distanciaASegmentoKm(medio, mad, bcn) < 0.5);

//conversión de números con coma
assert.equal(aNumero('1,459'), 1.459);
assert.equal(aNumero(''), null);

//Normalización de un registro con el formato real de la API
const e = normalizarEstacion({
  IDEESS: '1', 'Rótulo': 'repsol ', Latitud: '40,4168', 'Longitud (WGS84)': '-3,7038',
  'Precio Gasoleo A': '1,399', 'Precio Gasolina 95 E5': '', Horario: 'L-D: 24H',
});
assert.equal(e.rotulo, 'REPSOL');
assert.equal(e.lat, 40.4168);
assert.equal(e.precios.gasoleoA, 1.399);
assert.equal(e.precios.gasolina95, null);
assert.throws(() => parsearRespuesta({}));

//Búsqueda completa con datos de demostración
const est = generarDemo();
const base = {
  origen: mad, radioKm: 8, corredorKm: 3, velocidadKmh: 50, combustible: 'gasolina95',
  modoMarcas: 'todas', marcas: [], soloAbiertas: false, orden: 'distancia', ahora: lunes10,
};
const r = buscarGasolineras(est, base);
assert.ok(r.lista.length > 0);
assert.ok(r.lista.every((x) => x.distancia <= 8));
assert.equal(r.masCercana.id, r.lista[0].id);
assert.ok(r.lista.every((x) => x.precio >= r.masBarata.precio));

const incl = buscarGasolineras(est, { ...base, modoMarcas: 'incluir', marcas: ['REPSOL'] });
assert.ok(incl.lista.every((x) => x.rotulo === 'REPSOL'));
const excl = buscarGasolineras(est, { ...base, modoMarcas: 'excluir', marcas: ['REPSOL'] });
assert.ok(excl.lista.every((x) => x.rotulo !== 'REPSOL'));

const abiertas = buscarGasolineras(est, { ...base, soloAbiertas: true, ahora: new Date(2026, 10, 23, 23, 45) });
assert.ok(abiertas.lista.every((x) => x.abierta !== false));
assert.ok(listarMarcas(est).includes('REPSOL'));

console.log('✔ Todas las pruebas han pasado');
