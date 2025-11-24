/**
 * HAI3 Dependency Cruiser Configuration (Root)
 *
 * This file re-exports the monorepo preset.
 * Architecture: presets/standalone/configs/.dependency-cruiser.cjs -> presets/monorepo/configs/.dependency-cruiser.cjs -> .dependency-cruiser.cjs (this file)
 *
 * DO NOT add rules here - add them to:
 * - presets/standalone/configs/.dependency-cruiser.cjs for rules that apply to standalone HAI3 projects
 * - presets/monorepo/configs/.dependency-cruiser.cjs for monorepo-specific rules
 */

module.exports = require('./presets/monorepo/configs/.dependency-cruiser.cjs');
