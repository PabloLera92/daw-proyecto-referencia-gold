import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// envDir apunta a la raíz del monorepo: un único .env alimenta backend y frontend.
// Vite solo expone al navegador las variables con prefijo VITE_.
export default defineConfig({
  plugins: [react()],
  envDir: '..',
  server: { port: 5173 },
});
