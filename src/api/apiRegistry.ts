/**
 * API Registry
 * Self-registers API extensions and mocks with UI Core on import
 * App just needs to import this file
 */

import { apiServices, ACCOUNTS_DOMAIN } from '@hai3/uicore';

// Import all extras to apply module augmentations
import './accounts/extra';

// Import and self-register all mocks
import { accountsMockMap } from './accounts/mocks';
apiServices.registerMocks(ACCOUNTS_DOMAIN, accountsMockMap);

// Future services: import and register their mocks here
// import { billingMockMap } from './billing/mocks';
// apiServices.registerMocks(BILLING_DOMAIN, billingMockMap);
