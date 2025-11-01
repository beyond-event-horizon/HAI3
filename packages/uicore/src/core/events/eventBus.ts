/**
 * Event Bus - Central event emitter for domain communication
 * Implements Observable pattern for loose coupling between domains
 * Based on RxJS Subject pattern but lightweight
 * 
 * Type Safety: EventPayloadMap ensures emit/on use correct payload per event
 */

import type { EventPayloadMap } from './eventTypes/eventMap';

type EventHandler<T = unknown> = (payload: T) => void;

interface Subscription {
  unsubscribe: () => void;
}

class EventBus {
  private handlers: Map<string, Set<EventHandler<unknown>>> = new Map();

  /**
   * Emit an event with payload
   * Type-safe: payload must match event type in EventPayloadMap
   * Payload is optional for void events
   */
  emit<K extends keyof EventPayloadMap>(
    eventType: K,
    ...args: EventPayloadMap[K] extends void ? [] : [EventPayloadMap[K]]
  ): void {
    const handlers = this.handlers.get(eventType);
    if (handlers) {
      const payload = args[0];
      handlers.forEach(handler => handler(payload));
    }
  }

  /**
   * Subscribe to an event
   * Type-safe: handler receives correct payload type for event
   * Returns subscription object with unsubscribe method
   */
  on<K extends keyof EventPayloadMap>(
    eventType: K,
    handler: EventHandler<EventPayloadMap[K]>
  ): Subscription {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, new Set());
    }
    
    // Cast is safe because we control the payload type at emit time
    this.handlers.get(eventType)!.add(handler as EventHandler<unknown>);

    return {
      unsubscribe: (): void => {
        const handlers = this.handlers.get(eventType);
        if (handlers) {
          handlers.delete(handler as EventHandler<unknown>);
          if (handlers.size === 0) {
            this.handlers.delete(eventType);
          }
        }
      }
    };
  }

  /**
   * Subscribe to event, but only fire once then auto-unsubscribe
   * Type-safe: handler receives correct payload type for event
   */
  once<K extends keyof EventPayloadMap>(
    eventType: K,
    handler: EventHandler<EventPayloadMap[K]>
  ): Subscription {
    const wrappedHandler = (payload: EventPayloadMap[K]): void => {
      handler(payload);
      subscription.unsubscribe();
    };
    
    const subscription = this.on(eventType, wrappedHandler);
    return subscription;
  }

  /**
   * Remove all handlers for an event type
   */
  clear(eventType: string): void {
    this.handlers.delete(eventType);
  }

  /**
   * Remove all event handlers
   */
  clearAll(): void {
    this.handlers.clear();
  }
}

// Singleton instance
export const eventBus = new EventBus();
