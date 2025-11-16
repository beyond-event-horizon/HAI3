/**
 * API Registry
 * Central registry for all API service instances
 * Follows Open/Closed Principle: services self-register without modifying registry
 *
 * Pattern:
 * 1. Services self-register at module level
 * 2. Registry stores services by domain name
 * 3. Type-safe access via getService(domain) - type inferred from ApiServicesMap
 *
 * Type Safety: ApiServicesMap ensures domain name matches service type at compile time
 * Services use module augmentation to add their types to the map
 *
 * Services organized by backend domain/bounded context:
 * - accounts: Users, tenants, authentication, permissions
 * - billing: Invoices, payments, subscriptions (screenset-provided)
 * - analytics: Metrics, reports, dashboards (screenset-provided)
 */

import type { BaseApiService } from './BaseApiService';
import type { MockMap } from './protocols/ApiProtocol';
import { MockPlugin } from './plugins/MockPlugin';

/**
 * API Services Map
 * Maps domain string constants to service types
 * Services extend this interface via module augmentation
 * Keys must be string literals, not numbers
 *
 * @example
 * declare module '@hai3/uicore' {
 *   interface ApiServicesMap {
 *     [BILLING_DOMAIN]: BillingApiService;
 *   }
 * }
 */
export interface ApiServicesMap {
  // Services add their types via module augmentation
  // Core services are defined in their respective files
  // Keys are string literals only
  [key: string]: BaseApiService;
}

/**
 * API Services Configuration
 * Global configuration for all API services
 */
export interface ApiServicesConfig {
  useMockApi: boolean;
  mockDelay?: number;
}

/**
 * Service Constructor Type
 * Services now use no-arg constructors (configure themselves)
 */
type ServiceConstructor<T extends BaseApiService = BaseApiService> = new () => T;

/**
 * API Registry
 * Singleton registry that manages all service instances
 * Services self-register at module level (like screensets)
 */
class ApiRegistry {
  private services: Map<string, BaseApiService> = new Map();
  private serviceClasses: Map<string, ServiceConstructor> = new Map();
  private mockMaps: Map<string, Readonly<MockMap>> = new Map();
  private initialized: boolean = false;
  private config: Readonly<ApiServicesConfig> = { useMockApi: true };

  /**
   * Register mock data for a service
   * Type-safe: domain must be in ApiServicesMap
   * Called by app at startup to provide mock responses
   */
  registerMocks<K extends string & keyof ApiServicesMap>(
    domain: K,
    mockMap: Readonly<MockMap>
  ): void {
    this.mockMaps.set(domain, mockMap);
  }

  /**
   * Register an API service
   * Type-safe: domain must be in ApiServicesMap and serviceClass must match
   * Called by service modules at import time
   * Services are instantiated when initialize() is called
   */
  register<K extends string & keyof ApiServicesMap>(
    domain: K,
    serviceClass: ServiceConstructor<ApiServicesMap[K]>
  ): void {
    this.serviceClasses.set(domain, serviceClass);

    // If already initialized, instantiate immediately
    if (this.initialized) {
      const service = new serviceClass();
      this.services.set(domain, service);
    }
  }

  /**
   * Initialize all registered API services
   * Instantiates all services and sets up mock mode
   * Must be called before accessing any services
   */
  initialize(config?: ApiServicesConfig): void {
    if (config) {
      this.config = config;
    }
    this.initialized = true;

    // Instantiate all registered service classes
    this.serviceClasses.forEach((ServiceClass, domain) => {
      const service = new ServiceClass();
      this.services.set(domain, service);
    });

    // Set mock mode after services are instantiated
    if (this.config.useMockApi) {
      this.setMockMode(true);
    }
  }

  /**
   * Get service by domain with type safety
   * Type is automatically inferred from ApiServicesMap
   *
   * @example
   * const accounts = apiRegistry.getService(ACCOUNTS_DOMAIN);
   * const user = await accounts.getCurrentUser(); // Full type safety!
   */
  getService<K extends string & keyof ApiServicesMap>(domain: K): ApiServicesMap[K] {
    if (!this.initialized) {
      throw new Error('API services not initialized. Call initialize() first.');
    }

    const service = this.services.get(domain);
    if (!service) {
      throw new Error(
        `Service '${domain}' not found. Available services: ${Array.from(this.services.keys()).join(', ')}`
      );
    }

    return service as ApiServicesMap[K];
  }

  /**
   * Check if service is registered
   */
  has<K extends string & keyof ApiServicesMap>(domain: K): boolean {
    return this.services.has(domain) || this.serviceClasses.has(domain);
  }

  /**
   * Get all registered service domains
   */
  getDomains(): string[] {
    return Array.from(this.serviceClasses.keys());
  }

  /**
   * Get mock map for a domain
   * Used by services to access their mock data
   */
  getMockMap(domain: string): MockMap {
    return (this.mockMaps.get(domain) as MockMap) || {};
  }

  /**
   * Get current global API configuration
   * Used by services/protocols to read useMockApi, mockDelay, etc.
   */
  getConfig(): Readonly<ApiServicesConfig> {
    return this.config;
  }

  /**
   * Set mock mode dynamically using plugin composition
   * Registers/unregisters MockPlugin on all services
   *
   * @param useMockApi - Whether to use mock API
   */
  setMockMode(useMockApi: boolean): void {
    // Update config
    this.config = { ...this.config, useMockApi };

    // Update plugins on all existing services
    this.services.forEach((service, domain) => {
      if (useMockApi) {
        // Register MockPlugin if not already present
        if (!service.hasPlugin(MockPlugin)) {
          const mockMap = this.getMockMap(domain);
          const mockDelay = this.config.mockDelay;
          service.registerPlugin(new MockPlugin({ mockMap, delay: mockDelay }));
        }
      } else {
        // Unregister MockPlugin if present
        if (service.hasPlugin(MockPlugin)) {
          service.unregisterPlugin(MockPlugin);
        }
      }
    });
  }
}

/**
 * Export singleton instance
 * Single point of access for all API services
 * Consistent naming with themeRegistry, screensetRegistry, uikitRegistry
 */
export const apiRegistry = new ApiRegistry();
