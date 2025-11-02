/**
 * API Services Registry
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
 */
export interface ApiServicesConfig {
  useMockApi: boolean;
  mockDelay?: number;
}

/**
 * Service Constructor Type
 * Defines the shape of service class constructors
 */
type ServiceConstructor<T extends BaseApiService = BaseApiService> = new (config: Omit<import('./BaseApiService').BaseApiServiceConfig, 'baseURL'>) => T;

/**
 * API Services Registry
 * Singleton registry that manages all service instances
 * Services self-register at module level (like screensets)
 */
class ApiServicesRegistry {
  private services: Map<string, BaseApiService> = new Map();
  private serviceClasses: Map<string, ServiceConstructor> = new Map();
  private mockMaps: Map<string, Readonly<Record<string, any>>> = new Map();
  private config: ApiServicesConfig | null = null;
  private initialized: boolean = false;

  /**
   * Register mock data for a service
   * Type-safe: domain must be in ApiServicesMap
   * Called by app at startup to provide mock responses
   */
  registerMocks<K extends string & keyof ApiServicesMap>(
    domain: K,
    mockMap: Readonly<Record<string, any>>
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
    if (this.initialized && this.config) {
      const service = new serviceClass({
        useMockApi: this.config.useMockApi,
        mockDelay: this.config.mockDelay,
        mockMap: this.mockMaps.get(domain),
      });
      this.services.set(domain, service);
    }
  }

  /**
   * Initialize all registered API services
   * Instantiates all services with config
   * Must be called before accessing any services
   */
  initialize(config: ApiServicesConfig): void {
    this.config = config;
    this.initialized = true;
    
    // Instantiate all registered service classes
    this.serviceClasses.forEach((ServiceClass, domain) => {
      const service = new ServiceClass({
        useMockApi: config.useMockApi,
        mockDelay: config.mockDelay,
        mockMap: this.mockMaps.get(domain),
      });
      this.services.set(domain, service);
    });
  }

  /**
   * Get service by domain with type safety
   * Type is automatically inferred from ApiServicesMap
   * 
   * @example
   * const accounts = apiServices.getService(ACCOUNTS_DOMAIN);
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
   * Get current configuration
   */
  getConfig(): Readonly<ApiServicesConfig> | null {
    return this.config ? Object.freeze({ ...this.config }) : null;
  }

  /**
   * Update mock API mode without re-initialization
   * Faster than re-initializing - just updates config
   */
  setMockMode(useMockApi: boolean): void {
    if (!this.initialized || !this.config) {
      throw new Error('API services not initialized. Call initialize() first.');
    }
    
    this.config.useMockApi = useMockApi;
    
    // Update all service configs
    this.services.forEach((service) => {
      (service as any).config.useMockApi = useMockApi;
    });
  }
}

/**
 * Export singleton instance
 * Single point of access for all API services
 * Consistent naming with themeService, iconService, screensetService
 */
export const apiServices = new ApiServicesRegistry();

// Alias for clarity in some contexts
export const apiServicesRegistry = apiServices;
