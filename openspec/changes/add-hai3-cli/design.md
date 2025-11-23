## Context

HAI3 is a monorepo with workspace packages. The CLI needs to:
1. Be globally installable via npm (`npm install -g @hai3/cli`)
2. Work both standalone (project creation) and within projects (screenset management)
3. Generate code following HAI3's strict architectural patterns
4. Maintain consistency with existing screenset conventions (ids.ts, template literals, auto-discovery)
5. **Serve as foundation for future AI agent commands** - architecture must support programmatic invocation

## Goals / Non-Goals

**Goals:**
- Simple, memorable command structure (`hai3 <verb>` or `hai3 <noun> <verb>`)
- Interactive prompts for complex configuration (project creation)
- Minimal flags for repetitive operations (screenset management)
- Generated code passes `npm run arch:check` out of the box
- Support all 36 languages in generated i18n stubs
- **Scalable architecture** for future command additions
- **Programmatic API** for AI agent integration
- **Type-safe code generation** using TypeScript (no template strings)

**Non-Goals:**
- GUI or web-based project wizard
- Ejecting or converting existing projects
- Managing theme files (too simple to need CLI)
- Hot-reload or watch mode during generation

## Decisions

### Package Structure
**Decision:** New package at `packages/cli/` using tsup for bundling
**Rationale:** Consistent with existing monorepo structure; tsup already used for other packages

### CLI Framework
**Decision:** Commander.js for CLI parsing, Inquirer.js for prompts
**Alternatives:**
- yargs: More verbose API, less intuitive for subcommands
- oclif: Overkill for 4 commands, heavy framework
- Prompts.js: Less popular than Inquirer, fewer features

### Command Structure
**Decision:** `hai3 <verb>` for top-level, `hai3 screenset <verb>` for screenset operations
**Rationale:**
- `create` and `update` are project-level operations
- `screenset` groups related operations, enables future expansion (`hai3 screenset list`, `hai3 screenset delete`)
- Follows established patterns (npm, git, docker)

### Project Detection
**Decision:** Check for `hai3.config.json` in project root
**Rationale:**
- Explicit marker file (like `tsconfig.json` for TypeScript projects)
- Can store project-specific CLI configuration in future
- Falls back to checking `package.json` for `@hai3/*` dependencies

### Code Generation (TypeScript-based, NOT EJS)
**Decision:** Use TypeScript generator functions that return typed AST or string builders
**Rationale:**
- **Type safety**: Templates are TypeScript code, IDE autocomplete works
- **Refactoring**: Renaming types/interfaces propagates to generators
- **Testing**: Generator functions are unit-testable
- **No runtime parsing**: Faster than template engines
- **AI-friendly**: Generators can be called programmatically with typed inputs

**Implementation Pattern:**
```typescript
// packages/cli/src/generators/screenset.ts
interface ScreensetGeneratorInput {
  screensetId: string;
  screensetName: string;  // PascalCase
  initialScreenId: string;
  category: ScreensetCategory;
}

interface GeneratedFile {
  path: string;
  content: string;
}

export function generateScreenset(input: ScreensetGeneratorInput): GeneratedFile[] {
  return [
    generateIdsFile(input),
    generateScreensetConfig(input),
    generateInitialScreen(input),
    ...generateI18nFiles(input),
  ];
}

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

### Scalable Command Architecture
**Decision:** Plugin-based command registry with standardized interfaces
**Rationale:**
- New commands can be added without modifying core CLI
- AI agent commands will use same infrastructure
- Each command is isolated, testable, documentable

**Implementation Pattern:**
```typescript
// packages/cli/src/core/command.ts
export interface CommandContext {
  cwd: string;
  projectRoot: string | null;  // null if outside HAI3 project
  config: Hai3Config | null;
  logger: Logger;
  prompt: PromptFn;  // Abstracted for AI agents to provide answers
}

export interface CommandDefinition<TArgs = unknown, TResult = void> {
  name: string;
  description: string;
  args: ArgDefinition[];
  options: OptionDefinition[];

  // Validation before execution
  validate(args: TArgs, ctx: CommandContext): ValidationResult;

  // Main execution - returns result for programmatic use
  execute(args: TArgs, ctx: CommandContext): Promise<TResult>;
}

// Registry for dynamic command loading
export class CommandRegistry {
  private commands = new Map<string, CommandDefinition>();

  register(cmd: CommandDefinition): void;
  get(name: string): CommandDefinition | undefined;
  list(): CommandDefinition[];
}
```

### AI Agent Integration Layer
**Decision:** Dual-mode execution: interactive (human) vs programmatic (AI agent)
**Rationale:**
- Same commands work for both humans and AI agents
- AI agents can bypass prompts by providing all arguments upfront
- Results are structured for AI consumption

**Implementation Pattern:**
```typescript
// packages/cli/src/core/executor.ts
export interface ExecutionMode {
  interactive: boolean;  // false for AI agents
  answers?: Record<string, unknown>;  // Pre-filled prompt answers
}

export async function executeCommand<T>(
  command: CommandDefinition<unknown, T>,
  args: unknown,
  mode: ExecutionMode = { interactive: true }
): Promise<CommandResult<T>> {
  const ctx = await buildContext(mode);

  const validation = command.validate(args, ctx);
  if (!validation.ok) {
    return { success: false, errors: validation.errors };
  }

  const result = await command.execute(args, ctx);
  return { success: true, data: result };
}

// AI agents call this directly
import { executeCommand, commands } from '@hai3/cli';

const result = await executeCommand(
  commands.screensetCreate,
  { name: 'billing', category: 'drafts' },
  { interactive: false }
);
```

### ID Transformation for Copy
**Decision:** Parse `ids.ts` using TypeScript compiler API, generate transformation map
**Rationale:**
- Follows existing convention that ALL IDs are in `ids.ts`
- TypeScript AST parsing is accurate (vs regex)
- Can validate that all IDs follow naming conventions
- Safer than string-based find-replace

## Architecture Diagram

```
@hai3/cli
├── src/
│   ├── index.ts              # CLI entry (Commander setup)
│   ├── api.ts                # Programmatic API exports (for AI agents)
│   │
│   ├── core/
│   │   ├── command.ts        # CommandDefinition interface
│   │   ├── registry.ts       # CommandRegistry
│   │   ├── executor.ts       # executeCommand()
│   │   ├── context.ts        # CommandContext builder
│   │   └── logger.ts         # Colored output (silenceable)
│   │
│   ├── commands/
│   │   ├── create/
│   │   │   ├── index.ts      # CommandDefinition
│   │   │   └── prompts.ts    # Interactive questions
│   │   ├── update/
│   │   │   └── index.ts
│   │   └── screenset/
│   │       ├── create.ts
│   │       └── copy.ts
│   │
│   ├── generators/           # TypeScript code generators
│   │   ├── project.ts        # Full project scaffolding
│   │   ├── screenset.ts      # Screenset scaffolding
│   │   ├── screen.ts         # Individual screen
│   │   ├── i18n.ts           # Translation file stubs
│   │   └── utils.ts          # toScreamingSnake, toPascalCase, etc.
│   │
│   └── utils/
│       ├── project.ts        # findProjectRoot(), loadConfig()
│       ├── fs.ts             # writeGeneratedFiles()
│       └── transform.ts      # ID transformation for copy
│
└── package.json              # bin: { hai3: ./dist/index.js }
```

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Generated code drifts from framework patterns | Include generated files in arch:check CI |
| Version incompatibility between CLI and project | Store compatible version range in hai3.config.json |
| TypeScript generators harder to visualize than templates | Each generator is small, focused, well-documented |
| AI agent API surface area grows unpredictably | Define stable public API, version it |

## Migration Plan

Not applicable - new capability, no migration required.

## Future Extensibility

### Planned AI Agent Commands (future proposal)
- `hai3 agent analyze` - Analyze codebase and suggest improvements
- `hai3 agent fix <issue>` - Auto-fix common issues
- `hai3 agent generate <spec>` - Generate code from natural language spec

### Plugin System (future)
```typescript
// Future: External plugins
// ~/.hai3/plugins/my-plugin/index.ts
export default {
  commands: [myCustomCommand],
  generators: [myCustomGenerator],
};
```

## Open Questions (Resolved)

1. ~~Should `hai3 create` support non-interactive mode via flags for CI/automation?~~
   - **Yes** - Essential for AI agents. Use `--uikit=hai3|custom` and `--devtools` flags.

2. ~~Should CLI be published to npm public registry or private?~~
   - **Public** - Following framework's open-source nature.

3. ~~Should `hai3 screenset copy` also copy Redux slices if present?~~
   - **Yes** - With ID transformation in slice names and state keys.

4. ~~EJS vs TypeScript for templates?~~
   - **TypeScript generators** - Type safety, testability, AI-friendliness.
