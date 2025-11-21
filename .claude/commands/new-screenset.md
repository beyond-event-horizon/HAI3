---
description: Create a new screenset following HAI3 architecture
---

Read `.ai/targets/SCREENSETS.md`.

Ask user for: screenset name (camelCase), category (Drafts/Mockups/Production), initial screens, whether state management needed, whether API services needed.

## STEP 1: Create directory structure
```bash
mkdir -p src/screensets/{name}/screens/{screen-name}
mkdir -p src/screensets/{name}/i18n
```

## STEP 2: Create centralized IDs file
File: src/screensets/{name}/ids.ts
Export SCREENSET_ID (camelCase) and all SCREEN_IDs (camelCase).

## STEP 3: Create screenset-level i18n
Create ALL 36 language files in src/screensets/{name}/i18n/ (en.json, es.json, etc).
Use I18nRegistry.createLoader() in screenset config.

## STEP 4: Create screen components
For each screen in src/screensets/{name}/screens/{screen-name}/:
- Create {ScreenName}Screen.tsx with default export
- Create i18n/ folder with ALL 36 language files
- Use useScreenTranslations() hook
- Wrap translated text with TextLoader component

## STEP 5: Create screenset config
File: src/screensets/{name}/{name}Screenset.tsx
- Import IDs from ./ids
- Register icons if any (template literal: `${SCREENSET_ID}:iconName`)
- Create screenset translations loader
- Define ScreensetConfig with lazy-loaded screens
- Call screensetRegistry.register() at end

## STEP 6: If state management needed
Create domain-based structure:
- slices/{domain}Slice.ts for each domain
- events/{domain}Events.ts with local DOMAIN_ID constant
- effects/{domain}Effects.ts for each domain
- actions/{name}Actions.ts
Register each slice with its own effects in screenset config.
NO coordinator effects file. NO index.ts barrel exports.

## STEP 7: If API services needed
Create src/screensets/{name}/api/{Name}ApiService.ts
Use template literal for domain: `${SCREENSET_ID}:serviceName`
Create mocks.ts and import in screenset config.

## STEP 8: Validate
```bash
npm run type-check
npm run arch:check
npm run lint
npm run dev
```

## STEP 9: Test via Chrome DevTools MCP
STOP if MCP WebSocket is closed.
1. mcp__chrome-devtools__list_pages
2. mcp__chrome-devtools__take_snapshot - verify screenset in selector
3. Switch to new screenset via dev panel
4. mcp__chrome-devtools__list_console_messages - verify 0 errors
5. Test all screens and features
