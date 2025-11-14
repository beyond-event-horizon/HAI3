---
description: Create a new screenset following HAI3 architecture
---

Before starting, read `.ai/targets/SCREENSETS.md` and summarize 3-5 key rules.

Ask the user for:
1. Screenset name (e.g., "dashboard", "settings")
2. Category: drafts | mockups | production
3. Initial screens to include

Then create the screenset following this structure:

1. **Create directory structure:**
   ```
   src/screensets/{category}/{name}/
   ├── {name}Screenset.tsx  (main config with lazy loaders)
   ├── screens/
   │   ├── screenIds.ts     (REQUIRED: centralized screen ID constants)
   │   └── {screen-name}/
   │       └── {ScreenName}Screen.tsx  (with default export)
   ├── slices/              (if state needed)
   ├── actions/             (if actions needed)
   ├── events/              (if events needed)
   ├── effects/             (if effects needed)
   └── i18n/                (translations)
       ├── en.json
       └── es.json
   ```

2. **Create screen IDs file (REQUIRED):**
   ```typescript
   // src/screensets/{category}/{name}/screens/screenIds.ts
   export const SCREEN_ONE_ID = '{name}-screen-one';
   export const SCREEN_TWO_ID = '{name}-screen-two';
   ```

3. **Create screen components with default exports:**
   ```typescript
   // Screen component must have default export for lazy loading
   export const ScreenName: React.FC = () => { /* ... */ };
   ScreenName.displayName = 'ScreenName';
   export default ScreenName;  // REQUIRED
   ```

4. **Create screenset config** with lazy loaders:
   - Screenset ID constant
   - Import screen IDs from screenIds.ts (NOT from screen files)
   - Use dynamic imports: `screen: () => import('./screens/path/Screen')`
   - ScreensetConfig with menu array containing MenuScreenItem objects
   - Self-registration via screensetRegistry.register()

3. **Register in screensetRegistry:**
   - Add import to `src/screensets/screensetRegistry.tsx`

4. **Register i18n loader:**
   ```typescript
   i18nRegistry.registerLoader('screenset.{name}', async (language) => {
     return (await import(`./i18n/${language}.json`)).default;
   });
   ```

5. **Follow rules:**
   - **CRITICAL:** All screens MUST use lazy loading (dynamic imports)
   - Screen IDs MUST be in separate `screenIds.ts` file
   - Screen components MUST export default for lazy loading
   - NO top-level screen component imports in screenset config
   - Use @hai3/uikit components only (no manual styling)
   - Follow event-driven pattern (actions → events → effects → slices)
   - Register slices dynamically via registerSlice()
   - All UI text uses t('screenset.{name}:key')

6. **Validate** by running:
   ```bash
   npm run arch:check
   npm run dev
   ```
