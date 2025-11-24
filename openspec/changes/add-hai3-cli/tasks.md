## 1. Package Setup

- [x] 1.1 Create `packages/cli/` directory structure
- [x] 1.2 Initialize `package.json` with name `@hai3/cli`, bin entry `hai3`
- [x] 1.3 Add dependencies: commander, fs-extra, chalk v4 (CJS compatible)
- [x] 1.4 Configure tsup for CLI bundling (CJS output, executable shebang)
- [x] 1.5 Add to workspace in root `package.json`
- [x] 1.6 Add `api.ts` entry point for programmatic usage

## 2. Core Infrastructure

- [x] 2.1 Create `CommandDefinition<TArgs, TResult>` interface
- [x] 2.2 Create `CommandContext` interface with logger, prompt, projectRoot
- [x] 2.3 Create `CommandRegistry` class for dynamic command registration
- [x] 2.4 Implement `executeCommand()` with dual-mode support (interactive/programmatic)
- [x] 2.5 Implement project detection utility (`findProjectRoot()`, `loadConfig()`)
- [x] 2.6 Implement `Logger` class with chalk colors (silenceable for programmatic use)
- [x] 2.7 Implement prompt abstraction (simplified, using flags instead of inquirer)

## 3. Preset Hierarchy

- [x] 3.1 Create `presets/standalone/configs/` directory
- [x] 3.2 Create `presets/standalone/configs/.eslintrc.cjs` (source of truth)
- [x] 3.3 Create `presets/standalone/configs/.dependency-cruiser.cjs` (source of truth)
- [x] 3.4 Create `presets/standalone/configs/tsconfig.json` (source of truth)
- [x] 3.5 Create `presets/standalone/scripts/test-architecture.ts` (source of truth)
- [x] 3.6 Create `presets/monorepo/configs/` extending standalone
- [x] 3.7 Create `presets/monorepo/scripts/` extending standalone
- [x] 3.8 Update root files to re-export from monorepo presets
- [x] 3.9 Update `copy-templates.ts` to copy from `presets/standalone/`
- [x] 3.10 Delete old flattened files in presets/ (cleanup) - Already done, files don't exist

## 4. Template-Based Generation System

- [x] 4.1 Create `scripts/copy-templates.ts` build script
- [x] 4.2 Configure template sources in copy-templates config:
  - [x] Root files (index.html, configs, etc.)
  - [x] AI folders (.ai, .cursor, .windsurf)
  - [x] Source directories (themes, uikit, icons)
  - [x] Demo screenset for projects
  - [x] _blank screenset for screenset create
- [x] 4.3 Generate manifest.json with build metadata
- [x] 4.4 Add templates/ to .gitignore
- [x] 4.5 Integrate copy-templates into CLI build process

## 5. Blank Screenset Template

- [x] 5.1 Create `src/screensets/_blank/` with minimal structure
- [x] 5.2 Create ids.ts with screenset ID and screen ID exports
- [x] 5.3 Create types/index.ts (empty, with placeholder comment)
- [x] 5.4 Create events/_blankEvents.ts (empty enum with examples)
- [x] 5.5 Create slices/_blankSlice.ts (empty state with examples)
- [x] 5.6 Create effects/_blankEffects.ts (empty initializer with examples)
- [x] 5.7 Create actions/_blankActions.ts (empty with examples)
- [x] 5.8 Create api/_blankApiService.ts (base service, no methods)
- [x] 5.9 Create api/mocks.ts (empty mock map)
- [x] 5.10 Create uikit/icons/HomeIcon.tsx
- [x] 5.11 Create i18n/ with 36 language files (screenset-level)
- [x] 5.12 Create screens/home/HomeScreen.tsx (minimal, title + description only)
- [x] 5.13 Create screens/home/i18n/ with 36 language files (screen-level)
- [x] 5.14 Create _blankScreenset.tsx with self-registration
- [x] 5.15 Verify _blank passes type-check and arch:check

## 6. Screenset From Template Generator

- [x] 6.1 Create `generators/screensetFromTemplate.ts`
- [x] 6.2 Implement template reading from templates/screenset-template/
- [x] 6.3 Implement ordered ID transformation patterns
- [x] 6.4 Implement file name transformation
- [x] 6.5 Implement category replacement in screenset config

## 7. Command: `hai3 create`

- [x] 7.1 Create `CreateCommandArgs` and `CreateCommandResult` types
- [x] 7.2 Implement `createCommand` satisfying `CommandDefinition`
- [x] 7.3 Add validation: npm package name rules, directory conflict check
- [x] 7.4 Support flags: `--uikit`, `--devtools`, `--no-install`
- [x] 7.5 Wire template-based generator to produce all project files
- [x] 7.6 Return structured result with created files list

## 8. Command: `hai3 update`

- [x] 8.1 Create `UpdateCommandArgs` and `UpdateCommandResult` types
- [x] 8.2 Implement `updateCommand` satisfying `CommandDefinition`
- [x] 8.3 Detect context: inside/outside HAI3 project
- [x] 8.4 Implement self-update logic (`npm update -g @hai3/cli`)
- [x] 8.5 Implement project update: find and update `@hai3/*` packages
- [x] 8.6 Return structured result with updated packages and versions

## 9. Command: `hai3 screenset create`

- [x] 9.1 Create `ScreensetCreateArgs` and `ScreensetCreateResult` types
- [x] 9.2 Implement `screensetCreateCommand` satisfying `CommandDefinition`
- [x] 9.3 Add validation: camelCase name, no reserved names, no existing directory
- [x] 9.4 Add `--category` flag (drafts|mockups|production)
- [x] 9.5 Wire `generateScreensetFromTemplate()` (template-based)
- [x] 9.6 Return structured result with created files list (84 files)

## 10. Command: `hai3 screenset copy`

- [x] 10.1 Create `ScreensetCopyArgs` and `ScreensetCopyResult` types
- [x] 10.2 Implement `screensetCopyCommand` satisfying `CommandDefinition`
- [x] 10.3 Add validation: source exists, target doesn't exist
- [x] 10.4 Implement `parseIdsFile()` using regex parsing
- [x] 10.5 Generate ID transformation map (constant names + string values)
- [x] 10.6 Copy directory with file content transformation
- [x] 10.7 Rename files following naming convention
- [x] 10.8 Add `--category` flag for target category override
- [x] 10.9 Handle Redux slices: transform slice names, state keys, selectors

## 11. CLI Entry Point

- [x] 11.1 Create Commander program in `src/index.ts`
- [x] 11.2 Register all commands from registry
- [x] 11.3 Add `--version` and `--help` flags
- [x] 11.4 Add `--quiet` global flag (suppresses non-essential output)
- [x] 11.5 Create `src/api.ts` exporting `executeCommand`, `commands`, types

## 12. ESLint Configuration

- [x] 12.1 Add override for packages/cli/** to disable Lodash rules
- [x] 12.2 Add override for packages/cli/templates/** (gitignored, but for safety)
- [x] 12.3 Verify CLI passes lint with new rules

## 13. Testing Tasks (New Session)

These tasks verify the preset hierarchy and CLI work correctly:

- [x] 13.1 Delete old flattened preset files - N/A, files already in subdirs
- [x] 13.2 Verify monorepo arch:check passes
- [x] 13.3 Build CLI package
- [x] 13.4 Test `hai3 create` in /tmp
- [x] 13.5 Setup symlinks in test project
- [x] 13.6 Verify test project passes validation
- [x] 13.7 Verify test project dev server starts
- [x] 13.8 Test `hai3 screenset create` in test project
- [x] 13.9 Test `hai3 screenset copy` in test project
- [x] 13.10 Cleanup test project

## 14. Eliminate Root scripts/ Folder

Move scripts to presets and call them directly from there.

- [x] 14.1 Move `scripts/generate-colors.ts` to `presets/monorepo/scripts/generate-colors.ts`
- [x] 14.2 Update root `scripts/test-architecture.ts` to just call `presets/monorepo/scripts/test-architecture.ts` directly (already done)
- [x] 14.3 Delete root `scripts/` folder
- [x] 14.4 Update `package.json` npm scripts to run from presets:
  - `arch:check` -> `npx tsx presets/monorepo/scripts/test-architecture.ts`
  - `generate:colors` -> `npx tsx presets/monorepo/scripts/generate-colors.ts`
- [x] 14.5 Verify `npm run arch:check` still works

## 15. Update AI/IDE Documentation

Review and update documentation in .ai, .claude, .cursor, .windsurf folders to reflect preset hierarchy changes.

**IMPORTANT:** All edits to .ai/ folder MUST comply with `.ai/targets/AI.md` rules:
- Files under 100 lines
- ASCII only (no unicode arrows, emojis, smart quotes)
- Use keywords: MUST, REQUIRED, FORBIDDEN, STOP, DETECT, BAD, GOOD
- No code blocks, no multi-line examples

- [ ] 15.1 Review `.ai/GUIDELINES.md` - update routing if needed
- [ ] 15.2 Review `.ai/targets/CLI.md` - already updated, verify compliance
- [ ] 15.3 Review other `.ai/targets/*.md` files for preset references
- [ ] 15.4 Review `.claude/` folder for outdated references
- [ ] 15.5 Review `.cursor/` folder for outdated references
- [ ] 15.6 Review `.windsurf/` folder for outdated references
- [ ] 15.7 Update `CLAUDE.md` if preset hierarchy is mentioned

## 16. Technical Debt

- [x] 16.1 Investigate why `src/vite-env.d.ts` was added to copy-templates.ts
  - **Finding:** This is NOT a workaround - it's standard Vite project setup
  - The file contains `/// <reference types="vite/client" />` which provides TypeScript definitions for:
    - `import.meta.glob()` - used in screensetRegistry.tsx for auto-discovery
    - `import.meta.env` - used for DEV/PROD mode checks
    - Other Vite-specific globals (import.meta.hot, etc.)
  - This file is auto-generated by `npm create vite@latest` in all Vite projects
  - **Resolution:** Added detailed documentation in copy-templates.ts explaining the purpose

## 17. Session Bug Fixes (Completed 2024-11-24)

These bugs were discovered and fixed during testing session:

- [x] 17.1 Fix ESLint Lodash violations in CLI package
  - `packages/cli/src/generators/utils.ts` - use lodash upperFirst, lowerFirst, toUpper, toLower
  - `packages/cli/src/generators/screensetFromTemplate.ts` - use lodash upperFirst
  - `packages/cli/src/utils/validation.ts` - use lodash toLower

- [x] 17.2 Fix ESLint Lodash violations in uicore package
  - `packages/uicore/src/components/ScreensetSelector.tsx` - use lodash upperFirst
  - `packages/uicore/src/components/ThemeSelector.tsx` - use lodash upperFirst
  - `packages/uicore/src/components/UserInfo.tsx` - use lodash trim
  - `packages/uicore/src/layout/domains/screen/Screen.tsx` - use lodash trim

- [x] 17.3 Fix TypeScript errors in devtools package
  - `packages/uikit/src/base/dropdown-menu.tsx` - add container prop to DropdownMenuContent
  - `packages/uikit/src/base/dropdown-menu.tsx` - add container prop to DropdownMenuSubContent
  - `packages/devtools/src/sections/ControlPanel.tsx` - use ScreensetCategory enum
  - `packages/devtools/src/sections/LanguageSelector.tsx` - remove unused React import

- [x] 17.4 Fix TypeScript errors in uicore userActions
  - `packages/uicore/src/core/actions/userActions.ts` - cast to AccountsApiService, type error param

- [x] 17.5 Fix screensetRegistry.tsx JSDoc comment issue
  - `packages/cli/src/generators/project.ts` - change JSDoc to line comments (glob pattern in comment confused tsc)

- [x] 17.6 Fix _blank template missing DOMAIN_ID
  - `src/screensets/_blank/events/_blankEvents.ts` - uncomment DOMAIN_ID and import

## 18. Resume Session Tasks

Run these commands to verify state after resuming:

- [x] 18.1 Run `npm run arch:check` and check for any remaining issues
- [x] 18.2 Review any hints/warnings from arch:check output
- [x] 18.3 Run `npm run build:packages` to ensure all packages build

## 19. Project Generator Preset Structure Fix (2024-11-24)

Fixed issue where generated projects had flattened configs instead of preset hierarchy.

- [x] 19.1 Update `copy-templates.ts` to copy entire `presets/standalone/` folder
  - Removed flattened `standalonePresets` mapping
  - Added `presets/standalone` to directories list
- [x] 19.2 Update `project.ts` generator to create root wrapper files
  - `.eslintrc.cjs` - re-exports from `./presets/standalone/configs/.eslintrc.cjs`
  - `.dependency-cruiser.cjs` - re-exports from `./presets/standalone/configs/.dependency-cruiser.cjs`
  - `tsconfig.json` - extends `./presets/standalone/configs/tsconfig.json`
- [x] 19.3 Update `arch:check` script path in generated package.json
  - Changed from `scripts/test-architecture.ts` to `presets/standalone/scripts/test-architecture.ts`
- [x] 19.4 Add `packages/**/templates` to ESLint ignore patterns
- [x] 19.5 Test generated project structure matches preset hierarchy

## 20. Knip Configuration Cleanup (2024-11-24)

Fixed knip configuration hints from arch:check output.

- [x] 20.1 Refactor knip.json to use workspace-based configuration
- [x] 20.2 Ignore screensets in root workspace (self-registering via glob)
- [x] 20.3 Ignore CLI templates (build artifacts)
- [x] 20.4 Remove redundant entry patterns (let knip auto-detect)
- [x] 20.5 Verify no configuration hints remain

## Summary

**Completed:** 93/100 tasks (93%)
**Pending:** 7 tasks (Section 15 - Documentation updates)

### Files Modified (Session 2024-11-24 - Latest)

**CLI Package:**
- `packages/cli/scripts/copy-templates.ts` - Copy presets/standalone folder instead of flattening
- `packages/cli/src/generators/project.ts` - Generate root wrapper files for preset hierarchy

**Configuration:**
- `package.json` - Updated npm scripts paths to presets/monorepo/scripts/
- `presets/monorepo/configs/.eslintrc.cjs` - Added ignore patterns for scripts and templates
- `knip.json` - Refactored to workspace-based configuration

**Scripts:**
- Moved `scripts/generate-colors.ts` to `presets/monorepo/scripts/generate-colors.ts`
- Deleted root `scripts/` folder

### Files Modified (Previous Session - Bug Fixes)

**CLI Package:**
- `packages/cli/src/generators/utils.ts`
- `packages/cli/src/generators/screensetFromTemplate.ts`
- `packages/cli/src/generators/project.ts`
- `packages/cli/src/utils/validation.ts`

**UIKit Package:**
- `packages/uikit/src/base/dropdown-menu.tsx`

**UICore Package:**
- `packages/uicore/src/components/ScreensetSelector.tsx`
- `packages/uicore/src/components/ThemeSelector.tsx`
- `packages/uicore/src/components/UserInfo.tsx`
- `packages/uicore/src/layout/domains/screen/Screen.tsx`
- `packages/uicore/src/core/actions/userActions.ts`

**DevTools Package:**
- `packages/devtools/src/sections/ControlPanel.tsx`
- `packages/devtools/src/sections/LanguageSelector.tsx`

**App Source:**
- `src/screensets/_blank/events/_blankEvents.ts`
