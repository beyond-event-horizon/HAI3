import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { saveDevToolsState, loadDevToolsState } from './utils/persistence';
import { STORAGE_KEYS } from './types';
import { initPersistenceEffects } from './effects/persistenceEffects';
import './i18n'; // Register DevTools translations on module import

/**
 * DevTools Context Value
 * Includes portal container for high z-index dropdown rendering
 */
interface DevToolsContextValue {
  collapsed: boolean;
  visible: boolean;
  toggleCollapsed: () => void;
  toggleVisibility: () => void;
  portalContainer: HTMLElement | null;
  setPortalContainer: (container: HTMLElement | null) => void;
}

const DevToolsContext = createContext<DevToolsContextValue | undefined>(undefined);

export const useDevToolsContext = () => {
  const context = useContext(DevToolsContext);
  if (!context) {
    throw new Error('useDevToolsContext must be used within DevToolsProvider');
  }
  return context;
};

interface DevToolsProviderProps {
  children: ReactNode;
}

export const DevToolsProvider: React.FC<DevToolsProviderProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(() =>
    loadDevToolsState(STORAGE_KEYS.COLLAPSED, false)
  );
  const [visible, setVisible] = useState(true);
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);

  // Initialize persistence effects on mount
  useEffect(() => {
    const cleanup = initPersistenceEffects();
    return cleanup;
  }, []);

  const toggleCollapsed = useCallback(() => {
    setCollapsed((prev) => {
      const newValue = !prev;
      saveDevToolsState(STORAGE_KEYS.COLLAPSED, newValue);
      return newValue;
    });
  }, []);

  const toggleVisibility = useCallback(() => {
    setVisible((prev) => !prev);
  }, []);

  return (
    <DevToolsContext.Provider
      value={{
        collapsed,
        visible,
        toggleCollapsed,
        toggleVisibility,
        portalContainer,
        setPortalContainer,
      }}
    >
      {children}
    </DevToolsContext.Provider>
  );
};

DevToolsProvider.displayName = 'DevToolsProvider';
