---
description: Add a new screen to an existing screenset
---

Before starting, read `.ai/targets/SCREENSETS.md` and summarize 3-5 key rules.

Ask the user for:
1. Screenset path (e.g., `src/screensets/drafts/chat`)
2. Screen name (e.g., "settings", "history")
3. Whether this screen should be added to the menu

Then add the screen following this structure:

## 1. Add Screen ID Constant

Update the screenset's `screens/screenIds.ts` file:

```typescript
// src/screensets/{category}/{screenset}/screens/screenIds.ts
export const EXISTING_SCREEN_ID = '{screenset}-existing';
export const NEW_SCREEN_ID = '{screenset}-{new-screen}'; // Add this
```

## 2. Create Screen Directory Structure

```
src/screensets/{category}/{screenset}/screens/{screen-name}/
├── {ScreenName}Screen.tsx    # Screen component with default export
└── i18n/                      # REQUIRED: Screen-level translations
    ├── en.json                # All 36 languages required
    ├── es.json
    └── ... (all 36 languages)
```

## 3. Create Screen Translation Files

Create translation files for ALL 36 languages:

**Example** (`i18n/en.json`):
```json
{
  "title": "Screen Title",
  "description": "Screen description",
  "subtitle": "Subtitle text",
  "button_save": "Save",
  "button_cancel": "Cancel",
  "message_success": "Operation completed successfully"
}
```

Repeat for all 36 languages (es.json, fr.json, de.json, etc.).

## 4. Create Screen Component

```typescript
// src/screensets/{category}/{screenset}/screens/{screen-name}/{ScreenName}Screen.tsx
import React from 'react';
import { useScreenTranslations, useTranslation, I18nRegistry, Language, TextLoader } from '@hai3/uicore';
import { NEW_SCREEN_ID } from '../screenIds';
import { SCREENSET_ID } from '../../{screenset}Screenset';

// Import all uikit components from @hai3/uikit
import { Button, Card } from '@hai3/uikit';

// Screen-level translation loader (ALL 36 languages)
const translations = I18nRegistry.createLoader({
  [Language.English]: () => import('./i18n/en.json'),
  [Language.Spanish]: () => import('./i18n/es.json'),
  [Language.French]: () => import('./i18n/fr.json'),
  [Language.German]: () => import('./i18n/de.json'),
  // ... ALL 36 languages (TypeScript enforces completeness)
});

export const {ScreenName}Screen: React.FC = () => {
  // Register and load screen translations (current language only)
  useScreenTranslations(SCREENSET_ID, NEW_SCREEN_ID, translations);

  const { t } = useTranslation();

  // Translation key format: screen.{screenset}.{screen}:key
  const translationKey = `screen.${SCREENSET_ID}.${NEW_SCREEN_ID}`;

  return (
    <div className="p-6">
      {/* REQUIRED: Wrap translated text with TextLoader for loading states */}
      <TextLoader skeletonClassName="h-10 w-64 mb-4">
        <h1 className="text-2xl font-bold mb-2">
          {t(`${translationKey}:title`)}
        </h1>
      </TextLoader>

      <TextLoader skeletonClassName="h-6 w-96 mb-6">
        <p className="text-muted-foreground mb-6">
          {t(`${translationKey}:description`)}
        </p>
      </TextLoader>

      <Card className="p-6">
        <h2 className="text-xl mb-4">{t(`${translationKey}:subtitle`)}</h2>

        <div className="flex gap-4">
          <Button variant="default">
            {t(`${translationKey}:button_save`)}
          </Button>
          <Button variant="outline">
            {t(`${translationKey}:button_cancel`)}
          </Button>
        </div>
      </Card>
    </div>
  );
};

{ScreenName}Screen.displayName = '{ScreenName}Screen';

// REQUIRED: Default export for lazy loading
export default {ScreenName}Screen;
```

## 5. Update Screenset Config

Add the new screen to the screenset's menu array:

```typescript
// src/screensets/{category}/{screenset}/{screenset}Screenset.tsx
import { screensetRegistry, type ScreensetConfig, I18nRegistry, Language } from '@hai3/uicore';
import { EXISTING_SCREEN_ID, NEW_SCREEN_ID } from './screens/screenIds'; // Import new ID

export const SCREENSET_ID = '{screenset}';

// ... existing screensetTranslations ...

export const {screenset}Screenset: ScreensetConfig = {
  id: SCREENSET_ID,
  name: 'Screenset Display Name',
  category: '{category}',
  defaultScreen: EXISTING_SCREEN_ID,
  localization: screensetTranslations,
  menu: [
    // ... existing menu items ...
    {
      menuItem: {
        id: NEW_SCREEN_ID,
        label: `screenset.${SCREENSET_ID}:screens.{screen-name}.title`, // Translation key
        icon: 'optional-icon-id', // Optional
      },
      screen: () => import('./screens/{screen-name}/{ScreenName}Screen'), // Lazy loader
    },
  ],
};

// Self-register
screensetRegistry.register({screenset}Screenset);
```

## 6. Update Screenset-Level Translations

Add the menu label to screenset-level translation files:

```json
// src/screensets/{category}/{screenset}/i18n/en.json
{
  "name": "Screenset Display Name",
  "description": "Screenset description",
  "screens": {
    "existing-screen": {
      "title": "Existing Screen Title"
    },
    "{screen-name}": {
      "title": "New Screen Title"
    }
  }
}
```

Update ALL 36 language files with the same structure.

## 7. State Management (If Needed)

If the screen needs to interact with screenset state:

### Option A: Use Existing Actions/Events

```typescript
import { {screenset}Actions } from '../../actions/{screenset}Actions';
import { useAppDispatch, useAppSelector } from '@hai3/uicore';

export const {ScreenName}Screen: React.FC = () => {
  const dispatch = useAppDispatch();
  const data = useAppSelector(state => state.{screenset}.data);

  const handleAction = () => {
    // Fire-and-forget pattern: use void operator
    void dispatch({screenset}Actions.performAction(data));
  };

  // ... rest of component
};
```

### Option B: Add New Actions/Events

1. Add new events to `events/{screenset}Events.ts`:
```typescript
export enum {Screenset}Events {
  // ... existing events ...
  NewActionPerformed = '{screenset}/newActionPerformed',
}

declare module '@hai3/uicore' {
  interface EventPayloadMap {
    // ... existing events ...
    '{screenset}/newActionPerformed': { data: string };
  }
}
```

2. Add new actions to `actions/{screenset}Actions.ts`:
```typescript
export const performNewAction = (data: string) => {
  return (_dispatch: AppDispatch): void => {
    // Fire-and-forget pattern
    const api = apiRegistry.getService(DOMAIN);

    api.doSomething(data)
      .then((result) => {
        eventBus.emit({Screenset}Events.NewActionPerformed, { data: result });
      })
      .catch((error) => {
        console.error('Failed to perform action:', error);
      });
  };
};
```

3. Add effect handler to `effects/{screenset}Effects.ts`:
```typescript
export const initialize{Screenset}Effects = (appDispatch: AppDispatch): void => {
  dispatch = appDispatch;

  // ... existing event handlers ...

  eventBus.on({Screenset}Events.NewActionPerformed, ({ data }) => {
    dispatch(updateData({ data }));
  });
};
```

4. Add reducer to `slices/{screenset}Slice.ts` (if needed):
```typescript
const {screenset}Slice = createSlice({
  name: '{screenset}',
  initialState,
  reducers: {
    // ... existing reducers ...
    updateData: (state, action: PayloadAction<{ data: string }>) => {
      state.data = action.payload.data;
    },
  },
});
```

## 8. Critical Rules Checklist

- [ ] Screen ID added to `screens/screenIds.ts`
- [ ] Screen-level translation files created for ALL 36 languages
- [ ] Screen component uses `useScreenTranslations()` hook
- [ ] Translated text wrapped with `<TextLoader>` component
- [ ] Screen has default export for lazy loading
- [ ] Screen added to screenset menu with lazy loader `() => import()`
- [ ] Menu label added to screenset-level translations (all 36 languages)
- [ ] Translation keys follow format: `screen.{screenset}.{screen}:key`
- [ ] Only @hai3/uikit components used (no manual styling)
- [ ] Actions use fire-and-forget pattern (return `void`, use `.then()/.catch()`)
- [ ] Use `void` operator when dispatching: `void dispatch(action())`
- [ ] No direct slice imports or dispatch in component
- [ ] Use lodash for all string/array/object operations

## 9. Validate

```bash
npm run type-check  # Check TypeScript compilation
npm run arch:check  # Validate architecture rules
npm run dev         # Test in browser
```

Navigate to the screenset and verify:
- Screen appears in menu
- Screen loads without errors
- Translations load correctly
- Language switching works
- TextLoader shows skeleton during initial translation load
- No console errors

## Common Patterns

### Using Screen-Level State (React State)

```typescript
import { useState, useCallback } from 'react';

export const {ScreenName}Screen: React.FC = () => {
  const [localValue, setLocalValue] = useState('');

  const handleChange = useCallback((value: string) => {
    setLocalValue(value);
  }, []);

  // ... rest
};
```

### Form Handling

```typescript
import { useForm } from 'react-hook-form';
import { Input, Button, Form } from '@hai3/uikit';

export const {ScreenName}Screen: React.FC = () => {
  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
    },
  });

  const onSubmit = useCallback((data: FormData) => {
    // Fire-and-forget pattern
    void dispatch({screenset}Actions.submitForm(data));
  }, [dispatch]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Input {...form.register('name')} />
        <Input {...form.register('email')} />
        <Button type="submit">
          {t(`${translationKey}:button_submit`)}
        </Button>
      </form>
    </Form>
  );
};
```

### API Calls from Screen

**FORBIDDEN**: Do NOT call API directly from screen component.

**CORRECT**: Use actions:

```typescript
// In component
const handleFetch = useCallback(() => {
  void dispatch({screenset}Actions.fetchData());
}, [dispatch]);

// In actions/{screenset}Actions.ts
export const fetchData = () => {
  return (_dispatch: AppDispatch): void => {
    const api = apiRegistry.getService(DOMAIN);

    api.getData()
      .then((data) => {
        eventBus.emit({Screenset}Events.DataFetched, { data });
      })
      .catch((error) => {
        console.error('Failed to fetch:', error);
      });
  };
};
```

## References

- `.ai/targets/SCREENSETS.md` - Screenset rules
- `.ai/targets/EVENTS.md` - Event-driven architecture
- `.ai/targets/UIKIT.md` - UI Kit component rules
- `CLAUDE.md` - Overall architecture guide
