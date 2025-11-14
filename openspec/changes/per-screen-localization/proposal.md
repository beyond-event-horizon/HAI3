# Change: Per-Screen Localization with Hybrid Model

## Why

Currently, translations are organized per-screenset with one large translation file per language containing all screens in that screenset. This means:
- When a user navigates to any screen, ALL translations for ALL screens in the screenset are loaded
- Large screensets (like demo with 4 screens) load unnecessary translation data
- This negates the performance benefits of lazy-loaded screens implemented in the previous change
- No natural cohesion between screen code and its translations

**Example:** Demo screenset loads 161 lines of translations × 36 languages when user loads HelloWorld screen, but HelloWorld only needs ~15 lines.

Per-screen localization will:
- Load translations on-demand when screens are lazy-loaded
- Improve initial page load and navigation performance
- Create better code cohesion (translations colocated with screen components)
- Enable independent screen development (screen + translations together)

## What Changes

### Hybrid Translation Model

1. **Screenset-Level Translations** (for shared content)
   - Namespace: `screenset.<screenset-id>` (existing)
   - Location: `screensets/<category>/<name>/i18n/` (existing)
   - Contains: Shared labels, models, contexts, etc.
   - Registration: Screenset config with auto-discovery helper

2. **Screen-Level Translations** (screen-specific content)
   - Namespace: `screen.<screenset-id>.<screen-id>` (NEW)
   - Location: `screens/<screen-name>/i18n/` (NEW - colocated with screen)
   - Contains: Only translations needed by that specific screen
   - Registration: Screenset config with auto-discovery helper

### Declarative Localization Configuration

Both screenset-level and screen-level translations are configured declaratively in the screenset config:

```typescript
// Before: Manual registration calls
const TRANSLATIONS: Record<Language, ...> = { ... };
i18nRegistry.registerLoader('screenset.demo', async (lang) => { ... });
// ... for each screen

// After: Fully declarative config
export const demoScreenset: ScreensetConfig = {
  id: DEMO_SCREENSET_ID,
  localization: './i18n', // NEW - screenset-level (shared content)
  menu: [
    {
      menuItem: { id: HELLO_WORLD_SCREEN_ID, label: '...', icon: '...' },
      screen: () => import('./screens/helloworld/HelloWorldScreen'),
      localization: './screens/helloworld/i18n', // NEW - screen-level
    },
    {
      menuItem: { id: PROFILE_SCREEN_ID, label: '...', icon: '...' },
      screen: () => import('./screens/profile/ProfileScreen'),
      localization: './screens/profile/i18n', // NEW - screen-level
    },
    // ... other screens
  ],
};
```

The screenset registry automatically registers both screenset-level and screen-level translations based on the `localization` fields.

### Migration Path

**Demo Screenset** (4 screens):
- Before: 1 file × 36 languages = 36 files (161 lines each)
- After:
  - Screenset-level: 36 files (~10 lines each) for shared content
  - HelloWorld: 36 files (~15 lines each)
  - CurrentTheme: 36 files (~5 lines each)
  - Profile: 36 files (~15 lines each)
  - UIKitElements: 36 files (~140 lines each)
  - Total: 5 × 36 = 180 files (but loaded on-demand)

**Chat Screenset** (1 screen + shared):
- Before: 1 file × 36 languages = 36 files (63 lines each)
- After:
  - Screenset-level: 36 files (~15 lines for models, contexts)
  - Chat screen: 36 files (~48 lines each)
  - Total: 2 × 36 = 72 files (but loaded on-demand)

## Impact

**Performance:**
- ✅ Translations loaded only when needed (lazy-loaded with screens)
- ✅ Reduced initial bundle size (only shared translations loaded upfront)
- ✅ Faster navigation (smaller translation chunks per screen)

**Developer Experience:**
- ✅ Better cohesion (translations next to screen code)
- ✅ Easier maintenance (edit screen + translations together)
- ✅ Simpler registration (auto-discovery helper)
- ✅ Independent screen development

**Breaking Changes:**
- ⚠️ `ScreensetConfig` interface now requires `localization: string` field
- ⚠️ `MenuScreenItem` interface now requires `localization: string` field
- ⚠️ Manual translation registration code must be completely removed
- ⚠️ Translation key format changes from `screenset.demo:screens.hello.title` to `screen.demo.hello:title`
- ⚠️ All screen components must update their `t()` calls
- ⚠️ Translation files must be split and relocated

**Migration Effort:**
- 2 screensets to migrate (demo, chat)
- 5 screens total to update
- Estimated: 2-3 hours with automated tests

## Dependencies

**Requires:**
- Lazy-loaded screens (completed in previous change)
- i18nRegistry with namespace support (exists)

**Enables:**
- Future: Per-component translation bundles
- Future: Translation prefetching for predicted navigation

## Risks

**File Management:**
- More files to manage (180 vs 72 currently)
- Mitigated by: Colocated structure makes it easier to find/edit

**Registration Complexity:**
- More registration calls per screenset
- Mitigated by: Auto-discovery helper reduces boilerplate

**Testing:**
- Need to ensure all language files present for all screens
- Mitigated by: TypeScript Record<Language, ...> enforces at compile time
