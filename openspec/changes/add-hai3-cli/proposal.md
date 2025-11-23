# Change: Add HAI3 CLI Tools

## Why

Developers need a streamlined way to scaffold new HAI3 projects and manage screensets without manually copying boilerplate. CLI tools enable:
- Rapid project bootstrapping with configurable package selection
- Consistent screenset creation following framework conventions
- Safe screenset duplication with automatic ID updates
- Unified update mechanism for CLI and project dependencies

## What Changes

- **NEW** `@hai3/cli` package with globally installable CLI
- **NEW** `hai3 create <project-name>` command with interactive configuration
- **NEW** `hai3 update` command with context-aware behavior (CLI vs project)
- **NEW** `hai3 screenset create <name>` command for scaffolding screensets
- **NEW** `hai3 screenset copy <source> <target>` command for duplication

## Impact

- Affected specs: New `cli` capability
- Affected code: New package `packages/cli/`
- Dependencies: Commander.js (CLI framework), Inquirer.js (prompts), fs-extra, chalk

## Command Design Rationale

### `hai3 create <project-name>`
- **Positional argument** for project name (required) - follows npm/yarn conventions
- **Interactive prompts** for configuration rather than flags - better UX for one-time setup
- Prompts:
  - UIKit choice: "Use HAI3 UIKit" vs "Bring your own UIKit"
  - DevTools: "Include DevTools package" (yes/no)
- Generates `.ai/` documents tailored to selected configuration

### `hai3 update`
- **Context-aware** - detects HAI3 project via `hai3.config.json` or `package.json` workspace marker
- Outside project: Updates only `@hai3/cli` globally
- Inside project: Updates `@hai3/cli` + project HAI3 packages to latest compatible versions

### `hai3 screenset create <name>`
- **Positional argument** for screenset name (required, camelCase enforced)
- Creates minimal viable screenset with one initial screen (`home`)
- Follows existing patterns: `ids.ts`, screenset config, i18n stubs, lazy-loaded screen

### `hai3 screenset copy <source> <target> [--category <cat>]`
- **Two positional arguments**: source (existing) and target (new name)
- **Optional flag** `--category` to change screenset category (drafts|mockups|production)
- Performs find-replace on all IDs using template literal pattern
