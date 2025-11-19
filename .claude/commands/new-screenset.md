---
description: Create a new screenset following HAI3 architecture
---

Before starting, read `.ai/targets/SCREENSETS.md` and summarize 3-5 key rules.

Ask the user for:
1. Screenset name (e.g., "dashboard", "settings")
2. Category: drafts | mockups | production
3. Initial screens to include
4. Whether state management is needed (slices/actions/events/effects)
5. Whether API services are needed (screenset-specific or using framework services)

Then create the screenset following this structure:

## 1. Directory Structure

```
src/screensets/{category}/{name}/
├── {name}Screenset.tsx      # Main config with lazy loaders
├── screens/
│   ├── screenIds.ts         # REQUIRED: Centralized screen ID constants
│   └── {screen-name}/
│       ├── {ScreenName}Screen.tsx  # Screen component (default export)
│       └── i18n/            # REQUIRED: Screen-level translations
│           ├── en.json      # All 36 languages required
│           └── ...
├── api/                     # Optional: if API services needed
│   ├── {Domain}ApiService.ts  # Screenset-specific API service
│   ├── api.ts               # TypeScript types/interfaces
│   ├── mocks.ts             # Mock data
│   └── {domain}/            # Optional: for framework service extensions
│       ├── mocks.ts         # Mocks for framework services
│       └── extra.ts         # Module augmentation
├── slices/                  # Optional: if state needed
│   └── {name}Slice.ts
├── actions/                 # Optional: if actions needed
│   └── {name}Actions.ts
├── events/                  # Optional: if events needed
│   └── {name}Events.ts
├── effects/                 # Optional: if effects needed
│   └── {name}Effects.ts
├── types/                   # Optional: if custom types needed
│   └── index.ts
└── i18n/                    # REQUIRED: Screenset-level translations
    ├── en.json              # All 36 languages required
    └── ...
```

## 2. Create Screen IDs File (REQUIRED)

```typescript
// src/screensets/{category}/{name}/screens/screenIds.ts
export const SCREEN_ONE_ID = '{name}-screen-one';
export const SCREEN_TWO_ID = '{name}-screen-two';
```

**Why**: Prevents circular dependencies when screens import each other's IDs.

## 3. Create Screenset-Level Translations

Create translation files for ALL 36 languages in `i18n/` directory. Use `I18nRegistry.createLoader()`:

```typescript
// Import from @hai3/uicore
import { I18nRegistry, Language } from '@hai3/uicore';

// Create screenset-level translation loader
const screensetTranslations = I18nRegistry.createLoader({
  [Language.English]: () => import('./i18n/en.json'),
  [Language.Spanish]: () => import('./i18n/es.json'),
  // ... ALL 36 languages (TypeScript enforces completeness)
});
```

**Translation file structure** (`i18n/en.json`):
```json
{
  "name": "Screenset Display Name",
  "description": "Screenset description",
  "screens": {
    "screen-one": {
      "title": "Screen One Title"
    }
  }
}
```

## 4. Create Screen Components with Screen-Level Translations

**CRITICAL**: Each screen MUST have its own translations for lazy loading.

```typescript
// src/screensets/{category}/{name}/screens/{screen-name}/{ScreenName}Screen.tsx
import React from 'react';
import { useScreenTranslations, useTranslation, I18nRegistry, Language, TextLoader } from '@hai3/uicore';
import { SCREEN_ONE_ID } from '../screenIds';
import { SCREENSET_NAME_ID } from '../../{name}Screenset';

// Screen-level translation loader (ALL 36 languages)
const translations = I18nRegistry.createLoader({
  [Language.English]: () => import('./i18n/en.json'),
  [Language.Spanish]: () => import('./i18n/es.json'),
  // ... ALL 36 languages
});

export const ScreenOneName: React.FC = () => {
  // Register and load screen translations (current language only)
  useScreenTranslations(SCREENSET_NAME_ID, SCREEN_ONE_ID, translations);

  const { t } = useTranslation();

  return (
    <div>
      {/* Wrap translated text with TextLoader for loading states */}
      <TextLoader skeletonClassName="h-10 w-64">
        <h1>{t(`screen.${SCREENSET_NAME_ID}.${SCREEN_ONE_ID}:title`)}</h1>
      </TextLoader>
      <p>{t(`screen.${SCREENSET_NAME_ID}.${SCREEN_ONE_ID}:description`)}</p>
    </div>
  );
};

ScreenOneName.displayName = 'ScreenOneName';

// REQUIRED: Default export for lazy loading
export default ScreenOneName;
```

**Screen translation file** (`screens/{screen-name}/i18n/en.json`):
```json
{
  "title": "Screen Title",
  "description": "Screen description",
  "button_label": "Click Me"
}
```

## 5. Create Screenset Config

```typescript
// src/screensets/{category}/{name}/{name}Screenset.tsx
import { screensetRegistry, type ScreensetConfig, I18nRegistry, Language } from '@hai3/uicore';
import { SCREEN_ONE_ID, SCREEN_TWO_ID } from './screens/screenIds';

export const SCREENSET_NAME_ID = '{name}';

// Screenset-level translations
const screensetTranslations = I18nRegistry.createLoader({
  [Language.English]: () => import('./i18n/en.json'),
  [Language.Spanish]: () => import('./i18n/es.json'),
  // ... ALL 36 languages
});

export const {name}Screenset: ScreensetConfig = {
  id: SCREENSET_NAME_ID,
  name: 'Screenset Display Name',
  category: '{category}',
  defaultScreen: SCREEN_ONE_ID,
  localization: screensetTranslations, // Screenset-level translations
  menu: [
    {
      menuItem: {
        id: SCREEN_ONE_ID,
        label: `screenset.${SCREENSET_NAME_ID}:screens.screen-one.title`,
        icon: 'optional-icon-id',
      },
      screen: () => import('./screens/screen-one/ScreenOneName'), // Lazy loader
    },
    {
      menuItem: {
        id: SCREEN_TWO_ID,
        label: `screenset.${SCREENSET_NAME_ID}:screens.screen-two.title`,
      },
      screen: () => import('./screens/screen-two/ScreenTwoName'),
    },
  ],
};

// Self-register
screensetRegistry.register({name}Screenset);
```

## 6. API Services (Optional)

If the screenset needs API services, create them following the vertical slice pattern:

### For Screenset-Specific Services:
```typescript
// src/screensets/{name}/api/{Name}ApiService.ts
export const {NAME}_DOMAIN = '{name}' as const;

export class {Name}ApiService extends BaseApiService {
  constructor() {
    super(
      { baseURL: '/api/{name}' },
      new RestProtocol({ timeout: 30000 })
    );
  }

  protected getMockMap(): MockMap {
    return apiRegistry.getMockMap({NAME}_DOMAIN);
  }
}

apiRegistry.register({NAME}_DOMAIN, {Name}ApiService);

declare module '@hai3/uicore' {
  interface ApiServicesMap {
    [{NAME}_DOMAIN]: {Name}ApiService;
  }
}
```

### Register in Screenset Config:
```typescript
// src/screensets/{name}/{name}Screenset.tsx
import './api/{Name}ApiService'; // Trigger service registration
import { {name}MockMap } from './api/mocks';

apiRegistry.registerMocks({NAME}_DOMAIN, {name}MockMap);
```

### For Framework Service Extensions:
If the screenset uses a framework service (e.g., accounts), create mocks/extras:

```typescript
// src/screensets/{name}/api/accounts/mocks.ts
export const accountsMockMap = {
  'GET /user/current': () => ({ user: mockUser }),
} satisfies MockMap;
```

```typescript
// src/screensets/{name}/{name}Screenset.tsx
import './api/accounts/extra';
import { accountsMockMap } from './api/accounts/mocks';

apiRegistry.registerMocks(ACCOUNTS_DOMAIN, accountsMockMap);
```

## 7. State Management (Optional)

If the screenset needs state, create slices/actions/events/effects:

### Events (`events/{name}Events.ts`):
```typescript
import type { EventPayloadMap } from '@hai3/uicore';

export enum {Name}Events {
  ItemSelected = '{name}/itemSelected',
  DataFetched = '{name}/dataFetched',
}

// Module augmentation for type safety
declare module '@hai3/uicore' {
  interface EventPayloadMap {
    '{name}/itemSelected': { itemId: string };
    '{name}/dataFetched': { items: Item[] };
  }
}
```

### Actions (`actions/{name}Actions.ts`):
```typescript
import { eventBus, type AppDispatch } from '@hai3/uicore';
import { {Name}Events } from '../events/{name}Events';

/**
 * Select an item
 * Fire-and-forget pattern: returns void, handles async with .then()/.catch()
 */
export const selectItem = (itemId: string) => {
  return (_dispatch: AppDispatch): void => {
    // Emit event immediately (synchronous)
    eventBus.emit({Name}Events.ItemSelected, { itemId });
  };
};

/**
 * Fetch data from API
 * Fire-and-forget pattern for async operations
 */
export const fetchData = () => {
  return (_dispatch: AppDispatch): void => {
    const api = apiRegistry.getService(DOMAIN);

    api.getData()
      .then((items) => {
        eventBus.emit({Name}Events.DataFetched, { items });
      })
      .catch((error) => {
        console.error('Failed to fetch data:', error);
        // Emit error event if needed
      });
  };
};
```

### Slice (`slices/{name}Slice.ts`):
```typescript
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface {Name}State {
  selectedItemId: string | null;
  items: Item[];
}

const initialState: {Name}State = {
  selectedItemId: null,
  items: [],
};

const {name}Slice = createSlice({
  name: '{name}',
  initialState,
  reducers: {
    setSelectedItemId: (state, action: PayloadAction<{ itemId: string }>) => {
      state.selectedItemId = action.payload.itemId;
    },
    setItems: (state, action: PayloadAction<{ items: Item[] }>) => {
      state.items = action.payload.items;
    },
  },
});

export const { setSelectedItemId, setItems } = {name}Slice.actions;
export default {name}Slice.reducer;

// Module augmentation for RootState
declare module '@hai3/uicore' {
  interface RootState {
    {name}: {Name}State;
  }
}
```

### Effects (`effects/{name}Effects.ts`):
```typescript
import { eventBus, type AppDispatch } from '@hai3/uicore';
import { {Name}Events } from '../events/{name}Events';
import { setSelectedItemId, setItems } from '../slices/{name}Slice';

let dispatch: AppDispatch;

export const initialize{Name}Effects = (appDispatch: AppDispatch): void => {
  dispatch = appDispatch;

  eventBus.on({Name}Events.ItemSelected, ({ itemId }) => {
    dispatch(setSelectedItemId({ itemId }));
  });

  eventBus.on({Name}Events.DataFetched, ({ items }) => {
    dispatch(setItems({ items }));
  });
};

export const cleanup{Name}Effects = (): void => {
  // EventBus cleanup if needed
};
```

### Register Slice in App Bootstrap:
```typescript
// src/core/store.ts or appropriate bootstrap file
import {name}Reducer, { initialize{Name}Effects } from 'path/to/screenset';
import { registerSlice } from '@hai3/uicore';

registerSlice('{name}', {name}Reducer, initialize{Name}Effects);
```

## 7. Draft Entity Pattern (If Creating Entities)

For screensets that create entities (threads, documents, projects, etc.):

```typescript
// Action to create draft entity locally
export const createDraftEntity = () => {
  return (_dispatch: AppDispatch): void => {
    const draftId = `draft-${Date.now()}`;
    eventBus.emit({Name}Events.DraftEntityCreated, { entityId: draftId });
  };
};

// Action to save draft on first meaningful user action
export const saveEntity = (draftId: string, content: string) => {
  return (_dispatch: AppDispatch): void => {
    const api = apiRegistry.getService(DOMAIN);

    api.createEntity({
      firstContent: content, // API generates smart values from content
    })
      .then((entity) => {
        // Replace draft with real entity
        eventBus.emit({Name}Events.EntityCreated, { entity });
      })
      .catch((error) => {
        console.error('Failed to create entity:', error);
      });
  };
};
```

**Draft entity in slice:**
```typescript
interface Entity {
  id: string;
  title: string;
  isDraft?: boolean; // Mark drafts
}

// Effect handling draft creation
eventBus.on({Name}Events.DraftEntityCreated, ({ entityId }) => {
  const draftEntity: Entity = {
    id: entityId,
    title: '', // Empty until user provides content
    isDraft: true,
  };
  dispatch(addEntity(draftEntity));
});

// Effect replacing draft with real entity
eventBus.on({Name}Events.EntityCreated, ({ entity }) => {
  const state = store.getState();
  const draft = state.{name}.entities.find(e => e.isDraft);
  if (draft) {
    dispatch(removeEntity({ entityId: draft.id }));
  }
  dispatch(addEntity(entity));
});
```

## 8. Register in screensetRegistry

```typescript
// src/screensets/screensetRegistry.tsx
import './{category}/{name}/{name}Screenset';
```

## 9. Critical Rules Checklist

- [ ] All screens use lazy loading (dynamic imports: `() => import('./path')`)
- [ ] Screen IDs in separate `screenIds.ts` file
- [ ] Screen components have default exports
- [ ] NO top-level screen imports in screenset config
- [ ] Screenset-level translations with `I18nRegistry.createLoader()` and ALL 36 languages
- [ ] Screen-level translations with `useScreenTranslations()` and ALL 36 languages
- [ ] Translated text wrapped with `<TextLoader>` component
- [ ] Translation keys follow format: `screenset.{id}:key` and `screen.{screenset}.{screen}:key`
- [ ] Actions return `void`, use `.then()/.catch()` for async (fire-and-forget)
- [ ] Actions emit events, effects update slices
- [ ] Use `void` operator when calling actions: `void dispatch(action())`
- [ ] Only @hai3/uikit components (no manual styling)
- [ ] Draft entity pattern for entities (create local, save on first action)
- [ ] Smart content-based generation (no hardcoded i18n in data)
- [ ] Use lodash for all string/array/object operations
- [ ] Slice registered via `registerSlice()` if state needed
- [ ] Module augmentation for RootState if slice added

## 10. Validate

```bash
npm run arch:check  # Must pass
npm run type-check  # Must pass
npm run dev         # Test in browser
```

## References

- `.ai/targets/SCREENSETS.md` - Screenset rules (includes API service patterns)
- `.ai/targets/EVENTS.md` - Event-driven architecture
- `.ai/targets/API.md` - API base classes (framework-level)
- `CLAUDE.md` - Overall architecture guide
