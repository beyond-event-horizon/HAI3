# screensets Specification

## Purpose
TBD - created by archiving change per-screen-localization. Update Purpose after archive.
## Requirements
### Requirement: Declarative localization configuration in menu

Screensets SHALL specify screen localization paths declaratively in the menu config alongside screen loaders.

#### Scenario: Demo screenset with 4 screens

```typescript
// src/screensets/demo/demoScreenset.tsx

import { type ScreensetConfig } from '@hai3/uicore';

export const demoScreenset: ScreensetConfig = {
  id: 'demo',
  name: 'Demo',
  defaultScreen: HELLO_WORLD_SCREEN_ID,
  localization: './i18n', // NEW FIELD - screenset-level (shared content)
  menu: [
    {
      menuItem: { id: HELLO_WORLD_SCREEN_ID, label: '...', icon: '...' },
      screen: () => import('./screens/helloworld/HelloWorldScreen'),
      localization: './screens/helloworld/i18n', // NEW FIELD - screen-level
    },
    {
      menuItem: { id: PROFILE_SCREEN_ID, label: '...', icon: '...' },
      screen: () => import('./screens/profile/ProfileScreen'),
      localization: './screens/profile/i18n', // NEW FIELD - screen-level
    },
    {
      menuItem: { id: CURRENT_THEME_SCREEN_ID, label: '...', icon: '...' },
      screen: () => import('./screens/theme/CurrentThemeScreen'),
      localization: './screens/theme/i18n', // NEW FIELD - screen-level
    },
    {
      menuItem: { id: UI_KIT_ELEMENTS_SCREEN_ID, label: '...', icon: '...' },
      screen: () => import('./screens/uikit/UIKitElementsScreen'),
      localization: './screens/uikit/i18n', // NEW FIELD - screen-level
    },
  ],
};
```

**Given** a screenset with 4 screens and shared content
**When** the screenset is registered with screensetRegistry
**Then** the system SHALL:
- Register screenset-level namespace from `localization` field
- Automatically register 4 screen-level namespaces from menu config
- Use each screen's `localization` field to build namespace and load path

#### Scenario: Chat screenset with shared models/contexts

```typescript
// src/screensets/drafts/chat/chatScreenset.tsx

import { type ScreensetConfig } from '@hai3/uicore';

export const chatScreenset: ScreensetConfig = {
  id: 'chat',
  name: 'Chat',
  defaultScreen: CHAT_SCREEN_ID,
  localization: './i18n', // NEW FIELD - screenset-level (models, contexts)
  menu: [
    {
      menuItem: { id: CHAT_SCREEN_ID, label: '...', icon: '...' },
      screen: () => import('./screens/chat/ChatScreen'),
      localization: './screens/chat/i18n', // NEW FIELD - screen-level
    },
  ],
};
```

**Given** a chat screenset with shared models/contexts and one screen
**When** the screenset is registered
**Then** the system SHALL:
- Register screenset-level namespace from `localization` field for models and contexts
- Automatically register screen-level namespace from menu config
- Keep shared and screen translations separate

### Requirement: ScreensetConfig interface extension

The ScreensetConfig interface SHALL be extended to include a required localization field for screenset-level translations.

#### Scenario: ScreensetConfig type definition

```typescript
// packages/uicore/src/screensets/screensetRegistry.ts

export interface ScreensetConfig {
  id: string;
  name: string;
  defaultScreen: string;
  localization: string; // NEW FIELD - required relative path to screenset i18n directory
  menu: MenuScreenItem[];
  // ... other fields
}
```

**Given** the ScreensetConfig interface
**When** TypeScript compiles the screenset configs
**Then** the system SHALL:
- Require `localization` field at screenset level
- Validate field is string type (relative path)
- Fail compilation if field is missing

### Requirement: MenuScreenItem interface extension

The MenuScreenItem interface SHALL be extended to include a required localization field for screen-level translations.

#### Scenario: MenuScreenItem type definition

```typescript
// packages/uicore/src/screensets/screensetRegistry.ts

export interface MenuScreenItem {
  menuItem: MenuItem;
  screen: ScreenLoader;
  localization: string; // NEW FIELD - required relative path to screen i18n directory
}
```

**Given** the MenuScreenItem interface
**When** TypeScript compiles the screenset configs
**Then** the system SHALL:
- Require `localization` field in menu items
- Validate field is string type (relative path)
- Fail compilation if field is missing

#### Scenario: Screenset registry processes localization fields

```typescript
// Auto-registration logic in screensetRegistry.register()

// 1. Register screenset-level translations (required)
const namespace = `screenset.${screenset.id}`;
registerTranslationsFromDirectory(namespace, screenset.localization, screenset);

// 2. Register screen-level translations from menu (required)
for (const menuItem of screenset.menu) {
  const namespace = `screen.${screenset.id}.${menuItem.menuItem.id}`;
  registerTranslationsFromDirectory(namespace, menuItem.localization, screenset);
}
```

**Given** a screenset with required `localization` field and menu items with required `localization` fields
**When** the screenset registry processes the screenset
**Then** the system SHALL:
- Register screenset-level namespace using `screenset.localization`
- Build screen namespace as `screen.<screenset-id>.<screen-id>` for each menu item
- Call `registerTranslationsFromDirectory()` with namespace and path for each
- TypeScript will enforce presence of fields at compile time

### Requirement: Translation directory structure

Screensets SHALL organize translation files in a two-tier structure: screenset-level in the screenset's i18n directory, and screen-level colocated with each screen.

#### Scenario: Demo screenset directory structure

```
src/screensets/demo/
├── i18n/                          # Screenset-level (shared)
│   ├── en.json                    # ~10 lines (shared labels)
│   ├── es.json
│   └── ... (36 languages)
├── screens/
│   ├── screenIds.ts
│   ├── helloworld/
│   │   ├── HelloWorldScreen.tsx
│   │   └── i18n/                  # Screen-level
│   │       ├── en.json            # ~15 lines (HelloWorld only)
│   │       ├── es.json
│   │       └── ... (36 languages)
│   ├── profile/
│   │   ├── ProfileScreen.tsx
│   │   └── i18n/                  # Screen-level
│   │       └── ... (36 languages)
│   └── ...
└── demoScreenset.tsx              # Registers all translations
```

**Given** a screenset with multiple screens
**When** organizing translation files
**Then** the system SHALL:
- Place screenset-level translations in `<screenset>/i18n/`
- Place screen-level translations in `<screenset>/screens/<screen>/i18n/`
- Provide one file per language in each i18n directory (36 files total)

### Requirement: Declarative translation registration

Screensets SHALL use declarative `localization` fields in config to register translations automatically.

#### Scenario: Before (manual registration)

```typescript
// ❌ OLD (deprecated)
const TRANSLATIONS: Record<Language, () => Promise<{ default: TranslationDictionary }>> = {
  [Language.English]: () => import('./i18n/en.json'),
  [Language.Arabic]: () => import('./i18n/ar.json'),
  [Language.Spanish]: () => import('./i18n/es.json'),
  // ... 33 more languages (36 total lines of boilerplate)
};

i18nRegistry.registerLoader(`screenset.${DEMO_SCREENSET_ID}`, async (language: Language): Promise<TranslationDictionary> => {
  const module = await TRANSLATIONS[language]();
  return module.default;
});
```

**Given** the old manual registration pattern
**When** migrating to per-screen localization
**Then** this code MUST be replaced with declarative configuration

#### Scenario: After (declarative configuration)

```typescript
// ✅ NEW (required)
export const demoScreenset: ScreensetConfig = {
  id: 'demo',
  localization: './i18n', // Screenset-level translations registered automatically
  menu: [
    {
      menuItem: { ... },
      screen: () => import('./screens/hello/HelloScreen'),
      localization: './screens/hello/i18n', // Screen-level translations registered automatically
    },
  ],
};
```

**Given** the new declarative configuration
**When** registering screenset translations
**Then** the system SHALL:
- Read `localization` field from screenset config
- Read `localization` field from each menu item
- Automatically register translations for both levels
- Automatically discover all 36 language files per directory

