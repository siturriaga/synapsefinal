// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  // 🚨 FIX: Root set to '.' since index.html was moved to root
  root: '.', 
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // Assets that were in 'public' are now relative to the root
    publicDir: 'public', 
  }
});
