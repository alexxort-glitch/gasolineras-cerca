const R_TIERRA_KM = 6371;
const rad = (g) => (g * Math.PI) / 180;

//Distancia entre dos puntos sobre la esfera terrestre 
export function distanciaKm(a, b) {
  const dLat = rad(b.lat - a.lat);
  const dLon = rad(b.lon - a.lon);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * R_TIERRA_KM * Math.asin(Math.sqrt(h));
}


//Se usa una proyección plana local, suficiente para distancias de unos cientos de km
export function distanciaASegmentoKm(p, a, b) {
  const kmLat = 111.32;
  const kmLon = 111.32 * Math.cos(rad(a.lat));
  const px = (p.lon - a.lon) * kmLon, py = (p.lat - a.lat) * kmLat;
  const bx = (b.lon - a.lon) * kmLon, by = (b.lat - a.lat) * kmLat;
  const largo2 = bx * bx + by * by;
  let t = largo2 === 0 ? 0 : (px * bx + py * by) / largo2;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(px - t * bx, py - t * by);
}

//Geolocalización del dispositivo mediante la API del navegador
export function ubicacionPorDispositivo() {
  return new Promise((resolve, reject) => {
    if (!('geolocation' in navigator)) {
      reject(new Error('Este navegador no permite geolocalización.'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      (err) => {
        const motivos = {
          1: 'Has denegado el permiso de ubicación.',
          2: 'No se ha podido determinar la posición.',
          3: 'Se agotó el tiempo de espera.',
        };
        reject(new Error(motivos[err.code] || 'Error de geolocalización.'));
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  });
}

//geolocalización aproximada por dirección IP 
export async function ubicacionPorIP() {
  const r = await fetch('https://ipapi.co/json/');
  if (!r.ok) throw new Error('El servicio de localización por IP no responde.');
  const d = await r.json();
  if (typeof d.latitude !== 'number' || typeof d.longitude !== 'number') {
    throw new Error('No se pudo obtener la ubicación a partir de la IP.');
  }
  return { lat: d.latitude, lon: d.longitude, ciudad: d.city };
}
