# Change: Move API Services into Screensets

## Why

Currently, API services are centralized in `src/api/services/` and shared across screensets through the `apiRegistry`. While this reduces duplication, it creates coupling between screensets and prevents teams from independently developing and modifying screenset-specific API services. When multiple developers work on different screensets, changes to shared API services can cause conflicts and unintended side effects.

Moving API services into screenset folders enables true vertical slice architecture where each screenset owns its complete domain logic including API communication. This allows developers to work in complete isolation on their screensets without risk of breaking other screensets.

## What Changes

- **BREAKING**: Move all API service implementations from `src/api/services/<domain>/` to `src/screensets/<screenset>/api/`
- **BREAKING**: Move core service mocks and extensions from `src/core/api/` to screensets that use them
- **BREAKING**: Remove centralized `src/api/apiRegistry.ts` file
- **BREAKING**: Delete `src/core/api/` directory entirely
- **BREAKING**: Screensets will register their own API services and mocks within their screenset initialization
- Accept intentional duplication of API services when multiple screensets need similar functionality
- Framework services (e.g., AccountsApiService) remain in uicore package, but their mocks/extensions move to screensets
- Update architecture documentation and guidelines to reflect screenset-owned API pattern
- Update `.ai/targets/API.md` to reflect new location and ownership of API services
- Update `.ai/targets/SCREENSETS.md` to include API service rules
- Update `.ai/GUIDELINES.md` routing to direct API questions to SCREENSETS.md instead of API.md
- Update `.claude/commands/duplicate-screenset.md` to include API service duplication
- Update `.ai/workflows/DUPLICATE_SCREENSET.md` to include API directory in duplication steps

## Impact

**Affected specs:**
- `screensets` - MODIFIED to include API service ownership requirements

**Affected code:**
- `src/api/` - Entire directory deleted
- `src/core/api/` - Entire directory deleted
- `src/screensets/chat/` - Gained `api/` subdirectory with ChatApiService
- `src/screensets/chat-copy/` - Gained duplicate `api/` subdirectory (intentional duplication)
- `src/screensets/demo/` - Gained `api/accounts/` subdirectory with accounts mocks and extras
- `src/main.tsx` - Removed imports of `@/api/apiRegistry` and `@/core/api/coreApiRegistry`

**Affected documentation:**
- `.ai/GUIDELINES.md` - Update routing table
- `.ai/targets/API.md` - Deprecate or remove (API services now part of SCREENSETS.md)
- `.ai/targets/SCREENSETS.md` - Add API service rules
- `.ai/workflows/DUPLICATE_SCREENSET.md` - Add API directory to duplication steps
- `.claude/commands/duplicate-screenset.md` - Update to copy API services
- `CLAUDE.md` - Update architecture documentation
- `openspec/project.md` - Update external dependencies section

**Migration path:**
- Existing screensets must copy their API services from `src/api/services/` before deletion
- Duplication is expected and accepted as intentional architectural choice
