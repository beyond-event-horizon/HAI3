import { execSync } from 'child_process';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import type { CommandDefinition } from '../../core/command.js';
import { validationOk, validationError } from '../../core/types.js';

/**
 * Arguments for update command
 */
export interface UpdateCommandArgs {
  alpha?: boolean;
  stable?: boolean;
  templatesOnly?: boolean;
}

/**
 * Result of update command
 */
export interface UpdateCommandResult {
  cliUpdated: boolean;
  projectUpdated: boolean;
  updatedPackages: string[];
  templatesUpdated: boolean;
  syncedTemplates: string[];
  channel: 'alpha' | 'stable';
}

/**
 * Detect the current release channel based on installed CLI version
 * @returns 'alpha' if version contains prerelease identifier, 'stable' otherwise
 */
function detectCurrentChannel(): 'alpha' | 'stable' {
  try {
    const output = execSync('npm list -g @hai3/cli --json', { stdio: 'pipe' }).toString();
    const data = JSON.parse(output);
    const version = data.dependencies?.['@hai3/cli']?.version || '';

    // Check for prerelease identifiers (alpha, beta, rc, etc.)
    if (version.includes('-alpha') || version.includes('-beta') || version.includes('-rc')) {
      return 'alpha';
    }
    return 'stable';
  } catch {
    // If detection fails, default to stable (safer)
    return 'stable';
  }
}

/**
 * Get the path to the CLI's bundled templates directory
 */
function getTemplatesDir(): string {
  // tsup bundles to flat structure: dist/index.cjs
  // Templates are at templates/ (sibling to dist/)
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  // Navigate from dist/ to templates/
  return path.resolve(__dirname, '..', 'templates');
}

/**
 * Template directories/files to sync from CLI templates to project
 * Format: { src: path in templates, dest: path in project }
 *
 * openspec/ is NOT synced here - it's managed by `openspec update` command
 */
/**
 * Template sync configuration
 * - src: path in CLI templates directory
 * - dest: path in target project
 * - expand: if true, copy children of src to dest (not the directory itself)
 */
interface SyncTemplate {
  src: string;
  dest: string;
  expand?: boolean;
}

const SYNC_TEMPLATES: SyncTemplate[] = [
  // AI configuration (direct copies)
  { src: '.ai', dest: '.ai' },
  { src: '.claude', dest: '.claude' },
  { src: '.cursor', dest: '.cursor' },
  { src: '.windsurf', dest: '.windsurf' },
  { src: '.cline', dest: '.cline' },
  { src: '.aider', dest: '.aider' },
  // ESLint plugin with HAI3 rules
  { src: 'eslint-plugin-local', dest: 'eslint-plugin-local' },
  // Demo screenset
  { src: 'src/screensets/demo', dest: 'src/screensets/demo' },
  // Config files - expand children to project root
  { src: 'presets/standalone/configs', dest: '.', expand: true },
  // Scripts - expand children to scripts/ directory
  { src: 'presets/standalone/scripts', dest: 'scripts', expand: true },
];

/**
 * Sync template files from bundled CLI templates to project
 * @param projectRoot - The root directory of the HAI3 project
 * @param logger - Logger instance for output
 * @returns Array of synced paths
 */
async function syncTemplates(
  projectRoot: string,
  logger: { info: (msg: string) => void }
): Promise<string[]> {
  const templatesDir = getTemplatesDir();
  const synced: string[] = [];

  for (const { src, dest, expand } of SYNC_TEMPLATES) {
    const srcPath = path.join(templatesDir, src);

    // Only sync if source exists in templates
    if (!(await fs.pathExists(srcPath))) {
      continue;
    }

    try {
      if (expand) {
        // Expand mode: copy children of src directory to dest
        const children = await fs.readdir(srcPath);
        for (const child of children) {
          const childSrcPath = path.join(srcPath, child);
          const childDestPath = path.join(projectRoot, dest, child);
          await fs.ensureDir(path.dirname(childDestPath));
          await fs.remove(childDestPath);
          await fs.copy(childSrcPath, childDestPath);
          synced.push(path.join(dest, child));
        }
      } else {
        // Direct copy mode
        const destPath = path.join(projectRoot, dest);
        await fs.ensureDir(path.dirname(destPath));
        await fs.remove(destPath);
        await fs.copy(srcPath, destPath);
        synced.push(dest);
      }
    } catch (err) {
      logger.info(`  Warning: Could not sync ${src}: ${err}`);
    }
  }

  return synced;
}

/**
 * Update command implementation
 */
export const updateCommand: CommandDefinition<
  UpdateCommandArgs,
  UpdateCommandResult
> = {
  name: 'update',
  description: 'Update HAI3 CLI and project packages',
  args: [],
  options: [
    {
      name: 'alpha',
      shortName: 'a',
      description: 'Update to latest alpha/prerelease version',
      type: 'boolean',
      defaultValue: false,
    },
    {
      name: 'stable',
      shortName: 's',
      description: 'Update to latest stable version',
      type: 'boolean',
      defaultValue: false,
    },
    {
      name: 'templates-only',
      description: 'Only sync templates (skip CLI and package updates)',
      type: 'boolean',
      defaultValue: false,
    },
  ],

  validate(args) {
    // Cannot specify both --alpha and --stable
    if (args.alpha && args.stable) {
      return validationError('CONFLICTING_OPTIONS', 'Cannot specify both --alpha and --stable');
    }
    return validationOk();
  },

  async execute(args, ctx): Promise<UpdateCommandResult> {
    const { logger, projectRoot } = ctx;

    let cliUpdated = false;
    let projectUpdated = false;
    let templatesUpdated = false;
    const updatedPackages: string[] = [];
    const syncedTemplates: string[] = [];

    // Determine which channel to use
    let channel: 'alpha' | 'stable';
    if (args.alpha) {
      channel = 'alpha';
    } else if (args.stable) {
      channel = 'stable';
    } else {
      // Auto-detect based on current installation
      channel = detectCurrentChannel();
    }

    const tag = channel === 'alpha' ? '@alpha' : '@latest';

    // Skip CLI and package updates if --templates-only
    if (!args.templatesOnly) {
      logger.info(`Update channel: ${channel}`);
      logger.newline();

      // Update CLI
      logger.info('Checking for CLI updates...');
      try {
        execSync(`npm install -g @hai3/cli${tag}`, { stdio: 'pipe' });
        cliUpdated = true;
        logger.success(`@hai3/cli updated (${channel})`);
      } catch {
        logger.info('@hai3/cli is already up to date');
      }

      // If inside a project, update project packages
      if (projectRoot) {
        logger.newline();
        logger.info('Updating project HAI3 packages...');

        const packageJsonPath = path.join(projectRoot, 'package.json');
        const packageJson = await fs.readJson(packageJsonPath);

        const hai3Packages: string[] = [];

        // Find all @hai3/* packages
        for (const dep of Object.keys(packageJson.dependencies || {})) {
          if (dep.startsWith('@hai3/')) {
            hai3Packages.push(dep);
          }
        }
        for (const dep of Object.keys(packageJson.devDependencies || {})) {
          if (dep.startsWith('@hai3/')) {
            hai3Packages.push(dep);
          }
        }

        if (hai3Packages.length > 0) {
          const packagesToUpdate = [...new Set(hai3Packages)];
          logger.info(`Found ${packagesToUpdate.length} HAI3 packages to update`);

          try {
            // Install each package with the appropriate tag
            const packagesWithTag = packagesToUpdate.map(pkg => `${pkg}${tag}`);
            const updateCmd = `npm install ${packagesWithTag.join(' ')}`;
            execSync(updateCmd, { cwd: projectRoot, stdio: 'inherit' });
            projectUpdated = true;
            updatedPackages.push(...packagesToUpdate);
            logger.success(`Project packages updated (${channel})`);
          } catch {
            logger.warn('Failed to update some packages');
          }
        } else {
          logger.info('No HAI3 packages found in project');
        }
      } else {
        logger.newline();
        logger.info('Not inside a HAI3 project. Only CLI was updated.');
        logger.info('Run `hai3 update` from a project directory to update project packages.');
      }
    }

    // Sync project templates if inside a project
    if (projectRoot) {
      logger.newline();
      logger.info('Syncing project templates...');

      const synced = await syncTemplates(projectRoot, logger);
      if (synced.length > 0) {
        templatesUpdated = true;
        syncedTemplates.push(...synced);
        logger.success(`Templates updated: ${synced.length} directories`);
        for (const file of synced) {
          logger.info(`  - ${file}`);
        }
      } else {
        logger.info('Templates are already up to date');
      }
    }

    logger.newline();
    logger.success('Update complete!');

    return {
      cliUpdated,
      projectUpdated,
      updatedPackages,
      templatesUpdated,
      syncedTemplates,
      channel,
    };
  },
};
