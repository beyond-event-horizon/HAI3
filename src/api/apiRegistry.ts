/**
 * API Registry
 * Self-registers API extensions and mocks with UI Core on import
 * App just needs to import this file
 */

import { apiRegistry, ACCOUNTS_DOMAIN } from '@hai3/uicore';
import { CHAT_DOMAIN } from './services/chat/ChatApiService';

// Import all extras to apply module augmentations
import './services/accounts/extra';

// Import services to trigger self-registration
import './services/chat/ChatApiService';

// Import and register all mocks
import { accountsMockMap } from './services/accounts/mocks';
import { chatMockMap } from './services/chat/mocks';

// Register mock maps
apiRegistry.registerMocks(ACCOUNTS_DOMAIN, accountsMockMap);
apiRegistry.registerMocks(CHAT_DOMAIN, chatMockMap);

// Future services: import and register their mocks here
// import { billingMockMap } from './billing/mocks';
// apiRegistry.registerMocks(BILLING_DOMAIN, billingMockMap);
