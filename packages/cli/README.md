# @hai3/cli

Command-line interface for scaffolding and managing HAI3 framework projects.

## Overview

`@hai3/cli` provides a comprehensive set of commands for creating new HAI3 applications, generating screensets, managing project structure, and maintaining framework dependencies. The CLI streamlines project setup and ongoing development by automating common tasks and enforcing framework conventions.

## Purpose

This package eliminates manual project configuration and boilerplate creation. It generates properly structured HAI3 projects with all necessary dependencies, build configurations, and development tools pre-configured. The CLI ensures projects follow framework best practices from the start and provides utilities for maintaining that structure as projects evolve.

## Core Commands

### Project Creation

Initialize new HAI3 applications with complete project structure, dependency management, and build tooling. The creation process offers interactive prompts for customizing the initial setup, including UI Kit selection and development overlay inclusion.

### Screenset Generation

Create new screensets with proper directory structure, ID management, and template files. Screensets generate with all required files including configuration, screen components, translations, and event handlers.

### Screenset Duplication

Copy existing screensets while automatically transforming all IDs and namespaces to prevent conflicts. This command updates screenset IDs, screen IDs, translation keys, event names, and icon references throughout all files in the source screenset.

### Dependency Updates

Update the CLI itself and all HAI3 framework packages to their latest versions. The command detects whether it's running inside a project or standalone and adjusts its behavior accordingly.

## Installation

### Global Installation (Recommended)

```bash
npm install -g @hai3/cli
```

Global installation makes the `hai3` command available system-wide for creating new projects anywhere on your system.

### Project-Level Installation

```bash
npm install --save-dev @hai3/cli
```

Install as a dev dependency when using CLI commands within project scripts or when global installation isn't preferred.

## Command Reference

### `hai3 create <project-name>`

Creates a new HAI3 project with the specified name. Generates complete project structure including package configuration, build setup, linting rules, and starter screensets.

**Interactive Options:**
- UI Kit selection (HAI3 reference implementation or custom)
- Development overlay inclusion (Studio package)
- Git repository initialization
- Automatic dependency installation

**Output:**
- Fully configured Vite + React + TypeScript project
- HAI3 framework packages installed and configured
- Build and development scripts ready to use
- Architecture validation rules configured

### `hai3 screenset create <name>`

Generates a new screenset with proper structure and template files.

**Options:**
- `--category` - Specify screenset category (drafts, mockups, production)

**Generated Structure:**
- Screenset configuration file
- IDs file with all screenset constants
- Screen directory with starter screen
- Internationalization files for all 36 languages
- Event and effect handler files
- Redux slice files

### `hai3 screenset copy <source> <target>`

Duplicates an existing screenset with automatic ID transformation.

**Options:**
- `--category` - Target screenset category

**Transformations Applied:**
- Screenset ID updates
- Screen ID updates
- Translation key namespacing
- Event name updates
- Icon ID updates
- Redux state key updates

### `hai3 update`

Updates CLI and framework packages to latest versions.

**Behavior:**
- Inside project: Updates CLI globally and framework packages in project
- Outside project: Updates only CLI globally

## Project Generation Details

### Directory Structure

Created projects follow HAI3's standard monorepo-style structure with clear separation between framework packages, application code, screensets, themes, and configuration.

### Build Configuration

Projects ship with Vite configured for optimal development and production builds, TypeScript with strict mode enabled, and Tailwind CSS with framework theme integration.

### Quality Tools

Includes ESLint with custom framework rules, TypeScript strict mode checking, dependency validation through Dependency Cruiser, and architecture test setup.

### Development Workflow

Generated projects include scripts for development server, production builds, type checking, linting, architecture validation, and cleanup operations.

## Advanced Usage

### Programmatic API

The CLI exposes a programmatic API for use in build scripts, automation tools, or custom workflows. Import command executors and invoke them with configuration objects.

### Template Customization

CLI ships with comprehensive template files that new projects copy. These templates stay synchronized with the main HAI3 repository, ensuring new projects always use current best practices.

## Requirements

- Node.js 18.0.0 or higher
- npm 7+ (for workspace support if extending the monorepo structure)

## Version

**Alpha Release** (`0.1.0-alpha.0`) - Commands and APIs may change before stable release.

## License

Apache-2.0

## Repository

[https://github.com/HAI3org/HAI3](https://github.com/HAI3org/HAI3)

## Related Packages

- [`@hai3/uicore`](../uicore) - Core framework package
- [`@hai3/uikit`](../uikit) - UI component library
- [`@hai3/studio`](../studio) - Development tools overlay
