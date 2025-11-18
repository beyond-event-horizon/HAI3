---
description: Duplicate an existing screenset with all IDs changed
---

Before starting, read `.ai/workflows/DUPLICATE_SCREENSET.md` and `.ai/targets/SCREENSETS.md`.

Ask the user for:
1. SOURCE screenset name (existing screenset to copy)
2. TARGET screenset name (new screenset name)
3. Category for TARGET: drafts | mockups | production

Then follow the workflow in `.ai/workflows/DUPLICATE_SCREENSET.md` exactly:

## STEP 1: Copy
- Execute: `cp -r src/screensets/SOURCE src/screensets/TARGET`

## STEP 2: Update IDs
- Update `screenIds.ts` - rename all SCREEN_ID constants
- Update main screenset file - rename SCREENSET_ID constant
- Update icon IDs - append suffix to avoid conflicts
- Set category to the specified ScreensetCategory value

## STEP 3: Redux State
- Rename store file (`SOURCEStore.ts` to `TARGETStore.ts`)
- Update `createSlice` name field
- Rename State interface (SourceState to TargetState)
- Update module augmentation - new state key in RootState
- FORBIDDEN: Duplicate state keys

## STEP 4: Events
- Rename events file
- Update enum name (SourceEvents to TargetEvents)
- Replace all event string prefixes (`source/` to `target/`)
- Update EventPayloadMap with new event names
- Rename effects file and update all listeners
- Rename actions file and update all emits
- FORBIDDEN: Any references to old event names

## STEP 5: Components
- Update all screen component imports
- Change `state.source` to `state.target` in all selectors
- Update all action imports and calls
- Update translation keys in tk function
- Update useScreenTranslations IDs
- FORBIDDEN: Old screenset or screen IDs

## STEP 6: Translations
- Update `i18n/en.json` title and screen keys
- Use sed to update all other 35 language files
- DETECT: `grep -rn "screenset\\.SOURCE:" TARGET` (MUST be 0 matches)

## STEP 7: Register
- Import new screenset in `src/screensets/screensetRegistry.tsx`
- Ensure self-registration call exists

## STEP 8: Validate
- Run: `npm run arch:check` (MUST pass with zero errors)
- DETECT: `grep -rn "OLD_SCREENSET_ID" TARGET` (MUST be 0 matches)

## STEP 9: Test MCP
- STOP: If MCP WebSocket broken, fix first (see `.ai/MCP_TROUBLESHOOTING.md`)
- Navigate to new screenset via Chrome DevTools MCP
- Verify URL change in browser
- Test all primary screenset features
- Test all interactive components and state changes
- Verify no console errors
- FORBIDDEN: Skip MCP testing

## Critical Patterns
- BAD: Import SOURCE names | GOOD: Update to TARGET names
- BAD: state.source in TARGET code | GOOD: state.target in TARGET code
- BAD: source/ events in TARGET | GOOD: target/ events in TARGET
- BAD: Skip testing | GOOD: Always test via MCP

## Final Checklist
- [ ] Copy complete, all IDs updated, icon IDs unique, category set
- [ ] Store, slice, events, effects, actions all renamed and updated
- [ ] Components, translations (all 36 languages), registry updated
- [ ] Type-check passes, arch:check passes, MCP test complete, no errors

## References
- `.ai/workflows/DUPLICATE_SCREENSET.md` - Full workflow
- `.ai/targets/SCREENSETS.md` - Screenset architecture rules
- `.ai/MCP_TROUBLESHOOTING.md` - MCP connection recovery
