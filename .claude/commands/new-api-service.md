---
description: Add a new API service following domain-based architecture
---

Before starting, read `.ai/targets/API.md` and summarize 3-6 key rules.

Ask the user:
1. Domain name (e.g., "billing", "analytics", "notifications")
2. API endpoints and methods needed
3. Base URL for this domain

Then create the service:

## 1. Create Service in uicore

In `packages/uicore/src/api/{domain}/`:

**{Domain}ApiService.ts:**
```typescript
import { BaseApiService, apiRegistry } from '@hai3/uicore';

export const {DOMAIN}_DOMAIN = '{domain}' as const;

export class {Domain}ApiService extends BaseApiService {
  constructor(useMockApi: boolean, mockMap?: Map<string, any>) {
    super('https://api.example.com/{domain}', useMockApi, mockMap);
  }

  async get{Resource}s(): Promise<{Resource}[]> {
    return this.request<{Resource}[]>('GET', '/{resources}');
  }

  async get{Resource}(id: string): Promise<{Resource}> {
    return this.request<{Resource}>('GET', `/{resources}/${id}`);
  }

  async create{Resource}(data: Create{Resource}Data): Promise<{Resource}> {
    return this.request<{Resource}>('POST', '/{resources}', data);
  }
}

// Module augmentation for type safety
declare module '@hai3/uicore' {
  interface ApiServicesMap {
    [{DOMAIN}_DOMAIN]: {Domain}ApiService;
  }
}

// Self-register
apiRegistry.register({DOMAIN}_DOMAIN, {Domain}ApiService);
```

**api.ts:**
```typescript
export * from './{Domain}ApiService';
```

## 2. Create App-Level Mocks

In `src/api/{domain}/`:

**mocks.ts:**
```typescript
export const mock{Resource}s: {Resource}[] = [
  // mock data
];

export const {domain}MockMap = new Map<string, any>([
  ['GET:/{resources}', mock{Resource}s],
  ['GET:/{resources}/:id', (id: string) => mock{Resource}s.find(r => r.id === id)],
  ['POST:/{resources}', (data: any) => ({ id: 'new-id', ...data })],
]);
```

**extra.ts:**
```typescript
// Any app-specific extensions to the service
export * from './mocks';
```

## 3. Register Mocks in App

In `src/api/index.ts`:

```typescript
import { {domain}MockMap } from './{domain}/extra';

export const apiMockMaps = {
  // ...
  [{DOMAIN}_DOMAIN]: {domain}MockMap,
};
```

## 4. Usage in Components

```typescript
import { apiRegistry, {DOMAIN}_DOMAIN } from '@hai3/uicore';

// In component or effect
const {domain}Api = apiRegistry.getService({DOMAIN}_DOMAIN);
const {resource}s = await {domain}Api.get{Resource}s();
```

## Rules to Follow:

- ONE service per backend domain (not per entity)
- Services extend BaseApiService
- All methods typed (no raw .get('/url'))
- Mock data in app layer
- Self-registration via apiRegistry
- NO edits to apiRegistry.ts or BaseApiService
- NO API calls directly in React components

## Validation:

```bash
npm run build:packages
npm run arch:check
```

Verify:
- Domain constant created
- BaseApiService extended
- ApiServicesMap augmented
- Self-registration present
- Mocks exported from src/api/index.ts
