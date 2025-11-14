---
description: Add a new API service following domain-based architecture
---

## WORKFLOW
1. Read .ai/targets/API.md and summarize 3-6 rules
2. Ask user: domain name, endpoints/methods, base URL
3. Create service in packages/uicore/src/api/{domain}/
4. Create mocks in src/api/{domain}/
5. Register mocks in src/api/index.ts
6. Validate with npm run arch:check

## REQUIRED FILES
- packages/uicore/src/api/{domain}/{Domain}ApiService.ts
- packages/uicore/src/api/{domain}/api.ts -> export * from './{Domain}ApiService'
- src/api/{domain}/mocks.ts -> export mockMap
- src/api/{domain}/extra.ts -> export * from './mocks'
- src/api/index.ts -> import and register mockMap

## SERVICE STRUCTURE
- REQUIRED: export const {DOMAIN}_DOMAIN = '{domain}' as const
- REQUIRED: class {Domain}ApiService extends BaseApiService
- REQUIRED: constructor(useMockApi, mockMap) calls super(baseURL, useMockApi, mockMap)
- REQUIRED: Typed methods using this.request<T>(method, path, data)
- REQUIRED: declare module '@hai3/uicore' { interface ApiServicesMap }
- REQUIRED: apiRegistry.register({DOMAIN}_DOMAIN, {Domain}ApiService)

## MOCK STRUCTURE
- REQUIRED: export const mockResources: Resource[] = [data]
- REQUIRED: export const {domain}MockMap = new Map<string, any>()
- REQUIRED: Map keys format 'METHOD:/path' -> data or function
- REQUIRED: src/api/index.ts exports apiMockMaps with domain entry

## USAGE
- REQUIRED: const api = apiRegistry.getService({DOMAIN}_DOMAIN)
- REQUIRED: Call typed methods on service instance
- FORBIDDEN: Direct API calls in React components
- FORBIDDEN: Editing apiRegistry.ts or BaseApiService

## RULES
- REQUIRED: ONE service per backend domain (not per entity)
- REQUIRED: All methods fully typed
- REQUIRED: Mock data in app layer only
- REQUIRED: Self-registration pattern
- FORBIDDEN: Raw .get('/url') calls
- FORBIDDEN: Modifying registry root files

## VALIDATION
- REQUIRED: npm run build:packages passes
- REQUIRED: npm run arch:check passes
- DETECT: Domain constant created
- DETECT: BaseApiService extended
- DETECT: ApiServicesMap augmented
- DETECT: Self-registration present
