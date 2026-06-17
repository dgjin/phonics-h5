import { defineConfig } from 'vite';

export default defineConfig({
  // 相对路径，方便部署到任意子目录（GitHub Pages 等）
  base: './',
  build: {
    outDir: 'dist',
    target: 'es2018',
  },
  server: {
    port: 5173,
    host: true,
  },
});
