// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  // 🚨 NEW CONFIG: Tell Vite to look in the root folder for index.html
  root: '.',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // Assets that were in 'public' (like vite.svg) now need to be explicitly managed
    // by ensuring Vite knows the base path correctly.
    publicDir: 'public', 
  }
});
