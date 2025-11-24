# Change: Add HAI3 CLI Tools

## Status

**IMPLEMENTED** - Core functionality complete (99% tasks done, 7 documentation tasks pending)

### Recent Updates (2024-11-24)
- **DevTools → Studio Rename**: Completed full rename across codebase (packages/devtools → packages/studio, @hai3/devtools → @hai3/studio, all imports, docs, CLI flags)
- **NPM Publishing Preparation**: Pending approval (see Section 22 in tasks.md)

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
- **Flags** for configuration: `--uikit=hai3|custom`, `--studio` (enables HAI3 Studio dev overlay)
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

### Preset Hierarchy in Generated Projects
Generated projects follow the same preset hierarchy as the monorepo:
- `presets/standalone/configs/` - Source of truth for configs (.eslintrc.cjs, tsconfig.json, etc.)
- `presets/standalone/scripts/` - Source of truth for scripts (test-architecture.ts)
- Root files re-export from presets (e.g., `.eslintrc.cjs` requires `./presets/standalone/configs/.eslintrc.cjs`)

This ensures consistency between monorepo and standalone projects.

## Files Generated

| Command | Files | Includes |
|---------|-------|----------|
| `hai3 create` | 261+ | Demo screenset, themes, uikit, icons, AI docs, configs |
| `hai3 screenset create` | 84 | All screenset files + 72 i18n files (36 screenset + 36 screen) |

---

## Proposed: NPM Publishing Preparation (Section 22)

**Status:** PENDING APPROVAL

### Why

The HAI3 packages need to be published to NPM so that:
1. External developers can use `npm install -g @hai3/cli` to install the CLI
2. Generated projects can depend on `@hai3/uikit`, `@hai3/uicore`, etc. from NPM
3. Early testers can try the framework before stable release

### Versioning Strategy

Use **semver prerelease versions** for early testing:
- Version format: `0.1.0-alpha.0`, `0.1.0-alpha.1`, etc.
- Publish with `--tag alpha` to avoid polluting `latest` tag
- Users install with: `npm install @hai3/cli@alpha`

### Package.json Fields Required

Each package needs these fields for NPM publishing:

```json
{
  "name": "@hai3/packagename",
  "version": "0.1.0-alpha.0",
  "description": "Package description",
  "author": "HAI3 <team@hai3.dev>",
  "license": "Apache-2.0",
  "repository": {
    "type": "git",
    "url": "https://github.com/anthropics/hai3.git",
    "directory": "packages/packagename"
  },
  "bugs": {
    "url": "https://github.com/anthropics/hai3/issues"
  },
  "homepage": "https://hai3.dev",
  "keywords": ["hai3", "ui", "react", "saas"],
  "publishConfig": {
    "access": "public"
  },
  "files": ["dist", "README.md"],
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "require": "./dist/index.cjs",
      "types": "./dist/index.d.ts"
    }
  }
}
```

### Packages to Publish

| Package | Priority | Notes |
|---------|----------|-------|
| `@hai3/cli` | P0 | CLI tool, main entry point for users |
| `@hai3/uikit-contracts` | P0 | Interface definitions, dependency of uikit |
| `@hai3/uikit` | P0 | React components |
| `@hai3/uicore` | P0 | Core framework (layout, Redux, events) |
| `@hai3/studio` | P1 | Dev overlay, optional for production |

### Tasks (Proposed Section 22)

- [ ] 22.1 Add publishing metadata to `packages/uikit-contracts/package.json`
- [ ] 22.2 Add publishing metadata to `packages/uikit/package.json`
- [ ] 22.3 Add publishing metadata to `packages/uicore/package.json`
- [ ] 22.4 Add publishing metadata to `packages/studio/package.json`
- [ ] 22.5 Add publishing metadata to `packages/cli/package.json`
- [ ] 22.6 Create README.md for each package with basic docs
- [ ] 22.7 Add `.npmignore` or verify `files` field excludes dev artifacts
- [ ] 22.8 Verify build output structure matches exports
- [ ] 22.9 Test local `npm pack` for each package
- [ ] 22.10 Document publishing workflow in CLAUDE.md or README

### Out of Scope (This Proposal)

- Actual publishing to NPM (requires NPM tokens, CI setup)
- Automated release workflow (GitHub Actions)
- Changelog generation
- Version synchronization tooling

These items should be separate proposals after basic publishing preparation is approved.
