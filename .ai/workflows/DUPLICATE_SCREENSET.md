# AI WORKFLOW (REQUIRED)

## WORKFLOW: Duplicate Screenset

REQUIRED: Copy entire screenset directory
REQUIRED: Update all IDs (screenset, screen, icon, slice, events)
REQUIRED: Update Redux slice name and module augmentation
REQUIRED: Update all event names with new namespace prefix
REQUIRED: Update all translation keys in all 36 language files
REQUIRED: Register in screensetRegistry.tsx
REQUIRED: Pass arch:check with zero errors
REQUIRED: Test via Chrome DevTools MCP (never skip)

## STEP 0: Gather Requirements

Ask the user for:
1. **SOURCE screenset name** (existing screenset to copy)
2. **TARGET screenset name** (new screenset name)
3. **TARGET category**: drafts | mockups | production

## STEP 1: Copy

REQUIRED: cp -r src/screensets/SOURCE src/screensets/TARGET

## STEP 2: Update IDs

REQUIRED: Update screenIds.ts - rename all SCREEN_ID constants
REQUIRED: Update main screenset file - rename SCREENSET_ID
REQUIRED: Update icon IDs - append suffix to avoid conflicts
REQUIRED: Set category to correct ScreensetCategory value

## STEP 3: Redux State

REQUIRED: Rename store file (SOURCEStore.ts to TARGETStore.ts)
REQUIRED: Update createSlice name field
REQUIRED: Rename State interface
REQUIRED: Update module augmentation - new state key in RootState
FORBIDDEN: Duplicate state keys

## STEP 4: Events

REQUIRED: Rename events file
REQUIRED: Update enum name
REQUIRED: Replace all event string prefixes (source/ to target/)
REQUIRED: Update EventPayloadMap with new event names
REQUIRED: Rename effects file and update listeners
REQUIRED: Rename actions file and update emits
FORBIDDEN: Any references to old event names

## STEP 5: Components

REQUIRED: Update screen component imports
REQUIRED: Change state.source to state.target in selectors
REQUIRED: Update all action imports and calls
REQUIRED: Update translation keys in tk function
REQUIRED: Update useScreenTranslations IDs
FORBIDDEN: Old screenset or screen IDs

## STEP 6: Translations

REQUIRED: Update i18n/en.json title and screen keys
REQUIRED: sed update all other language files
DETECT: grep -rn "screenset\\.SOURCE:" TARGET (MUST be 0)

## STEP 7: Register

REQUIRED: Import new screenset in screensetRegistry.tsx
REQUIRED: Call register with new config

## STEP 8: Validate

REQUIRED: npm run type-check (MUST pass)
REQUIRED: npm run arch:check (MUST pass)
DETECT: grep -rn "OLD_SCREENSET_ID" TARGET (MUST be 0)

## STEP 9: Test MCP

STOP: If MCP broken, fix first
REQUIRED: Navigate via DevTools selector
REQUIRED: Verify URL change
REQUIRED: Test all primary screenset features
REQUIRED: Test all interactive components and state changes
REQUIRED: Verify no console errors
FORBIDDEN: Skip MCP testing

## PATTERNS

BAD: Import SOURCE names | GOOD: Update to TARGET names
BAD: state.source in TARGET | GOOD: state.target in TARGET
BAD: source/ events | GOOD: target/ events
BAD: Skip testing | GOOD: Always test MCP

## CHECKLIST

- [ ] Gather requirements (source, target name, category)
- [ ] Copy, IDs, icon, category
- [ ] Store, slice, events, effects, actions
- [ ] Components, translations, register
- [ ] Type-check, arch:check, MCP test, no errors
