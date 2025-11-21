/**
 * API Actions - Actions for API configuration
 * Following Flux architecture pattern
 */

import { eventBus } from '../events/eventBus';
import { ApiEvents } from '../events/eventTypes/apiEvents';

/**
 * Set API mode (mock vs real)
 * Emits ApiModeChanged event
 */
export const setApiMode = (useMockApi: boolean): void => {
  eventBus.emit(ApiEvents.ModeChanged, {
    useMockApi,
  });
};
