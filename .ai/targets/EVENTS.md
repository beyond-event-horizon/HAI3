# Event-Driven Architecture

> Common: .ai/GUIDELINES.md

## CRITICAL (AI: READ THIS FIRST)

**NEVER dispatch slice actions directly:**
- FORBIDDEN: `dispatch(setUseMockApi(value))`
- FORBIDDEN: `setUseMockApi(value)` 
- REQUIRED: `setApiMode(value)` from `@/core/actions`
- Pattern: Component -> Action -> Event -> Effect -> Slice -> Store

**Violations break architecture** - grep for: `dispatch(set[A-Z])`

**Event Naming:**
- MUST: Past-tense `ScreenNavigated`, `ThemeChanged`
- NEVER: Imperative `NavigateToScreen`, `ChangeTheme`
- Format: `'namespace/eventName'`
- Actions = imperative, Events = past-tense

**Actions:**
- NEVER: `dispatch(setMenuItems(...))`
- ALWAYS: `eventBus.emit(MenuEvents.ItemsChanged, {...})`
- Update own slice only + emit events

**Effects:**
- MUST: Subscribe to events
- MUST: Update own slice only
- NEVER: Business logic

**Cross-Domain:**
- FORBIDDEN: `import { setMenuItems } from '@/layout/domains/menu'`
- REQUIRED: Event-driven communication

**Location (Vertical Slice):**
- Event enums: `core/events/eventTypes/[namespace]Events.ts`
- Type maps: Same file as enum + payload
- Actions: `core/actions/[namespace]Actions.ts`
- Effects: Co-located with slices
- Init effects: `store.ts` calls `initEffects(store)`

## Type Safety (AI: READ THIS)

**BAD:**
- `eventBus.emit<PayloadType>(event, payload)`
- Payload type mismatch caught at runtime

**GOOD:**
- `eventBus.emit(event, payload)`
- NO explicit type parameters
- Compile-time errors for mismatches
- Add to eventMap.ts: `'namespace/eventName': PayloadType`

## Screenset Events (AI: READ THIS)

**Module augmentation in screenset code:**
```ts
declare module '@hai3/uicore' {
  interface EventPayloadMap {
    'myScreenset/event': { data: Type };
  }
}
```
