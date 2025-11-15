# Spec: i18n-loading

Translation loading and registration capabilities for the i18n system.

## ADDED Requirements

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

## MODIFIED Requirements

*No modified requirements - this is net-new functionality*

## REMOVED Requirements

*No removed requirements*
