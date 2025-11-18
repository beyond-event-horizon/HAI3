import React from 'react';
import { useTranslation } from '@hai3/uicore';
import { Card } from '@hai3/uikit';
import { Button, ButtonVariant } from '@hai3/uikit';
import { useDraggable } from './hooks/useDraggable';
import { useResizable } from './hooks/useResizable';
import { useDevToolsContext } from './DevToolsProvider';
import { ControlPanel } from './sections/ControlPanel';

export const DevToolsPanel: React.FC = () => {
  const { toggleCollapsed, setPortalContainer } = useDevToolsContext();
  const { t } = useTranslation();
  const portalRef = React.useRef<HTMLDivElement>(null);

  // Initialize hooks
  const { size, isResizing, handleMouseDown: handleResizeMouseDown } = useResizable();

  const { position, isDragging, handleMouseDown: handleDragMouseDown } = useDraggable({
    panelSize: size,
  });

  // Register portal container with context on mount
  React.useEffect(() => {
    setPortalContainer(portalRef.current);
    return () => setPortalContainer(null);
  }, [setPortalContainer]);

  return (
    <>
      {/* High z-index portal container for dropdowns */}
      <div
        ref={portalRef}
        className="devtools-portal-container fixed z-[10001] pointer-events-none"
      />

      <div
        className="devtools-panel fixed z-[10000]"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: `${size.width}px`,
          height: `${size.height}px`,
        }}
      >
      <Card className="h-full w-full flex flex-col glassmorphic-panel overflow-hidden">
        {/* Header with drag handle */}
        <div
          className="devtools-header px-4 py-3 border-b border-border/50 select-none flex items-center justify-between"
          onMouseDown={handleDragMouseDown}
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        >
          <h2 className="text-sm font-semibold text-foreground">{t('devtools:title')}</h2>
          <Button
            variant={ButtonVariant.Ghost}
            size="sm"
            onClick={toggleCollapsed}
            className="h-7 w-7 p-0"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <ControlPanel />
        </div>

        {/* Resize handle */}
        <div
          className="devtools-resize-handle absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize"
          onMouseDown={handleResizeMouseDown}
        >
          <svg
            className="w-4 h-4 text-muted-foreground/50"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M22 22H20V20H22V22ZM22 18H20V16H22V18ZM18 22H16V20H18V22ZM18 18H16V16H18V18ZM14 22H12V20H14V22Z" />
          </svg>
        </div>
      </Card>

      <style>{`
        .glassmorphic-panel {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(16px) saturate(180%);
          -webkit-backdrop-filter: blur(16px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.18);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        }

        .dark .glassmorphic-panel {
          background: rgba(0, 0, 0, 0.4);
          border-color: rgba(255, 255, 255, 0.12);
        }

        .devtools-portal-container > * {
          pointer-events: auto;
        }

        /* Bump z-index for all Radix UI dropdown portals globally when DevTools is present */
        body:has(.devtools-panel) [data-radix-popper-content-wrapper] {
          z-index: 10002 !important;
        }
      `}</style>
    </div>
    </>
  );
};

DevToolsPanel.displayName = 'DevToolsPanel';
