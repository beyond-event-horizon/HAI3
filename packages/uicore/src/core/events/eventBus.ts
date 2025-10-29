/**
 * Event Bus - Central event emitter for domain communication
 * Implements Observable pattern for loose coupling between domains
 * Based on RxJS Subject pattern but lightweight
 */

type EventHandler<T = unknown> = (payload: T) => void;

interface Subscription {
  unsubscribe: () => void;
}

class EventBus {
  private handlers: Map<string, Set<EventHandler<unknown>>> = new Map();

  /**
   * Emit an event with payload
   */
  emit<T = unknown>(eventType: string, payload: T): void {
    const handlers = this.handlers.get(eventType);
    if (handlers) {
      handlers.forEach(handler => handler(payload));
    }
  }

  /**
   * Subscribe to an event
   * Returns subscription object with unsubscribe method
   */
  on<T = unknown>(eventType: string, handler: EventHandler<T>): Subscription {
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
   */
  once<T = unknown>(eventType: string, handler: EventHandler<T>): Subscription {
    const wrappedHandler = (payload: T): void => {
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
