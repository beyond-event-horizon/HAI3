/**
 * API Extensions Registry
 * Auto-imports all backend service extensions (module augmentations + mocks)
 */

// Import all extras to apply module augmentations
import './accounts/extra';

// Re-export mock maps for registration
export { accountsMockMap } from './accounts/mocks';
