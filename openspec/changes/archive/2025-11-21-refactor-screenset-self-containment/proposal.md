# Change: Screenset Self-Containment Refactoring

## Why

Duplicating a screenset currently requires ~50+ manual changes across multiple files and concepts (Redux slices, events, API domains, translations, icon IDs, etc.). This is error-prone and violates the DRY principle. Each screenset should be completely self-contained where duplicating only requires copying the folder and updating exactly 2 things: the screenset ID and screen IDs.

**Current State**: Duplicating chat → chat-copy requires manually updating:
- Screenset ID constant
- Screen ID constants
- Icon IDs (to avoid conflicts)
- API domain constant
- Category setting
- Redux store file name
- Redux slice name in `createSlice()`
- State interface name
- RootState module augmentation
- Events file name
- Events enum name
- All event string prefixes (e.g., `'chat/'` → `'chat-copy/'`)
- EventPayloadMap module augmentation
- Effects file name and all event listeners
- Actions file name and all event emitters
- ApiServicesMap module augmentation
- State selectors in components (`state.chat` → `state.chatCopy`)
- Action imports and calls
- Translation keys in all 36 language files
- useScreenTranslations IDs
- Manual import in screensetRegistry.tsx

**Total**: ~50+ manual changes, high risk of errors

## What Changes

Refactor screenset architecture to derive all naming and registration from screenset ID:

1. **Centralize IDs** - All IDs in `ids.ts` (screenset ID + screen IDs)
2. **Enum pattern for state keys** - Use enum with template literal for RootState augmentation
3. **Fix RootState typing** - Define RootState explicitly (not computed from store), wrap store.getState()
4. **Auto-derive Redux slice names** - Slice name = screenset ID (e.g., `'chat'`)
5. **Auto-derive event namespaces** - Event prefix = `${screensetId}/` (e.g., `'chat/'`)
6. **Auto-derive API domains** - Domain = screenset ID (e.g., `'chat'`)
7. **Auto-derive translation namespaces** - Already done via `screenset.${id}:...`
8. **Auto-namespace icon IDs** - Prefix with screenset ID (e.g., `'chat:message-square'`)
9. **Auto-discover screensets** - Vite glob imports eliminate manual registration

**After Refactoring**: Duplicating chat → chat-copy requires:
1. Copy folder: `cp -r src/screensets/chat src/screensets/chat-copy`
2. Update ALL IDs in `ids.ts`:
   - `CHAT_SCREENSET_ID = 'chat'` → `'chat-copy'`
   - `CHAT_SCREEN_ID = 'chat'` → `'chat-copy'`

**Total**: 2 steps (copy + update one file), zero manual registration

**Auto-discovery**: Screensets are automatically discovered via Vite glob imports - no manual import needed

**Key innovation**: All IDs centralized in `ids.ts` file. Template literals and enums auto-derive all other names (Redux state keys, events, icons, API domains).

## Impact

**BREAKING**: All existing screensets must be refactored to follow new patterns

### Affected specs
- `screensets` - Core screenset architecture changes
- `i18n-loading` - Translation namespace derivation

### Affected code
- **packages/uicore/src/**:
  - `store/registerSlice.ts` - Enforce slice name = state key
  - `events/EventBus.ts` - Document event namespace convention
  - `screensets/screensetRegistry.ts` - Auto-discovery via glob pattern
  - `i18n/I18nRegistry.ts` - Namespace derivation utilities

- **src/screensets/[all screensets]/**:
  - `*Screenset.tsx` - Update to new patterns
  - `slices/*Slice.ts` - Ensure slice name = screenset ID
  - `events/*Events.ts` - Use derived event namespace
  - `api/*ApiService.ts` - Use derived domain
  - `uikit/icons/*.tsx` - Use namespaced icon IDs
  - `*Store.ts` - Simplify module augmentation

- **Documentation (`.ai/` and `.claude/`):**:
  - `.ai/targets/SCREENSETS.md` - Update architecture rules and conventions
  - `.ai/workflows/DUPLICATE_SCREENSET.md` - Update to 3-step process
  - `.claude/commands/duplicate-screenset.md` - Update to 3-step process
  - `.claude/commands/new-screenset.md` - Update with new conventions
  - `.claude/commands/new-screen.md` - Update screenset references
  - `.claude/commands/new-api-service.md` - Update API domain convention
  - `CLAUDE.md` - Update "Creating a New Screenset" section

- **Linting and Architecture**:
  - `.eslintrc.js` - Add custom rules for screenset conventions
  - `.dependency-cruiser.js` - Add rules for screenset isolation
  - `eslint-plugin-local/` (new) - Custom ESLint rules implementation

### Migration strategy
1. Update uicore infrastructure to support conventions
2. Migrate one screenset at a time (start with simplest: demo)
3. Update documentation and workflows
4. Archive duplicate-screenset workflow once migration complete

### Breaking changes
- **BREAKING**: RootState keys must match slice names exactly
- **BREAKING**: Event namespaces must follow `${screensetId}/` pattern
- **BREAKING**: Icon IDs must be namespaced as `${screensetId}:${iconName}`
- **BREAKING**: API domains must match screenset IDs

### Benefits
- **96% reduction** in duplication effort (~50 steps → 2 steps)
- **Zero configuration** - conventions replace configuration
- **Zero registration** - auto-discovery via Vite glob imports
- **Zero unsafe casts** - Proper RootState typing enables full type safety
- **Automated enforcement** - ESLint + dependency-cruiser catch violations
- **Type safety** - Enums and derived names prevent mismatches
- **Easier onboarding** - Clear, consistent patterns
- **Reduced errors** - Less manual work = fewer mistakes
