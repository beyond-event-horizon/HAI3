import React from 'react';
import { DevToolsProvider, useDevToolsContext } from './DevToolsProvider';
import { DevToolsPanel } from './DevToolsPanel';
import { useKeyboardShortcut } from './hooks/useKeyboardShortcut';

const DevToolsContent: React.FC = () => {
  const { collapsed, visible, toggleCollapsed, toggleVisibility } = useDevToolsContext();

  // Register keyboard shortcut (Ctrl/Cmd + Shift + D)
  useKeyboardShortcut(toggleVisibility);

  if (!visible) {
    return null;
  }

  if (collapsed) {
    return (
      <div className="fixed bottom-6 right-6 z-[10000]">
        <button
          onClick={toggleCollapsed}
          className="glassmorphic-button"
          title="Open DevTools (Ctrl+Shift+D)"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
            />
          </svg>
        </button>

        <style>{`
          .glassmorphic-button {
            /* Exact same styling as DevTools panel */
            width: 48px;
            height: 48px;
            padding: 0;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: background 0.2s ease;

            /* Glassmorphic styling - exact match to DevTools panel */
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(16px) saturate(180%);
            -webkit-backdrop-filter: blur(16px) saturate(180%);
            border: 1px solid rgba(255, 255, 255, 0.18);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
            color: hsl(var(--foreground));
          }

          .glassmorphic-button:hover {
            background: rgba(255, 255, 255, 0.15);
          }

          .dark .glassmorphic-button {
            background: rgba(0, 0, 0, 0.4);
            border-color: rgba(255, 255, 255, 0.12);
          }

          .dark .glassmorphic-button:hover {
            background: rgba(0, 0, 0, 0.5);
          }
        `}</style>
      </div>
    );
  }

  return <DevToolsPanel />;
};

export const DevToolsOverlay: React.FC = () => {
  return (
    <DevToolsProvider>
      <DevToolsContent />
    </DevToolsProvider>
  );
};

DevToolsOverlay.displayName = 'DevToolsOverlay';
