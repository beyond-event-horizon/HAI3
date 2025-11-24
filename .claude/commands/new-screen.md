---
description: Add a new screen to an existing screenset
---

Read `.ai/targets/SCREENSETS.md`.

Ask user for: screenset path (e.g., src/screensets/chat), screen name (camelCase), whether to add to menu.

## STEP 1: Add screen ID to centralized ids.ts
File: src/screensets/{screenset}/ids.ts
Add: export const NEW_SCREEN_ID = 'newScreen';

## STEP 2: Create screen directory
```bash
mkdir -p src/screensets/{screenset}/screens/{screen-name}/i18n
```

## STEP 3: Create screen i18n files
Create ALL 36 language files in screens/{screen-name}/i18n/ (en.json, es.json, etc).

## STEP 4: Create screen component
File: src/screensets/{screenset}/screens/{screen-name}/{ScreenName}Screen.tsx
- Import useScreenTranslations, useTranslation, I18nRegistry, Language from @hai3/uicore
- Import SCREENSET_ID and SCREEN_ID from ../../ids
- Create translation loader with I18nRegistry.createLoader() for ALL 36 languages
- Call useScreenTranslations(SCREENSET_ID, SCREEN_ID, translations) in component
- Use t() with keys: screen.${SCREENSET_ID}.${SCREEN_ID}:key
- Wrap translated text with TextLoader
- Add displayName property
- Export default for lazy loading

## STEP 5: If adding to menu
Edit src/screensets/{screenset}/{screenset}Screenset.tsx menu array:
- Add menuItem with id, label (translation key), optional icon
- Add screen lazy loader: () => import('./screens/{screen-name}/{ScreenName}Screen')

## STEP 6: Validate
```bash
npm run type-check
npm run lint
```

## STEP 7: Test via Chrome Studio MCP
STOP if MCP WebSocket is closed.
1. npm run dev
2. mcp__chrome-studio__navigate_page to screenset
3. mcp__chrome-studio__take_snapshot
4. Navigate to new screen
5. mcp__chrome-studio__list_console_messages - verify 0 errors
6. Verify translations load correctly
