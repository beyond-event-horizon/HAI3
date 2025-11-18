import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { I18nRegistry, Language, i18nRegistry } from '@hai3/uicore';
import { saveDevToolsState, loadDevToolsState } from './utils/persistence';
import { STORAGE_KEYS } from './types';
import { initPersistenceEffects } from './effects/persistenceEffects';

/**
 * DevTools Translation Loader
 * Registered on module import to ensure translations are available before components render
 */
const devtoolsTranslations = I18nRegistry.createLoader({
  [Language.English]: () => import('./i18n/en.json'),
  [Language.Arabic]: () => import('./i18n/ar.json'),
  [Language.Bengali]: () => import('./i18n/bn.json'),
  [Language.Czech]: () => import('./i18n/cs.json'),
  [Language.Danish]: () => import('./i18n/da.json'),
  [Language.German]: () => import('./i18n/de.json'),
  [Language.Greek]: () => import('./i18n/el.json'),
  [Language.Spanish]: () => import('./i18n/es.json'),
  [Language.Persian]: () => import('./i18n/fa.json'),
  [Language.Finnish]: () => import('./i18n/fi.json'),
  [Language.French]: () => import('./i18n/fr.json'),
  [Language.Hebrew]: () => import('./i18n/he.json'),
  [Language.Hindi]: () => import('./i18n/hi.json'),
  [Language.Hungarian]: () => import('./i18n/hu.json'),
  [Language.Indonesian]: () => import('./i18n/id.json'),
  [Language.Italian]: () => import('./i18n/it.json'),
  [Language.Japanese]: () => import('./i18n/ja.json'),
  [Language.Korean]: () => import('./i18n/ko.json'),
  [Language.Malay]: () => import('./i18n/ms.json'),
  [Language.Dutch]: () => import('./i18n/nl.json'),
  [Language.Norwegian]: () => import('./i18n/no.json'),
  [Language.Polish]: () => import('./i18n/pl.json'),
  [Language.Portuguese]: () => import('./i18n/pt.json'),
  [Language.Romanian]: () => import('./i18n/ro.json'),
  [Language.Russian]: () => import('./i18n/ru.json'),
  [Language.Swedish]: () => import('./i18n/sv.json'),
  [Language.Swahili]: () => import('./i18n/sw.json'),
  [Language.Tamil]: () => import('./i18n/ta.json'),
  [Language.Thai]: () => import('./i18n/th.json'),
  [Language.Tagalog]: () => import('./i18n/tl.json'),
  [Language.Turkish]: () => import('./i18n/tr.json'),
  [Language.Ukrainian]: () => import('./i18n/uk.json'),
  [Language.Urdu]: () => import('./i18n/ur.json'),
  [Language.Vietnamese]: () => import('./i18n/vi.json'),
  [Language.ChineseTraditional]: () => import('./i18n/zh-TW.json'),
  [Language.ChineseSimplified]: () => import('./i18n/zh.json'),
});

// Register translations immediately on module import
i18nRegistry.registerLoader('devtools', devtoolsTranslations);

/**
 * DevTools Context Value
 * Includes portal container for high z-index dropdown rendering
 */
interface DevToolsContextValue {
  collapsed: boolean;
  toggleCollapsed: () => void;
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

  return (
    <DevToolsContext.Provider
      value={{
        collapsed,
        toggleCollapsed,
        portalContainer,
        setPortalContainer,
      }}
    >
      {children}
    </DevToolsContext.Provider>
  );
};

DevToolsProvider.displayName = 'DevToolsProvider';
