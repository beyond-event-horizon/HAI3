# Event-Driven Architecture (Canonical)

## AI WORKFLOW (REQUIRED)
1) Summarize 3-6 rules from this file before making changes.
2) STOP if you introduce direct slice dispatch, prop drilling, or callback-based state mutation.

## CRITICAL RULES
- Data flow pattern is fixed: Component -> Action -> Event -> Effect -> Slice -> Store.
- Actions emit events; effects react to events and update their own slice only.
- Cross-domain communication is allowed only via events.
- Direct slice dispatch, prop drilling, and callback state mutation are FORBIDDEN.

## ACTIONS
- Pure functions only; cannot access store state (no getState).
- Fire events through the event bus.
- May compose other actions.
- Must return void (no Promise-returning thunks).
- REQUIRED: Use fire-and-forget pattern for async work (return void, handle async with then/catch).
- REQUIRED: Chain async calls with then instead of await to keep void return type.
- REQUIRED: Use the void operator when calling actions from components to ignore Promises.
- FORBIDDEN: async keyword on action functions, return Promise<void>, unhandled promise rejections.
- FORBIDDEN: Direct slice dispatch from actions.

## EFFECTS
- Subscribe to events.
- Update only their own slice.
- Contain no business logic.
- May not call actions (prevents loops).
- Can read store state to optimize but must handle initial state correctly.

## EVENT NAMING
- Events use past-tense names.
- Format: "namespace/eventName".
- Actions use imperative names; events use past-tense names.

## TYPE SAFETY
- No explicit generic parameters when emitting events.
- Every event key must exist in EventPayloadMap.
- Each event key maps to exactly one payload type.

## FILE LOCATION RULES
- Events, actions, slices, and effects belong to the owning feature or slice (package or app).
- No global "core events" unless the feature truly spans multiple packages or apps.
- Each owner initializes its own effects in its own store or bootstrap file.

## DETECTION RULES
- Direct slice dispatch: grep -R "dispatch(set[A-Z])" src packages.
- Cross-domain slice import: grep -R "import .*Slice .* from" src packages.
- Actions accessing store: grep -R "getState.*app\\.|getState\\(\\).*\\." src "*Actions.ts".