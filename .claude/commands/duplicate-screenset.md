---
description: Duplicate an existing screenset with all IDs changed
---

Read `.ai/workflows/DUPLICATE_SCREENSET.md` and `.ai/targets/SCREENSETS.md`.

Ask user for SOURCE screenset, TARGET screenset (camelCase), and category (Drafts/Mockups/Production).

## STEP 1: Copy screenset
```bash
cp -r src/screensets/SOURCE src/screensets/TARGET
```

## STEP 2: Update src/screensets/TARGET/ids.ts
Replace all ID constants with TARGET values. Screenset ID must be camelCase, single word preferred.

## STEP 3: Optional - update category
Edit src/screensets/TARGET/TARGETScreenset.tsx and change category if needed.

## STEP 4: Validate
```bash
npm run type-check
npm run arch:check
npm run lint
grep -rn "OLD_SCREENSET_ID" src/screensets/TARGET/  # Must return 0 matches
```

## STEP 5: Test via Chrome Studio MCP
STOP if MCP WebSocket is closed. Fix connection first.
1. npm run dev
2. mcp__chrome-studio__list_pages
3. mcp__chrome-studio__navigate_page to http://localhost:5173
4. mcp__chrome-studio__take_snapshot - verify TARGET in screenset selector
5. Click TARGET screenset in dev panel
6. mcp__chrome-studio__list_console_messages - verify 0 errors
7. Test primary features
8. Verify auto-discovery worked (screenset appears without manual registration)
