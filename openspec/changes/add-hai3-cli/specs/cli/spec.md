## ADDED Requirements

### Requirement: CLI Package Structure

The CLI SHALL be implemented as a workspace package `@hai3/cli` with a globally installable binary named `hai3` and a programmatic API for AI agent integration.

#### Scenario: Package installation

**Given** a developer installing the CLI globally
**When** running `npm install -g @hai3/cli`
**Then** the system SHALL:
- Install the `@hai3/cli` package
- Make `hai3` command available in PATH
- Support both ESM and CommonJS environments

#### Scenario: Package structure

```
packages/cli/
├── package.json          # name: @hai3/cli, bin: { hai3: ./dist/index.js }
├── tsup.config.ts        # Bundle config
├── src/
│   ├── index.ts          # CLI entry point (Commander setup)
│   ├── api.ts            # Programmatic API exports
│   │
│   ├── core/
│   │   ├── command.ts    # CommandDefinition interface
│   │   ├── registry.ts   # CommandRegistry class
│   │   ├── executor.ts   # executeCommand() function
│   │   ├── context.ts    # CommandContext builder
│   │   └── logger.ts     # Colored output (silenceable)
│   │
│   ├── commands/
│   │   ├── create/       # Project creation command
│   │   ├── update/       # Update command
│   │   └── screenset/    # Screenset subcommands
│   │
│   ├── generators/       # TypeScript code generators
│   │   ├── project.ts
│   │   ├── screenset.ts
│   │   ├── screen.ts
│   │   ├── i18n.ts
│   │   └── utils.ts
│   │
│   └── utils/
│       ├── project.ts    # findProjectRoot(), loadConfig()
│       ├── fs.ts         # writeGeneratedFiles()
│       └── transform.ts  # ID transformation for copy
```

**Given** the package structure above
**When** tsup builds the package
**Then** the output SHALL include both CLI binary and library exports

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

#### Scenario: Pre-filled answers for prompts

```typescript
const result = await executeCommand(
  commands.create,
  { projectName: 'my-app' },
  {
    interactive: false,
    answers: {
      uikit: 'hai3',
      devtools: true,
      initGit: false,
    },
  }
);
```

**Given** a command with interactive prompts
**When** executed with `answers` object
**Then** the system SHALL use provided answers instead of prompting

#### Scenario: Structured error responses

```typescript
const result = await executeCommand(
  commands.screensetCreate,
  { name: 'Invalid-Name' },
  { interactive: false }
);

// result = {
//   success: false,
//   errors: [
//     { code: 'INVALID_NAME', message: 'Screenset name must be camelCase' }
//   ]
// }
```

**Given** invalid arguments
**When** validation fails
**Then** the system SHALL return structured errors with code and message

### Requirement: TypeScript-Based Code Generation

The CLI SHALL use TypeScript generator functions (NOT template engines like EJS) to produce type-safe, refactorable code.

#### Scenario: Generator function pattern

```typescript
interface ScreensetGeneratorInput {
  screensetId: string;
  screensetName: string;
  initialScreenId: string;
  category: ScreensetCategory;
}

interface GeneratedFile {
  path: string;
  content: string;
}

function generateScreenset(input: ScreensetGeneratorInput): GeneratedFile[] {
  return [
    generateIdsFile(input),
    generateScreensetConfig(input),
    generateInitialScreen(input),
    ...generateI18nFiles(input),
  ];
}
```

**Given** typed generator input
**When** generating code
**Then** the system SHALL:
- Use TypeScript functions to build file contents
- Return array of `{ path, content }` objects
- Enable IDE autocomplete and refactoring support

#### Scenario: Generated ids.ts file

```typescript
function generateIdsFile(input: ScreensetGeneratorInput): GeneratedFile {
  const { screensetId, screensetName, initialScreenId } = input;
  return {
    path: `src/screensets/${screensetId}/ids.ts`,
    content: `/**
 * ${screensetName} Screenset IDs
 */
export const ${toScreamingSnake(screensetName)}_SCREENSET_ID = '${screensetId}';
export const ${toScreamingSnake(initialScreenId)}_SCREEN_ID = '${initialScreenId}';
`,
  };
}
```

**Given** screenset input with `screensetId: 'billing'`, `screensetName: 'Billing'`
**When** `generateIdsFile()` is called
**Then** the output SHALL contain:
- Export for `BILLING_SCREENSET_ID = 'billing'`
- Export for initial screen ID

### Requirement: Project Creation Command

The CLI SHALL provide a `hai3 create <project-name>` command that scaffolds a new HAI3 project with interactive configuration.

#### Scenario: Interactive project creation

**Given** a developer running `hai3 create my-app`
**When** the command executes interactively
**Then** the system SHALL:
- Prompt: "Which UIKit would you like to use?" (HAI3 UIKit / Custom UIKit)
- Prompt: "Include DevTools?" (Yes / No)
- Create directory `my-app/`
- Generate `package.json` with selected dependencies
- Generate `hai3.config.json` with configuration
- Generate `.ai/` documents matching configuration
- Generate boilerplate files (App.tsx, main.tsx, vite.config.ts)
- Run `npm install` with progress indicator

#### Scenario: Non-interactive project creation

**Given** a developer running `hai3 create my-app --uikit=hai3 --devtools --no-git`
**When** the command executes
**Then** the system SHALL skip prompts and use flag values

#### Scenario: Project name validation

**Given** invalid project name `123-invalid`
**When** validation runs
**Then** the system SHALL display error and exit with code 1

#### Scenario: Directory conflict handling

**Given** existing directory `my-app/`
**When** running `hai3 create my-app`
**Then** the system SHALL prompt for overwrite confirmation

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

#### Scenario: Project detection traverses parents

**Given** running from `my-app/src/components/`
**When** `hai3.config.json` exists in `my-app/`
**Then** the system SHALL detect project root correctly

### Requirement: Screenset Create Command

The CLI SHALL provide a `hai3 screenset create <name>` command that scaffolds a new screenset with one initial screen.

#### Scenario: Create screenset

**Given** running `hai3 screenset create billing` inside a HAI3 project
**When** the command executes
**Then** the system SHALL create:
```
src/screensets/billing/
├── ids.ts
├── billingScreenset.tsx
├── i18n/
│   └── ... (36 language files)
└── screens/
    └── home/
        ├── HomeScreen.tsx
        └── i18n/
            └── ... (36 language files)
```

#### Scenario: Name validation

**Given** invalid name `My-Screenset`
**When** validation runs
**Then** the system SHALL display: "Screenset name must be camelCase"

#### Scenario: Existing screenset

**Given** `src/screensets/demo/` exists
**When** running `hai3 screenset create demo`
**Then** the system SHALL display error and exit with code 1

#### Scenario: Category flag

**Given** running `hai3 screenset create billing --category=production`
**When** generating screenset config
**Then** the config SHALL have `category: ScreensetCategory.Production`

#### Scenario: Outside project error

**Given** running outside HAI3 project
**When** no `hai3.config.json` found
**Then** the system SHALL display: "Not inside a HAI3 project"

### Requirement: Screenset Copy Command

The CLI SHALL provide a `hai3 screenset copy <source> <target>` command that duplicates an existing screenset with transformed IDs.

#### Scenario: Copy with ID transformation

**Given** running `hai3 screenset copy chat chatCopy`
**When** `src/screensets/chat/` exists
**Then** the system SHALL:
- Copy to `src/screensets/chatCopy/`
- Parse `chat/ids.ts` using TypeScript compiler API
- Transform constant names: `CHAT_SCREENSET_ID` -> `CHAT_COPY_SCREENSET_ID`
- Transform string values: `'chat'` -> `'chatCopy'`
- Rename files: `chatScreenset.tsx` -> `chatCopyScreenset.tsx`

#### Scenario: Source not found

**Given** running `hai3 screenset copy nonexistent target`
**When** source doesn't exist
**Then** the system SHALL display error and exit with code 1

#### Scenario: Target exists

**Given** running `hai3 screenset copy chat demo`
**When** `src/screensets/demo/` exists
**Then** the system SHALL display error and exit with code 1

#### Scenario: Category override

**Given** running `hai3 screenset copy chat chatProd --category=production`
**When** original has `category: ScreensetCategory.Drafts`
**Then** copied screenset SHALL have `category: ScreensetCategory.Production`

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

#### Scenario: Redux slice transformation

**Given** source screenset with Redux slices
**When** copying
**Then** the system SHALL transform:
- Slice file names
- Slice names in `createSlice()`
- State keys in RootState augmentation
- Selector names and references

### Requirement: Generated Code Quality

All code generated by CLI commands SHALL pass HAI3 architectural validation without modification.

#### Scenario: Created project passes validation

**Given** running `hai3 create my-app`
**When** project is created
**Then** the following SHALL succeed in `my-app/`:
```bash
npm run type-check
npm run lint
npm run arch:check
npm run build
```

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
