# Change: Add NPM Publishing Support

## Status

**PROPOSED** - Awaiting approval

## Why

The HAI3 packages need to be published to NPM so that:
1. External developers can install the CLI globally (`npm install -g @hai3/cli`)
2. Generated projects can depend on `@hai3/uikit`, `@hai3/uicore`, etc. from NPM
3. Early testers can try the framework before stable release

## What Changes

- **MODIFIED** All package.json files in `packages/*/` with publishing metadata
- **NEW** README.md files for each published package
- **NEW** Publishing workflow documentation

## Impact

- Affected specs: None (tooling/infrastructure only)
- Affected code: `packages/*/package.json`, new README files
- Dependencies: None new

## Versioning Strategy

Use **semver prerelease versions** for early testing:
- Version format: `0.1.0-alpha.0`, `0.1.0-alpha.1`, etc.
- Publish with `--tag alpha` to avoid polluting `latest` tag
- Users install with: `npm install @hai3/cli@alpha`
- **All packages use aligned versions** - same version number across all @hai3/* packages (fixed mode)

## License

All packages use **Apache 2.0** license (`Apache-2.0` in package.json).

## Package.json Fields Required

Each package (`packages/*/package.json`) needs these fields for NPM publishing. The root `package.json` is not published - it only manages the monorepo workspace.

```json
{
  "name": "@hai3/packagename",
  "version": "0.1.0-alpha.0",
  "description": "Package description",
  "author": "HAI3org",
  "license": "Apache-2.0",
  "repository": {
    "type": "git",
    "url": "https://github.com/HAI3org/HAI3.git",
    "directory": "packages/packagename"
  },
  "bugs": {
    "url": "https://github.com/HAI3org/HAI3/issues"
  },
  "homepage": "https://github.com/HAI3org/HAI3",
  "keywords": ["hai3", "ui", "react", "saas"],
  "engines": {
    "node": ">=18"
  },
  "sideEffects": false,
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

## Peer Dependencies by Package

| Package | Peer Dependencies |
|---------|-------------------|
| `@hai3/uikit-contracts` | None (pure TypeScript interfaces) |
| `@hai3/uikit` | `react: ^18.0.0`, `react-dom: ^18.0.0`, `@hai3/uikit-contracts: *` |
| `@hai3/uicore` | `react: ^18.0.0`, `react-dom: ^18.0.0`, `@reduxjs/toolkit: ^2.0.0`, `@hai3/uikit-contracts: *` |
| `@hai3/studio` | `react: ^18.0.0`, `react-dom: ^18.0.0`, `@hai3/uicore: *` |
| `@hai3/cli` | None (standalone CLI tool) |

## Packages to Publish

| Package | Priority | Notes |
|---------|----------|-------|
| `@hai3/cli` | P0 | CLI tool, main entry point for users |
| `@hai3/uikit-contracts` | P0 | Interface definitions, dependency of uikit |
| `@hai3/uikit` | P0 | React components |
| `@hai3/uicore` | P0 | Core framework (layout, Redux, events) |
| `@hai3/studio` | P1 | Dev overlay, optional for production |

## Publishing Workflow

### Alpha Stage (Current)

Simple manual workflow for early releases:

1. Ensure all packages build: `npm run build:packages`
2. Run validation: `npm run arch:check`
3. Bump versions (all packages together): Edit package.json files or use `npm version`
4. Publish with alpha tag: `npm publish --tag alpha` (in each package directory)

### Future (After Stable)

Automated workflow with Changesets or Lerna:

1. Developer creates PR with changeset file describing changes
2. PR merged → CI creates "Release PR" with version bumps + changelog
3. Maintainer merges Release PR
4. CI publishes to NPM automatically

This is out of scope for the current proposal.

## Out of Scope

- Actual publishing to NPM (requires NPM tokens, organization setup)
- Automated CI/CD release workflow (GitHub Actions)
- Changelog generation tooling
- Version synchronization tooling (Lerna, Changesets)

These items should be separate proposals after basic publishing preparation is approved.
