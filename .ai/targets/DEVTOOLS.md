# DevTools Guidelines

## AI WORKFLOW (REQUIRED)
1) Summarize 3-6 rules from this file before proposing changes.
2) STOP if you add Redux, import from @hai3/uikit directly, hardcode strings, or bypass event bus.

## SCOPE
- All code under packages/devtools/**.
- DevTools is a development-time overlay providing UI controls for testing screensets, themes, languages, and API modes.
- DevTools is a workspace package separate from uicore and uikit; follows the same architectural patterns.

## CRITICAL RULES
- DevTools is presentational with minimal state; no business logic, no domain knowledge.
- UI components use fallback pattern: try uikitRegistry first, fallback to direct @hai3/uikit imports.
- All user-facing text must use i18n; no hardcoded strings.
- Controls call uicore actions directly (DevTools renders uicore state, doesn't own business state).
- DevTools UI state (position, size, collapsed, visible) managed via React state/context (NOT Redux).
- LocalStorage acts as persistent store; effects update localStorage on DevTools events.
- Layout-only styling; no visual styling, no hex colors, no inline styles (see STYLING.md).

## STOP CONDITIONS
- Hardcoded strings ("Theme:", "Language:", etc.).
- Adding business logic or domain knowledge to DevTools.
- Manual visual styling or hex colors.
- Creating Redux slice for DevTools UI state (use React state/context instead).
- Direct localStorage writes from components (use effects instead).

## FILE STRUCTURE RULES
- Package root: packages/devtools/src/
- Components: sections/{ComponentName}.tsx (ThemeSelector, ScreensetSelector, LanguageSelector, ApiModeToggle)
- Events: events/devtoolsEvents.ts (visibility toggled, position changed, size changed, etc.)
- Effects: effects/persistenceEffects.ts (listen to events, update localStorage)
- Hooks: hooks/{useDraggable.ts,useResizable.ts,useKeyboardShortcut.ts}
- Utilities: utils/{persistence.ts}
- Types: types.ts
- Main components: {DevToolsProvider.tsx,DevToolsPanel.tsx,DevToolsOverlay.tsx}
- No Redux slice; DevTools uses React state + localStorage for UI state

## STATE MANAGEMENT RULES
- REQUIRED: DevTools UI state (visible, collapsed, position, size) managed via React state/context.
- REQUIRED: DevTools renders business state from uicore (theme, language, screenset, apiMode via selectors).
- REQUIRED: Controls call uicore actions directly (changeTheme, changeLanguage, selectScreenset, setApiMode).
- REQUIRED: DevTools emits events for its own UI state changes (visibility toggled, position changed, size changed).
- REQUIRED: Effects listen to DevTools events and update localStorage (not Redux).
- FORBIDDEN: Creating Redux slice for DevTools UI state; use React state instead.
- FORBIDDEN: Direct localStorage writes from components; use effects pattern.

## EVENT-DRIVEN ARCHITECTURE
- REQUIRED: Define DevTools UI events in packages/devtools/src/events/devtoolsEvents.ts.
- REQUIRED: Use namespace "devtools/eventName" for DevTools UI events (visibilityToggled, positionChanged, sizeChanged).
- REQUIRED: Extend EventPayloadMap via module augmentation.
- REQUIRED: Emit events when DevTools UI state changes (for persistence).
- REQUIRED: Effects in packages/devtools/src/effects/persistenceEffects.ts listen to events and update localStorage.
- FORBIDDEN: Direct localStorage writes from components; emit events instead.
- DETECT: grep -rn "localStorage.setItem" packages/devtools/src/{sections,hooks}/

## UI KIT INTEGRATION RULES (FALLBACK PATTERN)
- REQUIRED: Use fallback pattern for UI components and icons.
- REQUIRED: Try registry first: const Btn = uikitRegistry.getComponent(UiKitComponent.Button) || Button.
- REQUIRED: Import fallback: import { Button } from '@hai3/uikit' (allowed as fallback).
- REQUIRED: DevTools works without component registration (self-contained development tool).
- PATTERN: const Component = uikitRegistry.getComponent(UiKitComponent.X) || DirectImport.

## LOCALIZATION RULES
- REQUIRED: All user-facing text uses i18n with namespace "devtools:key".
- REQUIRED: Register DevTools translations with I18nRegistry.createLoader() covering all 36 languages.
- REQUIRED: Translation files in packages/devtools/src/i18n/{en,es,ar,...}.json.
- REQUIRED: Use useTranslation() hook for t() function and direction property.
- REQUIRED: Pass direction to DropdownMenu dir prop for RTL support.
- FORBIDDEN: Hardcoded strings like "Theme:", "Screenset:", "Language:", "Mock API".
- DETECT: grep -rn "StaticText\\|>Theme:<\\|>Language:<" packages/devtools/src/

## CONTROL COMPONENT RULES
- REQUIRED: Each control (ThemeSelector, ScreensetSelector, etc.) is a pure component.
- REQUIRED: Controls call uicore actions directly (changeTheme, selectScreenset, changeLanguage, setApiMode).
- REQUIRED: Controls read business state from uicore via selectors (useAppSelector).
- REQUIRED: Controls use UIKit fallback pattern for components (registry → direct import).
- REQUIRED: Layout uses flexbox with justify-between for label-left, control-right alignment.
- REQUIRED: Consistent height (h-9 / 36px) and spacing (space-y-3 / 12px) for all controls.
- FORBIDDEN: Controls managing business state locally; business state lives in uicore only.

## HOOKS RULES
- REQUIRED: Custom hooks for reusable logic (useDraggable, useResizable, useKeyboardShortcut).
- REQUIRED: Hooks use lodash for all object/array operations.
- REQUIRED: Hooks save state to localStorage via persistence utils.
- REQUIRED: Delta-based calculations for smooth drag/resize (store initial position/size, calculate delta).
- FORBIDDEN: Direct DOM manipulation without React refs.

## PERSISTENCE RULES (LOCALSTORAGE AS "SLICE")
- REQUIRED: Treat localStorage as persistent store for DevTools UI state.
- REQUIRED: Components emit events when UI state changes (not direct localStorage writes).
- REQUIRED: Effects in packages/devtools/src/effects/persistenceEffects.ts listen to events.
- REQUIRED: Effects update localStorage via utils/persistence.ts helpers.
- REQUIRED: Storage keys use format "hai3:devtools:{key}" (position, size, collapsed).
- REQUIRED: Components load persisted state on mount via loadDevToolsState(key, defaultValue).
- FORBIDDEN: Direct localStorage.setItem() from components or hooks; emit events instead.

## Z-INDEX ARCHITECTURE
- REQUIRED: DevTools panel at z-index 10000.
- REQUIRED: Portal container at z-index 10001 for dropdown portals.
- REQUIRED: Global CSS rule bumps Radix UI dropdowns to z-index 10002 when DevTools present.
- REQUIRED: Use body:has(.devtools-panel) selector for conditional z-index bumping.

## STYLING RULES (see STYLING.md)
- REQUIRED: Layout-only styling; no visual styles in DevTools components.
- REQUIRED: Use Tailwind utility classes for layout (flex, items-center, justify-between, h-9, space-y-3).
- REQUIRED: Glassmorphic panel styling via CSS custom properties and backdrop-filter.
- REQUIRED: Use rem-based units; px only for borders.
- FORBIDDEN: Hex colors, inline style props, manual padding/margin px values.

## GLASSMORPHIC DESIGN
- REQUIRED: Panel and button use glassmorphic styling (semi-transparent bg, backdrop blur, border).
- REQUIRED: Light mode: rgba(255, 255, 255, 0.1) background.
- REQUIRED: Dark mode: rgba(0, 0, 0, 0.4) background.
- REQUIRED: Backdrop filter: blur(16px) saturate(180%).
- REQUIRED: Border: 1px solid rgba(255, 255, 255, 0.18) for light, rgba(255, 255, 255, 0.12) for dark.

## DEPENDENCIES RULES
- REQUIRED: Declare @hai3/uicore as peer dependency (shared instance with app).
- REQUIRED: Declare @hai3/uikit as direct dependency (fallback pattern allowed).
- REQUIRED: Declare @hai3/uikit-contracts as direct dependency (type safety).
- REQUIRED: DevTools exports DevToolsOverlay component for app integration.
- REQUIRED: DevTools conditionally rendered based on import.meta.env.DEV.
- FORBIDDEN: DevTools importing from app-level code (src/**).
- FORBIDDEN: DevTools declaring @hai3/uicore as direct dependency (must be peer).

## INTEGRATION RULES
- REQUIRED: App imports DevTools via dynamic import when import.meta.env.DEV is true.
- REQUIRED: DevTools rendered as sibling to main app content (not inside Layout).
- REQUIRED: DevTools provides HAI3Provider-free self-contained state via DevToolsProvider.
- FORBIDDEN: DevTools rendered in production builds.

## PRE-DIFF CHECKLIST
- [ ] UI components use fallback pattern (registry → direct import).
- [ ] All user-facing text uses t() from useTranslation().
- [ ] DevTools translations registered with I18nRegistry.createLoader() covering all 36 languages.
- [ ] Translation namespace is "devtools:key".
- [ ] Controls call uicore actions directly (changeTheme, changeLanguage, selectScreenset, setApiMode).
- [ ] Controls read business state via useAppSelector from uicore slices.
- [ ] DevTools UI state managed via React state/context (NOT Redux slice).
- [ ] DevTools UI events defined in devtoolsEvents.ts with EventPayloadMap augmentation.
- [ ] Persistence effects listen to DevTools events and update localStorage.
- [ ] No direct localStorage writes from components/hooks; emit events instead.
- [ ] Hooks use lodash for object/array operations.
- [ ] Layout-only styling; no hex colors or inline styles.
- [ ] Consistent control height (h-9) and spacing (space-y-3).
- [ ] Z-index architecture maintained (panel: 10000, portal: 10001, dropdowns: 10002).
- [ ] Direction passed to DropdownMenu for RTL support.
- [ ] @hai3/uicore declared as peer dependency; @hai3/uikit as direct dependency.
- [ ] No imports from app-level code (src/**).
