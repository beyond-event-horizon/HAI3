/**
 * API Services Registry
 * Central registry for all API service instances
 * Follows Open/Closed Principle: services self-register without modifying registry
 * 
 * Pattern:
 * 1. Services self-register at module level
 * 2. Registry stores services by domain name
 * 3. Type-safe access via getService<T>(domain) method
 * 
 * Services organized by backend domain/bounded context:
 * - accounts: Users, tenants, authentication, permissions
 * - billing: Invoices, payments, subscriptions (screenset-provided)
 * - analytics: Metrics, reports, dashboards (screenset-provided)
 */

import type { BaseApiService } from './BaseApiService';

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
type ServiceConstructor = new (config: Omit<import('./BaseApiService').BaseApiServiceConfig, 'baseURL'>) => BaseApiService;

/**
 * API Services Registry
 * Singleton registry that manages all service instances
 * Services self-register at module level (like screensets)
 */
class ApiServicesRegistry {
  private services: Map<string, BaseApiService> = new Map();
  private serviceClasses: Map<string, ServiceConstructor> = new Map();
  private config: ApiServicesConfig | null = null;
  private initialized: boolean = false;

  /**
   * Register an API service
   * Called by service modules at import time
   * Services are instantiated when initialize() is called
   */
  register(domain: string, serviceClass: ServiceConstructor): void {
    this.serviceClasses.set(domain, serviceClass);
    
    // If already initialized, instantiate immediately
    if (this.initialized && this.config) {
      const service = new serviceClass({
        useMockApi: this.config.useMockApi,
        mockDelay: this.config.mockDelay,
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
      });
      this.services.set(domain, service);
    });
  }

  /**
   * Get service by domain with type safety
   * Use type parameter to get full autocomplete
   * 
   * @example
   * const accounts = apiServices.getService<AccountsApiService>('accounts');
   * const user = await accounts.getCurrentUser();
   */
  getService<T extends BaseApiService>(domain: string): T {
    if (!this.initialized) {
      throw new Error('API services not initialized. Call initialize() first.');
    }
    
    const service = this.services.get(domain);
    if (!service) {
      throw new Error(
        `Service '${domain}' not found. Available services: ${Array.from(this.services.keys()).join(', ')}`
      );
    }
    
    return service as T;
  }

  /**
   * Check if service is registered
   */
  has(domain: string): boolean {
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
}

/**
 * Export singleton instance
 * Single point of access for all API services
 */
export const apiServices = new ApiServicesRegistry();
