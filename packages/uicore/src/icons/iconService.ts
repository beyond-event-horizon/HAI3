import type { ReactNode } from 'react';

/**
 * Icon Registry Service
 * Allows screensets to register their icons at runtime
 * Similar to themeService and screensetService
 */
class IconService {
  private icons: Map<string, ReactNode> = new Map();

  /**
   * Register an icon
   */
  register(id: string, icon: ReactNode): void {
    if (this.icons.has(id)) {
      console.warn(`Icon "${id}" is already registered. Overwriting.`);
    }
    this.icons.set(id, icon);
  }

  /**
   * Register multiple icons at once
   */
  registerBatch(icons: Record<string, ReactNode>): void {
    Object.entries(icons).forEach(([id, icon]) => {
      this.register(id, icon);
    });
  }

  /**
   * Get an icon by ID
   */
  get(id: string): ReactNode | undefined {
    return this.icons.get(id);
  }

  /**
   * Get all registered icons
   */
  getAll(): Record<string, ReactNode> {
    return Object.fromEntries(this.icons);
  }

  /**
   * Check if an icon is registered
   */
  has(id: string): boolean {
    return this.icons.has(id);
  }
}

export const iconService = new IconService();
