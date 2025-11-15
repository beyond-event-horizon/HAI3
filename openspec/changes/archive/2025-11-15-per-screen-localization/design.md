# Design: Per-Screen Localization with Hybrid Model

## Architecture Overview

### Two-Tier Translation System

```
Screenset
├── Screenset-Level Translations (screenset.demo)
│   └── Menu titles ONLY: screens.helloworld.title, screens.profile.title
└── Screen-Level Translations (screen.demo.*)
    ├── screen.demo.helloworld  → ALL screen-specific content
    ├── screen.demo.profile      → ALL screen-specific content
    ├── screen.demo.theme        → ALL screen-specific content
    └── screen.demo.uikit        → ALL screen-specific content
```

### Critical Design Decision: Content Separation

**Problem Discovered:** Initial implementation duplicated screen content in both screenset-level and screen-level translation files. For example, `src/screensets/drafts/demo/i18n/en.json` contained:

```json
{
  "screens": {
    "helloworld": {
      "title": "Hello World",
      "welcome": "Welcome to HAI3 Demo Screenset",  // ❌ Duplicated
      "description": "This is a simple demo...",     // ❌ Duplicated
      "go_to_theme": "Go to Theme Screen"            // ❌ Duplicated
    }
  }
}
```

**Impact:** This defeated the entire purpose of lazy loading - when a user switched languages, ALL screen content for ALL screens would load immediately (36 languages × all screens × full content).

**Solution:** Strict content separation enforced:
- **Screenset-level** (`src/screensets/drafts/demo/i18n/`): Contains ONLY menu titles needed for navigation menu
- **Screen-level** (`src/screensets/drafts/demo/screens/helloworld/i18n/`): Contains ALL screen-specific UI text

**Corrected Structure:**

```json
// src/screensets/drafts/demo/i18n/en.json (screenset-level)
{
  "title": "Demo Screenset",
  "description": "Example screens for HAI3 framework",
  "screens": {
    "helloworld": { "title": "Hello World" },        // ✅ Menu title only
    "profile": { "title": "User Profile" },          // ✅ Menu title only
    "theme": { "title": "Current Theme" },           // ✅ Menu title only
    "uikit": { "title": "UI Kit Elements" }          // ✅ Menu title only
  }
}

// src/screensets/drafts/demo/screens/helloworld/i18n/en.json (screen-level)
{
  "title": "Hello World",
  "welcome": "Welcome to HAI3 Demo Screenset",      // ✅ Only here
  "description": "This is a simple demo screen...", // ✅ Only here
  "navigation_title": "Navigation Example",         // ✅ Only here
  "navigation_description": "Click the button...",  // ✅ Only here
  "go_to_theme": "Go to Theme Screen"               // ✅ Only here
}
```

**Result:** When switching languages, only menu titles load immediately. Screen content loads on-demand when user navigates to that screen.

### Directory Structure

```
src/screensets/drafts/demo/
├── i18n/                          # Screenset-level (menu titles + shared content ONLY)
│   ├── en.json                    # Contains: title, description, screens.*.title
│   ├── es.json                    # NO screen-specific content (to avoid duplication)
│   └── ... (36 languages)
├── screens/
│   ├── screenIds.ts
│   ├── helloworld/
│   │   ├── HelloWorldScreen.tsx
│   │   └── i18n/                  # Screen-level (ALL screen-specific content)
│   │       ├── en.json            # Contains: all screen UI text, labels, descriptions
│   │       ├── es.json            # Loaded lazily when screen is selected
│   │       └── ... (36 languages)
│   ├── profile/
│   │   ├── ProfileScreen.tsx
│   │   └── i18n/
│   │       └── ... (36 languages)
│   └── ...
└── demoScreenset.tsx              # Registers both levels
```

**CRITICAL: Avoiding Duplication**
- Screenset-level files contain ONLY menu titles (e.g., `screens.helloworld.title`)
- Screen-level files contain ALL screen-specific content
- DO NOT duplicate screen content in both levels - defeats lazy loading purpose

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

### I18nRegistry - Consolidated Translation Management

All translation functionality is centralized in the `I18nRegistry` class following SOLID and DRY principles.

**Current approach** - Manual translation loader with explicit imports:

```typescript
// Screenset translation loader (36 lines, but type-safe)
const screensetLoader = I18nRegistry.createLoader({
  [Language.English]: () => import('./i18n/en.json'),
  [Language.Arabic]: () => import('./i18n/ar.json'),
  [Language.Spanish]: () => import('./i18n/es.json'),
  // ... all 36 languages (required for type safety)
});
```

**Why explicit imports?** Vite requires static import paths for code splitting. Dynamic path construction (`import(\`./i18n/${lang}.json\`)`) breaks Vite's module graph analysis.

**I18nRegistry.createLoader()** - Static method that wraps translation imports:

```typescript
/**
 * Create a translation loader from language-specific imports
 *
 * This static method eliminates boilerplate error handling while maintaining
 * Vite's static analysis requirements for code splitting.
 *
 * @param translationMap - Map of Language to import functions
 * @returns Translation loader function compatible with i18nRegistry
 *
 * @example
 * const loader = I18nRegistry.createLoader({
 *   [Language.English]: () => import('./i18n/en.json'),
 *   [Language.Spanish]: () => import('./i18n/es.json'),
 * });
 */
static createLoader(
  translationMap: Record<Language, () => Promise<{ default: TranslationDictionary }>>
): TranslationLoader {
  return async (language: Language): Promise<TranslationDictionary> => {
    try {
      const module = await translationMap[language]();
      return module.default;
    } catch (error) {
      console.error(`[i18n] Failed to load ${language}:`, error);
      return {}; // Return empty dict on error instead of breaking app
    }
  };
}
```

**I18nRegistry.LANGUAGE_FILE_MAP** - Static property for language-to-filename mapping:

```typescript
/**
 * Maps Language enum to JSON filenames
 * Centralized mapping used by auto-discovery helpers
 */
static readonly LANGUAGE_FILE_MAP: Record<Language, string> = {
  [Language.English]: 'en.json',
  [Language.Arabic]: 'ar.json',
  [Language.Spanish]: 'es.json',
  // ... all 36 languages
};
```

**i18nRegistry.registerFromDirectory()** - Instance method for auto-discovery (future use):

```typescript
/**
 * Auto-discover translation files in a directory
 *
 * NOTE: Currently not used due to Vite static analysis limitations.
 * Explicit imports in screensets provide better type safety and code splitting.
 *
 * @param namespace - Translation namespace (e.g., 'screenset.demo')
 * @param relativePath - Path to i18n directory (e.g., './i18n')
 *
 * @example
 * i18nRegistry.registerFromDirectory('screenset.demo', './i18n');
 */
registerFromDirectory(namespace: string, relativePath: string): void {
  // Build dynamic import map using LANGUAGE_FILE_MAP
  const translationMap = {} as Record<Language, () => Promise<{ default: TranslationDictionary }>>;

  for (const [language, filename] of Object.entries(I18nRegistry.LANGUAGE_FILE_MAP)) {
    const lang = language as Language;
    translationMap[lang] = () => import(/* @vite-ignore */ `${relativePath}/${filename}`);
  }

  this.registerLoader(namespace, I18nRegistry.createLoader(translationMap));
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

**Initial Load (app startup):**
```
App initializes
├─> Screenset translations load (menu titles only)
│   └─> Demo: 4 menu titles × 36 languages
│   └─> Chat: 1 menu title × 36 languages
└─> Default screen (HelloWorld) loads
    └─> Screen translations load (HelloWorld content × 1 language)
```

**Language Switch (user changes from English to Arabic):**
```
User selects Arabic
├─> Mark translationsReady = false (shows skeleton loaders)
├─> Load screenset translations for Arabic (menu titles only)
│   └─> Demo: 4 titles
│   └─> Chat: 1 title
├─> Mark translationsReady = true
└─> Current screen translations load automatically
    └─> HelloWorld Arabic content loads
    └─> Increment screenTranslationsVersion (triggers re-render)
```

**Screen Navigation (user clicks Profile menu item):**
```
User navigates to Profile screen
├─> navigateToScreen('profile') action dispatched
├─> Screen component lazy-loads
└─> useScreenTranslations() hook executes
    ├─> Registers loader for 'screen.demo.profile'
    └─> Loads current language only
        └─> Imports ./screens/profile/i18n/ar.json (if Arabic selected)
        └─> Increment screenTranslationsVersion
        └─> Component re-renders with translations
```

**Key Points:**
- Screenset-level: Loads ALL languages (but only menu titles - minimal data)
- Screen-level: Loads CURRENT language only (on-demand when screen selected)
- No duplication between levels ensures minimal data transfer

### Migration Strategy

**Step 1: Add Auto-Discovery Helper**
- Create `registerTranslationsFromDirectory()` in uicore
- Export from uicore index

**Step 2: Split Translation Files**
- Extract screen-specific keys from screenset i18n files
- Create per-screen i18n directories
- **CRITICAL:** Keep ONLY menu titles in screenset i18n files
- **CRITICAL:** Move ALL screen content to screen-level i18n files
- Avoid duplication between levels

**Step 3: Remove Duplication (if exists)**
- Review all screenset-level translation files
- Ensure `screens.*.title` contains ONLY the title field
- Remove any other screen-specific content from screenset files
- Verify screen-level files contain all screen UI text

**Step 4: Update Registration**
- Replace manual TRANSLATIONS map with auto-discovery helper
- Register both screenset and screen namespaces

**Step 5: Update Components**
- Change `t('screenset.demo:screens.hello.title')` → `t('screen.demo.hello:title')`
- Update all screen components (5 total)

**Step 6: Validate**
- Run type-check (ensures all Language enum values handled)
- Run in browser (test language switching via MCP)
- Verify lazy loading (check network tab for translation chunks)
- Verify no duplication (screenset files should be minimal)

## Trade-offs

### Chosen: Hybrid Model

**Pros:**
- ✅ Flexible - shared content at screenset level, specific at screen level
- ✅ Optimal loading - only load what's needed
- ✅ Better DX - translations colocated with screens
- ✅ Clear content separation - menu titles vs screen content
- ✅ Prevents duplication - strict rules enforced

**Cons:**
- ⚠️ Two registration patterns to understand
- ⚠️ More files to manage
- ⚠️ Requires discipline to avoid duplication between levels

**Alternative Considered:** Pure per-screen (everything at screen level)

**Why rejected:** Duplicates shared content across screens, no natural place for screenset-level labels

### Critical Issue Resolved: Content Duplication

**Problem:** Initial implementation allowed screen content to exist in both screenset-level and screen-level files, defeating lazy loading.

**Why it happened:** Unclear boundaries - developers naturally copied full screen content to screenset files for easy access.

**Prevention:**
1. **Strict rule:** Screenset files contain ONLY `screens.*.title` (menu labels)
2. **Documentation:** Clear examples showing correct split
3. **Code review:** Check for duplication in translation PRs
4. **Future:** Build-time validation to detect duplication

**Lesson learned:** Lazy loading only works if content is truly separated. Duplication defeats the entire optimization.

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

**Before (with duplication bug):**
- Demo screenset-level: ~80 lines × 36 languages = 2,880 lines
  - Contained: title, description, AND all screen content duplicated
- Demo screen-level: 4 screens × ~15 lines × 36 languages = 2,160 lines
  - Same content duplicated from screenset-level files
- **Total loaded on language switch:** 2,880 lines (all unnecessary)
- **Total duplication waste:** 2,160 lines duplicated across both levels

**After (duplication fixed):**
- Demo screenset-level: ~8 lines × 36 languages = 288 lines
  - Contains: title, description, 4 menu titles ONLY
- HelloWorld screen-level: ~15 lines × 1 language = 15 lines (loaded on-demand)
- **Total for HelloWorld:** 288 + 15 = 303 lines vs 2,880 lines (89.5% reduction)
- **Total duplication eliminated:** 2,160 lines removed

**Chat Screenset:**
- Screenset-level: ~4 lines × 36 languages = 144 lines (title + description + 1 menu title)
- Chat screen-level: ~25 lines × 1 language = 25 lines (loaded on-demand)
- **Total for Chat:** 144 + 25 = 169 lines

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

1. **Build-Time Duplication Detection (HIGH PRIORITY)**
   - Scan all translation files during build
   - Detect duplicate keys between screenset-level and screen-level files
   - Fail build if duplication detected
   - Report: "Duplicate key 'screens.helloworld.welcome' found in both screenset and screen files"
   - Prevents regression of duplication bug

2. **Component-Level Translations**
   - Further split screen translations into component-level
   - Example: `component.demo.helloworld.navigationcard:title`

3. **Translation Prefetching**
   - Predict next screen navigation
   - Prefetch translations before user clicks

4. **Translation Fallback Chain**
   - Screen → Screenset → App default
   - Allows partial translations while falling back to higher levels

5. **Build-Time Validation**
   - Check all translation files exist for all languages
   - Validate translation keys match component usage
   - Generate TypeScript types from translation keys
   - Verify screenset files contain only menu titles
