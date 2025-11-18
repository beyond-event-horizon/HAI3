import { eventBus } from '@hai3/uicore';
import { DevToolsEvents } from '../events/devtoolsEvents';
import { saveDevToolsState } from '../utils/persistence';
import { STORAGE_KEYS } from '../types';

/**
 * Persistence Effects
 * Listen to DevTools UI events and update localStorage
 * Treats localStorage as a "slice" for DevTools UI state
 */

/**
 * Initialize all persistence effects
 * Call this once when DevTools mounts
 */
export const initPersistenceEffects = (): (() => void) => {
  // Position changed listener
  const positionSubscription = eventBus.on(
    DevToolsEvents.PositionChanged,
    ({ position }) => {
      saveDevToolsState(STORAGE_KEYS.POSITION, position);
    }
  );

  // Size changed listener
  const sizeSubscription = eventBus.on(
    DevToolsEvents.SizeChanged,
    ({ size }) => {
      saveDevToolsState(STORAGE_KEYS.SIZE, size);
    }
  );

  // Button position changed listener
  const buttonPositionSubscription = eventBus.on(
    DevToolsEvents.ButtonPositionChanged,
    ({ position }) => {
      saveDevToolsState(STORAGE_KEYS.BUTTON_POSITION, position);
    }
  );

  // Return cleanup function to unsubscribe all listeners
  return () => {
    positionSubscription.unsubscribe();
    sizeSubscription.unsubscribe();
    buttonPositionSubscription.unsubscribe();
  };
};
