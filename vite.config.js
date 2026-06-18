import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/',
  plugins: [react()],
  build: {
    outDir: 'dist',
    target: 'es2018',
  },
  server: {
    port: 5173,
    host: true,
  },
});
