# API Guidelines

> Common: .ai/GUIDELINES.md | Events: .ai/targets/EVENTS.md

## CRITICAL (AI: READ THIS FIRST)

**Rules:**
- One service per backend domain
- BAD: EntityService (UserService, InvoiceService)
- GOOD: DomainService pattern
- Extend BaseApiService
- Each service defines own domain constant locally
- Mocks in app layer, NOT in services

**Mocking:**
- Apps provide mockMaps via apiRegistry.initialize()
- BaseApiService intercepts requests when useMockApi=true
- Mock data in app layer: src/api/[service]/mocks.ts

**Usage:**
- BAD: `apiService.get('/endpoint')`, `getService('accounts')`
- GOOD: `apiRegistry.getService(DOMAIN_CONSTANT).methodName()`
- Type inferred from ApiServicesMap
- Init in main.tsx: `apiRegistry.initialize({ useMockApi, mockMaps })`

**Adding Service:**
1. UICore: Create `api/[domain]/`: `ServiceNameApiService.ts`, `api.ts`
2. Define domain constant: `export const DOMAIN_CONST = 'domain' as const;`
3. Extend BaseApiService, set baseURL
4. Module augmentation for ApiServicesMap
5. Self-register: `apiRegistry.register(DOMAIN_CONST, ServiceName);`
6. App: Create `src/api/[service]/`: `extra.ts`, `mocks.ts`
7. App: Export in src/api/index.ts apiMockMaps
8. NO modification to apiRegistry.ts (Open/Closed)

**Anti-Patterns:**
- BAD: API calls in components, Redux dispatch in actions
- BAD: Generic `get('/url')`
- BAD: Entity-based services
- GOOD: Domain services, type-safe methods, self-registration

**Structure:**
- UICore: `api/[domain]/` has `*ApiService.ts`, `api.ts`
- App: `src/api/[service]/` has `extra.ts`, `mocks.ts`
- App: `src/api/index.ts` exports `apiMockMaps`

**Extending Types:**
- `ApiUser.extra?: UserExtra` for platform fields
- src/api/[service]/extra.ts: module augmentation
- src/api/[service]/mocks.ts: full mock with extra
- Pass mockMaps to apiRegistry.initialize()
