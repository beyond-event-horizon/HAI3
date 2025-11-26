import path from 'path';
import fs from 'fs-extra';
import type { GeneratedFile, Hai3Config } from '../core/types.js';

/**
 * Input for project generation
 */
export interface ProjectGeneratorInput {
  /** Project name (npm package name format) */
  projectName: string;
  /** Use HAI3 UIKit or custom */
  uikit: 'hai3' | 'custom';
  /** Include studio */
  studio: boolean;
}

/**
 * Get the templates directory path
 * In bundled CLI: dist/index.cjs -> need to go up to package root then templates
 */
function getTemplatesDir(): string {
  // __dirname in CJS bundle is the dist folder
  // We need: packages/cli/dist -> packages/cli/templates
  return path.resolve(__dirname, '../templates');
}

/**
 * Read all files from a directory recursively
 */
async function readDirRecursive(
  dir: string,
  basePath: string = ''
): Promise<GeneratedFile[]> {
  const files: GeneratedFile[] = [];

  if (!(await fs.pathExists(dir))) {
    return files;
  }

  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relativePath = path.join(basePath, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await readDirRecursive(fullPath, relativePath)));
    } else {
      const content = await fs.readFile(fullPath, 'utf-8');
      files.push({ path: relativePath, content });
    }
  }

  return files;
}

/**
 * Generate all files for a new HAI3 project
 * Combines template files with dynamically generated config files
 */
export async function generateProject(
  input: ProjectGeneratorInput
): Promise<GeneratedFile[]> {
  const { projectName, uikit, studio } = input;
  const templatesDir = getTemplatesDir();
  const files: GeneratedFile[] = [];

  // 1. Load manifest to know what to copy
  const manifestPath = path.join(templatesDir, 'manifest.json');
  if (!(await fs.pathExists(manifestPath))) {
    throw new Error(
      'Templates not found. Run `npm run build` in packages/cli first.'
    );
  }

  const manifest = await fs.readJson(manifestPath);

  // 2. Copy root template files (with minimal transformations where needed)
  for (const file of manifest.rootFiles) {
    const filePath = path.join(templatesDir, file);
    if (await fs.pathExists(filePath)) {
      let content = await fs.readFile(filePath, 'utf-8');

      // Transform src/main.tsx for uikit='custom':
      // - Remove @hai3/uikit/styles import (custom projects provide their own styles)
      // - Add ./index.css import (for Tailwind directives)
      if (file === 'src/main.tsx' && uikit === 'custom') {
        content = content.replace(
          /import '@hai3\/uikit\/styles';.*\n/g,
          "import './index.css';\n"
        );
      }

      files.push({ path: file, content });
    }
  }

  // 2.1 Generate index.css for custom uikit (hai3 uikit includes Tailwind via @hai3/uikit/styles)
  if (uikit === 'custom') {
    files.push({
      path: 'src/index.css',
      content: `@tailwind base;
@tailwind components;
@tailwind utilities;
`,
    });
  }

  // 3. Copy template directories (.ai, .cursor, .windsurf, src/themes, etc.)
  for (const dir of manifest.directories) {
    const dirPath = path.join(templatesDir, dir);
    const dirFiles = await readDirRecursive(dirPath, dir);
    files.push(...dirFiles);
  }

  // 4. Copy screensets from templates
  for (const screenset of manifest.screensets) {
    const screensetPath = path.join(templatesDir, 'src/screensets', screenset);
    const screensetFiles = await readDirRecursive(
      screensetPath,
      `src/screensets/${screenset}`
    );
    files.push(...screensetFiles);
  }

  // 5. Generate dynamic files (need project-specific values)

  // 5.1 hai3.config.json (marker file for project detection)
  const config: Hai3Config = {
    hai3: true,
  };
  files.push({
    path: 'hai3.config.json',
    content: JSON.stringify(config, null, 2) + '\n',
  });

  // 5.2 package.json
  // Use 'alpha' tag for @hai3 packages during alpha phase
  // This resolves to the latest alpha version from npm
  const dependencies: Record<string, string> = {
    '@hai3/uicore': 'alpha',
    '@hai3/uikit-contracts': 'alpha',
    '@reduxjs/toolkit': '^2.2.1',
    lodash: '^4.17.21',
    'lucide-react': '^0.344.0',
    react: '^18.3.1',
    'react-dom': '^18.3.1',
    'react-markdown': '^9.0.1',
    'remark-gfm': '^4.0.0',
    'tailwindcss-animate': '^1.0.7',
  };

  if (uikit === 'hai3') {
    dependencies['@hai3/uikit'] = 'alpha';
  }

  const devDependencies: Record<string, string> = {
    '@types/lodash': '^4.17.20',
    '@types/react': '^18.3.3',
    '@types/react-dom': '^18.3.0',
    '@eslint/js': '^9.15.0',
    '@typescript-eslint/eslint-plugin': '^8.15.0',
    '@typescript-eslint/parser': '^8.15.0',
    '@vitejs/plugin-react': '^4.3.4',
    autoprefixer: '^10.4.18',
    'dependency-cruiser': '^16.4.0',
    eslint: '^9.15.0',
    'eslint-plugin-react-hooks': '^5.0.0',
    'eslint-plugin-unused-imports': '^4.1.4',
    globals: '^15.12.0',
    postcss: '^8.4.35',
    tailwindcss: '^3.4.1',
    tsx: '^4.19.0',
    typescript: '^5.4.2',
    'typescript-eslint': '^8.15.0',
    vite: '^6.4.1',
  };

  if (studio) {
    devDependencies['@hai3/studio'] = 'alpha';
  }

  const packageJson = {
    name: projectName,
    version: '0.1.0',
    private: true,
    type: 'module',
    workspaces: ['eslint-plugin-local'],
    scripts: {
      dev: 'npm run generate:colors && vite',
      build: 'npm run generate:colors && vite build',
      preview: 'vite preview',
      lint: 'npm run build --workspace=eslint-plugin-local && eslint . --max-warnings 0',
      'type-check': 'tsc --noEmit',
      'generate:colors': 'npx tsx presets/standalone/scripts/generate-colors.ts',
      'arch:check': 'npx tsx presets/standalone/scripts/test-architecture.ts',
      'arch:deps':
        'npx dependency-cruiser src/ --config .dependency-cruiser.cjs --output-type err-long',
    },
    dependencies,
    devDependencies,
  };

  files.push({
    path: 'package.json',
    content: JSON.stringify(packageJson, null, 2) + '\n',
  });

  // 5.3 Root wrapper files that re-export from presets/standalone/
  // These follow the same pattern as the monorepo but point to standalone presets

  // eslint.config.js - re-exports standalone ESLint config (ESLint 9 flat config)
  files.push({
    path: 'eslint.config.js',
    content: `/**
 * HAI3 ESLint Configuration (Root)
 *
 * This file re-exports the standalone preset.
 * DO NOT add rules here - add them to presets/standalone/configs/eslint.config.js
 */

import standaloneConfig from './presets/standalone/configs/eslint.config.js';

export default standaloneConfig;
`,
  });

  // .dependency-cruiser.cjs - re-exports standalone dependency cruiser config
  files.push({
    path: '.dependency-cruiser.cjs',
    content: `/**
 * HAI3 Dependency Cruiser Configuration (Root)
 *
 * This file re-exports the standalone preset.
 * DO NOT add rules here - add them to presets/standalone/configs/.dependency-cruiser.cjs
 */

module.exports = require('./presets/standalone/configs/.dependency-cruiser.cjs');
`,
  });

  // tsconfig.json - extends standalone TypeScript config
  files.push({
    path: 'tsconfig.json',
    content: JSON.stringify(
      {
        $schema: 'https://json.schemastore.org/tsconfig',
        _comment: [
          'HAI3 TypeScript Configuration (Root)',
          '',
          'This file extends the standalone preset.',
          'DO NOT add compilerOptions here - add them to presets/standalone/configs/tsconfig.json',
        ],
        extends: './presets/standalone/configs/tsconfig.json',
        compilerOptions: {
          baseUrl: '.',
        },
        include: ['src'],
        references: [{ path: './tsconfig.node.json' }],
      },
      null,
      2
    ) + '\n',
  });

  return files;
}
