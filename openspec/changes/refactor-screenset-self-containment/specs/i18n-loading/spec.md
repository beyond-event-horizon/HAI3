## ADDED Requirements

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
