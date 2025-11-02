# API Guidelines

> Common: .ai/GUIDELINES.md | Events: .ai/targets/EVENTS.md

## CRITICAL (AI: READ THIS FIRST)

**Rules:**
- One service per backend domain
- BAD: UserService, InvoiceService
- GOOD: AccountsService, BillingService
- Extend BaseApiService, implement `getMockMap()`
- Each service defines own domain constant locally

**Mocking:**
- Handled by BaseApiService interceptor
- Each service implements `getMockMap()`: `'GET /path': mockData`
- Mock data in domain's `mocks.ts`

**Usage:**
- BAD: `apiService.get('/endpoint')`, `getService('accounts')`
- GOOD: `apiServices.getService(ACCOUNTS_DOMAIN).getCurrentUser()`
- Type inferred from ApiServicesMap
- Init in `appEffects.ts`: `apiServices.initialize({ useMockApi })`

**Adding Service:**
1. Create `api/[domain]/` folder: `*ApiService.ts`, `api.ts`, `mocks.ts`
2. Define domain constant: `export const MY_DOMAIN = 'mydomain' as const;`
3. Extend BaseApiService, set baseURL, implement `getMockMap()`
4. Module augmentation: `declare module '../apiServices' { interface ApiServicesMap { [MY_DOMAIN]: MyService; } }`
5. Self-register: `apiServices.register(MY_DOMAIN, MyService);`
6. Import in screenset to trigger registration
7. NO modification to apiServices.ts (Open/Closed principle)

**Anti-Patterns:**
- BAD: API calls in components, Redux dispatch in actions
- BAD: Generic `get('/url')`
- BAD: Entity-based services
- GOOD: Domain services, type-safe methods, self-registration

**Structure:**
Vertical slices: `api/[domain]/` contains `*ApiService.ts`, `api.ts`, `mocks.ts`
Base: `BaseApiService.ts`, `apiServices.ts`
