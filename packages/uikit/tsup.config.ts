import { defineConfig } from 'tsup';
import path from 'path';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  sourcemap: true,
  external: [
    'react',
    'react-dom',
    '@radix-ui/react-select',
    '@radix-ui/react-slot',
    'class-variance-authority',
    'clsx',
    'lucide-react',
    'tailwind-merge',
  ],
  treeshake: true,
  splitting: false,
  esbuildOptions(options) {
    options.alias = {
      '@/lib': path.resolve(__dirname, 'src/lib'),
      '@/uikit': path.resolve(__dirname, 'src'),
    };
  },
});
