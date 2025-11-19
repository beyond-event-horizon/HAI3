/**
 * User Extra Properties
 * Platform-specific user fields via module augmentation
 */

import '@hai3/uicore';

declare module '@hai3/uicore' {
  interface UserExtra {
    department: string;
  }
}
