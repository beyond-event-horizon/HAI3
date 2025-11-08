# Event-Driven Architecture (Canonical)

## AI WORKFLOW (REQUIRED)
1) Summarize 3–6 rules from this file before making changes.
2) STOP if you introduce direct slice dispatch, prop drilling, or callback-based state mutation.

## CRITICAL RULES
- Data flow pattern is fixed: Component → Action → Event → Effect → Slice → Store
- Actions emit events; effects react to events and update their own slice only
- Cross-domain communication is allowed **only via events**
- Direct slice dispatch, prop drilling, and callback state mutation are **FORBIDDEN**

## ACTIONS
- Fire events through the event bus
- May compose other actions
- Must return `void` (no async Promise-returning thunks)
- Cannot directly dispatch to slices

## EFFECTS
- Subscribe to events
- Update only their own slice
- Contain no business logic
- May not call actions

## EVENT NAMING
- Past-tense names
- Format: `namespace/eventName`
- Actions use imperative names; events use past-tense names

## TYPE SAFETY
- No explicit generic parameters when emitting
- Every event key must exist in `EventPayloadMap`
- Each event key maps to exactly one payload type

## FILE LOCATION RULES
- Events, actions, slices, and effects belong to the **owning feature/slice** (package or app)
- No global “core events” unless the feature truly spans multiple packages/apps
- Each owner initializes its own effects in its own store/bootstrap file

## DETECTION RULES
- Direct slice dispatch: `dispatch(set[A-Z])`
- Cross-domain slice import: `import .*Slice .* from`