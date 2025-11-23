## 1. Package Setup

- [ ] 1.1 Create `packages/cli/` directory structure
- [ ] 1.2 Initialize `package.json` with name `@hai3/cli`, bin entry `hai3`
- [ ] 1.3 Add dependencies: commander, inquirer, fs-extra, chalk, typescript (for AST parsing)
- [ ] 1.4 Configure tsup for CLI bundling (ESM + CJS, executable shebang)
- [ ] 1.5 Add to workspace in root `package.json`
- [ ] 1.6 Add `api.ts` entry point for programmatic usage

## 2. Core Infrastructure

- [ ] 2.1 Create `CommandDefinition<TArgs, TResult>` interface
- [ ] 2.2 Create `CommandContext` interface with logger, prompt, projectRoot
- [ ] 2.3 Create `CommandRegistry` class for dynamic command registration
- [ ] 2.4 Implement `executeCommand()` with dual-mode support (interactive/programmatic)
- [ ] 2.5 Implement project detection utility (`findProjectRoot()`, `loadConfig()`)
- [ ] 2.6 Implement `Logger` class with chalk colors (silenceable for programmatic use)
- [ ] 2.7 Implement `PromptFn` abstraction (Inquirer for interactive, direct answers for programmatic)

## 3. TypeScript Generators

- [ ] 3.1 Create `GeneratedFile` interface (`{ path, content }`)
- [ ] 3.2 Implement string utility functions (`toPascalCase`, `toCamelCase`, `toScreamingSnake`)
- [ ] 3.3 Implement `generateIdsFile()` - screenset IDs
- [ ] 3.4 Implement `generateScreensetConfig()` - screenset.tsx with self-registration
- [ ] 3.5 Implement `generateScreen()` - screen component with i18n hooks
- [ ] 3.6 Implement `generateI18nStubs()` - 36 language JSON files
- [ ] 3.7 Implement `generateProjectFiles()` - package.json, configs, App.tsx, main.tsx
- [ ] 3.8 Implement `generateAiDocuments()` - .ai/ folder based on project config
- [ ] 3.9 Implement `writeGeneratedFiles()` - atomic file writing utility

## 4. Command: `hai3 create`

- [ ] 4.1 Create `CreateCommandArgs` and `CreateCommandResult` types
- [ ] 4.2 Implement `createCommand` satisfying `CommandDefinition`
- [ ] 4.3 Add validation: npm package name rules, directory conflict check
- [ ] 4.4 Add prompts: UIKit choice, DevTools inclusion, git init
- [ ] 4.5 Wire generators to produce all project files
- [ ] 4.6 Execute `npm install` with spinner
- [ ] 4.7 Support non-interactive flags: `--uikit`, `--devtools`, `--no-git`, `--no-install`
- [ ] 4.8 Return structured result with created files list

## 5. Command: `hai3 update`

- [ ] 5.1 Create `UpdateCommandArgs` and `UpdateCommandResult` types
- [ ] 5.2 Implement `updateCommand` satisfying `CommandDefinition`
- [ ] 5.3 Detect context: inside/outside HAI3 project
- [ ] 5.4 Implement self-update logic (`npm update -g @hai3/cli`)
- [ ] 5.5 Implement project update: find and update `@hai3/*` packages
- [ ] 5.6 Return structured result with updated packages and versions

## 6. Command: `hai3 screenset create`

- [ ] 6.1 Create `ScreensetCreateArgs` and `ScreensetCreateResult` types
- [ ] 6.2 Implement `screensetCreateCommand` satisfying `CommandDefinition`
- [ ] 6.3 Add validation: camelCase name, no existing directory
- [ ] 6.4 Add `--category` flag (drafts|mockups|production)
- [ ] 6.5 Wire generators: ids.ts, screensetConfig, initialScreen, i18n
- [ ] 6.6 Return structured result with created files list

## 7. Command: `hai3 screenset copy`

- [ ] 7.1 Create `ScreensetCopyArgs` and `ScreensetCopyResult` types
- [ ] 7.2 Implement `screensetCopyCommand` satisfying `CommandDefinition`
- [ ] 7.3 Add validation: source exists, target doesn't exist
- [ ] 7.4 Implement `parseIdsFile()` using TypeScript compiler API
- [ ] 7.5 Generate ID transformation map (constant names + string values)
- [ ] 7.6 Copy directory with file content transformation
- [ ] 7.7 Rename files following naming convention (chatScreenset.tsx -> billingScreenset.tsx)
- [ ] 7.8 Add `--category` flag for target category override
- [ ] 7.9 Handle Redux slices: transform slice names, state keys, selectors

## 8. CLI Entry Point

- [ ] 8.1 Create Commander program in `src/index.ts`
- [ ] 8.2 Register all commands from registry
- [ ] 8.3 Add `--version` and `--help` flags
- [ ] 8.4 Add `--quiet` global flag (suppresses non-essential output)
- [ ] 8.5 Create `src/api.ts` exporting `executeCommand`, `commands`, types

## 9. Testing & Documentation

- [ ] 9.1 Add CLI to `npm run build:packages` build order
- [ ] 9.2 Test `hai3 create` end-to-end (creates working project)
- [ ] 9.3 Test `hai3 screenset create` (passes arch:check)
- [ ] 9.4 Test `hai3 screenset copy` (all IDs transformed correctly)
- [ ] 9.5 Test programmatic API (`executeCommand` in non-interactive mode)
- [ ] 9.6 Update CLAUDE.md with CLI documentation
- [ ] 9.7 Update QUICK_START.md with CLI usage examples
- [ ] 9.8 Document programmatic API in README for AI agent developers
