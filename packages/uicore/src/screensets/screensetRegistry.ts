import type { MenuItem } from '../layout/domains/menu/menuSlice';
import type { Language, TranslationDictionary } from '../i18n/types';
import { i18nRegistry } from '../i18n/i18nRegistry';

/**
 * Screenset Category Enum
 * Defines the three-stage development workflow categories for screensets
 */
export enum ScreensetCategory {
  /** AI-generated initial layouts */
  Drafts = 'drafts',
  /** Designer-refined versions */
  Mockups = 'mockups',
  /** Engineer-finalized, production-ready screens */
  Production = 'production',
}

/**
 * Screen loader function type
 * Returns a Promise resolving to a module with a default export of a React component
 *
 * @example
 * ```typescript
 * // Correct usage with dynamic import
 * screen: () => import('./screens/HelloWorldScreen')
 * ```
 */
export type ScreenLoader = () => Promise<{ default: React.ComponentType }>;

/**
 * Translation loader function type
 * Returns a Promise resolving to translations for the given language
 */
export type TranslationLoader = (language: Language) => Promise<TranslationDictionary>;

/**
 * Menu screen item combines menu item with its lazy-loaded screen component
 * All screens MUST be lazy-loaded using dynamic imports for optimal performance
 * Screen-level translations are registered by the screen component itself when it mounts
 */
export interface MenuScreenItem {
  menuItem: MenuItem;
  screen: ScreenLoader;
}

/**
 * Screenset Configuration
 * Apps register their screensets with this structure
 * Menu array contains both menu item config and screen component
 */
export interface ScreensetConfig {
  id: string;
  name: string;
  category: ScreensetCategory;
  /** Translation loader for screenset-level translations */
  localization: TranslationLoader;
  menu: MenuScreenItem[];
  defaultScreen: string;
}

/**
 * Screenset Registry
 * Allows apps to register screensets at runtime
 */
class ScreensetRegistry {
  private screensets: Map<string, ScreensetConfig> = new Map();

  /**
   * Register a screenset
   * Auto-registers screenset-level translations
   * Screen-level translations are registered by each screen component when it mounts
   * @param config Screenset configuration
   */
  register(config: ScreensetConfig): void {
    const key = `${config.category}:${config.id}`;

    // Auto-register screenset-level translations only
    const screensetNamespace = `screenset.${config.id}`;
    i18nRegistry.registerLoader(screensetNamespace, config.localization);

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
   * Returns lazy loader functions for each screen
   */
  getScreens(key: string): { [key: string]: ScreenLoader } {
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
  getByCategory(category: ScreensetCategory): ScreensetConfig[] {
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
  getMetadataByCategory(category: ScreensetCategory): Array<{ id: string; name: string }> {
    return this.getByCategory(category).map((s) => ({
      id: s.id,
      name: s.name,
    }));
  }

  /**
   * Get all categories
   */
  getCategories(): ScreensetCategory[] {
    const categories = new Set<ScreensetCategory>();
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
   * Returns lazy loader functions that will be wrapped with React.lazy in the Screen component
   */
  private buildScreensFromMenu(menu: MenuScreenItem[]): { [key: string]: ScreenLoader } {
    const screens: { [key: string]: ScreenLoader } = {};
    menu.forEach((item) => {
      screens[item.menuItem.id] = item.screen;
    });
    return screens;
  }
}

// Export singleton instance
export const screensetRegistry = new ScreensetRegistry();
