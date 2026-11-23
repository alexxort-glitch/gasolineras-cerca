import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

// viteSingleFile genera un único index.html con JS y CSS incrustados,
// de modo que la aplicación se puede abrir con doble clic (sin servidor).
export default defineConfig({
  plugins: [react(), viteSingleFile()],
  base: './',
});
