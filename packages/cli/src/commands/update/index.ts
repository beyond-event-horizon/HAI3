import { execSync } from 'child_process';
import fs from 'fs-extra';
import path from 'path';
import type { CommandDefinition } from '../../core/command.js';
import { validationOk } from '../../core/types.js';

/**
 * Arguments for update command
 */
export interface UpdateCommandArgs {
  // No arguments needed
}

/**
 * Result of update command
 */
export interface UpdateCommandResult {
  cliUpdated: boolean;
  projectUpdated: boolean;
  updatedPackages: string[];
}

/**
 * Update command implementation
 */
export const updateCommand: CommandDefinition<
  UpdateCommandArgs,
  UpdateCommandResult
> = {
  name: 'update',
  description:
    'Update HAI3 CLI and project packages',
  args: [],
  options: [],

  validate() {
    return validationOk();
  },

  async execute(args, ctx): Promise<UpdateCommandResult> {
    const { logger, projectRoot } = ctx;

    let cliUpdated = false;
    let projectUpdated = false;
    const updatedPackages: string[] = [];

    // Always try to update CLI
    logger.info('Checking for CLI updates...');
    try {
      execSync('npm update -g @hai3/cli', { stdio: 'pipe' });
      cliUpdated = true;
      logger.success('@hai3/cli updated');
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
          const updateCmd = `npm update ${packagesToUpdate.join(' ')}`;
          execSync(updateCmd, { cwd: projectRoot, stdio: 'inherit' });
          projectUpdated = true;
          updatedPackages.push(...packagesToUpdate);
          logger.success('Project packages updated');
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

    logger.newline();
    logger.success('Update complete!');

    return {
      cliUpdated,
      projectUpdated,
      updatedPackages,
    };
  },
};
