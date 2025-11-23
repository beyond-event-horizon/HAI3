/**
 * Copy template files from main project to CLI package
 *
 * This script runs during CLI build to copy real project files
 * that will be used as templates for new projects.
 */
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CLI_ROOT = path.resolve(__dirname, '..');
const PROJECT_ROOT = path.resolve(CLI_ROOT, '../..');
const TEMPLATES_DIR = path.join(CLI_ROOT, 'templates');

/**
 * Template configuration
 */
const config = {
  // Root-level files to copy (relative to project root)
  rootFiles: [
    'index.html',
    'postcss.config.ts',
    'tailwind.config.ts',
    'tsconfig.json',
    'tsconfig.node.json',
    'vite.config.ts',
    '.gitignore',
  ],

  // Directories to copy entirely (relative to project root)
  directories: [
    '.ai',
    '.cursor',
    '.windsurf',
    'src/themes',
    'src/uikit',
    'src/icons',
  ],

  // Screensets to include in new projects (exclude chat, _blank)
  screensets: ['demo'],

  // Screenset template for `hai3 screenset create`
  // This is the blank template that gets transformed
  screensetTemplate: '_blank',

  // Files to generate dynamically (not copied)
  // - package.json (needs project name)
  // - hai3.config.json (needs config options)
  // - src/App.tsx (standard)
  // - src/main.tsx (depends on uikit choice)
  // - src/screensets/screensetRegistry.tsx (standard)
};

async function copyTemplates() {
  console.log('📦 Copying templates from main project...\n');

  // Clean templates directory
  await fs.remove(TEMPLATES_DIR);
  await fs.ensureDir(TEMPLATES_DIR);

  // 1. Copy root files
  console.log('Root files:');
  for (const file of config.rootFiles) {
    const src = path.join(PROJECT_ROOT, file);
    const dest = path.join(TEMPLATES_DIR, file);

    if (await fs.pathExists(src)) {
      await fs.copy(src, dest);
      console.log(`  ✓ ${file}`);
    } else {
      console.log(`  ⚠ ${file} (not found, skipping)`);
    }
  }

  // 2. Copy directories
  console.log('\nDirectories:');
  for (const dir of config.directories) {
    const src = path.join(PROJECT_ROOT, dir);
    const dest = path.join(TEMPLATES_DIR, dir);

    if (await fs.pathExists(src)) {
      await fs.copy(src, dest);
      const fileCount = await countFiles(dest);
      console.log(`  ✓ ${dir}/ (${fileCount} files)`);
    } else {
      console.log(`  ⚠ ${dir}/ (not found, skipping)`);
    }
  }

  // 3. Copy screensets
  console.log('\nScreensets:');
  for (const screenset of config.screensets) {
    const src = path.join(PROJECT_ROOT, 'src/screensets', screenset);
    const dest = path.join(TEMPLATES_DIR, 'src/screensets', screenset);

    if (await fs.pathExists(src)) {
      await fs.copy(src, dest);
      const fileCount = await countFiles(dest);
      console.log(`  ✓ ${screenset}/ (${fileCount} files)`);
    } else {
      console.log(`  ⚠ ${screenset}/ (not found, skipping)`);
    }
  }

  // 4. Copy screenset template (for `hai3 screenset create`)
  console.log('\nScreenset Template:');
  const templateSrc = path.join(PROJECT_ROOT, 'src/screensets', config.screensetTemplate);
  const templateDest = path.join(TEMPLATES_DIR, 'screenset-template');

  if (await fs.pathExists(templateSrc)) {
    await fs.copy(templateSrc, templateDest);
    const fileCount = await countFiles(templateDest);
    console.log(`  ✓ ${config.screensetTemplate}/ -> screenset-template/ (${fileCount} files)`);
  } else {
    console.log(`  ⚠ ${config.screensetTemplate}/ (not found, skipping)`);
  }

  // 5. Write manifest for runtime
  const manifest = {
    rootFiles: config.rootFiles,
    directories: config.directories,
    screensets: config.screensets,
    screensetTemplate: 'screenset-template',
    generatedAt: new Date().toISOString(),
  };
  await fs.writeJson(path.join(TEMPLATES_DIR, 'manifest.json'), manifest, {
    spaces: 2,
  });

  console.log('\n✅ Templates copied successfully!');
  console.log(`   Location: ${TEMPLATES_DIR}`);
}

async function countFiles(dir: string): Promise<number> {
  let count = 0;
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) {
      count += await countFiles(path.join(dir, entry.name));
    } else {
      count++;
    }
  }
  return count;
}

copyTemplates().catch((err) => {
  console.error('❌ Failed to copy templates:', err);
  process.exit(1);
});
