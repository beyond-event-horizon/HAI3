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
   ├── {name}Screenset.tsx  (main config)
   ├── screens/
   │   └── {screen-name}/
   │       └── {ScreenName}Screen.tsx
   ├── slices/              (if state needed)
   ├── actions/             (if actions needed)
   ├── events/              (if events needed)
   ├── effects/             (if effects needed)
   └── i18n/                (translations)
       ├── en.json
       └── es.json
   ```

2. **Create screenset config** with:
   - Screenset ID constant
   - ScreensetConfig with id, name, category, defaultScreen
   - getMenuItems() returning MenuItem[]
   - getScreens() returning screen components
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
   - Use @hai3/uikit components only (no manual styling)
   - Follow event-driven pattern (actions → events → effects → slices)
   - Register slices dynamically via registerSlice()
   - All UI text uses t('screenset.{name}:key')
   - Define IDs as constants where used

6. **Validate** by running:
   ```bash
   npm run arch:check
   npm run dev
   ```
