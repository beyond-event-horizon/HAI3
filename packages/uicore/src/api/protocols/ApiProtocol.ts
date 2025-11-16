/**
 * API Protocol Base Class
 * Defines the contract for all API communication protocols (REST, SSE, WebSocket, etc.)
 * Follows Interface Segregation Principle - minimal interface for protocol lifecycle
 */

import type { ApiServiceConfig } from '../ApiServiceConfig';
import type { ApiPlugin } from '../plugins/ApiPlugin';

/**
 * JSON-serializable primitive value
 */
export type JsonPrimitive = string | number | boolean | null;

/**
 * JSON-serializable value (recursive)
 */
export type JsonValue =
  | JsonPrimitive
  | JsonValue[]
  | { [key: string]: JsonValue };

/**
 * JSON object type
 */
export type JsonObject = { [key: string]: JsonValue };

/**
 * JSON-compatible type - broader than JsonValue to accept objects without index signatures
 * Intentionally permissive to avoid type errors while maintaining runtime JSON-serializability
 */
export type JsonCompatible = JsonValue | object;

/**
 * Mock response factory function type
 * Generic function that can accept any request and return any response
 * Each service defines its own specific mock types
 */
export type MockResponseFactory<TRequest = JsonValue, TResponse = JsonValue> = (
  requestData?: TRequest
) => TResponse;

/**
 * Mock map - maps endpoint keys to response factories
 * Flexible typing allows different request/response types per endpoint
 * Return values must be JSON-serializable (verified at runtime, not compile-time)
 */
export type MockMap = Record<string, MockResponseFactory<JsonValue, JsonCompatible>>;

/**
 * Base protocol abstract class
 * All protocols must implement initialize and cleanup
 */
export abstract class ApiProtocol {
  /**
   * Initialize protocol with base config, mock map accessor, and plugin accessor
   * Called by BaseApiService during construction
   *
   * @param baseConfig - Shared configuration (baseURL)
   * @param getMockMap - Function to access mock response map
   * @param getPlugins - Function to access registered plugins in order
   */
  abstract initialize(
    baseConfig: Readonly<ApiServiceConfig>,
    getMockMap: () => Readonly<MockMap>,
    getPlugins: () => ReadonlyArray<ApiPlugin>
  ): void;

  /**
   * Cleanup protocol resources
   * Called when service is destroyed or protocol needs to release resources
   */
  abstract cleanup(): void;
}
