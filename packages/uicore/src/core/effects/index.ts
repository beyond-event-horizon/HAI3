/**
 * Effects - Central initialization for all domain effects
 * Call initEffects once during app setup
 */

import type { Store } from '@reduxjs/toolkit';
import { initMenuEffects } from './menuEffects';
import { initLayoutEffects } from './layoutEffects';

/**
 * Initialize all effects
 * This sets up event subscriptions for all domains
 */
export function initEffects(store: Store): void {
  initMenuEffects(store);
  initLayoutEffects(store);
}

// Re-export individual init functions if needed
export { initMenuEffects } from './menuEffects';
export { initLayoutEffects } from './layoutEffects';
