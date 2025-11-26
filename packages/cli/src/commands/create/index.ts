import fs from 'fs-extra';
import path from 'path';
import type { CommandDefinition } from '../../core/command.js';
import { validationOk, validationError } from '../../core/types.js';
import { generateProject } from '../../generators/project.js';
import { writeGeneratedFiles } from '../../utils/fs.js';
import { isValidPackageName } from '../../utils/validation.js';

/**
 * Arguments for create command
 */
export interface CreateCommandArgs {
  projectName: string;
  uikit?: 'hai3' | 'custom';
  studio?: boolean;
  git?: boolean;
  install?: boolean;
}

/**
 * Result of create command
 */
export interface CreateCommandResult {
  projectPath: string;
  files: string[];
}

/**
 * Create command implementation
 */
export const createCommand: CommandDefinition<
  CreateCommandArgs,
  CreateCommandResult
> = {
  name: 'create',
  description: 'Create a new HAI3 project',
  args: [
    {
      name: 'projectName',
      description: 'Name of the project to create',
      required: true,
    },
  ],
  options: [
    {
      name: 'uikit',
      description: 'UIKit to use (hai3 or custom)',
      type: 'string',
      choices: ['hai3', 'custom'],
    },
    {
      name: 'studio',
      description: 'Include Studio package',
      type: 'boolean',
    },
  ],

  validate(args, ctx) {
    // Validate project name
    if (!args.projectName) {
      return validationError('MISSING_NAME', 'Project name is required');
    }

    if (!isValidPackageName(args.projectName)) {
      return validationError(
        'INVALID_NAME',
        'Invalid project name. Must be a valid npm package name.'
      );
    }

    // Check if directory exists
    const projectPath = path.join(ctx.cwd, args.projectName);
    if (fs.existsSync(projectPath)) {
      // Will prompt for overwrite in execute
    }

    return validationOk();
  },

  async execute(args, ctx): Promise<CreateCommandResult> {
    const { logger, prompt } = ctx;
    const projectPath = path.join(ctx.cwd, args.projectName);

    // Check for existing directory
    if (await fs.pathExists(projectPath)) {
      const { overwrite } = await prompt<{ overwrite: boolean }>([
        {
          name: 'overwrite',
          type: 'confirm',
          message: `Directory '${args.projectName}' already exists. Overwrite?`,
          default: false,
        },
      ]);

      if (!overwrite) {
        throw new Error('Aborted.');
      }

      await fs.remove(projectPath);
    }

    // Get configuration via prompts if not provided
    let uikit = args.uikit;
    let studio = args.studio;

    if (uikit === undefined || studio === undefined) {
      const answers = await prompt<{
        uikit: 'hai3' | 'custom';
        studio: boolean;
      }>([
        {
          name: 'uikit',
          type: 'list',
          message: 'Which UIKit would you like to use?',
          choices: [
            { name: 'HAI3 UIKit (recommended)', value: 'hai3' },
            { name: 'Custom UIKit', value: 'custom' },
          ],
          default: 'hai3',
        },
        {
          name: 'studio',
          type: 'confirm',
          message: 'Include Studio?',
          default: true,
        },
      ]);

      uikit = uikit ?? answers.uikit;
      studio = studio ?? answers.studio;
    }

    logger.newline();
    logger.info(`Creating project '${args.projectName}'...`);
    logger.newline();

    // Generate project files (async - reads from templates)
    const files = await generateProject({
      projectName: args.projectName,
      uikit: uikit!,
      studio: studio!,
    });

    // Write files
    const writtenFiles = await writeGeneratedFiles(projectPath, files);
    logger.success(`Generated ${writtenFiles.length} files`);

    // Done
    logger.newline();
    logger.success(`Project '${args.projectName}' created successfully!`);
    logger.newline();
    logger.log('Next steps:');
    logger.log(`  cd ${args.projectName}`);
    logger.log('  git init');
    logger.log('  npm install');
    logger.log('  npm run dev');
    logger.newline();

    return {
      projectPath,
      files: writtenFiles,
    };
  },
};
