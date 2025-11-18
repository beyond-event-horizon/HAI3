import { useEffect } from 'react';
import { upperCase } from 'lodash';

/**
 * Hook to register a keyboard shortcut (Ctrl+Shift+D / Cmd+Shift+D)
 */
export const useKeyboardShortcut = (handler: () => void) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = upperCase(navigator.platform).indexOf('MAC') >= 0;
      const modifierKey = isMac ? e.metaKey : e.ctrlKey;

      if (modifierKey && e.shiftKey && e.key === 'D') {
        e.preventDefault(); // Prevent browser bookmark dialog
        handler();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handler]);
};
