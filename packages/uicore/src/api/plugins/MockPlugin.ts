/**
 * Mock Plugin
 * Intercepts API requests and returns mock data when mock mode is enabled
 * Uses composition pattern - instantiated/destroyed dynamically
 */

import type { ApiPlugin, RequestConfig } from './ApiPlugin';
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
export class MockPlugin implements ApiPlugin {
  priority = 100; // Highest priority - intercepts early

  private readonly mockMap: Readonly<MockMap>;
  private readonly delay: number;

  constructor(config: MockPluginConfig) {
    this.mockMap = config.mockMap;
    this.delay = config.delay ?? 500;
  }

  /**
   * Intercept request and return mock data if available
   * Short-circuits request by returning Response directly
   */
  async onRequest(config: RequestConfig): Promise<RequestConfig | Response> {
    const mockKey = `${config.method.toUpperCase()} ${config.url}`;
    const mockFactory = this.mockMap[mockKey];

    if (mockFactory) {
      // Simulate network delay
      await this.simulateDelay();

      // Get mock data from factory
      const mockData = mockFactory();

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
