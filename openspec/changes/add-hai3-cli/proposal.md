# Change: Add HAI3 CLI Tools

## Status

**IMPLEMENTED** - All core functionality complete (97% tasks done, 2 documentation tasks deferred)

## Why

Developers need a streamlined way to scaffold new HAI3 projects and manage screensets without manually copying boilerplate. CLI tools enable:
- Rapid project bootstrapping with configurable package selection
- Consistent screenset creation following framework conventions
- Safe screenset duplication with automatic ID updates
- Unified update mechanism for CLI and project dependencies

## What Changes

- **NEW** `@hai3/cli` package with globally installable CLI
- **NEW** `hai3 create <project-name>` command with flag-based configuration
- **NEW** `hai3 update` command with context-aware behavior (CLI vs project)
- **NEW** `hai3 screenset create <name>` command for scaffolding screensets
- **NEW** `hai3 screenset copy <source> <target>` command for duplication
- **NEW** `_blank` screenset template in main project
- **NEW** Template-based generation system (copies real project files)

## Impact

- Affected specs: New `cli` capability
- Affected code: New package `packages/cli/`, new screenset `src/screensets/_blank/`
- Dependencies: Commander.js (CLI framework), fs-extra, chalk v4

## Command Design

### `hai3 create <project-name>`
- **Positional argument** for project name (required) - follows npm/yarn conventions
- **Flags** for configuration: `--uikit=hai3|custom`, `--devtools`
- **Template-based**: Copies real project files (261+ files)
- Creates working HAI3 project with demo screenset

### `hai3 update`
- **Context-aware** - detects HAI3 project via `hai3.config.json`
- Outside project: Updates only `@hai3/cli` globally
- Inside project: Updates `@hai3/cli` + project HAI3 packages to latest compatible versions

### `hai3 screenset create <name>`
- **Positional argument** for screenset name (required, camelCase enforced)
- **Template-based**: Copies from `_blank` screenset (84 files)
- **ID transformation**: Replaces all `_blank` variants with new name
- Follows existing patterns: ids.ts, screenset config, i18n, lazy-loaded screen, Redux slice, events, effects, API service

### `hai3 screenset copy <source> <target> [--category <cat>]`
- **Two positional arguments**: source (existing) and target (new name)
- **Optional flag** `--category` to change screenset category (drafts|mockups|production)
- Performs find-replace on all IDs using template literal pattern
- Parses ids.ts to build transformation map

## Key Implementation Decisions

### Template-Based Generation
Instead of programmatic string generation (like EJS templates), the CLI:
1. Copies real project files at build time (`copy-templates.ts`)
2. Transforms IDs at runtime during command execution
3. This ensures templates never drift from framework patterns

### Minimal _blank Template
The `_blank` screenset provides:
- Correct file structure with all directories
- Empty placeholder files with commented examples
- No business logic to remove
- Passes type-check and arch:check

### CJS Output
CLI uses CommonJS output with chalk v4 for Node.js compatibility.
ESM was causing issues with fs-extra and chalk v5.

## Files Generated

| Command | Files | Includes |
|---------|-------|----------|
| `hai3 create` | 261+ | Demo screenset, themes, uikit, icons, AI docs, configs |
| `hai3 screenset create` | 84 | All screenset files + 72 i18n files (36 screenset + 36 screen) |
