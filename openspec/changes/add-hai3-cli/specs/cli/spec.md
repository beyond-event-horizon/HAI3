## ADDED Requirements

### Requirement: CLI Package Structure

The CLI SHALL be implemented as a workspace package `@hai3/cli` with a globally installable binary named `hai3` and a programmatic API for AI agent integration.

#### Scenario: Package installation

**Given** a developer installing the CLI globally
**When** running `npm install -g @hai3/cli`
**Then** the system SHALL:
- Install the `@hai3/cli` package
- Make `hai3` command available in PATH
- Support CommonJS environments (Node.js)

#### Scenario: Package structure

```
packages/cli/
├── package.json          # name: @hai3/cli, bin: { hai3: ./dist/index.cjs }
├── tsup.config.ts        # Bundle config (CJS output)
├── scripts/
│   └── copy-templates.ts # Build-time template copying
├── templates/            # Gitignored - generated at build
│   ├── manifest.json
│   ├── screenset-template/
│   └── ...
├── src/
│   ├── index.ts          # CLI entry point (Commander setup)
│   ├── api.ts            # Programmatic API exports
│   │
│   ├── core/
│   │   ├── command.ts    # CommandDefinition interface
│   │   ├── registry.ts   # CommandRegistry class
│   │   ├── executor.ts   # executeCommand() function
│   │   ├── types.ts      # Shared types
│   │   ├── logger.ts     # Colored output (silenceable)
│   │   └── prompt.ts     # Prompt abstraction
│   │
│   ├── commands/
│   │   ├── create/       # Project creation command
│   │   ├── update/       # Update command
│   │   └── screenset/    # Screenset subcommands
│   │
│   ├── generators/
│   │   ├── project.ts          # Template-based project generation
│   │   ├── screensetFromTemplate.ts  # Template-based screenset generation
│   │   ├── screenset.ts        # Legacy programmatic (reference)
│   │   ├── i18n.ts             # Translation utilities
│   │   ├── transform.ts        # ID transformation for copy
│   │   └── utils.ts            # toPascalCase, toScreamingSnake, etc.
│   │
│   └── utils/
│       ├── project.ts    # findProjectRoot(), loadConfig()
│       ├── fs.ts         # writeGeneratedFiles()
│       └── validation.ts # Name validation utilities
```

**Given** the package structure above
**When** tsup builds the package
**Then** the output SHALL include both CLI binary and library exports

### Requirement: Template-Based Code Generation

The CLI SHALL use a template-based approach where real project files are copied at build time and transformed at runtime, ensuring templates never drift from framework patterns.

#### Scenario: Build-time template copying

**Given** the `packages/cli/scripts/copy-templates.ts` script
**When** `npm run build` is executed in packages/cli
**Then** the system SHALL:
- Copy root config files (index.html, tsconfig.json, vite.config.ts, etc.)
- Copy AI guideline folders (.ai, .cursor, .windsurf)
- Copy source directories (themes, uikit, icons)
- Copy demo screenset for project creation
- Copy _blank screenset as screenset-template for screenset creation
- Generate manifest.json with build metadata

#### Scenario: Template sources configuration

```typescript
const config = {
  rootFiles: [
    'index.html',
    'postcss.config.ts',
    'tailwind.config.ts',
    'tsconfig.json',
    'tsconfig.node.json',
    'vite.config.ts',
    '.gitignore',
  ],
  directories: [
    '.ai',
    '.cursor',
    '.windsurf',
    'src/themes',
    'src/uikit',
    'src/icons',
  ],
  screensets: ['demo'],
  screensetTemplate: '_blank',
};
```

**Given** the template configuration above
**When** copy-templates.ts runs
**Then** all specified files SHALL be copied to packages/cli/templates/

### Requirement: Blank Screenset Template

The CLI SHALL include a minimal `_blank` screenset template with correct structure but no business logic.

#### Scenario: Template structure

```
src/screensets/_blank/
├── ids.ts                    # Centralized IDs
├── types/index.ts            # Type definitions (empty)
├── events/_blankEvents.ts    # Events enum (empty, with examples)
├── slices/_blankSlice.ts     # Redux slice (empty state)
├── effects/_blankEffects.ts  # Effect listeners (empty)
├── actions/_blankActions.ts  # Action creators (empty)
├── api/
│   ├── _blankApiService.ts   # API service class (base only)
│   └── mocks.ts              # Mock map (empty)
├── uikit/icons/HomeIcon.tsx  # Custom icon
├── i18n/                     # 36 language files
├── screens/home/
│   ├── HomeScreen.tsx        # Simple screen (title + description)
│   └── i18n/                 # 36 language files
└── _blankScreenset.tsx       # Screenset config with self-registration
```

**Given** the _blank screenset template
**When** developers review the structure
**Then** they SHALL find:
- Empty placeholder files with commented examples
- No business logic to remove
- Correct HAI3 architectural patterns

#### Scenario: Template validation

**Given** the _blank screenset in src/screensets/_blank/
**When** running validation commands
**Then** `npm run type-check` and `npm run arch:check` SHALL pass

### Requirement: Scalable Command Architecture

The CLI SHALL use a plugin-based command registry with standardized interfaces to enable future extensibility and AI agent integration.

#### Scenario: CommandDefinition interface

```typescript
export interface CommandContext {
  cwd: string;
  projectRoot: string | null;
  config: Hai3Config | null;
  logger: Logger;
  prompt: PromptFn;
}

export interface CommandDefinition<TArgs = unknown, TResult = void> {
  name: string;
  description: string;
  args: ArgDefinition[];
  options: OptionDefinition[];
  validate(args: TArgs, ctx: CommandContext): ValidationResult;
  execute(args: TArgs, ctx: CommandContext): Promise<TResult>;
}
```

**Given** the `CommandDefinition` interface
**When** implementing a new command
**Then** the command SHALL:
- Define typed arguments and result
- Provide validation logic separate from execution
- Return structured results for programmatic consumption

#### Scenario: Command registration

```typescript
const registry = new CommandRegistry();
registry.register(createCommand);
registry.register(updateCommand);
registry.register(screensetCreateCommand);
registry.register(screensetCopyCommand);
```

**Given** a `CommandRegistry` instance
**When** commands are registered
**Then** they SHALL be discoverable by name for both CLI and programmatic use

### Requirement: Programmatic API for AI Agents

The CLI SHALL expose a programmatic API enabling AI agents to execute commands non-interactively with typed inputs and outputs.

#### Scenario: Programmatic execution

```typescript
import { executeCommand, commands } from '@hai3/cli';

const result = await executeCommand(
  commands.screensetCreate,
  { name: 'billing', category: 'drafts' },
  { interactive: false }
);

if (result.success) {
  console.log('Created files:', result.data.files);
}
```

**Given** an AI agent importing `@hai3/cli`
**When** calling `executeCommand()` with `interactive: false`
**Then** the system SHALL:
- Skip all interactive prompts
- Use provided arguments directly
- Return typed `CommandResult<T>` with success/failure and data

### Requirement: Project Creation Command

The CLI SHALL provide a `hai3 create <project-name>` command that scaffolds a new HAI3 project using template-based generation.

#### Scenario: Project creation

**Given** a developer running `hai3 create my-app`
**When** the command executes
**Then** the system SHALL create:
- Directory `my-app/`
- All root config files from templates
- `hai3.config.json` with project configuration
- `package.json` with HAI3 dependencies
- `.ai/`, `.cursor/`, `.windsurf/` folders from templates
- `src/themes/`, `src/uikit/`, `src/icons/` from templates
- `src/screensets/demo/` screenset from templates
- Generated files: App.tsx, main.tsx, screensetRegistry.tsx

#### Scenario: Project creation flags

**Given** running `hai3 create my-app --uikit=custom --devtools`
**When** the command executes with flags
**Then** the system SHALL use flag values without prompting

#### Scenario: Generated project file count

**Given** a successful project creation
**When** counting generated files
**Then** approximately 261+ files SHALL be created

#### Scenario: Project name validation

**Given** invalid project name `123-invalid`
**When** validation runs
**Then** the system SHALL display error and exit with code 1

### Requirement: Update Command

The CLI SHALL provide a `hai3 update` command that updates the CLI globally, and when inside a HAI3 project, also updates project dependencies.

#### Scenario: Update outside project

**Given** running `hai3 update` outside a HAI3 project
**When** no `hai3.config.json` found
**Then** the system SHALL only update `@hai3/cli` globally

#### Scenario: Update inside project

**Given** running `hai3 update` inside a HAI3 project
**When** `hai3.config.json` exists
**Then** the system SHALL:
- Update global CLI
- Update all `@hai3/*` packages in project
- Return summary of updated packages

### Requirement: Screenset Create Command

The CLI SHALL provide a `hai3 screenset create <name>` command that scaffolds a new screenset using template-based generation from the _blank template.

#### Scenario: Create screenset

**Given** running `hai3 screenset create billing` inside a HAI3 project
**When** the command executes
**Then** the system SHALL create:
```
src/screensets/billing/
├── ids.ts
├── types/index.ts
├── events/billingEvents.ts
├── slices/billingSlice.ts
├── effects/billingEffects.ts
├── actions/billingActions.ts
├── api/
│   ├── billingApiService.ts
│   └── mocks.ts
├── uikit/icons/HomeIcon.tsx
├── billingScreenset.tsx
├── i18n/                 # 36 language files
└── screens/home/
    ├── HomeScreen.tsx
    └── i18n/             # 36 language files
```

#### Scenario: ID transformation patterns

**Given** the _blank template with identifiers like `_BLANK_SCREENSET_ID`, `_blankSlice`, `_BlankState`
**When** creating screenset named `billing`
**Then** the system SHALL transform:
- `_BLANK_SCREENSET_ID` → `BILLING_SCREENSET_ID`
- `_BLANK_DOMAIN` → `BILLING_DOMAIN`
- `'_blank'` → `'billing'`
- `_blankSlice` → `billingSlice`
- `_blankEffects` → `billingEffects`
- `_blankEvents` → `billingEvents`
- `_BlankEvents` → `BillingEvents`
- `_BlankState` → `BillingState`
- `initialize_BlankEffects` → `initializeBillingEffects`
- `select_BlankState` → `selectBillingState`
- `_blank` → `billing`
- `_Blank` → `Billing`

#### Scenario: Generated screenset file count

**Given** a successful screenset creation
**When** counting generated files
**Then** 84 files SHALL be created

#### Scenario: Name validation

**Given** invalid name `My-Screenset`
**When** validation runs
**Then** the system SHALL display: "Screenset name must be camelCase"

#### Scenario: Reserved name validation

**Given** reserved name `_blank`
**When** validation runs
**Then** the system SHALL display error about reserved name

#### Scenario: Category flag

**Given** running `hai3 screenset create billing --category=production`
**When** generating screenset config
**Then** the config SHALL have `category: ScreensetCategory.Production`

#### Scenario: Home screen ID uses screenset name

**Given** the _blank template with `HOME_SCREEN_ID = '_blank'`
**When** creating screenset named `billing`
**Then** the system SHALL transform:
- `HOME_SCREEN_ID = '_blank'` → `HOME_SCREEN_ID = 'billing'`
- Translation key `menu_items._blank.label` → `menu_items.billing.label`

This ensures unique routes when multiple screensets are created.

### Requirement: Screenset Copy Command

The CLI SHALL provide a `hai3 screenset copy <source> <target>` command that duplicates an existing screenset with transformed IDs.

#### Scenario: Copy with ID transformation

**Given** running `hai3 screenset copy chat chatCopy`
**When** `src/screensets/chat/` exists
**Then** the system SHALL:
- Copy to `src/screensets/chatCopy/`
- Parse `chat/ids.ts` to find all ID constants
- Transform constant names: `CHAT_SCREENSET_ID` → `CHAT_COPY_SCREENSET_ID`
- Transform screenset ID values: `'chat'` → `'chatCopy'`
- Transform screen ID values using suffix: `'helloworld'` → `'helloworldCopy'`
- Transform translation key paths: `.chat.` → `.chatCopy.` in template literals
- Update screenset display name: `name: 'Chat'` → `name: 'ChatCopy'`
- Rename files: `chatScreenset.tsx` → `chatCopyScreenset.tsx`
- Default category to `ScreensetCategory.Drafts` unless `--category` specified

#### Scenario: Source not found

**Given** running `hai3 screenset copy nonexistent target`
**When** source doesn't exist
**Then** the system SHALL display error and exit with code 1

#### Scenario: Target exists

**Given** running `hai3 screenset copy chat demo`
**When** `src/screensets/demo/` exists
**Then** the system SHALL display error and exit with code 1

#### Scenario: Template literal preservation

**Given** source event definition:
```typescript
export enum ChatEvents {
  Selected = `${CHAT_SCREENSET_ID}/threads/selected`,
}
```
**When** copying to `chatCopy`
**Then** the result SHALL be:
```typescript
export enum ChatCopyEvents {
  Selected = `${CHAT_COPY_SCREENSET_ID}/threads/selected`,
}
```

#### Scenario: Screen ID suffix transformation

**Given** source screen IDs that don't contain the screenset ID:
```typescript
export const HELLO_WORLD_SCREEN_ID = 'helloworld';
export const PROFILE_SCREEN_ID = 'profile';
```
**When** copying from `demo` to `demoCopy`
**Then** the system SHALL derive suffix `'Copy'` and transform:
```typescript
export const HELLO_WORLD_SCREEN_ID = 'helloworldCopy';
export const PROFILE_SCREEN_ID = 'profileCopy';
```

#### Scenario: Translation key path transformation

**Given** source menu item label:
```typescript
label: `screenset.${CHAT_SCREENSET_ID}:menu_items.chat.label`
```
**When** copying to `chatCopy`
**Then** the result SHALL be:
```typescript
label: `screenset.${CHAT_COPY_SCREENSET_ID}:menu_items.chatCopy.label`
```

#### Scenario: Default category to drafts

**Given** running `hai3 screenset copy chat chatCopy` without `--category` flag
**When** the source screenset has `category: ScreensetCategory.Mockups`
**Then** the copied screenset SHALL have `category: ScreensetCategory.Drafts`

#### Scenario: Screenset display name transformation

**Given** source screenset with `name: 'Chat'`
**When** copying to `chatCopy`
**Then** the result SHALL have `name: 'ChatCopy'`

### Requirement: Generated Code Quality

All code generated by CLI commands SHALL pass HAI3 architectural validation without modification.

#### Scenario: Created screenset passes validation

**Given** running `hai3 screenset create billing`
**When** screenset is created
**Then** `npm run arch:check` SHALL succeed

#### Scenario: Copied screenset passes validation

**Given** running `hai3 screenset copy chat chatCopy`
**When** screenset is copied
**Then**:
- `npm run arch:check` SHALL succeed
- No ID collisions SHALL occur
- New screenset SHALL be accessible in UI

### Requirement: Project Configuration File

Projects created or managed by CLI SHALL have a `hai3.config.json` file at the project root.

#### Scenario: Config file structure

```json
{
  "$schema": "https://hai3.dev/schemas/config.json",
  "version": "1.0.0",
  "uikit": "hai3",
  "devtools": true,
  "cliVersion": "1.0.0"
}
```

**Given** a project created with HAI3 UIKit and DevTools
**When** `hai3.config.json` is generated
**Then** the file SHALL contain:
- `version`: Config schema version
- `uikit`: "hai3" or "custom"
- `devtools`: boolean
- `cliVersion`: CLI version that created the project

#### Scenario: Config for project detection

**Given** any `hai3` command execution
**When** determining if inside HAI3 project
**Then** the system SHALL search for `hai3.config.json` in current and parent directories
