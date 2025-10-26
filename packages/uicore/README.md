# @hai3/uicore

> **⚠️ Pre-release (0.x.x)**: This package is in early development. APIs may change without notice. Not recommended for production use.

HAI3 UI Core package provides the foundational layout system and Redux architecture for building SaaS control panels.

## Installation

```bash
npm install @hai3/uicore @reduxjs/toolkit react-redux
```

## Features

- **Layout System**: Header, Footer, Menu, Sidebar, Screen, Popup, Overlay
- **Redux Architecture**: Pre-configured store with domain-based slices
- **Self-contained Domains**: Each layout domain manages its own state
- **TypeScript First**: Full type safety with strict TypeScript

## Quick Start

```tsx
import { Layout } from '@hai3/uicore';
import { Provider } from 'react-redux';
import { store } from '@hai3/uicore/store';

function App() {
  return (
    <Provider store={store}>
      <Layout>
        {/* Your app content */}
      </Layout>
    </Provider>
  );
}
```

## Architecture

HAI3 UI Core follows a domain-driven architecture where:
- Each layout domain is self-contained with its own Redux slice
- Configuration is done via Redux actions (no prop drilling)
- Domains self-hide when not visible
- Orchestrators accept only children (no domain props)

## API Status

⚠️ **Unstable**: Breaking changes may occur in any 0.x release.

## Documentation

Full documentation: [HAI3 Documentation](https://github.com/beyond-event-horizon/HAI3)

## License

MIT
