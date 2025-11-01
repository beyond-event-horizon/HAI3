import type { MenuItem } from '@/core/layout/domains/menu/menuSlice';

/**
 * Menu screen item combines menu item with its screen component
 */
export interface MenuScreenItem {
  menuItem: MenuItem;
  screen: React.ComponentType;
}

/**
 * Screenset Configuration
 * Apps register their screensets with this structure
 * Menu array contains both menu item config and screen component
 */
export interface ScreensetConfig {
  id: string;
  name: string;
  category: string;
  menu: MenuScreenItem[];
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
   * Get screens map for a screenset
   */
  getScreens(key: string): { [key: string]: React.ComponentType } {
    const screenset = this.screensets.get(key);
    if (!screenset) return {};
    return this.buildScreensFromMenu(screenset.menu);
  }

  /**
   * Get menu items for a screenset
   */
  getMenuItems(key: string): MenuItem[] {
    const screenset = this.screensets.get(key);
    if (!screenset) return [];
    return this.extractMenuItems(screenset.menu);
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

  /**
   * Extract menu items from menu screen items
   */
  private extractMenuItems(menu: MenuScreenItem[]): MenuItem[] {
    return menu.map((item) => item.menuItem);
  }

  /**
   * Build screens map from menu screen items
   */
  private buildScreensFromMenu(menu: MenuScreenItem[]): { [key: string]: React.ComponentType } {
    const screens: { [key: string]: React.ComponentType } = {};
    menu.forEach((item) => {
      screens[item.menuItem.id] = item.screen;
    });
    return screens;
  }
}

// Export singleton instance
export const screensetService = new ScreensetService();
