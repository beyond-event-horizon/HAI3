# @hai3/devtools

Development tools overlay for HAI3 applications - provides runtime controls for theme switching, screenset selection, language changes, and API mode toggling.

## Features

- **Theme Selector**: Switch between registered themes in real-time
- **Screenset Selector**: Navigate between different screensets (Drafts, Mockups, Production)
- **Language Selector**: Test internationalization with 36 supported languages
- **API Mode Toggle**: Switch between mock and real API implementations
- **Draggable & Resizable**: Position the panel anywhere on screen
- **Keyboard Shortcut**: Toggle with `Ctrl+Shift+D` (Windows/Linux) or `Cmd+Shift+D` (macOS)
- **State Persistence**: Panel position, size, and collapsed state saved to localStorage
- **Fully Localized**: All labels and controls available in 36 languages
- **Glassmorphic Design**: Modern, semi-transparent overlay with backdrop blur

## Installation

```bash
npm install --save-dev @hai3/devtools
```

> **Note**: This is a development-only package. Install as a `devDependency`, not a regular dependency.

## Usage

### Automatic Integration (Recommended)

HAI3Provider automatically detects and loads DevTools in development mode if the package is installed:

```tsx
// main.tsx
import ReactDOM from 'react-dom/client';
import { HAI3Provider } from '@hai3/uicore';
import { App } from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <HAI3Provider>
    <App />
  </HAI3Provider>
);
```

That's it! DevTools will automatically appear in development mode.

### Manual Integration (Advanced)

If you need custom control over DevTools loading:

```tsx
import { DevToolsOverlay } from '@hai3/devtools';

export const App = () => {
  return (
    <div>
      {/* Your app content */}
      {import.meta.env.DEV && <DevToolsOverlay />}
    </div>
  );
};
```

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+Shift+D` (Win/Linux) | Toggle DevTools panel |
| `Cmd+Shift+D` (macOS) | Toggle DevTools panel |

## Panel Controls

### Dragging
- Click and hold the panel header to drag it anywhere on screen
- Position persists across page reloads via localStorage

### Resizing
- Drag the bottom-right corner to resize the panel
- Min size: 320px × 400px
- Max size: 600px × 800px
- Size persists across page reloads

### Collapsing
- Click the collapse button in the panel header to minimize
- When collapsed, a circular button appears in the bottom-right corner
- Click the button to expand the panel again

## Development Controls

### Theme Selector
Switch between all registered themes in real-time. The current theme is highlighted.

### Screenset Selector
Navigate between screensets organized by category:
- **Drafts**: AI-generated screens for rapid prototyping
- **Mockups**: Human-refined screens for review
- **Production**: Polished, production-ready screens

### Language Selector
Test your app's internationalization with 36 supported languages:
- English, Spanish, French, German, Italian, Portuguese
- Russian, Chinese (Simplified & Traditional), Japanese, Korean
- Arabic, Hindi, Bengali, Turkish, Vietnamese, Thai
- And 20 more languages

### API Mode Toggle
Switch between mock and real API implementations:
- **Mock API**: Uses local mock data for development/testing
- **Real API**: Connects to actual backend services

## Tree-Shaking

DevTools is automatically excluded from production builds through Vite's tree-shaking:

```typescript
// This code in HAI3Provider only loads in development
const DevToolsOverlay = isDevelopment
  ? lazy(() => import('@hai3/devtools'))
  : null;
```

**Production bundle verification**:
- DevTools adds **0 bytes** to production bundle
- No DevTools code present in `dist/assets/` after `npm run build`
- Conditional import ensures complete code elimination

## Architecture

### Event-Driven Persistence
DevTools uses HAI3's event bus for state persistence:

```typescript
// Position/size changes emit events
eventBus.emit(DevToolsEvents.PositionChanged, { position });

// Persistence effects subscribe to events
eventBus.on(DevToolsEvents.PositionChanged, ({ position }) => {
  localStorage.setItem('hai3:devtools:position', JSON.stringify(position));
});
```

### Localization
DevTools translations are registered at module import time:

```typescript
// Auto-registered when package loads
i18nRegistry.registerLoader('devtools', devtoolsTranslations);
```

All 36 language files are lazy-loaded - only the current language downloads.

### Self-Contained Design
DevTools imports components directly from `@hai3/uikit`:

```typescript
import { Button, Card, Select } from '@hai3/uikit';
```

This ensures DevTools works independently without registry coupling.

## Package Dependencies

### Peer Dependencies (Required)
- `@hai3/uicore` - Core layout and state management
- `@hai3/uikit` - UI component library
- `@hai3/uikit-contracts` - Type definitions
- `react` ^18.0.0
- `react-dom` ^18.0.0

### Direct Dependencies
- `lodash` - Utility functions

## TypeScript Support

Full TypeScript support with exported types:

```typescript
import type { Position, Size, DevToolsState } from '@hai3/devtools';
```

## Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)

## License

MIT

## Contributing

DevTools is part of the HAI3 monorepo. See the main repository for contribution guidelines.

## Related Packages

- [`@hai3/uicore`](../uicore) - Core layout and state management
- [`@hai3/uikit`](../uikit) - UI component library
- [`@hai3/uikit-contracts`](../uikit-contracts) - Type definitions
