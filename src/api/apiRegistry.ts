/**
 * API Registry
 * Self-registers API extensions and mocks with UI Core on import
 * App just needs to import this file
 */

import { apiRegistry, ACCOUNTS_DOMAIN } from '@hai3/uicore';
import { CHAT_DOMAIN, ChatApiService } from './chat/ChatApiService';

// Import all extras to apply module augmentations
import './accounts/extra';

// Import and self-register all mocks
import { accountsMockMap } from './accounts/mocks';
import { chatMockMap } from './chat/mocks';

apiRegistry.registerMocks(ACCOUNTS_DOMAIN, accountsMockMap);
apiRegistry.register(CHAT_DOMAIN, ChatApiService);
apiRegistry.registerMocks(CHAT_DOMAIN, chatMockMap);

// Future services: import and register their mocks here
// import { billingMockMap } from './billing/mocks';
// apiRegistry.registerMocks(BILLING_DOMAIN, billingMockMap);
