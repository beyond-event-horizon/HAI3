import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/uikit': path.resolve(__dirname, './src/uikit'),
      '@/core': path.resolve(__dirname, './src/core'),
      '@/screensets': path.resolve(__dirname, './src/screensets'),
      '@/styles': path.resolve(__dirname, './src/styles'),
    },
  },
});
