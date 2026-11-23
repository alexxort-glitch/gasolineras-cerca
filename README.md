# Gasolineras cercanas – Actividad 3

Aplicación web en **React 18 + Vite** que consume la API REST de precios de carburantes del
Ministerio para la Transformación Digital y de la Función Pública (datos.gob.es) y muestra la
gasolinera más cercana, la más barata y si estará abierta a la hora de llegada.

## Uso rápido
Abre `dist/index.html` en el navegador (doble clic). Necesita Internet para consultar la API.
Si la API no responde, la propia página ofrece reintentar, cargar un JSON o usar datos de demostración.

## Desarrollo
```bash
npm install
npm run dev     # http://localhost:5173
npm test        # pruebas de la lógica
npm run build   # regenera dist/index.html (un solo fichero)
```

## Estructura
- `src/components/` – App, StatusBanner, SearchForm, LocationPicker, BrandFilter, Results, StationCard
- `src/services/carburantesApi.js` – llamada AJAX (fetch) a la API y normalización de datos
- `src/utils/` – geo (Haversine, GPS, IP), horario (¿abierta?), procesado (filtros y orden)
- `src/data/demo.js` – datos ficticios para pruebas sin conexión
- `tests/pruebas.mjs` – pruebas automáticas
- `capturas/` – imágenes de la memoria

Endpoint: `https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/`
