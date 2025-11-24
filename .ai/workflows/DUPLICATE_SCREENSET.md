# AI WORKFLOW (REQUIRED)

## WORKFLOW: Duplicate Screenset

REQUIRED: Copy folder and update ids.ts only (2 steps, 96% reduction from ~50 steps).
REQUIRED: Pass arch:check with zero errors.
REQUIRED: Test via Chrome Studio MCP (never skip).

## STEP 0: Gather Requirements

Ask user for:
- SOURCE screenset name (existing screenset to copy).
- TARGET screenset name (camelCase, single word preferred).
- TARGET category: Drafts, Mockups, or Production.

## STEP 1: Copy Folder

REQUIRED: cp -r src/screensets/SOURCE src/screensets/TARGET

What gets copied:
- All screens, components, UI elements.
- Redux slices/, actions/, events/, effects/ with domain-specific files (if present).
- API services and mocks (if present).
- Icons (if present).
- Translation files (all 36 languages).
- ids.ts (will be updated in Step 2).

## STEP 2: Update IDs

REQUIRED: Update ids.ts with TARGET_SCREENSET_ID and all SCREEN_IDs (camelCase).
REQUIRED: Everything else auto-updates via template literals.
- Event enums: ${TARGET_SCREENSET_ID}/${DOMAIN_ID}/eventName (domain files have local DOMAIN_ID constant).
- Icon IDs: ${TARGET_SCREENSET_ID}:iconName.
- API domain: ${TARGET_SCREENSET_ID}:serviceName.
- Redux state key: State = \`${TARGET_SCREENSET_ID}\`.
- Screenset auto-discovered (no manual registration).

Optional: Update category in screenset config if needed.

## STEP 3: Validate

REQUIRED: npm run type-check (MUST pass with zero errors).
REQUIRED: npm run arch:check (MUST pass all checks).
REQUIRED: npm run lint (MUST pass with zero errors).
DETECT: grep -rn "OLD_SCREENSET_ID" src/screensets/TARGET/ (MUST be 0 matches).

## STEP 4: Test via Chrome Studio MCP

STOP: If MCP connection is broken, fix it first. NEVER skip testing.
REQUIRED: npm run dev.
REQUIRED: mcp__chrome-studio__list_pages to check open pages.
REQUIRED: mcp__chrome-studio__navigate_page to load app.
REQUIRED: mcp__chrome-studio__take_snapshot to verify screenset appears in selector.
REQUIRED: Click screenset in dev panel to switch to new screenset.
REQUIRED: Verify URL changes to target screenset.
REQUIRED: mcp__chrome-studio__list_console_messages to check for errors.
REQUIRED: Test all primary screenset features.
REQUIRED: Verify no console errors in browser.

## CHECKLIST

- [ ] Gather requirements (source, target name, category).
- [ ] Copy folder: cp -r src/screensets/SOURCE src/screensets/TARGET.
- [ ] Update ids.ts with new screenset ID and all screen IDs.
- [ ] (Optional) Update category in screenset config.
- [ ] Run type-check (MUST pass).
- [ ] Run arch:check (MUST pass).
- [ ] Run lint (MUST pass).
- [ ] Verify zero occurrences of old screenset ID.
- [ ] Test via Chrome Studio MCP (NEVER skip).
- [ ] Verify screenset auto-discovered in dev panel.
- [ ] Test all features and verify no console errors.
