# Tasks: Per-Screen Localization

## Phase 1: Foundation (Auto-Discovery Helper)

### Task 1: Create language-to-file mapping constant
- [ ] Create `packages/uicore/src/i18n/languageFileMap.ts`
- [ ] Export `LANGUAGE_FILE_MAP: Record<Language, string>` with all 36 languages
- [ ] Map each Language enum to its filename (e.g., `Language.English` → `'en.json'`)
- **Validation:** TypeScript compiles, all 36 languages present

### Task 2: Implement `registerTranslationsFromDirectory()` helper
- [ ] Create `packages/uicore/src/i18n/registerTranslationsFromDirectory.ts`
- [ ] Implement function that:
  - Takes namespace and relativePath parameters
  - Uses LANGUAGE_FILE_MAP to build translation map
  - Creates dynamic imports for each language file
  - Registers loader with i18nRegistry
- [ ] Add JSDoc documentation with examples
- **Validation:** TypeScript compiles, function exported

### Task 3: Export helper from uicore
- [ ] Add export to `packages/uicore/src/index.ts`
- [ ] Export `registerTranslationsFromDirectory` function
- [ ] Export `LANGUAGE_FILE_MAP` constant (for reference)
- **Validation:** Can import from `@hai3/uicore`

### Task 4: Extend ScreensetConfig interface
- [ ] Open `packages/uicore/src/screensets/screensetRegistry.ts`
- [ ] Add required `localization: string` field to `ScreensetConfig` interface
- [ ] Add JSDoc comment explaining the field (relative path to screenset i18n directory)
- **Validation:** TypeScript compiles, field is required

### Task 5: Extend MenuScreenItem interface
- [ ] Open `packages/uicore/src/screensets/screensetRegistry.ts`
- [ ] Add required `localization: string` field to `MenuScreenItem` interface
- [ ] Add JSDoc comment explaining the field (relative path to screen i18n directory)
- **Validation:** TypeScript compiles, field is required

### Task 6: Update screenset registry to auto-register translations
- [ ] Open `packages/uicore/src/screensets/screensetRegistry.ts`
- [ ] In `register()` method, after existing logic:
  - Register screenset-level: `registerTranslationsFromDirectory('screenset.${screenset.id}', screenset.localization, screenset)`
  - Loop through `screenset.menu` and register screen-level for each: `registerTranslationsFromDirectory('screen.${screenset.id}.${menuItem.menuItem.id}', menuItem.localization, screenset)`
- [ ] Add error handling for invalid paths
- **Validation:** TypeScript compiles, logic correct

### Task 7: Build packages and validate
- [ ] Run `npm run build:packages`
- [ ] Run `npm run type-check`
- **Validation:** No TypeScript errors, clean build

## Phase 2: Demo Screenset Migration

### Task 8: Split demo screenset translations
- [ ] Read current `src/screensets/drafts/demo/i18n/en.json` (161 lines)
- [ ] Extract screen-specific keys:
  - HelloWorld: `screens.helloworld.*` → ~15 lines
  - Profile: `screens.profile.*` → ~15 lines
  - CurrentTheme: `screens.theme.*` → ~5 lines
  - UIKitElements: `screens.uikit.*` → ~140 lines
- [ ] Keep shared keys in screenset i18n (~10 lines)
- [ ] Create new file structure for English first
- **Validation:** All keys accounted for, no duplicates

### Task 9: Create per-screen i18n directories
- [ ] Create `src/screensets/drafts/demo/screens/helloworld/i18n/`
- [ ] Create `src/screensets/drafts/demo/screens/profile/i18n/`
- [ ] Create `src/screensets/drafts/demo/screens/theme/i18n/`
- [ ] Create `src/screensets/drafts/demo/screens/uikit/i18n/`
- **Validation:** Directories exist

### Task 10: Create English translation files
- [ ] Write `screens/helloworld/i18n/en.json` with HelloWorld keys
- [ ] Write `screens/profile/i18n/en.json` with Profile keys
- [ ] Write `screens/theme/i18n/en.json` with CurrentTheme keys
- [ ] Write `screens/uikit/i18n/en.json` with UIKitElements keys
- [ ] Update `screenset i18n/en.json` to remove screen-specific keys, keep shared
- **Validation:** JSON files valid, keys match original structure

### Task 11: Replicate for all 35 other languages
- [ ] For each language (es, fr, de, ... × 35):
  - Split screenset translation file
  - Create per-screen translation files
  - Update screenset file to remove screen keys
- **Validation:** 180 total files (5 × 36), all JSON valid

### Task 12: Update demo screenset config with localization paths
- [ ] Open `src/screensets/drafts/demo/demoScreenset.tsx`
- [ ] Add `localization: './i18n'` field to screenset config (screenset-level translations)
- [ ] Add `localization: './screens/helloworld/i18n'` field to HelloWorld menu item
- [ ] Add `localization: './screens/profile/i18n'` field to Profile menu item
- [ ] Add `localization: './screens/theme/i18n'` field to CurrentTheme menu item
- [ ] Add `localization: './screens/uikit/i18n'` field to UIKitElements menu item
- [ ] Remove manual TRANSLATIONS map and i18nRegistry calls (no longer needed)
- **Validation:** TypeScript compiles, translations auto-register via config

### Task 13: Update HelloWorldScreen component
- [ ] Change `screenset.${DEMO_SCREENSET_ID}:screens.${HELLO_WORLD_SCREEN_ID}.*` → `screen.demo.helloworld:*`
- [ ] Update all `t()` calls to use new namespace format
- [ ] Remove `screens.helloworld.` prefix from keys (now top-level in screen namespace)
- **Validation:** TypeScript compiles, component renders

### Task 14: Update ProfileScreen component
- [ ] Change `screenset.demo:screens.profile.*` → `screen.demo.profile:*`
- [ ] Update all `t()` calls
- **Validation:** TypeScript compiles, component renders

### Task 15: Update CurrentThemeScreen component
- [ ] Change `screenset.demo:screens.theme.*` → `screen.demo.theme:*`
- [ ] Update all `t()` calls
- **Validation:** TypeScript compiles, component renders

### Task 16: Update UIKitElementsScreen component
- [ ] Change `screenset.demo:screens.uikit.*` → `screen.demo.uikit:*`
- [ ] Update all `t()` calls
- **Validation:** TypeScript compiles, component renders

### Task 17: Test demo screenset in browser
- [ ] Navigate to each demo screen (helloworld, profile, theme, uikit)
- [ ] Switch languages and verify translations load correctly
- [ ] Check Network tab: verify per-screen translation chunks load on navigation
- [ ] Verify no console errors
- **Validation:** All screens display correct translations in all languages

## Phase 3: Chat Screenset Migration

### Task 18: Split chat screenset translations
- [ ] Read current `src/screensets/drafts/chat/i18n/en.json` (63 lines)
- [ ] Extract screen-specific keys: `screens.chat.*` → ~48 lines
- [ ] Keep shared keys (models, contexts) in screenset i18n (~15 lines)
- **Validation:** All keys accounted for

### Task 19: Create chat screen i18n directory
- [ ] Create `src/screensets/drafts/chat/screens/chat/i18n/`
- **Validation:** Directory exists

### Task 20: Create English translation files
- [ ] Write `screens/chat/i18n/en.json` with Chat screen keys
- [ ] Update `screenset i18n/en.json` to keep only shared keys (models, contexts)
- **Validation:** JSON files valid, keys match original

### Task 21: Replicate for all 35 other languages
- [ ] For each language (es, fr, de, ... × 35):
  - Split screenset translation file
  - Create screen translation file
  - Update screenset file to keep shared keys
- **Validation:** 72 total files (2 × 36), all JSON valid

### Task 22: Update chat screenset config with localization paths
- [ ] Open `src/screensets/drafts/chat/chatScreenset.tsx`
- [ ] Add `localization: './i18n'` field to screenset config (screenset-level translations)
- [ ] Add `localization: './screens/chat/i18n'` field to Chat screen menu item
- [ ] Remove manual TRANSLATIONS map and i18nRegistry calls (no longer needed)
- **Validation:** TypeScript compiles, translations auto-register via config

### Task 23: Update ChatScreen component
- [ ] Change helper from `tk = (key) => t(\`screenset.chat:screens.chat.${key}\`)`
- [ ] To: `tk = (key) => t(\`screen.chat.chat:${key}\`)`
- [ ] Verify all `tk()` calls work (no prefix change needed since we're just changing namespace)
- **Validation:** TypeScript compiles

### Task 24: Test chat screenset in browser
- [ ] Navigate to chat screen
- [ ] Switch languages and verify translations load correctly
- [ ] Check Network tab: verify screen translation chunk loads
- [ ] Test all UI elements (new chat, message placeholder, thread list, etc.)
- [ ] Verify no console errors
- **Validation:** Chat screen displays correct translations in all languages

## Phase 4: Cleanup and Documentation

### Task 25: Update CLAUDE.md documentation
- [ ] Add section on per-screen localization pattern
- [ ] Document `registerTranslationsFromDirectory()` helper
- [ ] Add examples of hybrid translation model
- [ ] Update "Creating a New Screenset" section
- **Validation:** Documentation clear and accurate

### Task 26: Update new-screenset command
- [ ] Update `.claude/commands/new-screenset.md`
- [ ] Add instructions for per-screen i18n structure
- [ ] Add auto-discovery helper usage example
- [ ] Include both screenset and screen-level registration
- **Validation:** Command template updated

### Task 27: Run full validation suite
- [ ] `npm run type-check` - no TypeScript errors
- [ ] `npm run lint` - no linting errors
- [ ] `npm run arch:check` - all architecture tests pass
- [ ] `npm run build` - clean production build
- **Validation:** All checks pass

### Task 28: Browser testing - comprehensive
- [ ] Test all 5 screens in both screensets
- [ ] Test language switching on each screen
- [ ] Verify lazy-loading behavior (Network tab)
- [ ] Test RTL languages (Arabic, Hebrew)
- [ ] Verify bundle size reduction
- **Validation:** All functionality works, performance improved

## Phase 5: Performance Validation

### Task 29: Measure bundle sizes
- [ ] Record main bundle size
- [ ] Record per-screen chunk sizes
- [ ] Record translation file sizes
- [ ] Compare to previous per-screenset approach
- **Validation:** Document performance improvements

### Task 30: Measure loading times
- [ ] Measure initial page load
- [ ] Measure screen navigation time
- [ ] Measure language switch time
- [ ] Compare to previous approach
- **Validation:** Performance improvements documented

## Dependencies

- **Task 7** must complete before Phase 2 starts (helper must be available)
- **Tasks 8-17** (Demo) can be done in parallel with **Tasks 18-24** (Chat)
- **Tasks 25-26** (Documentation) can be done anytime after understanding the pattern
- **Tasks 27-30** (Validation) must be done last

## Estimated Effort

- **Phase 1:** 1-2 hours (helper implementation)
- **Phase 2:** 2-3 hours (demo migration, 4 screens)
- **Phase 3:** 1-2 hours (chat migration, 1 screen)
- **Phase 4:** 1 hour (documentation, cleanup)
- **Phase 5:** 30 minutes (performance validation)
- **Total:** 5.5-8.5 hours

## Parallelization Opportunities

- **Demo and Chat migrations** (Tasks 7-16 || Tasks 17-23): Can be done simultaneously
- **Translation file creation** within each screenset: Can be scripted/automated
- **Component updates** within each screenset: Can be done in any order

## Automation Opportunities

- Script to split translation files based on `screens.*` prefix
- Script to create per-screen i18n directories
- Script to replicate English files to other languages (copy structure, keep translations)
