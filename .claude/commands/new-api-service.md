---
description: Add a new API service following domain-based architecture
---

## WORKFLOW
1. Read .ai/targets/SCREENSETS.md "API SERVICE RULES" section
2. Ask user:
   - Is this a framework service (used by uicore) or screenset service?
   - Which screenset will use this service?
   - Domain name, endpoints/methods, base URL
3. For framework service: Create in packages/uicore/src/api/services/{domain}/
4. For screenset service: Create in src/screensets/{screenset}/api/
5. Create mocks in the screenset that uses the service
6. Register mocks in screenset configuration file
7. Validate with npm run arch:check

## FRAMEWORK SERVICE (used by uicore package)
**Service location:** `packages/uicore/src/api/services/{domain}/`
**Mocks/extras location:** `src/screensets/{screenset}/api/{domain}/`

Example: AccountsApiService
- Service: packages/uicore/src/api/services/accounts/AccountsApiService.ts
- Mocks: src/screensets/demo/api/accounts/mocks.ts
- Extra: src/screensets/demo/api/accounts/extra.ts
- Registration: src/screensets/demo/demoScreenset.tsx

## SCREENSET SERVICE (screenset-specific)
**Service location:** `src/screensets/{screenset}/api/`
**Mocks location:** `src/screensets/{screenset}/api/`

Example: ChatApiService
- Service: src/screensets/chat/api/ChatApiService.ts
- Types: src/screensets/chat/api/api.ts
- Mocks: src/screensets/chat/api/mocks.ts
- Registration: src/screensets/chat/chatScreenset.tsx

## SERVICE STRUCTURE
- REQUIRED: export const {DOMAIN}_DOMAIN = '{domain}' as const
- REQUIRED: class {Domain}ApiService extends BaseApiService
- REQUIRED: constructor() calls super(config, ...protocols)
- REQUIRED: protected getMockMap() returns apiRegistry.getMockMap(DOMAIN)
- REQUIRED: Typed methods using this.request<T>(method, path, data)
- REQUIRED: declare module '@hai3/uicore' { interface ApiServicesMap }
- REQUIRED: apiRegistry.register({DOMAIN}_DOMAIN, {Domain}ApiService)

## MOCK STRUCTURE (in screenset)
- REQUIRED: export const {domain}MockMap = { 'METHOD /path': () => data } satisfies MockMap
- REQUIRED: Import in screenset file: import { {domain}MockMap } from './api/mocks'
- REQUIRED: Register in screenset file: apiRegistry.registerMocks({DOMAIN}_DOMAIN, {domain}MockMap)

## MODULE AUGMENTATION (if needed)
- OPTIONAL: Create api/{domain}/extra.ts for extending interfaces
- Example: Extend UserExtra, ApiServiceExtra, etc.
- Import in screenset file: import './api/{domain}/extra'

## SCREENSET REGISTRATION PATTERN
```typescript
// src/screensets/{screenset}/{screenset}Screenset.tsx
import { apiRegistry, {DOMAIN}_DOMAIN } from '@hai3/uicore';
import './api/{Domain}ApiService'; // Triggers service self-registration
import { {domain}MockMap } from './api/mocks';

// Register mocks for this screenset
apiRegistry.registerMocks({DOMAIN}_DOMAIN, {domain}MockMap);
```

## USAGE IN COMPONENTS
- REQUIRED: const api = apiRegistry.getService({DOMAIN}_DOMAIN)
- REQUIRED: Call typed methods on service instance
- FORBIDDEN: Direct API calls in React components
- FORBIDDEN: Editing apiRegistry or BaseApiService

## RULES
- REQUIRED: Framework services in uicore, screenset services in screensets
- REQUIRED: Mocks and extensions ALWAYS in screenset that uses them
- REQUIRED: ONE service per backend domain (not per entity)
- REQUIRED: All methods fully typed with protocol pattern
- REQUIRED: Self-registration pattern for services
- REQUIRED: Manual mock registration in screenset files
- FORBIDDEN: Central mock registration files (src/api/index.ts removed)
- FORBIDDEN: Modifying registry root files

## VALIDATION
- REQUIRED: npm run build:packages passes (for framework services)
- REQUIRED: npm run arch:check passes
- REQUIRED: Service tested via MCP tools (both mock and normal mode)
- DETECT: Domain constant created
- DETECT: BaseApiService extended with protocol pattern
- DETECT: ApiServicesMap augmented
- DETECT: Self-registration present
- DETECT: Mock registration in screenset file
