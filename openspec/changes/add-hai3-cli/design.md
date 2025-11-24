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
- **Template-based generation** - copy real project files, not programmatic strings

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
**Decision:** Commander.js for CLI parsing, chalk for colored output
**Alternatives:**
- yargs: More verbose API, less intuitive for subcommands
- oclif: Overkill for 4 commands, heavy framework
- Inquirer.js: Dropped in favor of simpler approach with flags

### Command Structure
**Decision:** `hai3 <verb>` for top-level, `hai3 screenset <verb>` for screenset operations
**Rationale:**
- `create` and `update` are project-level operations
- `screenset` groups related operations, enables future expansion (`hai3 screenset list`, `hai3 screenset delete`)
- Follows established patterns (npm, git, docker)

### Project Detection
**Decision:** Check for `hai3.config.json` marker file in project root
**Rationale:**
- Simple marker file with `{ "hai3": true }` content
- Explicit project identifier (like `tsconfig.json` for TypeScript projects)
- No configuration values - purely for project detection

### Template-Based Code Generation (IMPLEMENTED)

**Decision:** Copy real project files at build time, transform IDs at runtime
**Rationale:**
- **Single source of truth**: Templates are real, working code from the main project
- **No drift**: When framework patterns change, templates auto-update on next CLI build
- **Accurate**: No manual string interpolation that could introduce bugs
- **Maintainable**: Edit real files, not template strings

**Implementation:**
```
presets/
├── standalone/
│   ├── configs/                  # Source of truth for standalone project configs
│   │   ├── .eslintrc.cjs
│   │   ├── .dependency-cruiser.cjs
│   │   └── tsconfig.json
│   └── scripts/
│       └── test-architecture.ts  # Source of truth for standalone scripts
├── monorepo/
│   ├── configs/                  # Extends standalone/configs/
│   └── scripts/                  # Extends standalone/scripts/

packages/cli/
├── scripts/
│   └── copy-templates.ts     # Build script: copies from presets/standalone/
├── templates/                 # Generated at build time (gitignored)
│   ├── .ai/                   # AI guidelines
│   ├── .cursor/               # Cursor rules
│   ├── .windsurf/             # Windsurf rules
│   ├── src/themes/            # Theme files
│   ├── src/uikit/             # UIKit registry
│   ├── src/icons/             # Icon utilities
│   ├── src/screensets/demo/   # Demo screenset (for projects)
│   ├── screenset-template/    # _blank screenset (for screenset create)
│   └── manifest.json          # Build metadata
```

**Build Process:**
```bash
npm run build  # in packages/cli
# 1. Runs copy-templates.ts - copies from main project
# 2. Runs tsup - bundles CLI code
# 3. Templates are included in dist
```

### Blank Screenset Template

**Decision:** Minimal `_blank` screenset with structure only, no business logic
**Rationale:**
- Provides correct file structure and patterns
- No confusing example code to delete
- Clear placeholder comments showing where to add logic

**Template Structure:**
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
│   ├── HomeScreen.tsx        # Simple screen with title/description
│   └── i18n/                 # 36 language files
└── _blankScreenset.tsx       # Screenset config with self-registration
```

### ID Transformation for Screenset Create

**Decision:** String replacement with ordered patterns
**Rationale:**
- Simple and predictable
- Handles all naming conventions (camelCase, PascalCase, SCREAMING_SNAKE)
- Order matters: more specific patterns before generic `_blank`

**Home Screen ID Pattern:**
The `_blank` template uses `HOME_SCREEN_ID = '_blank'` (same value as screenset ID) to ensure each created screenset has a unique route. When transformed, `'_blank'` becomes `'billing'`, giving each screenset a unique home screen route.

**Transform Patterns (in order):**
```typescript
// SCREAMING_SNAKE constants
_BLANK_SCREENSET_ID → BILLING_SCREENSET_ID
_BLANK_DOMAIN → BILLING_DOMAIN

// String values (includes HOME_SCREEN_ID value)
'_blank' → 'billing'
"_blank" → "billing"

// Specific patterns (before generic _blank)
_blankScreenset → billingScreenset
_blankApiService → billingApiService
_blankSlice → billingSlice
_blankEffects → billingEffects
_blankEvents → billingEvents
_BlankEvents → BillingEvents
_BlankState → BillingState
initialize_BlankEffects → initializeBillingEffects
select_BlankState → selectBillingState

// Generic patterns (last)
_blank → billing
_Blank → Billing
```

### ID Transformation for Copy

**Decision:** Parse `ids.ts` using regex, generate transformation map with suffix-based screen ID transformation
**Rationale:**
- Follows existing convention that ALL IDs are in `ids.ts`
- Regex parsing sufficient for controlled format
- Safer than string-based find-replace
- Screen IDs use suffix to avoid screenset ID in routes

**Suffix Derivation:**
```typescript
// If target starts with source, suffix is the remainder
// 'chat' -> 'chatCopy' gives suffix 'Copy'
// 'demo' -> 'demoV2' gives suffix 'V2'
function deriveCopySuffix(source: string, target: string): string {
  if (target.startsWith(source)) {
    return target.slice(source.length);
  }
  return toPascalCase(target); // fallback
}
```

**Screen ID Transformation:**
```typescript
// Screen IDs that don't contain screenset ID get suffix appended
// 'helloworld' -> 'helloworldCopy' (not 'demoCopyHelloworld')
// 'profile' -> 'profileCopy'
if (constName.endsWith('_SCREEN_ID') && !value.startsWith(sourceScreensetId)) {
  newValue = `${value}${suffix}`;
}
```

**Translation Key Path Transformation:**
```typescript
// Transform .originalValue. patterns in template literals
// 'menu_items.chat.label' -> 'menu_items.chatCopy.label'
result = result.replace(
  /\.${escapeRegExp(originalValue)}([.}\`:]|$)/g,
  `.${newValue}$1`
);
```

**Category Default:**
```typescript
// Default to 'drafts' for copies (copies are work-in-progress)
const category: ScreensetCategory = args.category ?? 'drafts';
```

**Display Name Transformation:**
```typescript
// Update name property for screenset selector display
// name: 'Chat' -> name: 'ChatCopy'
result = result.replace(
  /^(\s*name:\s*)['"]([^'"]+)['"]/m,
  `$1'${toPascalCase(target)}'`
);
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

## Architecture Diagram

```
@hai3/cli
├── scripts/
│   └── copy-templates.ts       # Build-time template copying
│
├── templates/                   # Gitignored - generated at build
│   ├── manifest.json            # Build metadata
│   ├── screenset-template/      # _blank screenset for create
│   └── ...                      # Project files for create
│
├── src/
│   ├── index.ts                 # CLI entry (Commander setup)
│   ├── api.ts                   # Programmatic API exports (for AI agents)
│   │
│   ├── core/
│   │   ├── command.ts           # CommandDefinition interface
│   │   ├── registry.ts          # CommandRegistry
│   │   ├── executor.ts          # executeCommand()
│   │   ├── types.ts             # Shared types
│   │   ├── logger.ts            # Colored output (silenceable)
│   │   └── prompt.ts            # Prompt abstraction
│   │
│   ├── commands/
│   │   ├── create/
│   │   │   └── index.ts         # CommandDefinition
│   │   ├── update/
│   │   │   └── index.ts
│   │   └── screenset/
│   │       ├── create.ts
│   │       └── copy.ts
│   │
│   ├── generators/
│   │   ├── project.ts           # Reads from templates/
│   │   ├── screensetFromTemplate.ts  # Transform _blank template
│   │   ├── screenset.ts         # Legacy programmatic (kept for reference)
│   │   ├── i18n.ts              # Translation file utilities
│   │   ├── transform.ts         # ID transformation for copy
│   │   └── utils.ts             # toPascalCase, toScreamingSnake, etc.
│   │
│   └── utils/
│       ├── project.ts           # findProjectRoot(), loadConfig()
│       ├── fs.ts                # writeGeneratedFiles()
│       └── validation.ts        # Name validation utilities
│
└── package.json                 # bin: { hai3: ./dist/index.cjs }
```

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Generated code drifts from framework patterns | Templates are real code from main project |
| Template copy adds build time | Only ~300 files, takes <1s |
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
   - **Neither** - Template-based approach using real project files.

5. ~~Should screenset create use programmatic generation or templates?~~
   - **Templates** - Copy from `_blank` screenset with ID transformation.
