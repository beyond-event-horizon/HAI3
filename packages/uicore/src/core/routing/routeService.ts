import { screensetService } from '@/core/screensets/screensetService';

/**
 * Route information for a screen
 */
export interface RouteInfo {
  screenId: string;
  screensetKey: string; // Format: "category:screensetId"
  path: string;
}

/**
 * Route Service
 * Dynamically generates routes from registered screensets
 * Following self-registering registry pattern (see GUIDELINES.md)
 * Uses lazy initialization to prevent race conditions
 */
class RouteService {
  private routes: Map<string, RouteInfo> = new Map();
  private synced: boolean = false;

  /**
   * Synchronize routes from all registered screensets
   * Called automatically on first access (lazy initialization)
   */
  syncFromScreensets(): void {
    this.routes.clear();

    const screensets = screensetService.getAll();

    screensets.forEach((screenset) => {
      const screensetKey = `${screenset.category}:${screenset.id}`;

      Object.keys(screenset.screens).forEach((screenId) => {
        const path = `/${screenId}`;
        this.routes.set(screenId, {
          screenId,
          screensetKey,
          path,
        });
      });
    });
    
    // Only cache if we found screensets (prevents caching empty state)
    if (screensets.length > 0) {
      this.synced = true;
    }
  }
  
  /**
   * Ensure routes are synced (lazy initialization)
   * Prevents race conditions by syncing on first access
   */
  private ensureSynced(): void {
    if (!this.synced) {
      this.syncFromScreensets();
    }
  }

  /**
   * Find which screenset contains a screen
   * @param screenId Screen ID to look up
   * @returns Screenset key (category:screensetId) or undefined
   */
  getScreensetKeyForScreen(screenId: string): string | undefined {
    this.ensureSynced();
    return this.routes.get(screenId)?.screensetKey;
  }

  /**
   * Check if a screen exists in the route registry
   * @param screenId Screen ID to check
   */
  hasScreen(screenId: string): boolean {
    this.ensureSynced();
    return this.routes.has(screenId);
  }

  /**
   * Get all registered screen IDs
   */
  getAllScreenIds(): string[] {
    this.ensureSynced();
    return Array.from(this.routes.keys());
  }

  /**
   * Get route path for a screen
   * @param screenId Screen ID
   * @returns Path (e.g., "/hello-world") or undefined
   */
  getPath(screenId: string): string | undefined {
    this.ensureSynced();
    return this.routes.get(screenId)?.path;
  }

  /**
   * Get all routes
   */
  getAll(): RouteInfo[] {
    this.ensureSynced();
    return Array.from(this.routes.values());
  }

  /**
   * Clear all routes (for testing)
   */
  clear(): void {
    this.routes.clear();
    this.synced = false;
  }
}

// Export singleton instance
export const routeService = new RouteService();
