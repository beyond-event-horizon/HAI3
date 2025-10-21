import React from 'react';

/**
 * Demo screen for HAI3 UI-Core
 * This is a placeholder screen to demonstrate the layout system
 */

export const DemoScreen: React.FC = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Welcome to HAI3 UI-Core</h1>
      
      <div className="bg-card p-6 rounded-lg border border-border mb-6">
        <h2 className="text-xl font-semibold mb-3">Getting Started</h2>
        <p className="text-muted-foreground mb-4">
          This is the initial commit of HAI3 UI-Core, a framework that merges 
          AI-assisted UI generation with human craftsmanship for building 
          maintainable, scalable, and visually consistent SaaS control panels.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-card p-4 rounded-lg border border-border">
          <h3 className="text-lg font-semibold mb-2">Layout Components</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>✓ Header</li>
            <li>✓ Footer</li>
            <li>✓ Menu</li>
            <li>✓ Sidebar</li>
            <li>✓ Popup</li>
            <li>✓ Overlay</li>
          </ul>
        </div>

        <div className="bg-card p-4 rounded-lg border border-border">
          <h3 className="text-lg font-semibold mb-2">Core Features</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>✓ TypeScript</li>
            <li>✓ React + Vite</li>
            <li>✓ Redux Toolkit</li>
            <li>✓ Tailwind CSS</li>
            <li>✓ Modular Architecture</li>
            <li>✓ Theme Support</li>
          </ul>
        </div>
      </div>

      <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
        <h3 className="text-lg font-semibold mb-2 text-primary">Next Steps</h3>
        <ol className="text-sm space-y-2 list-decimal list-inside">
          <li>Install dependencies: <code className="bg-muted px-2 py-1 rounded">npm install</code></li>
          <li>Start the development server: <code className="bg-muted px-2 py-1 rounded">npm run dev</code></li>
          <li>Begin building your screens in the <code className="bg-muted px-2 py-1 rounded">src/screensets</code> folder</li>
        </ol>
      </div>
    </div>
  );
};

DemoScreen.displayName = 'DemoScreen';
