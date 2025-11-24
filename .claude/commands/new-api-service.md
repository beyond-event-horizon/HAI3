---
description: Add a new API service following domain-based architecture
---

Read `.ai/targets/SCREENSETS.md` API SERVICE RULES section.

Ask user for: framework service or screenset service, which screenset will use it, domain name, endpoints/methods, base URL.

## FRAMEWORK SERVICE (used by uicore package)

### STEP 1: Create service
File: packages/uicore/src/api/services/{domain}/{Domain}ApiService.ts
- Export const DOMAIN = 'domain' as const
- Extend BaseApiService
- Define methods
- Call apiRegistry.register(DOMAIN, ServiceClass)
- Add module augmentation for ApiServicesMap

### STEP 2: Create screenset mocks/extras
In screenset that uses it: src/screensets/{screenset}/api/{domain}/
- Create mocks.ts with MockMap
- Create extra.ts for module augmentation if needed
- Import extra.ts in screenset config
- Call apiRegistry.registerMocks(DOMAIN, mockMap) in screenset config

## SCREENSET SERVICE (screenset-specific)

### STEP 1: Create service
File: src/screensets/{screenset}/api/{Name}ApiService.ts
- Import SCREENSET_ID from ../ids
- Export const DOMAIN = `${SCREENSET_ID}:serviceName` as const
- Extend BaseApiService
- Define methods with getMockMap()
- Call apiRegistry.register(DOMAIN, ServiceClass)
- Add module augmentation for ApiServicesMap

### STEP 2: Create mocks
File: src/screensets/{screenset}/api/mocks.ts
Export mockMap satisfying MockMap type.

### STEP 3: Register in screenset config
Import ./api/{Name}ApiService for side effect.
Call apiRegistry.registerMocks(DOMAIN, mockMap).

## STEP 4: Validate
```bash
npm run type-check
npm run arch:check
```

## STEP 5: Test via Chrome Studio MCP
STOP if MCP WebSocket is closed.
1. npm run dev
2. mcp__chrome-studio__list_console_messages
3. Test API calls
4. Verify mocks return expected data
5. Toggle API mode in Studio and verify both modes work
