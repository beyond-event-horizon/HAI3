/**
 * API Plugin System
 * Extensible plugin architecture for API services using composition over inheritance
 *
 * Plugins can hook into request/response lifecycle:
 * - onRequest: Intercept/modify requests (can short-circuit with mock response)
 * - onResponse: Transform responses
 * - onError: Handle errors (can provide fallback responses)
 *
 * Plugins are registered/unregistered dynamically by constructor reference (type-safe)
 * Priority determines execution order (higher = executes first)
 */

/**
 * Request Configuration
 * Represents an outgoing API request
 */
export interface RequestConfig {
  url: string;
  method: string;
  data?: unknown;
  headers?: Record<string, string>;
}

/**
 * API Plugin Abstract Class
 * Extend this class to create custom plugins (mock, logging, retry, cache, etc.)
 * Enforces implementation of required lifecycle methods
 */
export abstract class ApiPlugin {
  /**
   * Plugin priority (higher = executes first)
   * Suggested values:
   * - Mock: 100 (highest - intercepts before real requests)
   * - Auth: 80 (adds tokens before logging)
   * - Logging: 50 (logs after auth tokens added)
   * - Retry: 30 (retries failed requests)
   * - Cache: 20 (caches successful responses)
   */
  priority: number = 0;

  /**
   * Request hook - called before request is sent
   * Can modify request config or short-circuit by returning a Response
   *
   * @param config - Request configuration
   * @returns Modified config OR Response to short-circuit (pass through by default)
   */
  async onRequest(config: RequestConfig): Promise<RequestConfig | Response> {
    return config;
  }

  /**
   * Response hook - called after successful response
   * Can transform response data
   *
   * @param response - Response from server
   * @returns Modified response (pass through by default)
   */
  async onResponse(response: Response): Promise<Response> {
    return response;
  }

  /**
   * Error hook - called when request fails
   * Can transform error or provide fallback response
   *
   * @param error - Error that occurred
   * @returns Modified error OR Response as fallback (rethrow by default)
   */
  async onError(error: Error): Promise<Error | Response> {
    throw error;
  }

  /**
   * Initialize hook - called when plugin is registered
   * Use for setup (e.g., loading config, connecting to services)
   * Override if needed
   */
  initialize(): void {
    // Default: no initialization needed
  }

  /**
   * Destroy hook - called when plugin is unregistered
   * REQUIRED: Clean up resources (connections, timers, listeners)
   * MUST be implemented by subclasses
   */
  abstract destroy(): void;
}
