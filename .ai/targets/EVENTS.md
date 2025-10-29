# Event-Driven Architecture

> Common rules: .ai/GUIDELINES.md

**Pattern:** Component → Action (emits events) → Effect (updates slice) → Store → Component

## Rules (AI: READ THIS - CRITICAL)

**Actions:**
- BAD: `dispatch(setMenuItems(...))` (direct cross-domain update)
- GOOD: `eventBus.emit(MenuEvents.ItemsChanged, {...})` (emit event)
- Actions update ONLY their own slice + emit events

**Effects:**
- Subscribe to events, NOT actions
- Update ONLY their own slice
- No business logic - just slice updates

**Components:**
- Dispatch actions from `@/core/actions`, NOT slice reducers
- BAD: `dispatch(layoutSlice.actions.setTheme(...))`
- GOOD: `dispatch(setTheme(...))`

**Cross-Domain:**
- BAD: `import { setMenuItems } from '@/core/layout/domains/menu'`
- GOOD: Actions emit events, effects subscribe

**Location (Vertical Slice):**
- Event enums: `core/events/eventTypes.ts` (grouped by domain)
- Actions: `core/actions/[domain]Actions.ts`
- Effects: `core/effects/[domain]Effects.ts`
- Init effects: `store.ts` calls `initEffects(store)`

## Adding New Event (AI: READ THIS)

**1. Add enum to `eventTypes.ts`:**
```ts
export enum MyDomainEvents {
  SomethingChanged = 'myDomain/somethingChanged',
}
export interface SomethingChangedPayload { data: string }
```

**2. Emit in action:**
```ts
eventBus.emit<SomethingChangedPayload>(MyDomainEvents.SomethingChanged, { data: '...' });
```

**3. Subscribe in effect:**
```ts
eventBus.on<SomethingChangedPayload>(MyDomainEvents.SomethingChanged, ({ data }) => {
  store.dispatch(updateMySlice(data));
});
```
