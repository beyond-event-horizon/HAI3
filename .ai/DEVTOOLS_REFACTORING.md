# DevTools Refactoring Roadmap

## Current Violations

### 1. UIKit Fallback Pattern (ENHANCEMENT)
**Current**: Direct imports only from `@hai3/uikit`
```typescript
// CURRENT (acceptable)
import { Button, DropdownMenu, Switch } from '@hai3/uikit';

// BETTER (target - with fallback)
import { Button as FallbackButton } from '@hai3/uikit';
const Button = uikitRegistry.getComponent(UiKitComponent.Button) || FallbackButton;
```

**Files to enhance** (optional, not critical):
- packages/devtools/src/sections/ThemeSelector.tsx
- packages/devtools/src/sections/ScreensetSelector.tsx
- packages/devtools/src/sections/LanguageSelector.tsx
- packages/devtools/src/sections/ApiModeToggle.tsx
- packages/devtools/src/DevToolsPanel.tsx

### 2. LocalStorage Persistence Pattern (CRITICAL)
**Violation**: Direct localStorage writes from hooks/components
```typescript
// BAD (current)
saveDevToolsState(STORAGE_KEYS.POSITION, newPosition);

// GOOD (target)
eventBus.emit('devtools/positionChanged', { position: newPosition });
// Effect listens and updates localStorage
```

**Files to create:**
- packages/devtools/src/events/devtoolsEvents.ts
- packages/devtools/src/effects/persistenceEffects.ts

**Files to refactor:**
- packages/devtools/src/hooks/useDraggable.ts (emit position events, remove direct saves)
- packages/devtools/src/hooks/useResizable.ts (emit size events, remove direct saves)
- packages/devtools/src/hooks/useKeyboardShortcut.ts (emit visibility events)

### 3. Hardcoded Strings (CRITICAL)
**Violation**: User-facing text is hardcoded
```typescript
// BAD (current)
<label>Theme:</label>
<label>Screenset:</label>
<label>Language:</label>
<label>Mock API</label>

// GOOD (target)
const { t } = useTranslation();
<label>{t('devtools:controls.theme')}</label>
<label>{t('devtools:controls.screenset')}</label>
<label>{t('devtools:controls.language')}</label>
<label>{t('devtools:controls.mockApi')}</label>
```

**Files to create:**
- packages/devtools/src/i18n/en.json (and 35 other languages)
- packages/devtools/src/i18n/translationLoader.ts

**Files to refactor:**
- All section components to use t() function

### 4. React State for UI State (CORRECT APPROACH)
**Current approach is correct** - DevTools uses React.useState for UI state
```typescript
// CURRENT (correct - keep this)
const [visible, setVisible] = useState(true);
const [collapsed, setCollapsed] = useState(false);

// DevTools UI state stays in React, NOT Redux
// Business state (theme, language, etc.) read from uicore via selectors
```

**No changes needed** - DevToolsProvider approach is correct!

### 5. Module Augmentation for Events (TO ADD)
**Missing**: DevTools events not typed in EventPayloadMap
```typescript
// TO ADD in devtools/src/events/devtoolsEvents.ts
declare module '@hai3/uicore' {
  interface EventPayloadMap {
    'devtools/positionChanged': { position: Position };
    'devtools/sizeChanged': { size: Size };
  }
}
```

**Files to create:**
- packages/devtools/src/events/devtoolsEvents.ts

### 6. Controls Call UICore Actions Directly (CORRECT APPROACH)
**Current approach is correct** - Controls call uicore actions directly
```typescript
// CURRENT (correct - keep this)
import { changeTheme, changeLanguage, selectScreenset, setApiMode } from '@hai3/uicore';
void changeTheme(themeName);

// DevTools renders uicore state, doesn't manage business logic
```

**No changes needed** - This is the right pattern!

## Refactoring Steps (Recommended Order)

### Phase 1: LocalStorage Persistence via Events
1. Create devtools events (packages/devtools/src/events/devtoolsEvents.ts)
2. Create persistence effects (packages/devtools/src/effects/persistenceEffects.ts)
3. Refactor hooks to emit events instead of direct localStorage writes:
   - useDraggable: emit 'devtools/positionChanged'
   - useResizable: emit 'devtools/sizeChanged'
4. Initialize persistence effects in DevToolsProvider or index

### Phase 2: Localization
1. Create translation loader with I18nRegistry.createLoader()
2. Create translation files for all 36 languages
3. Register translations in DevToolsProvider or index
4. Refactor all components to use t() from useTranslation()

### Phase 3: UIKit Fallback Pattern (Optional Enhancement)
1. Add fallback pattern to components (registry → direct import)
2. Keep @hai3/uikit as direct dependency (fallback allowed)
3. Ensure DevTools works without component registration

### Phase 4: Dependencies Cleanup
1. Update package.json:
   - Change @hai3/uicore to peerDependency (prevent dual instances)
   - Keep @hai3/uikit as dependency (fallback pattern)
   - Keep @hai3/uikit-contracts as dependency
2. Run architecture checks: npm run arch:check

### Phase 5: File Organization
1. Create effects/ directory and move persistence logic
2. Create events/ directory for event definitions
3. Keep current structure for sections/, hooks/, utils/
4. Add proper exports in index.ts

### Phase 6: Styling Cleanup
1. Remove any inline styles
2. Ensure all sizing uses rem-based units
3. Move visual styles to CSS modules or Tailwind utilities
4. Verify glassmorphic styling follows theme tokens

## Expected File Structure (Target)

```
packages/devtools/
├── src/
│   ├── events/
│   │   └── devtoolsEvents.ts            # DevTools UI events (position, size) + EventPayloadMap augmentation
│   ├── effects/
│   │   └── persistenceEffects.ts        # Listen to DevTools events, update localStorage
│   ├── sections/
│   │   ├── ControlPanel.tsx             # Layout for all controls
│   │   ├── ThemeSelector.tsx            # Theme control (uses uikitRegistry)
│   │   ├── ScreensetSelector.tsx        # Screenset control (uses uikitRegistry)
│   │   ├── LanguageSelector.tsx         # Language control (uses uikitRegistry)
│   │   └── ApiModeToggle.tsx            # API mode control (uses uikitRegistry)
│   ├── hooks/
│   │   ├── useDraggable.ts              # Emit position events
│   │   ├── useResizable.ts              # Emit size events
│   │   └── useKeyboardShortcut.ts       # Emit visibility events
│   ├── utils/
│   │   └── persistence.ts               # LocalStorage utils
│   ├── i18n/
│   │   ├── translationLoader.ts         # I18nRegistry.createLoader()
│   │   ├── en.json                      # English translations
│   │   ├── es.json                      # Spanish translations
│   │   └── ... (34 more languages)
│   ├── types.ts                         # TypeScript types
│   ├── DevToolsProvider.tsx             # Redux provider for DevTools
│   ├── DevToolsPanel.tsx                # Main panel component
│   ├── DevToolsOverlay.tsx              # Root component
│   └── index.ts                         # Public exports
├── package.json
└── tsup.config.ts
```

## Testing Checklist (Post-Refactoring)

- [ ] npm run build:packages passes
- [ ] npm run arch:check passes
- [ ] npm run arch:deps passes
- [ ] DevTools overlay renders correctly
- [ ] Theme selector works (calls uicore action directly)
- [ ] Screenset selector works (calls uicore action directly)
- [ ] Language selector works (calls uicore action directly)
- [ ] API mode toggle works (calls uicore action directly)
- [ ] Panel dragging works smoothly (emits position events)
- [ ] Panel resizing works smoothly (emits size events)
- [ ] Position persisted to localStorage via events
- [ ] Size persisted to localStorage via events
- [ ] Keyboard shortcut (Ctrl+Shift+D) toggles visibility
- [ ] Collapse/expand works
- [ ] RTL languages flip submenu direction correctly
- [ ] All text uses translations (no hardcoded strings)
- [ ] Z-index layering works for dropdowns
- [ ] @hai3/uicore is peer dependency (shared instance)
- [ ] @hai3/uikit is direct dependency (fallback allowed)
- [ ] No console errors

## Grep Commands for Violation Detection

```bash
# Hardcoded strings (violations)
grep -rn "Theme:\\|Screenset:\\|Language:\\|Mock API" packages/devtools/src/

# Direct localStorage writes from components/hooks (violations)
grep -rn "localStorage.setItem" packages/devtools/src/{sections,hooks}/

# Missing event emissions (should emit on state changes)
grep -rn "setPosition\\|setSize" packages/devtools/src/hooks/
```
