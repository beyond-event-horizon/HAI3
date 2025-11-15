# Spec: screen-translation

Screen-level translation organization and usage.

## ADDED Requirements

### Requirement: Colocated translation files

Screen translation files SHALL be colocated with screen components in a dedicated i18n subdirectory.

#### Scenario: Translation directory structure

```
screens/
├── helloworld/
│   ├── HelloWorldScreen.tsx
│   └── i18n/
│       ├── en.json
│       ├── es.json
│       └── ... (36 languages)
├── profile/
│   ├── ProfileScreen.tsx
│   └── i18n/
│       └── ... (36 languages)
```

**Given** a screen component at `screens/helloworld/HelloWorldScreen.tsx`
**When** the screen has translatable content
**Then** translations SHALL be stored in `screens/helloworld/i18n/<language>.json`

#### Scenario: Translation file contains only screen-specific keys

```json
// screens/helloworld/i18n/en.json
{
  "title": "Hello World",
  "welcome": "Welcome to HAI3 Demo Screenset",
  "description": "...",
  "navigation_title": "Navigation Example",
  "go_to_theme": "Go to Theme Screen"
}
```

**Given** a screen's translation file
**When** the file is loaded
**Then** it SHALL contain:
- Only keys specific to that screen
- Top-level keys (no `screens.<screen-id>.` prefix)
- All necessary translations for the screen to function

#### Scenario: Shared content remains at screenset level

```json
// screensets/chat/i18n/en.json (screenset-level)
{
  "models": {
    "gpt_5": "GPT-5",
    "gpt_4_5_turbo": "GPT-4.5 Turbo"
  },
  "contexts": {
    "documentation": "Documentation",
    "codebase": "Codebase"
  }
}

// screens/chat/i18n/en.json (screen-level)
{
  "title": "Chat",
  "recent_chats": "Recent Chats",
  "message_placeholder": "Type your message..."
}
```

**Given** a screenset with shared content (models, contexts) and screen-specific content
**When** organizing translations
**Then** the system SHALL:
- Keep shared content in screenset-level i18n directory
- Keep screen-specific content in screen-level i18n directory
- Avoid duplication between the two levels

### Requirement: Screen namespace translation keys

Screen components SHALL use screen-specific namespaces for translation keys in the format `screen.<screenset-id>.<screen-id>:<key>`.

#### Scenario: Screen component uses screen namespace

```typescript
// Before (per-screenset)
const HelloWorldScreen: React.FC = () => {
  const { t } = useTranslation();
  return <h1>{t('screenset.demo:screens.helloworld.title')}</h1>;
};

// After (per-screen)
const HelloWorldScreen: React.FC = () => {
  const { t } = useTranslation();
  return <h1>{t('screen.demo.helloworld:title')}</h1>;
};
```

**Given** a screen component in the demo screenset
**When** the component needs to display translated text
**Then** it SHALL use the namespace format `screen.demo.<screen-id>:<key>`

#### Scenario: Helper function for screen translations

```typescript
const ChatScreenInternal: React.FC = () => {
  const { t } = useTranslation();
  const tk = (key: string) => t(`screen.chat.chat:${key}`);

  return (
    <div>
      <h1>{tk('title')}</h1>
      <p>{tk('message_placeholder')}</p>
    </div>
  );
};
```

**Given** a screen component with many translation calls
**When** the component wants to reduce boilerplate
**Then** it MAY create a helper function that prefixes the screen namespace

#### Scenario: Mixing screen and screenset translations

```typescript
const ChatScreen: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div>
      {/* Screen-level translation */}
      <h1>{t('screen.chat.chat:title')}</h1>

      {/* Screenset-level (shared) translation */}
      <select>
        <option>{t('screenset.chat:models.gpt_5')}</option>
        <option>{t('screenset.chat:models.gpt_4_5_turbo')}</option>
      </select>
    </div>
  );
};
```

**Given** a screen that needs both screen-specific and shared translations
**When** rendering the component
**Then** it SHALL be able to access both namespaces:
- `screen.<screenset-id>.<screen-id>:*` for screen-specific keys
- `screenset.<screenset-id>:*` for shared keys

### Requirement: Lazy-loaded translation chunks

Screen translations SHALL load on-demand when the screen is lazy-loaded, not upfront with the application.

#### Scenario: Translation loading timeline

```
User navigates to HelloWorld screen
├─> React.lazy() loads screen component chunk
├─> Screenset translations already loaded (shared content)
└─> i18nRegistry loads screen translations
    └─> import('./screens/helloworld/i18n/en.json') for current language
```

**Given** a user on the app home page
**When** the user navigates to HelloWorld screen for the first time
**Then** the system SHALL:
- Load the screen component chunk (React.lazy)
- Load screen translations for the current language only
- NOT load translations for other screens
- NOT reload screenset translations (already loaded)

#### Scenario: Translation caching after first load

```
User navigates: Home → HelloWorld → Profile → HelloWorld
```

**Given** a user who has already visited HelloWorld screen
**When** the user navigates back to HelloWorld screen
**Then** the system SHALL:
- Use cached screen component (already loaded)
- Use cached screen translations (already loaded)
- NOT make new network requests for HelloWorld translations

## MODIFIED Requirements

*No modified requirements - this is net-new functionality*

## REMOVED Requirements

*No removed requirements - this is a new spec*
