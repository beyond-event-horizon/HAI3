# API Guidelines

> Common: .ai/GUIDELINES.md | Events: .ai/targets/EVENTS.md

## CRITICAL (AI: READ THIS FIRST)

**Rules:**
- One service per backend domain
- BAD: UserService, InvoiceService
- GOOD: AccountsService, BillingService
- Extend BaseApiService, implement `getMockMap()`
- Self-register: `apiServices.register('domain', Class)` at end of file

**Mocking:**
- Handled by BaseApiService interceptor
- Each service implements `getMockMap()`: `'GET /path': mockData`
- Mock data in domain's `mocks.ts`

**Usage:**
- BAD: `apiService.get('/endpoint')`
- GOOD: `apiServices.getService<AccountsApiService>('accounts').getCurrentUser()`
- Init in `appEffects.ts`: `apiServices.initialize({ useMockApi })`

**Adding Service:**
1. Create `api/[domain]/` folder: `*ApiService.ts`, `api.ts`, `mocks.ts`
2. Extend BaseApiService, set baseURL, implement `getMockMap()`
3. Add type-safe methods: `async getX(): Promise<Response> { return this.get<Response>('/path'); }`
4. Self-register at end: `apiServices.register('domain', ServiceClass);`
5. Import in screenset to trigger registration

**Anti-Patterns:**
- BAD: API calls in components, Redux dispatch in actions
- BAD: Generic `get('/url')`
- BAD: Entity-based services
- GOOD: Domain services, type-safe methods, self-registration

**Structure:**
Vertical slices: `api/[domain]/` contains `*ApiService.ts`, `api.ts`, `mocks.ts`
Base: `BaseApiService.ts`, `apiServices.ts`
