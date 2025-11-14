---
description: Quick reference for common HAI3 patterns
---

## Event-Driven Pattern

```typescript
// 1. Define Event
export const NavEvents = {
  ScreenChanged: 'navigation/screenChanged' as const,
};
export type ScreenChangedPayload = { screenId: string };

// 2. Create Action (emits event)
export const navigateToScreen = (screenId: string) => {
  return (_dispatch: AppDispatch): void => {
    eventBus.emit(NavEvents.ScreenChanged, { screenId });
  };
};

// 3. Create Effect (listens and updates slice)
export function initNavEffects(store: Store): void {
  eventBus.on(NavEvents.ScreenChanged, ({ screenId }) => {
    store.dispatch(setCurrentScreen(screenId));
  });
}
```

## Import Rules

```typescript
// Same package
import { Foo } from './Foo';

// Cross-branch in app
import { Layout } from '@/core/layout';

// Cross-package
import { Layout } from '@hai3/uicore';
import { Button } from '@hai3/uikit';

// ❌ NEVER
import { Foo } from '@hai3/uikit/src/internal/Foo';
```

## Component Usage

```typescript
// In uicore
const Button = uikitRegistry.getComponent(UiKitComponent.Button);
<Button onClick={handleClick}>Click me</Button>

// In app/screensets
import { Button } from '@hai3/uikit';
<Button onClick={handleClick}>Click me</Button>
```

## Registry Pattern

```typescript
// 1. Define domain constant
export const MY_DOMAIN = 'my-domain' as const;

// 2. Create service
export class MyService extends BaseApiService {
  constructor(useMockApi: boolean, mockMap?: Map<string, any>) {
    super('https://api.example.com/my-domain', useMockApi, mockMap);
  }
}

// 3. Module augmentation
declare module '@hai3/uicore' {
  interface ApiServicesMap {
    [MY_DOMAIN]: MyService;
  }
}

// 4. Self-register
apiRegistry.register(MY_DOMAIN, MyService);
```

## Styling

```typescript
// ✅ GOOD - theme tokens
<div className="bg-background text-foreground">
  <h1 className="text-2xl font-bold text-primary">Title</h1>
  <p className="text-muted-foreground">Description</p>
</div>

// ❌ BAD - hardcoded
<div style={{ backgroundColor: '#ffffff', color: '#000000' }}>
  <h1 style={{ fontSize: '24px', color: '#0066cc' }}>Title</h1>
</div>
```

## i18n

```typescript
// Register loader
i18nRegistry.registerLoader('screenset.demo', async (language) => {
  return (await import(`./i18n/${language}.json`)).default;
});

// Usage
const title = t('screenset.demo:screens.home.title');
const subtitle = t('screenset.demo:screens.home.subtitle', { name: 'John' });
```

## Common Commands

```bash
npm ci                    # Install dependencies
npm run dev               # Start dev server
npm run build             # Build all
npm run build:packages    # Build packages only
npm run type-check        # TypeScript check
npm run lint              # ESLint
npm run arch:check        # Architecture validation (CRITICAL)
npm run arch:deps         # Dependency rules check
```

## Repo Invariants

- Event-driven architecture only
- Registries follow Open/Closed principle
- App deps limited to: @hai3/uicore, @hai3/uikit, react, react-dom
- Cross-domain communication only via events
- No string literal identifiers (use constants/enums)
- No `any`, no unsafe casts

## Documentation

- `.ai/GUIDELINES.md` - Main guidelines with routing table
- `.ai/targets/*.md` - Area-specific rules
- `CLAUDE.md` - Architecture overview for Claude Code
- `README.md` - Project overview
