import fs from 'fs-extra';
import path from 'path';
import type { Hai3Config } from '../core/types.js';

/**
 * Config file name
 */
export const CONFIG_FILE = 'hai3.config.json';

/**
 * Find HAI3 project root by looking for hai3.config.json
 * Traverses parent directories until found or reaches filesystem root
 */
export async function findProjectRoot(
  startDir: string
): Promise<string | null> {
  let currentDir = path.resolve(startDir);
  const { root } = path.parse(currentDir);

  while (currentDir !== root) {
    const configPath = path.join(currentDir, CONFIG_FILE);
    if (await fs.pathExists(configPath)) {
      return currentDir;
    }
    currentDir = path.dirname(currentDir);
  }

  return null;
}

/**
 * Load HAI3 config from project root
 */
export async function loadConfig(projectRoot: string): Promise<Hai3Config> {
  const configPath = path.join(projectRoot, CONFIG_FILE);
  const content = await fs.readFile(configPath, 'utf-8');
  return JSON.parse(content) as Hai3Config;
}

/**
 * Save HAI3 config to project root
 */
export async function saveConfig(
  projectRoot: string,
  config: Hai3Config
): Promise<void> {
  const configPath = path.join(projectRoot, CONFIG_FILE);
  await fs.writeFile(configPath, JSON.stringify(config, null, 2) + '\n');
}

/**
 * Check if a directory is inside a HAI3 project
 */
export async function isInsideProject(dir: string): Promise<boolean> {
  return (await findProjectRoot(dir)) !== null;
}

/**
 * Get screensets directory path
 */
export function getScreensetsDir(projectRoot: string): string {
  return path.join(projectRoot, 'src', 'screensets');
}

/**
 * Check if a screenset exists
 */
export async function screensetExists(
  projectRoot: string,
  screensetId: string
): Promise<boolean> {
  const screensetPath = path.join(getScreensetsDir(projectRoot), screensetId);
  return fs.pathExists(screensetPath);
}
