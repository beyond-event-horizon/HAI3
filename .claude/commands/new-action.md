---
description: Create a new action following event-driven architecture
---

Before starting, read `.ai/targets/EVENTS.md` and summarize 3-6 key rules.

Ask the user:
1. Action purpose (e.g., "navigate to screen", "load user data")
2. Which domain/namespace (e.g., "navigation", "user", "menu")
3. Event payload data

Then create the action following event-driven pattern:

## 1. Define Event

In `packages/uicore/src/events/{namespace}Events.ts` or `src/screensets/{name}/events/`:

```typescript
export const {Namespace}Events = {
  {EventName}: '{namespace}/{eventName}' as const,
} as const;

export type {EventName}Payload = {
  // payload fields
};

// Module augmentation for type safety
declare module '@hai3/uicore' {
  interface EventPayloadMap {
    [{Namespace}Events.{EventName}]: {EventName}Payload;
  }
}
```

## 2. Create Action

In `packages/uicore/src/actions/{namespace}Actions.ts` or `src/screensets/{name}/actions/`:

```typescript
import { eventBus } from '@hai3/uicore';
import { {Namespace}Events } from '../events/{namespace}Events';
import type { AppDispatch } from '@hai3/uicore';

/**
 * Imperative name describing what this action does
 */
export const {actionName} = (params: ParamsType) => {
  return (_dispatch: AppDispatch): void => {
    // Emit event (NOT direct dispatch)
    eventBus.emit({Namespace}Events.{EventName}, {
      // payload
    });
  };
};
```

## 3. Create Effect

In `packages/uicore/src/domains/{domain}/effects.ts` or `src/screensets/{name}/effects/`:

```typescript
import { eventBus } from '@hai3/uicore';
import { {Namespace}Events } from '../../events/{namespace}Events';
import type { Store } from '@hai3/uicore';

export function init{Domain}Effects(store: Store): void {
  eventBus.on({Namespace}Events.{EventName}, (payload) => {
    // Update slice via dispatch
    store.dispatch(set{Something}(payload.{field}));
  });
}
```

## Rules to Follow:

- Actions use **imperative** names (selectScreen, changeTheme, loadUser)
- Events use **past-tense** names (screenSelected, themeChanged, userLoaded)
- Actions are **pure functions** (no getState, no async thunks)
- Actions return **void** (not Promise)
- Effects update **their own slice only**
- Cross-domain communication **only via events**
- No direct slice dispatch from actions/components

## Validation:

```bash
npm run arch:check
```

Look for violations:
- Direct slice dispatch: `dispatch(set[A-Z])`
- Cross-domain slice import
- Action accessing store: `getState`
