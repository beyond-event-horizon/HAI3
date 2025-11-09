# API Guidelines

## AI WORKFLOW (REQUIRED)
1) Summarize 3–6 rules from this file before proposing changes.
2) STOP if you intend to modify `BaseApiService` or `apiRegistry.ts`.

## SCOPE
- Core API layer in `packages/uicore/api/**`
- App-level API extensions in `src/api/**`

## CRITICAL RULES
- One **domain service** per backend domain (no entity-based services).
- Services **self-register** using `apiRegistry.register(...)` — registry source file must never be edited.
- All calls must go through **typed service methods** (no raw `.get('/url')`).
- Mock data lives in the **app layer** and is wired via `apiRegistry.initialize({ useMockApi, mockMaps })`.
- All services extend `BaseApiService` and update `ApiServicesMap` via module augmentation.

## STOP CONDITIONS
- Editing `BaseApiService` or `apiRegistry.ts`
- Calling APIs inside React components
- Adding generic helpers like `get('/endpoint')`
- Creating `UserService`, `InvoiceService`, or other entity-style services

## ADDING A SERVICE
1) Create `packages/uicore/api/<domain>/` with `ServiceNameApiService.ts` and `api.ts`
2) Define domain constant: `export const DOMAIN = 'domain' as const`
3) Extend `BaseApiService` and set `baseURL`
4) Add module augmentation for `ApiServicesMap`
5) Register service: `apiRegistry.register(DOMAIN, ServiceName)`
6) In app: add `src/api/<domain>/extra.ts` and `mocks.ts`
7) Export `apiMockMaps` from `src/api/index.ts`

## USAGE RULES
- Access only via `apiRegistry.getService(DOMAIN).methodName()`
- Type inference must originate from `ApiServicesMap`
- No direct axios/fetch usage outside `BaseApiService`

## PRE-DIFF CHECKLIST
- [ ] Domain constant created
- [ ] `BaseApiService` extended with `baseURL`
- [ ] `ApiServicesMap` augmented
- [ ] App mocks added and exported
- [ ] No edits to `apiRegistry.ts`
- [ ] No raw `.get('/url')` calls