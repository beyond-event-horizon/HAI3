# API Guidelines

## AI WORKFLOW (REQUIRED)
1) Summarize 3-6 rules from this file before proposing changes.
2) STOP if you intend to modify BaseApiService or apiRegistry.ts.

## SCOPE
- Core API layer: packages/uicore/src/api/**
  - plugins/  -> request and response interceptors (ApiPlugin, MockPlugin)
  - protocols/ -> communication protocols (RestProtocol, SseProtocol)
  - services/  -> domain services (accounts, etc.)
- App-level API extensions: src/api/services/**

## CRITICAL RULES
- One domain service per backend domain (no entity-based services).
- Services self-register using apiRegistry.register(...) (registry source file must never be edited).
- All calls go through typed service methods (no raw get("/url")).
- Mock data lives in the app layer and is wired via apiRegistry.initialize({ useMockApi, mockMaps }).
- All services extend BaseApiService and update ApiServicesMap via module augmentation.

## STOP CONDITIONS
- Editing BaseApiService or apiRegistry.ts.
- Calling APIs directly inside React components.
- Adding generic helpers like get("/endpoint").
- Creating UserService, InvoiceService, or other entity-style services.

## ADDING A SERVICE
- Create: packages/uicore/src/api/services/<domain>/{ServiceNameApiService.ts,api.ts}.
- Define domain constant: export const DOMAIN = "domain" as const.
- Extend BaseApiService and set baseURL.
- Add module augmentation for ApiServicesMap.
- Register service: apiRegistry.register(DOMAIN, ServiceName).
- In app: add src/api/services/<domain>/{extra.ts,mocks.ts}.
- In app: import service in src/api/apiRegistry.ts only to trigger registration.

## USAGE RULES
- Access only via apiRegistry.getService(DOMAIN).methodName().
- Type inference must originate from ApiServicesMap.
- No direct axios or fetch usage outside BaseApiService.

## PLUGIN RULES
- REQUIRED: Extend ApiPlugin abstract class to create plugins.
- REQUIRED: Implement abstract destroy() method for resource cleanup.
- REQUIRED: Use abstract classes to enforce method implementation; use interfaces for pure contracts only.

## MOCK DATA RULES
- REQUIRED: Use lodash for all string, array, and object operations in mock data factories.
- FORBIDDEN: Native JavaScript helpers where lodash provides an equivalent (see GUIDELINES.md BLOCKLIST).

## PRE-DIFF CHECKLIST
- [ ] Domain constant created.
- [ ] BaseApiService extended with baseURL.
- [ ] ApiServicesMap augmented.
- [ ] App mocks added and exported.
- [ ] No edits to apiRegistry.ts.
- [ ] No raw get("/url") calls.