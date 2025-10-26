import { defineConfig } from 'tsup';
import path from 'path';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: {
    compilerOptions: {
      skipLibCheck: true,
    },
  },
  clean: true,
  sourcemap: true,
  external: [
    'react',
    'react-dom',
    '@reduxjs/toolkit',
    'react-redux',
    '@hai3/uikit',
  ],
  treeshake: true,
  splitting: false,
  esbuildOptions(options) {
    options.alias = {
      '@/core': path.resolve(__dirname, 'src'),
      '@/styles': path.resolve(__dirname, 'src/styles'),
      '@/uikit': '@hai3/uikit',
    };
  },
});
