# HAI3 UI-Core

> **TARGET AUDIENCE:** Humans  
> **PURPOSE:** Project overview and current state of the HAI3 framework

**Human-driven development, AI-assisted, well structured and polished framework for SaaS control panels**

HAI3 UI-Core is a framework that merges AI-assisted UI generation with human craftsmanship, ensuring maintainable, scalable, and visually consistent applications for SaaS multitenant and multi-user control panels.

## Project Vision

The main **HAI3 UI-Core objective** is to achieve the **maximum possible efficiency** of application screens generation by **AI**, while maintaining the **code quality** and **code structure** for future application logic scale.

1. **HAI3 UI-core**: Human-driven development, AI-assisted, well structured and polished.
2. **Application business screens**: AI-driven development with help of HAI3 UI-core, Human-assisted.

## Features

- **TypeScript-first**: Strict typing for better developer experience and code quality
- **Modern Stack**: React 18 + Vite + Redux Toolkit + Tailwind CSS
- **Modular Architecture**: Screensets as vertical slices, reusable UIKit components
- **Layout System**: Complete set of layout components (Header, Footer, Menu, Sidebar, Popup, Overlay)
- **Theme Support**: Configurable themes with light/dark mode support
- **State Management**: Redux with Flux pattern for shared and private state
- **Microfrontend Ready**: Designed for plugin ecosystems and third-party integrations

## Project Structure

```
HAI3/
├── .ai/                     # AI assistant guidelines
│   └── GUIDELINES.md       # AI coding rules and patterns
├── docs/                    # Project documentation
│   ├── MANIFEST.md         # Core philosophy and principles
│   └── MODEL.md            # Layout and architecture model
├── src/
│   ├── core/               # UI Core implementation
│   │   ├── layout/         # Layout domain (vertical slice)
│   │   │   ├── domains/    # Layout sub-domains
│   │   │   │   ├── header/ # Header component + slice
│   │   │   │   ├── footer/ # Footer component + slice
│   │   │   │   ├── menu/   # Menu component + slice
│   │   │   │   ├── sidebar/# Sidebar component + slice
│   │   │   │   ├── screen/ # Screen component + slice
│   │   │   │   ├── popup/  # Popup component + slice
│   │   │   │   └── overlay/# Overlay component + slice
│   │   │   ├── Layout.tsx  # Main layout orchestrator
│   │   │   └── layoutSlice.ts # Layout-level state
│   │   ├── hooks/          # Typed Redux hooks
│   │   ├── coreSlice.ts    # Global app state
│   │   ├── store.ts        # Redux store configuration
│   │   └── types.ts        # Shared type definitions
│   ├── uikit/              # Reusable UI components
│   │   └── layout/         # Layout components (presentational)
│   ├── screensets/         # Application screens (vertical slices)
│   │   └── drafts/         # Draft screenset
│   │       └── screens/    # Screenset screens (component + slice per screen)
│   ├── styles/             # Global styles and themes
│   │   └── themes/         # Theme configurations
│   └── lib/                # Utility functions
├── public/                 # Static assets
└── [config files]          # TypeScript, Vite, Tailwind configs
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm 9+
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd HAI3
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Layout Components

HAI3 provides a complete set of layout components:

- **Header**: Top navigation bar with logo and actions
- **Footer**: Bottom bar with copyright and links
- **Menu**: Collapsible navigation menu with nested items
- **Sidebar**: Contextual side panels (left or right)
- **Popup**: Modal/dialog system with backdrop
- **Overlay**: Backdrop for popups and loading states

All components are fully typed, themeable, and follow accessibility best practices.

## Core Architecture

### Redux Store Structure

```typescript
{
  core: {
    user: User | null,
    tenant: Tenant | null,
    loading: boolean,
    error: string | null
  },
  layout: {
    menuCollapsed: boolean,
    sidebarCollapsed: boolean,
    sidebarPosition: 'left' | 'right',
    theme: 'light' | 'dark',
    popupStack: PopupState[],
    overlayVisible: boolean
  }
}
```

### Screensets

Screensets are vertical slices of your application. Each screenset:
- Has its own components and business logic
- Can have its own Redux slice
- Uses UIKit components for consistency
- Is isolated from other screensets

## Development Guidelines

Please refer to [.ai/GUIDELINES.md](./.ai/GUIDELINES.md) for AI coding guidelines including:

- TypeScript best practices
- Project structure conventions
- Component development patterns
- State management guidelines
- Screenset architecture

## Contributing

Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## Roadmap

- [ ] Add more UIKit components (Button, Input, Card, etc.)
- [ ] Implement API layer with typed contracts
- [ ] Add authentication and RBAC
- [ ] Create theme builder and customization tools
- [ ] Implement microfrontend plugin system
- [ ] Add i18n/l10n support
- [ ] Create testing framework and examples
- [ ] Build documentation site
- [ ] Add CLI for scaffolding screens and components

## Learn More

- [Project Manifest](./docs/MANIFEST.md) - Core philosophy and principles
- [Architecture Model](./docs/MODEL.md) - Layout and design model
- [AI Guidelines](./.ai/GUIDELINES.md) - AI coding rules and patterns

---

Built for developers building the next generation of SaaS applications