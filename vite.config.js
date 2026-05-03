import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const rootDir = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  server: {
    port: 4173
  },
  preview: {
    port: 4173
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(rootDir, 'index.html'),
        login: path.resolve(rootDir, 'pages/login.html'),
        register: path.resolve(rootDir, 'pages/register.html'),
        app: path.resolve(rootDir, 'pages/app.html')
      }
    }
  }
});
