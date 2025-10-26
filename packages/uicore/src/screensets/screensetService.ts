import type { MenuItem } from '@hai3/uikit';

/**
 * Screenset Configuration
 * Apps register their screensets with this structure
 */
export interface ScreensetConfig {
  id: string;
  name: string;
  category: string;
  screens: {
    [key: string]: React.ComponentType;
  };
  menuItems: MenuItem[];
  defaultScreen: string;
}

/**
 * Screenset Registry Service
 * Allows apps to register screensets at runtime
 */
class ScreensetService {
  private screensets: Map<string, ScreensetConfig> = new Map();

  /**
   * Register a screenset
   * @param config Screenset configuration
   */
  register(config: ScreensetConfig): void {
    const key = `${config.category}:${config.id}`;
    this.screensets.set(key, config);
  }

  /**
   * Register multiple screensets
   * @param configs Array of screenset configurations
   */
  registerMany(configs: ScreensetConfig[]): void {
    configs.forEach((config) => this.register(config));
  }

  /**
   * Get screenset by category:id key
   */
  get(key: string): ScreensetConfig | undefined {
    return this.screensets.get(key);
  }

  /**
   * Get all screensets for a category
   */
  getByCategory(category: string): ScreensetConfig[] {
    return Array.from(this.screensets.values()).filter((s) => s.category === category);
  }

  /**
   * Get all registered screensets
   */
  getAll(): ScreensetConfig[] {
    return Array.from(this.screensets.values());
  }

  /**
   * Get screenset metadata for selector
   */
  getMetadataByCategory(category: string): Array<{ id: string; name: string }> {
    return this.getByCategory(category).map((s) => ({
      id: s.id,
      name: s.name,
    }));
  }

  /**
   * Get all categories
   */
  getCategories(): string[] {
    const categories = new Set<string>();
    this.screensets.forEach((s) => categories.add(s.category));
    return Array.from(categories).sort();
  }

  /**
   * Clear all screensets (for testing)
   */
  clear(): void {
    this.screensets.clear();
  }
}

// Export singleton instance
export const screensetService = new ScreensetService();
