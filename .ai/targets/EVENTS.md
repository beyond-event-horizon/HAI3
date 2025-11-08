# Event-Driven Architecture

> Common: .ai/GUIDELINES.md

## CRITICAL (AI: READ THIS FIRST)

**NEVER dispatch slice actions directly:**
- FORBIDDEN: `dispatch(setSliceState(value))`
- FORBIDDEN: `setSliceState(value)` 
- REQUIRED: `actionFunction(value)` from `@/core/actions`
- Pattern: Component -> Action -> Event -> Effect -> Slice -> Store
- Detect: grep for `dispatch(set[A-Z])`

**Event Naming:**
- MUST: Past-tense `EntityActioned`, `StateChanged`
- NEVER: Imperative `ActionEntity`, `ChangeState`
- Format: `'namespace/eventName'`
- Actions = imperative, Events = past-tense

**Actions:**
- NEVER: `dispatch(setSliceData(...))`
- ALWAYS: `eventBus.emit(NamespaceEvents.EventName, {...})`
- Update own slice only + emit events
- CAN: Call other actions (composition allowed)
- PATTERN: Action -> Action is valid (e.g., fetchUser calls changeLanguage)
- MUST: Return void (never Promise<void>)
- FORBIDDEN: `async (dispatch) => Promise<void>`
- REQUIRED: `(dispatch) => void` with fire-and-forget promises

**Effects:**
- MUST: Subscribe to events
- MUST: Update own slice only
- NEVER: Business logic
- NEVER: Call actions (prevents cycles)
- FORBIDDEN: `changeLanguage()`, `fetchUser()` etc in effects
- WHY: Effect -> Action -> Event -> Effect = infinite loop potential

**Cross-Domain:**
- FORBIDDEN: `import { setSliceAction } from '@/layout/domains/domain'`
- REQUIRED: Event-driven communication

**Location (Vertical Slice):**
- Event enums: `core/events/eventTypes/[namespace]Events.ts`
- Type maps: Same file as enum + payload
- Actions: `core/actions/[namespace]Actions.ts`
- Effects: Co-located with slices
- Init effects: `store.ts` calls `initEffects(store)`

## Type Safety (AI: READ THIS)

**FORBIDDEN:**
- `eventBus.emit<PayloadType>(event, payload)`
- Payload type mismatch caught at runtime

**REQUIRED:**
- `eventBus.emit(event, payload)`
- NO explicit type parameters
- Compile-time errors for mismatches
- Add to eventMap.ts: `'namespace/eventName': PayloadType`

## Screenset Events (AI: READ THIS)

**Module augmentation in screenset code:**
```ts
declare module '@hai3/uicore' {
  interface EventPayloadMap {
    'namespace/eventName': PayloadType;
  }
}
```
