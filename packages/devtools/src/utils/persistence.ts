/**
 * Utility functions for persisting DevTools state to localStorage
 */

/**
 * Save a value to localStorage with a given key
 * Handles errors gracefully (e.g., quota exceeded, localStorage disabled)
 */
export const saveDevToolsState = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`[DevTools] Failed to save state for ${key}:`, e);
  }
};

/**
 * Load a value from localStorage with a given key
 * Returns defaultValue if key doesn't exist or on error
 */
export const loadDevToolsState = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.warn(`[DevTools] Failed to load state for ${key}:`, e);
    return defaultValue;
  }
};
