/**
 * Mock Plugin
 * Intercepts API requests and returns mock data when mock mode is enabled
 * Uses composition pattern - instantiated/destroyed dynamically
 */

import { ApiPlugin } from './ApiPlugin';
import type { RequestConfig } from './ApiPlugin';
import type { MockMap } from '../protocols/ApiProtocol';

/**
 * Mock Plugin Configuration
 */
export interface MockPluginConfig {
  mockMap: Readonly<MockMap>;
  delay?: number; // Delay in ms before returning mock response (default: 500)
}

/**
 * Mock Plugin Implementation
 * High priority (100) ensures it intercepts requests before real API calls
 */
export class MockPlugin extends ApiPlugin {
  priority = 100; // Highest priority - intercepts early

  private readonly mockMap: Readonly<MockMap>;
  private readonly delay: number;

  constructor(config: MockPluginConfig) {
    super();
    this.mockMap = config.mockMap;
    this.delay = config.delay ?? 500;
  }

  /**
   * Match URL pattern with parameters (e.g., /threads/:id matches /threads/123)
   */
  private matchUrlPattern(pattern: string, url: string): boolean {
    // Convert pattern with :param to regex
    const regexPattern = pattern
      .replace(/:[^/]+/g, '[^/]+')  // Replace :param with regex
      .replace(/\//g, '\\/');        // Escape slashes

    const regex = new RegExp(`^${regexPattern}$`);
    return regex.test(url);
  }

  /**
   * Find matching mock factory for the request
   * Supports both exact matches and URL patterns (e.g., /threads/:id)
   */
  private findMockFactory(method: string, url: string): ((data?: import('../protocols/ApiProtocol').JsonValue) => unknown) | undefined {
    const mockKey = `${method.toUpperCase()} ${url}`;

    // Try exact match first
    const mockFactory = this.mockMap[mockKey];
    if (mockFactory) {
      return mockFactory;
    }

    // Try pattern matching
    for (const [key, factory] of Object.entries(this.mockMap)) {
      const [keyMethod, keyUrl] = key.split(' ', 2);
      if (keyMethod === method.toUpperCase() && this.matchUrlPattern(keyUrl, url)) {
        return factory;
      }
    }

    return undefined;
  }

  /**
   * Intercept request and return mock data if available
   * Short-circuits request by returning Response directly
   */
  async onRequest(config: RequestConfig): Promise<RequestConfig | Response> {
    const mockFactory = this.findMockFactory(config.method, config.url);

    if (mockFactory) {
      // Simulate network delay
      await this.simulateDelay();

      // Get mock data from factory, passing request data
      const mockData = mockFactory(config.data as import('../protocols/ApiProtocol').JsonValue | undefined);

      // Return mock response (short-circuits the request chain)
      return new Response(JSON.stringify(mockData), {
        status: 200,
        statusText: 'OK (MOCKED)',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    // No mock found, pass through to next plugin/protocol
    return config;
  }

  /**
   * Simulate network delay for realistic mock behavior
   */
  private async simulateDelay(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, this.delay));
  }

  /**
   * Cleanup plugin resources
   * MockPlugin has no resources to clean up
   */
  destroy(): void {
    // No cleanup needed for mock plugin
  }
}
