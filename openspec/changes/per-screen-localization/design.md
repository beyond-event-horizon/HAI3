# Design: Per-Screen Localization with Hybrid Model

## Architecture Overview

### Two-Tier Translation System

```
Screenset
├── Screenset-Level Translations (screenset.demo)
│   └── Shared content: models, contexts, common labels
└── Screen-Level Translations (screen.demo.*)
    ├── screen.demo.helloworld
    ├── screen.demo.profile
    ├── screen.demo.theme
    └── screen.demo.uikit
```

### Directory Structure

```
src/screensets/drafts/demo/
├── i18n/                          # Screenset-level (shared)
│   ├── en.json
│   ├── es.json
│   └── ... (36 languages)
├── screens/
│   ├── screenIds.ts
│   ├── helloworld/
│   │   ├── HelloWorldScreen.tsx
│   │   └── i18n/                  # Screen-level (colocated)
│   │       ├── en.json
│   │       ├── es.json
│   │       └── ... (36 languages)
│   ├── profile/
│   │   ├── ProfileScreen.tsx
│   │   └── i18n/
│   │       └── ... (36 languages)
│   └── ...
└── demoScreenset.tsx              # Registers both levels
```

### Namespace Design

**Old Format (per-screenset):**
```typescript
t('screenset.demo:screens.helloworld.title')
//  ^^^^^^^^^ screenset namespace
//                     ^^^^^^^^^^^ screen path
//                                 ^^^^^ key
```

**New Format (hybrid):**
```typescript
// Screen-specific translations
t('screen.demo.helloworld:title')
//  ^^^^^^ screen namespace prefix
//         ^^^^ screenset id
//              ^^^^^^^^^^^ screen id
//                         ^^^^^ key

// Shared screenset translations
t('screenset.demo:models.gpt_5')
//  ^^^^^^^^^ screenset namespace (unchanged)
```

### Auto-Discovery Helper

**Problem:** Manual registration is verbose and error-prone:

```typescript
// Current approach (36 lines of boilerplate)
const TRANSLATIONS: Record<Language, () => Promise<{ default: TranslationDictionary }>> = {
  [Language.English]: () => import('./i18n/en.json'),
  [Language.Arabic]: () => import('./i18n/ar.json'),
  [Language.Spanish]: () => import('./i18n/es.json'),
  // ... 33 more languages
};

i18nRegistry.registerLoader('screenset.demo', async (language: Language) => {
  const module = await TRANSLATIONS[language]();
  return module.default;
});
```

**Solution:** Auto-discovery helper:

```typescript
// New approach (1 line)
registerTranslationsFromDirectory('screenset.demo', './i18n');
```

**Implementation:**

```typescript
/**
 * Auto-discovers translation files in a directory and registers them
 *
 * @param namespace - Translation namespace (e.g., 'screen.demo.helloworld')
 * @param relativePath - Path to i18n directory relative to caller (e.g., './i18n')
 *
 * Automatically maps language codes to files:
 * - Language.English → en.json
 * - Language.Spanish → es.json
 * - etc.
 */
export function registerTranslationsFromDirectory(
  namespace: string,
  relativePath: string
): void {
  // Create language-to-file mapping
  const languageFileMap: Record<Language, string> = {
    [Language.English]: 'en.json',
    [Language.Arabic]: 'ar.json',
    // ... all 36 languages
  };

  // Build dynamic import map
  const translationMap: Record<Language, () => Promise<{ default: TranslationDictionary }>> =
    {} as Record<Language, () => Promise<{ default: TranslationDictionary }>>;

  for (const [language, filename] of Object.entries(languageFileMap)) {
    const lang = language as Language;
    translationMap[lang] = () => import(/* @vite-ignore */ `${relativePath}/${filename}`);
  }

  // Register with i18nRegistry
  i18nRegistry.registerLoader(namespace, async (language: Language) => {
    const module = await translationMap[language]();
    return module.default;
  });
}
```

### Screenset Registration Pattern

```typescript
// src/screensets/drafts/demo/demoScreenset.tsx

import { type ScreensetConfig } from '@hai3/uicore';

export const demoScreenset: ScreensetConfig = {
  id: DEMO_SCREENSET_ID,
  name: 'Demo',
  defaultScreen: HELLO_WORLD_SCREEN_ID,
  localization: './i18n', // Screenset-level translations (shared content)
  menu: [
    {
      menuItem: { id: HELLO_WORLD_SCREEN_ID, label: '...', icon: '...' },
      screen: () => import('./screens/helloworld/HelloWorldScreen'),
      localization: './screens/helloworld/i18n', // Screen-level translations
    },
    {
      menuItem: { id: PROFILE_SCREEN_ID, label: '...', icon: '...' },
      screen: () => import('./screens/profile/ProfileScreen'),
      localization: './screens/profile/i18n',
    },
    {
      menuItem: { id: CURRENT_THEME_SCREEN_ID, label: '...', icon: '...' },
      screen: () => import('./screens/theme/CurrentThemeScreen'),
      localization: './screens/theme/i18n',
    },
    {
      menuItem: { id: UI_KIT_ELEMENTS_SCREEN_ID, label: '...', icon: '...' },
      screen: () => import('./screens/uikit/UIKitElementsScreen'),
      localization: './screens/uikit/i18n',
    },
  ],
};
```

**Key Benefits:**
- Fully declarative configuration - all config in one place
- No manual registration calls needed
- Screenset registry auto-registers both screenset and screen translations
- Clear relationship between screenset/screens and their translations

### Screenset Registry Auto-Registration

The screenset registry will be enhanced to automatically register translations from both the screenset config and menu items:

```typescript
// packages/uicore/src/screensets/screensetRegistry.ts

class ScreensetRegistry {
  register(screenset: ScreensetConfig): void {
    // ... existing registration logic

    // 1. Auto-register screenset-level translations (required)
    const screensetNamespace = `screenset.${screenset.id}`;
    registerTranslationsFromDirectory(screensetNamespace, screenset.localization, screenset);

    // 2. Auto-register screen-level translations from menu config (required)
    for (const menuItem of screenset.menu) {
      const screenNamespace = `screen.${screenset.id}.${menuItem.menuItem.id}`;
      registerTranslationsFromDirectory(screenNamespace, menuItem.localization, screenset);
    }

    this.screensets.set(screenset.id, screenset);
  }
}
```

**Implementation Notes:**
- `ScreensetConfig` interface extended with required `localization: string` field for screenset-level translations
- `MenuScreenItem` interface extended with required `localization: string` field for screen-level translations
- Screenset registry registers both config levels during registration
- Screenset namespace format: `screenset.<screenset-id>`
- Screen namespace format: `screen.<screenset-id>.<screen-id>`
- Registration happens at screenset registration time (module import), not screen load time
- TypeScript enforces presence of both fields at compile time

### Loading Behavior

**Before (per-screenset):**
```
User navigates to HelloWorld screen
└─> Screen lazy-loads
└─> Screenset translations already loaded (all 161 lines × 36 languages)
```

**After (per-screen):**
```
User navigates to HelloWorld screen
├─> Screen lazy-loads
├─> Screenset translations already loaded (shared ~10 lines × 36 languages)
└─> Screen translations load (only HelloWorld ~15 lines × current language)
    └─> i18nRegistry.setLanguage() already called
    └─> Loader for 'screen.demo.helloworld' executes
    └─> Imports ./screens/helloworld/i18n/en.json (or current language)
```

### Migration Strategy

**Step 1: Add Auto-Discovery Helper**
- Create `registerTranslationsFromDirectory()` in uicore
- Export from uicore index

**Step 2: Split Translation Files**
- Extract screen-specific keys from screenset i18n files
- Create per-screen i18n directories
- Keep shared content in screenset i18n

**Step 3: Update Registration**
- Replace manual TRANSLATIONS map with auto-discovery helper
- Register both screenset and screen namespaces

**Step 4: Update Components**
- Change `t('screenset.demo:screens.hello.title')` → `t('screen.demo.hello:title')`
- Update all screen components (5 total)

**Step 5: Validate**
- Run type-check (ensures all Language enum values handled)
- Run in browser (test language switching)
- Verify lazy loading (check network tab for translation chunks)

## Trade-offs

### Chosen: Hybrid Model

**Pros:**
- ✅ Flexible - shared content at screenset level, specific at screen level
- ✅ Optimal loading - only load what's needed
- ✅ Better DX - translations colocated with screens

**Cons:**
- ⚠️ Two registration patterns to understand
- ⚠️ More files to manage

**Alternative Considered:** Pure per-screen (everything at screen level)

**Why rejected:** Duplicates shared content across screens, no natural place for screenset-level labels

### Chosen: Colocated Files

**Pros:**
- ✅ Natural cohesion - screen code + translations together
- ✅ Easier to find/edit
- ✅ Independent screen development

**Cons:**
- ⚠️ Translations scattered across multiple directories

**Alternative Considered:** Centralized `i18n/screens/hello/en.json`

**Why rejected:** Less cohesive, harder to find translations for a specific screen

### Chosen: New Namespace Format

**Pros:**
- ✅ Clearer separation between screenset and screen translations
- ✅ More natural for screen-level loading
- ✅ Prevents naming collisions

**Cons:**
- ⚠️ Breaking change - all components must update
- ⚠️ New pattern to learn

**Alternative Considered:** Keep `screenset.demo:screens.hello.key` format

**Why rejected:** Doesn't reflect new architecture, less clear ownership

## Performance Impact

### Bundle Size Analysis

**Before:**
- Demo screenset: 161 lines × 36 languages = 5,796 lines loaded on ANY screen
- Chat screenset: 63 lines × 36 languages = 2,268 lines loaded on ANY screen

**After (HelloWorld screen example):**
- Screenset shared: 10 lines × 36 languages = 360 lines loaded upfront
- HelloWorld screen: 15 lines × 1 language = 15 lines loaded on-demand
- Total for HelloWorld: 375 lines vs 5,796 lines (93.5% reduction)

### Loading Timeline

**Before:**
```
Page load
├─> App bundle (277 KB)
├─> Screenset translations (all screens, all languages)
└─> Screen component
```

**After:**
```
Page load
├─> App bundle (173 KB) ← already reduced by screen lazy-loading
├─> Screenset translations (shared only, all languages)
└─> On navigation:
    ├─> Screen component chunk
    └─> Screen translations (current language only)
```

### Network Requests

**Before:** 1 translation file per screenset per language (cached)

**After:** N+1 translation files (1 screenset + N screens) per language (cached, loaded on-demand)

Not a concern because:
- HTTP/2 multiplexing handles multiple small requests efficiently
- Files are cached after first load
- On-demand loading means unused screens never fetch translations

## Type Safety

The `Record<Language, ...>` type enforces that all 36 languages are provided:

```typescript
// Auto-discovery helper maintains type safety
const languageFileMap: Record<Language, string> = {
  [Language.English]: 'en.json',
  [Language.Arabic]: 'ar.json',
  // ... must include ALL 36 languages or TypeScript error
};
```

If a language file is missing, the dynamic import will fail at runtime with a clear error.

## Future Enhancements

1. **Component-Level Translations**
   - Further split screen translations into component-level
   - Example: `component.demo.helloworld.navigationcard:title`

2. **Translation Prefetching**
   - Predict next screen navigation
   - Prefetch translations before user clicks

3. **Translation Fallback Chain**
   - Screen → Screenset → App default
   - Allows partial translations while falling back to higher levels

4. **Build-Time Validation**
   - Check all translation files exist for all languages
   - Validate translation keys match component usage
   - Generate TypeScript types from translation keys
