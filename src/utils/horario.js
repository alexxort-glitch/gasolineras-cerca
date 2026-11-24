const DIAS = ['L', 'M', 'X', 'J', 'V', 'S', 'D']; // 0 = lunes ... 6 = domingo

function expandirDias(texto) {
  const t = texto.trim().toUpperCase();
  const rango = t.match(/^([LMXJVSD])\s*-\s*([LMXJVSD])$/);
  if (rango) {
    let i = DIAS.indexOf(rango[1]);
    const fin = DIAS.indexOf(rango[2]);
    const dias = [];
    for (let n = 0; n < 7; n++) {
      dias.push(i);
      if (i === fin) break;
      i = (i + 1) % 7;
    }
    return dias;
  }
  if (/^[LMXJVSD]$/.test(t)) return [DIAS.indexOf(t)];
  return null;
}

const aMin = (h, m) => Number(h) * 60 + Number(m);

//Devuelve un array de 7 posiciones con los tramos inicio o fin en minutos o null si no se entiende
export function parsearHorario(texto) {
  if (!texto) return null;
  const porDia = Array.from({ length: 7 }, () => []);
  let entendido = false;

  for (const segmento of texto.split(';')) {
    const pos = segmento.indexOf(':');
    if (pos < 0) continue;
    const dias = expandirDias(segmento.slice(0, pos));
    const resto = segmento.slice(pos + 1);
    if (!dias) continue;

    const tramos = [];
    if (/24\s*H/i.test(resto)) {
      tramos.push([0, 1440]);
    } else {
      const re = /(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/g;
      let m;
      while ((m = re.exec(resto)) !== null) {
        tramos.push([aMin(m[1], m[2]), aMin(m[3], m[4])]);
      }
    }
    if (tramos.length === 0) continue;
    entendido = true;

    for (const d of dias) {
      for (let [ini, fin] of tramos) {
        if (fin === 0) fin = 1440; // "06:00-00:00" = hasta medianoche
        if (fin > ini) {
          porDia[d].push([ini, fin]);
        } else {
          // Tramo que cruza la medianoche (p. ej. 22:00-02:00)
          porDia[d].push([ini, 1440]);
          porDia[(d + 1) % 7].push([0, fin]);
        }
      }
    }
  }
  return entendido ? porDia : null;
}

export function estaAbierta(texto, fecha) {
  const horario = parsearHorario(texto);
  if (!horario) return null;
  const dia = (fecha.getDay() + 6) % 7; // JS: 0 = domingo → 0 = lunes
  const minuto = fecha.getHours() * 60 + fecha.getMinutes();
  return horario[dia].some(([ini, fin]) => minuto >= ini && minuto < fin);
}
