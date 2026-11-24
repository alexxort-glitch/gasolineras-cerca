import { normalizarEstacion } from '../services/carburantesApi.js';

function generador(semilla) {
  let s = semilla;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

const MARCAS = ['REPSOL', 'CEPSA', 'BP', 'SHELL', 'GALP', 'PLENERGY', 'BALLENOIL', 'CARREFOUR', 'ALCAMPO', 'PETROPRIX'];
const HORARIOS = [
  'L-D: 24H',
  'L-V: 06:00-22:00; S-D: 07:00-15:00',
  'L-S: 07:00-14:00 y 16:00-21:00; D: 09:00-14:00',
  'L-D: 06:00-23:00',
  'L-V: 07:00-21:00; S: 08:00-14:00',
];
const COMA = (n) => n.toFixed(3).replace('.', ',');

export function generarDemo() {
  const rnd = generador(2026);
  const centro = { lat: 40.4168, lon: -3.7038 }; // Madrid
  const crudo = [];
  for (let i = 0; i < 90; i++) {
    const marca = MARCAS[Math.floor(rnd() * MARCAS.length)];
    const lat = centro.lat + (rnd() - 0.5) * 0.45;
    const lon = centro.lon + (rnd() - 0.5) * 0.6;
    const gasolina = 1.38 + rnd() * 0.22;
    const gasoleo = gasolina - 0.08 + (rnd() - 0.5) * 0.05;
    crudo.push({
      IDEESS: String(9000 + i),
      'Rótulo': marca,
      'Dirección': `CALLE DEMO ${i + 1}`,
      'C.P.': '28' + String(100 + i).slice(-3),
      Localidad: 'MADRID',
      Municipio: 'Madrid',
      Provincia: 'MADRID',
      Horario: HORARIOS[Math.floor(rnd() * HORARIOS.length)],
      Latitud: COMA(lat),
      'Longitud (WGS84)': COMA(lon),
      'Precio Gasolina 95 E5': COMA(gasolina),
      'Precio Gasolina 98 E5': COMA(gasolina + 0.12),
      'Precio Gasoleo A': COMA(gasoleo),
      'Precio Gasoleo Premium': rnd() > 0.5 ? COMA(gasoleo + 0.1) : '',
    });
  }
  return crudo.map(normalizarEstacion);
}
