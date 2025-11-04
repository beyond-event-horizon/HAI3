import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Split UI Kit components into separate chunk
          if (id.includes('@hai3/uikit')) {
            return 'uikit';
          }
          // Split UI Core business logic
          if (id.includes('@hai3/uicore')) {
            return 'uicore';
          }
          // Split React and React DOM
          if (id.includes('react') || id.includes('react-dom')) {
            return 'react';
          }
        },
      },
    },
  },
});
