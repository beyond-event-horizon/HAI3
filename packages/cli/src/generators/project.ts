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

  // 2. Copy root template files
  for (const file of manifest.rootFiles) {
    const filePath = path.join(templatesDir, file);
    if (await fs.pathExists(filePath)) {
      const content = await fs.readFile(filePath, 'utf-8');
      files.push({ path: file, content });
    }
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
  const dependencies: Record<string, string> = {
    '@hai3/uicore': '^0.1.0',
    '@hai3/uikit-contracts': '^0.1.0',
    '@reduxjs/toolkit': '^2.2.1',
    lodash: '^4.17.21',
    'lucide-react': '^0.344.0',
    react: '^18.3.1',
    'react-dom': '^18.3.1',
    'tailwindcss-animate': '^1.0.7',
  };

  if (uikit === 'hai3') {
    dependencies['@hai3/uikit'] = '^0.1.0';
  }

  const devDependencies: Record<string, string> = {
    '@types/lodash': '^4.17.20',
    '@types/react': '^18.3.3',
    '@types/react-dom': '^18.3.0',
    '@typescript-eslint/eslint-plugin': '^7.18.0',
    '@typescript-eslint/parser': '^7.0.0',
    '@vitejs/plugin-react': '^4.3.4',
    autoprefixer: '^10.4.18',
    'dependency-cruiser': '^16.4.0',
    eslint: '^8.57.0',
    'eslint-plugin-react-hooks': '^4.6.0',
    'eslint-plugin-unused-imports': '^3.2.0',
    postcss: '^8.4.35',
    tailwindcss: '^3.4.1',
    tsx: '^4.19.0',
    typescript: '^5.4.2',
    vite: '^6.4.1',
  };

  if (studio) {
    devDependencies['@hai3/studio'] = '^0.1.0';
  }

  const packageJson = {
    name: projectName,
    version: '0.1.0',
    private: true,
    type: 'module',
    workspaces: ['eslint-plugin-local'],
    scripts: {
      dev: 'vite',
      build: 'vite build',
      preview: 'vite preview',
      lint: 'npm run build --workspace=eslint-plugin-local && eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0',
      'type-check': 'tsc --noEmit',
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

  // 5.3 src/main.tsx
  const mainImports = [
    "import { StrictMode } from 'react';",
    "import { createRoot } from 'react-dom/client';",
    "import { HAI3Provider } from '@hai3/uicore';",
  ];
  if (uikit === 'hai3') {
    mainImports.push("import '@hai3/uikit/styles';");
  }
  mainImports.push(
    "import '@/uikit/uikitRegistry';",
    "import '@/screensets/screensetRegistry';",
    "import '@/themes/themeRegistry';",
    "import App from './App';",
    "import './index.css';"
  );

  files.push({
    path: 'src/main.tsx',
    content: `${mainImports.join('\n')}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HAI3Provider>
      <App />
    </HAI3Provider>
  </StrictMode>
);
`,
  });

  // 5.4 src/App.tsx
  files.push({
    path: 'src/App.tsx',
    content: `import { AppRouter } from '@hai3/uicore';

function App() {
  return <AppRouter />;
}

export default App;
`,
  });

  // 5.5 src/index.css
  files.push({
    path: 'src/index.css',
    content: `@tailwind base;
@tailwind components;
@tailwind utilities;
`,
  });

  // 5.6 src/screensets/screensetRegistry.tsx
  files.push({
    path: 'src/screensets/screensetRegistry.tsx',
    content: `// Auto-discover and import all screensets
// Glob pattern matches files like:
//   demo/demoScreenset.tsx
//   billing/billingScreenset.tsx
//
// Eager loading ensures side effects (screensetRegistry.register() calls)
// execute before app renders
const screensetModules = import.meta.glob('./*/*[Ss]creenset.tsx', { eager: true });

// Export for debugging
export { screensetModules };
`,
  });

  // 5.7 Root wrapper files that re-export from presets/standalone/
  // These follow the same pattern as the monorepo but point to standalone presets

  // .eslintrc.cjs - re-exports standalone ESLint config
  files.push({
    path: '.eslintrc.cjs',
    content: `/**
 * HAI3 ESLint Configuration (Root)
 *
 * This file re-exports the standalone preset.
 * DO NOT add rules here - add them to presets/standalone/configs/.eslintrc.cjs
 */

module.exports = require('./presets/standalone/configs/.eslintrc.cjs');
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
