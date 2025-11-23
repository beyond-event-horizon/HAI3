import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    api: 'src/api.ts',
  },
  format: ['cjs'],
  outExtension() {
    return { js: '.cjs', dts: '.d.cts' };
  },
  dts: {
    entry: {
      api: 'src/api.ts',
    },
  },
  clean: true,
  sourcemap: true,
  shims: true,
  async onSuccess() {
    // Add shebang to CLI entry after build
    const fs = await import('fs/promises');

    const cliPath = 'dist/index.cjs';
    const content = await fs.readFile(cliPath, 'utf-8');
    if (!content.startsWith('#!/usr/bin/env node')) {
      await fs.writeFile(cliPath, `#!/usr/bin/env node\n${content}`);
    }
  },
});
