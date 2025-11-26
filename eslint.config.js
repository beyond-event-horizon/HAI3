/**
 * HAI3 ESLint Configuration (Root)
 *
 * This file re-exports the monorepo preset.
 * Architecture: presets/standalone/configs/eslint.config.js -> presets/monorepo/configs/eslint.config.js -> eslint.config.js (this file)
 *
 * DO NOT add rules here - add them to:
 * - presets/standalone/configs/eslint.config.js for rules that apply to standalone HAI3 projects
 * - presets/monorepo/configs/eslint.config.js for monorepo-specific rules
 */

export { default } from './presets/monorepo/configs/eslint.config.js';
