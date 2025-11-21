# i18n-loading Specification

## Purpose
TBD - created by archiving change per-screen-localization. Update Purpose after archive.
## Requirements
### Requirement: Auto-discovery translation registration

The system SHALL provide a helper function to automatically discover and register translation files from a directory, eliminating manual boilerplate for all 36 languages.

#### Scenario: Register translations from directory

```typescript
// Before: Manual registration (36 lines of boilerplate)
const TRANSLATIONS: Record<Language, () => Promise<{ default: TranslationDictionary }>> = {
  [Language.English]: () => import('./i18n/en.json'),
  [Language.Arabic]: () => import('./i18n/ar.json'),
  // ... 34 more languages
};
i18nRegistry.registerLoader('screenset.demo', async (language) => {
  const module = await TRANSLATIONS[language]();
  return module.default;
});

// After: Auto-discovery (1 line)
registerTranslationsFromDirectory('screenset.demo', './i18n');
```

**Given** a directory containing translation JSON files named by language code (`en.json`, `es.json`, etc.)
**When** `registerTranslationsFromDirectory(namespace, relativePath)` is called
**Then** the system SHALL:
- Map all 36 Language enum values to their corresponding filenames
- Create dynamic imports for each language file
- Register a loader with i18nRegistry that loads translations on-demand

#### Scenario: Type-safe language file mapping

```typescript
const languageFileMap: Record<Language, string> = {
  [Language.English]: 'en.json',
  [Language.Spanish]: 'es.json',
  // Must include ALL 36 languages or TypeScript error
};
```

**Given** the LANGUAGE_FILE_MAP constant
**When** TypeScript compiles the codebase
**Then** the system SHALL enforce that all 36 Language enum values are mapped to filenames

#### Scenario: Missing translation file error

```typescript
registerTranslationsFromDirectory('screen.demo.hello', './screens/hello/i18n');
// But ./screens/hello/i18n/en.json doesn't exist
```

**Given** a registered translation namespace
**When** a user switches to a language whose translation file is missing
**Then** the system SHALL:
- Fail the dynamic import with a clear error message
- Log the missing file path to console
- Not crash the application (graceful degradation)

### Requirement: Hybrid translation namespace support

The system SHALL support two-tier translation namespaces: screenset-level for shared content and screen-level for screen-specific content.

#### Scenario: Screenset-level translations (shared content)

```typescript
registerTranslationsFromDirectory('screenset.chat', './i18n');

// Usage in components
t('screenset.chat:models.gpt_5')           // "GPT-5"
t('screenset.chat:contexts.documentation') // "Documentation"
```

**Given** screenset-level translations registered with namespace `screenset.<screenset-id>`
**When** a component requests translation with that namespace
**Then** the system SHALL load translations from the screenset's i18n directory

#### Scenario: Screen-level translations (screen-specific content)

```typescript
registerTranslationsFromDirectory('screen.demo.helloworld', './screens/helloworld/i18n');

// Usage in components
t('screen.demo.helloworld:title')       // "Hello World"
t('screen.demo.helloworld:description') // "Welcome to HAI3..."
```

**Given** screen-level translations registered with namespace `screen.<screenset-id>.<screen-id>`
**When** a component requests translation with that namespace
**Then** the system SHALL load translations from the screen's colocated i18n directory

#### Scenario: Hybrid loading on screen navigation

```typescript
// Screenset config
registerTranslationsFromDirectory('screenset.demo', './i18n');             // Shared
registerTranslationsFromDirectory('screen.demo.helloworld', './screens/helloworld/i18n'); // Screen-specific
```

**Given** both screenset and screen translations registered
**When** a user navigates to HelloWorld screen
**Then** the system SHALL:
- Load screenset translations (if not already loaded)
- Load screen translations for HelloWorld only
- NOT load translations for other screens (Profile, Theme, UIKit)

### Requirement: Translation namespace derivation convention

Translation namespaces SHALL be automatically derived from screenset and screen IDs following a consistent pattern to enable self-contained screenset duplication.

#### Scenario: Screenset-level namespace derivation

```typescript
// src/screensets/chat/chatScreenset.tsx
export const CHAT_SCREENSET_ID = 'chat';

// Screenset-level translations registered automatically
const screensetTranslations = I18nRegistry.createLoader({
  [Language.English]: () => import('./i18n/en.json'),
  // ... all languages
});

export const chatScreenset: ScreensetConfig = {
  id: CHAT_SCREENSET_ID,
  localization: screensetTranslations,
  // ...
};

// Namespace derivation: `screenset.${CHAT_SCREENSET_ID}`
// → 'screenset.chat'
```

**Given** a screenset with ID `'chat'`
**When** registering screenset-level translations
**Then** the translation namespace MUST be derived as `'screenset.chat'`

#### Scenario: Screen-level namespace derivation

```typescript
// src/screensets/chat/screens/chat/ChatScreen.tsx
import { useScreenTranslations } from '@hai3/uicore';
import { CHAT_SCREENSET_ID } from '../../chatScreenset';
import { CHAT_SCREEN_ID } from '../screenIds';

const translations = I18nRegistry.createLoader({
  [Language.English]: () => import('./i18n/en.json'),
  // ... all languages
});

export const ChatScreen: React.FC = () => {
  // Namespace derivation: `screen.${CHAT_SCREENSET_ID}.${CHAT_SCREEN_ID}`
  // → 'screen.chat.chat'
  useScreenTranslations(CHAT_SCREENSET_ID, CHAT_SCREEN_ID, translations);

  const { t } = useTranslation();

  return (
    <h1>{t(`screen.${CHAT_SCREENSET_ID}.${CHAT_SCREEN_ID}:title`)}</h1>
    // Resolves to: t('screen.chat.chat:title')
  );
};
```

**Given** a screen with screenset ID `'chat'` and screen ID `'chat'`
**When** registering screen-level translations
**Then** the translation namespace MUST be derived as `'screen.chat.chat'`

#### Scenario: Duplication updates namespaces automatically

```typescript
// src/screensets/chat-copy/chatCopyScreenset.tsx
export const CHAT_COPY_SCREENSET_ID = 'chat-copy'; // CHANGED

// Namespace automatically updates to 'screenset.chat-copy'

// src/screensets/chat-copy/screens/chat/ChatScreen.tsx
import { CHAT_COPY_SCREENSET_ID } from '../../chatCopyScreenset';

useScreenTranslations(CHAT_COPY_SCREENSET_ID, CHAT_SCREEN_ID, translations);
// Namespace automatically updates to 'screen.chat-copy.chat'

t(`screen.${CHAT_COPY_SCREENSET_ID}.${CHAT_SCREEN_ID}:title`)
// Resolves to: t('screen.chat-copy.chat:title')
```

**Given** a duplicated screenset with ID changed to `'chat-copy'`
**When** the screenset ID constant is updated
**Then** all translation namespaces SHALL automatically update:
- Screenset namespace: `'screenset.chat'` → `'screenset.chat-copy'`
- Screen namespace: `'screen.chat.chat'` → `'screen.chat-copy.chat'`

**And** no manual updates to translation keys are required

### Requirement: Translation key format documentation

Translation keys SHALL follow the format `namespace:path.to.key` where namespace is automatically derived from screenset and screen IDs.

#### Scenario: Screenset-level translation key format

```typescript
// src/screensets/chat/i18n/en.json
{
  "name": "Chat Application",
  "models": {
    "gpt4": "GPT-4",
    "claude": "Claude"
  }
}

// Usage in code:
t(`screenset.${CHAT_SCREENSET_ID}:name`)
// → t('screenset.chat:name') → 'Chat Application'

t(`screenset.${CHAT_SCREENSET_ID}:models.gpt4`)
// → t('screenset.chat:models.gpt4') → 'GPT-4'
```

**Given** a screenset with ID `'chat'`
**When** accessing screenset-level translations
**Then** keys MUST use format `screenset.chat:path.to.key`

#### Scenario: Screen-level translation key format

```typescript
// src/screensets/chat/screens/chat/i18n/en.json
{
  "title": "Chat Interface",
  "placeholders": {
    "message": "Type your message..."
  }
}

// Usage in code:
t(`screen.${CHAT_SCREENSET_ID}.${CHAT_SCREEN_ID}:title`)
// → t('screen.chat.chat:title') → 'Chat Interface'

t(`screen.${CHAT_SCREENSET_ID}.${CHAT_SCREEN_ID}:placeholders.message`)
// → t('screen.chat.chat:placeholders.message') → 'Type your message...'
```

**Given** a screen with screenset ID `'chat'` and screen ID `'chat'`
**When** accessing screen-level translations
**Then** keys MUST use format `screen.chat.chat:path.to.key`

#### Scenario: Template literal usage for type safety

```typescript
// Recommended pattern - template literal ensures namespace updates automatically
const screensetKey = `screenset.${CHAT_SCREENSET_ID}:name`;
const screenKey = `screen.${CHAT_SCREENSET_ID}.${CHAT_SCREEN_ID}:title`;

// Not recommended - hardcoded string breaks during duplication
const hardcodedKey = 'screenset.chat:name'; // ❌ Won't update if CHAT_SCREENSET_ID changes
```

**Given** a screenset using translations
**When** constructing translation keys
**Then** template literals SHOULD be used to ensure automatic updates during duplication
**And** hardcoded namespace strings SHOULD be avoided

