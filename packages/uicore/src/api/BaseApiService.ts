/**
 * Base API Service
 * Abstract base class for service-specific API clients using protocol registry pattern
 * Follows SOLID principles:
 * - Single Responsibility: Protocol + plugin lifecycle management
 * - Open/Closed: Open for extension via protocols/plugins, closed for modification
 * - Liskov Substitution: Derived services are substitutable
 * - Dependency Inversion: Depends on ApiProtocol/ApiPlugin interfaces, not concrete implementations
 * - Composition over Inheritance: Plugins composed dynamically, not inherited
 */

import { sortBy, forEach, reverse } from 'lodash';
import { ApiProtocol, type MockMap } from './protocols/ApiProtocol';
import type { ApiServiceConfig } from './ApiServiceConfig';
import type { ApiPlugin } from './plugins/ApiPlugin';

/**
 * Abstract Base API Service
 * Manages protocol and plugin lifecycle using registry pattern (Open/Closed Principle)
 */
export abstract class BaseApiService {
  private readonly protocols: Map<string, ApiProtocol> = new Map();
  private readonly plugins: Map<new (...args: never[]) => ApiPlugin, ApiPlugin> = new Map();

  constructor(
    protected readonly config: Readonly<ApiServiceConfig>,
    ...protocols: ApiProtocol[]
  ) {
    // Initialize and register each protocol
    protocols.forEach((protocol) => {
      protocol.initialize(
        this.config,
        () => this.getMockMap(),
        () => this.getPluginsInOrder()
      );
      // Store by constructor name - no instanceof checks (Open/Closed compliance)
      this.protocols.set(protocol.constructor.name, protocol);
    });
  }

  /**
   * Type-safe protocol accessor
   * Returns protocol instance by type
   * Open/Closed Principle: No modification needed for new protocols
   *
   * @param type - Protocol class constructor
   * @returns Protocol instance
   * @throws Error if protocol not registered
   */
  protected protocol<T extends ApiProtocol>(type: new (...args: never[]) => T): T {
    const name = type.name;
    const protocol = this.protocols.get(name);
    if (!protocol) {
      throw new Error(`Protocol ${name} not registered`);
    }
    return protocol as T;
  }

  /**
   * Get mock response map
   * Override in derived classes to provide mock data
   */
  protected getMockMap(): Readonly<MockMap> {
    return {};
  }

  /**
   * Get current configuration
   */
  getConfig(): Readonly<ApiServiceConfig> {
    return this.config;
  }

  /**
   * Register plugin (auto-sorts by priority)
   * Uses constructor as key (type-safe, no strings)
   *
   * @param plugin - Plugin instance to register
   */
  registerPlugin(plugin: ApiPlugin): void {
    const constructor = plugin.constructor as new (...args: never[]) => ApiPlugin;
    this.plugins.set(constructor, plugin);
    this.sortPlugins();
    plugin.initialize?.();
  }

  /**
   * Unregister plugin by constructor
   * Type-safe: pass the class, not a string
   *
   * @param pluginClass - Plugin class constructor
   */
  unregisterPlugin<T extends ApiPlugin>(pluginClass: new (...args: never[]) => T): void {
    const plugin = this.plugins.get(pluginClass);
    if (plugin) {
      plugin.destroy();
      this.plugins.delete(pluginClass);
    }
  }

  /**
   * Get plugin instance by constructor
   * Returns undefined if not registered
   *
   * @param pluginClass - Plugin class constructor
   * @returns Plugin instance or undefined
   */
  getPlugin<T extends ApiPlugin>(pluginClass: new (...args: never[]) => T): T | undefined {
    return this.plugins.get(pluginClass) as T | undefined;
  }

  /**
   * Check if plugin is registered
   *
   * @param pluginClass - Plugin class constructor
   * @returns True if plugin is registered
   */
  hasPlugin<T extends ApiPlugin>(pluginClass: new (...args: never[]) => T): boolean {
    return this.plugins.has(pluginClass);
  }

  /**
   * Sort plugins by priority (descending)
   * Called after adding new plugin
   * Uses lodash for array operations
   */
  private sortPlugins(): void {
    // Convert Map entries to array
    const entries = Array.from(this.plugins.entries());

    // Use lodash sortBy with negative priority for descending order
    const sorted = sortBy(entries, ([, plugin]) => -(plugin.priority ?? 0));

    // Clear and rebuild map using lodash forEach
    this.plugins.clear();
    forEach(sorted, ([constructor, plugin]) => {
      this.plugins.set(constructor, plugin);
    });
  }

  /**
   * Get plugins in priority order
   * Returns array of plugins (Map values converted to array)
   */
  protected getPluginsInOrder(): ApiPlugin[] {
    // Convert Map values to array (Map-specific operation, acceptable)
    return Array.from(this.plugins.values());
  }

  /**
   * Get plugins in reverse priority order (for response/error handlers)
   * Uses lodash reverse on array
   */
  protected getPluginsReversed(): ApiPlugin[] {
    const plugins = this.getPluginsInOrder();
    // Use lodash reverse (creates new array, doesn't mutate)
    return reverse([...plugins]);
  }

  /**
   * Cleanup all protocols and plugins
   * Call when service is no longer needed
   * Note: Map.forEach() is acceptable - lodash doesn't provide better Map iteration
   */
  destroy(): void {
    // Cleanup protocols (Map.forEach is acceptable for Map iteration)
    this.protocols.forEach((p) => p.cleanup());
    this.protocols.clear();

    // Cleanup plugins (Map.forEach is acceptable for Map iteration)
    this.plugins.forEach((p) => p.destroy());
    this.plugins.clear();
  }
}
