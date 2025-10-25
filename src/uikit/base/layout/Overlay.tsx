import React from 'react';
import { cn } from '@/lib/utils';

/**
 * Overlay component for HAI3 UI-Core
 * Provides a backdrop overlay for popups, loading states, and other UI elements
 */

export interface OverlayProps {
  className?: string;
  children?: React.ReactNode;
  visible?: boolean;
  opacity?: number;
  blur?: boolean;
  onClick?: () => void;
  zIndex?: number;
}

export const Overlay: React.FC<OverlayProps> = ({
  className,
  children,
  visible = false,
  opacity = 0.5,
  blur = false,
  onClick,
  zIndex = 40,
}) => {
  if (!visible) return null;

  return (
    <div
      className={cn(
        'fixed inset-0 transition-opacity duration-300',
        blur && 'backdrop-blur-sm',
        className
      )}
      style={{
        backgroundColor: `rgba(0, 0, 0, ${opacity})`,
        zIndex,
      }}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

Overlay.displayName = 'Overlay';
