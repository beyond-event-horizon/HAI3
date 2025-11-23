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

## 3. Template-Based Generation System

- [x] 3.1 Create `scripts/copy-templates.ts` build script
- [x] 3.2 Configure template sources in copy-templates config:
  - [x] Root files (index.html, configs, etc.)
  - [x] AI folders (.ai, .cursor, .windsurf)
  - [x] Source directories (themes, uikit, icons)
  - [x] Demo screenset for projects
  - [x] _blank screenset for screenset create
- [x] 3.3 Generate manifest.json with build metadata
- [x] 3.4 Add templates/ to .gitignore
- [x] 3.5 Integrate copy-templates into CLI build process

## 4. Blank Screenset Template

- [x] 4.1 Create `src/screensets/_blank/` with minimal structure
- [x] 4.2 Create ids.ts with screenset ID and screen ID exports
- [x] 4.3 Create types/index.ts (empty, with placeholder comment)
- [x] 4.4 Create events/_blankEvents.ts (empty enum with examples)
- [x] 4.5 Create slices/_blankSlice.ts (empty state with examples)
- [x] 4.6 Create effects/_blankEffects.ts (empty initializer with examples)
- [x] 4.7 Create actions/_blankActions.ts (empty with examples)
- [x] 4.8 Create api/_blankApiService.ts (base service, no methods)
- [x] 4.9 Create api/mocks.ts (empty mock map)
- [x] 4.10 Create uikit/icons/HomeIcon.tsx
- [x] 4.11 Create i18n/ with 36 language files (screenset-level)
- [x] 4.12 Create screens/home/HomeScreen.tsx (minimal, title + description only)
- [x] 4.13 Create screens/home/i18n/ with 36 language files (screen-level)
- [x] 4.14 Create _blankScreenset.tsx with self-registration
- [x] 4.15 Verify _blank passes type-check and arch:check

## 5. Screenset From Template Generator

- [x] 5.1 Create `generators/screensetFromTemplate.ts`
- [x] 5.2 Implement template reading from templates/screenset-template/
- [x] 5.3 Implement ordered ID transformation patterns:
  - [x] SCREAMING_SNAKE constants (_BLANK_SCREENSET_ID, _BLANK_DOMAIN)
  - [x] String values ('_blank', "_blank")
  - [x] Specific patterns (_blankSlice, _blankEffects, etc.)
  - [x] PascalCase patterns (_BlankEvents, _BlankState, etc.)
  - [x] Function names (initialize_BlankEffects, select_BlankState)
  - [x] Generic patterns (_blank, _Blank)
- [x] 5.4 Implement file name transformation
- [x] 5.5 Implement category replacement in screenset config

## 6. TypeScript Generators (Legacy, Kept for Reference)

- [x] 6.1 Create `GeneratedFile` interface (`{ path, content }`)
- [x] 6.2 Implement string utility functions (`toPascalCase`, `toCamelCase`, `toScreamingSnake`)
- [x] 6.3 Implement `generateIdsFile()` - screenset IDs
- [x] 6.4 Implement `generateScreensetConfig()` - screenset.tsx with self-registration
- [x] 6.5 Implement `generateScreen()` - screen component with i18n hooks
- [x] 6.6 Implement `generateI18nStubs()` - 36 language JSON files
- [x] 6.7 Implement `generateProjectFiles()` - package.json, configs, App.tsx, main.tsx
- [x] 6.8 Implement `writeGeneratedFiles()` - atomic file writing utility

## 7. Command: `hai3 create`

- [x] 7.1 Create `CreateCommandArgs` and `CreateCommandResult` types
- [x] 7.2 Implement `createCommand` satisfying `CommandDefinition`
- [x] 7.3 Add validation: npm package name rules, directory conflict check
- [x] 7.4 Support flags: `--uikit`, `--devtools`, `--no-install`
- [x] 7.5 Wire template-based generator to produce all project files
- [x] 7.6 Return structured result with created files list
- [x] 7.7 Note: git init removed (user can run manually)
- [x] 7.8 Note: npm install removed (user can run manually)

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

## 13. Testing & Documentation

- [x] 13.1 Add CLI to `npm run build:packages` build order
- [x] 13.2 Test `hai3 create` end-to-end (creates working project with 261+ files)
- [x] 13.3 Test `hai3 screenset create` (creates 84 files, passes arch:check)
- [x] 13.4 Test `hai3 screenset copy` (all IDs transformed correctly)
- [x] 13.5 Test programmatic API (`executeCommand` in non-interactive mode)
- [x] 13.6 Update CLAUDE.md with CLI documentation (minimal mention)
- [ ] 13.7 Update QUICK_START.md with CLI usage examples (deferred)
- [ ] 13.8 Document programmatic API in README for AI agent developers (deferred)

## Summary

**Completed:** 62/64 tasks (97%)
**Deferred:** 2 documentation tasks (QUICK_START.md, README)

### Key Implementation Notes:

1. **Template-based approach**: Instead of programmatic string generation, CLI copies real project files at build time and transforms IDs at runtime. This ensures templates never drift from framework patterns.

2. **_blank screenset**: Minimal template with correct structure but no business logic. Empty enums, empty state, empty effects - just placeholder comments showing patterns.

3. **CJS output**: CLI uses CommonJS output with chalk v4 for compatibility. ESM was causing issues with fs-extra and chalk v5.

4. **No interactive prompts**: Removed inquirer.js in favor of simpler flag-based approach. Create command uses `--uikit`, `--devtools` flags.

5. **84 files generated**: `hai3 screenset create` generates 84 files including all 36 languages for both screenset-level and screen-level i18n.

6. **261 files for project**: `hai3 create` generates 261+ files including demo screenset, themes, uikit, icons, AI guidelines, etc.
