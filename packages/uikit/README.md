# @hai3/uikit

> **⚠️ Pre-release (0.x.x)**: This package is in early development. APIs may change without notice. Not recommended for production use.

HAI3 UI Kit provides reusable React components built on shadcn/ui with Tailwind CSS.

## Installation

```bash
npm install @hai3/uikit
```

### Peer Dependencies

```bash
npm install react react-dom @radix-ui/react-select @radix-ui/react-slot \
  class-variance-authority clsx lucide-react tailwind-merge tailwindcss-animate
```

## Features

- **Base Components**: Wrappers around shadcn/ui with consistent API
- **Composite Components**: Higher-level components built from base
- **Theme Support**: Full theming via Tailwind CSS
- **TypeScript**: Complete type definitions
- **Accessible**: Built on Radix UI primitives

## Quick Start

```tsx
import { Button, ButtonVariant } from '@hai3/uikit';

function MyComponent() {
  return (
    <Button variant={ButtonVariant.Primary}>
      Click me
    </Button>
  );
}
```

## Component Hierarchy

```
shadcn/ui (base primitives)
  ↓
Base Components (HAI3 wrappers)
  ↓
Composite Components (combinations)
```

## Available Components

### Base
- Button
- Header, Footer, Menu, Sidebar
- Popup, Overlay

### Composite
- IconButton
- ThemeSelector

## API Status

⚠️ **Unstable**: Breaking changes may occur in any 0.x release.

## Documentation

Full documentation: [HAI3 Documentation](https://github.com/beyond-event-horizon/HAI3)

## License

MIT
