/**
 * HAI3 ESLint Configuration (Root)
 *
 * This file re-exports the monorepo preset.
 * Architecture: presets/standalone/configs/.eslintrc.cjs -> presets/monorepo/configs/.eslintrc.cjs -> .eslintrc.cjs (this file)
 *
 * DO NOT add rules here - add them to:
 * - presets/standalone/configs/.eslintrc.cjs for rules that apply to standalone HAI3 projects
 * - presets/monorepo/configs/.eslintrc.cjs for monorepo-specific rules
 */

module.exports = require('./presets/monorepo/configs/.eslintrc.cjs');
