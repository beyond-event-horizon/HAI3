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
 * API Plugin Interface
 * Implement this interface to create custom plugins (mock, logging, retry, cache, etc.)
 */
export interface ApiPlugin {
  /**
   * Plugin priority (higher = executes first)
   * Default: 0
   * Suggested values:
   * - Mock: 100 (highest - intercepts before real requests)
   * - Auth: 80 (adds tokens before logging)
   * - Logging: 50 (logs after auth tokens added)
   * - Retry: 30 (retries failed requests)
   * - Cache: 20 (caches successful responses)
   */
  priority?: number;

  /**
   * Request hook - called before request is sent
   * Can modify request config or short-circuit by returning a Response
   *
   * @param config - Request configuration
   * @returns Modified config OR Response to short-circuit
   */
  onRequest?(config: RequestConfig): Promise<RequestConfig | Response>;

  /**
   * Response hook - called after successful response
   * Can transform response data
   *
   * @param response - Response from server
   * @returns Modified response
   */
  onResponse?(response: Response): Promise<Response>;

  /**
   * Error hook - called when request fails
   * Can transform error or provide fallback response
   *
   * @param error - Error that occurred
   * @returns Modified error OR Response as fallback
   */
  onError?(error: Error): Promise<Error | Response>;

  /**
   * Initialize hook - called when plugin is registered
   * Use for setup (e.g., loading config, connecting to services)
   */
  initialize?(): void;

  /**
   * Destroy hook - called when plugin is unregistered
   * REQUIRED: Clean up resources (connections, timers, listeners)
   */
  destroy(): void;
}
