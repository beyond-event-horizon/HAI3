# Implementation Tasks

## 1. Pre-Migration Analysis
- [x] 1.1 Identify all API services in `src/api/services/`
- [x] 1.2 Map API services to consuming screensets via `rg "apiRegistry.getService"`
- [x] 1.3 Document duplication requirements (which screensets share which services)
- [x] 1.4 Verify current tests pass: `npm run type-check && npm run arch:check`

## 2. Copy API Services to Screensets
- [x] 2.1 Create `src/screensets/chat/api/` directory
- [x] 2.2 Copy `src/api/services/chat/*` to `src/screensets/chat/api/`
- [x] 2.3 Update imports in `ChatApiService.ts` to use relative paths (remove `@/api` references)
- [x] 2.4 Add `import './api/ChatApiService'` in `src/screensets/chat/chatScreenset.tsx`
- [x] 2.5 Create `src/screensets/chat-copy/api/` directory
- [x] 2.6 Copy `src/api/services/chat/*` to `src/screensets/chat-copy/api/`
- [x] 2.7 Update imports in chat-copy's `ChatApiService.ts`
- [x] 2.8 Add `import './api/ChatApiService'` in `src/screensets/chat-copy/chatCopyScreenset.tsx`
- [x] 2.9 Move accounts service mocks/extras to `src/screensets/demo/api/accounts/`
- [x] 2.10 Register accounts mocks in demo screenset configuration

## 3. Update Action Files
- [x] 3.1 Update `src/screensets/chat/actions/chatActions.ts` to import from local `api/`
- [x] 3.2 Update `src/screensets/chat-copy/actions/chatCopyActions.ts` to import from local `api/`
- [x] 3.3 Verify no remaining imports from `@/api/services/`
- [x] 3.4 Run type-check: `npm run type-check`

## 4. Update Screen Components
- [x] 4.1 Update `src/screensets/chat/screens/chat/ChatScreen.tsx` imports
- [x] 4.2 Update `src/screensets/chat-copy/screens/chat/ChatScreen.tsx` imports
- [x] 4.3 Verify all type imports reference local `api/api.ts`

## 5. Delete Centralized API Directory
- [x] 5.1 Remove import of `@/api/apiRegistry` from `src/main.tsx`
- [x] 5.2 Delete entire `src/api/` directory
- [x] 5.3 Run type-check to catch any remaining references: `npm run type-check`
- [x] 5.4 Run architecture validation: `npm run arch:check`
- [x] 5.5 Delete `src/core/api/` directory (core service mocks moved to screensets)

## 6. Update Guidelines and Documentation
- [x] 6.1 Update `.ai/GUIDELINES.md` routing table - remove or redirect API routing to SCREENSETS
- [x] 6.2 Update `.ai/targets/SCREENSETS.md` - add API service rules section
- [x] 6.3 Deprecate or remove `.ai/targets/API.md` (or repurpose for uicore base API classes)
- [x] 6.4 Update `.ai/workflows/DUPLICATE_SCREENSET.md` - add `api/` directory to duplication steps
- [x] 6.5 Update `.claude/commands/duplicate-screenset.md` - include API service copying logic
- [ ] 6.6 Update `CLAUDE.md` - modify "Working with API Services" section
- [ ] 6.7 Update `openspec/project.md` - revise "External Dependencies > API Services" section

## 7. Testing and Validation
- [x] 7.1 Run full build: `npm run build`
- [x] 7.2 Start dev server: `npm run dev`
- [x] 7.3 Test chat screenset - verify API calls work
- [x] 7.4 Test chat-copy screenset - verify API calls work
- [x] 7.5 Verify no console errors related to API services
- [x] 7.6 Run architecture checks: `npm run arch:check`
- [x] 7.7 Verify no unused exports: `npm run arch:unused`

## 7.5. MCP Testing - Mock API Mode
- [x] 7.5.1 Use MCP tools to navigate to chat screenset
- [x] 7.5.2 Enable mock API mode via Studio toggle
- [x] 7.5.3 Create a new thread and verify mock data returns
- [x] 7.5.4 Send a message and verify mock streaming response
- [x] 7.5.5 Check console for API service registration logs
- [x] 7.5.6 Verify mock data comes from `chat/api/mocks.ts`
- [x] 7.5.7 Switch to chat-copy screenset via MCP
- [x] 7.5.8 Verify chat-copy uses its own independent mock data
- [x] 7.5.9 Take screenshot to verify UI reflects mock mode

## 7.6. MCP Testing - Normal API Mode
- [x] 7.6.1 Use MCP tools to disable mock API mode
- [x] 7.6.2 Verify API calls go to real endpoints (check network tab via MCP)
- [x] 7.6.3 Navigate to chat screenset via MCP
- [x] 7.6.4 Verify normal API behavior (may fail if backend not running - expected)
- [x] 7.6.5 Check console logs show correct API service being used
- [x] 7.6.6 Switch between chat and chat-copy to verify independence
- [x] 7.6.7 Take snapshot to verify no errors in console

## 8. Verify Duplication is Intentional
- [x] 8.1 Confirm `chat` and `chat-copy` both have independent API services
- [x] 8.2 Make a test change to `chat/api/ChatApiService.ts`
- [x] 8.3 Verify `chat-copy/api/ChatApiService.ts` is unchanged
- [x] 8.4 Revert test change

## 9. Documentation Review
- [x] 9.1 Review all documentation changes for consistency
- [x] 9.2 Verify routing table in GUIDELINES.md is accurate
- [x] 9.3 Ensure SCREENSETS.md covers API service creation workflow
- [x] 9.4 Update example code snippets in documentation

## 10. Final Validation
- [x] 10.1 Clean install: `npm run clean:deps`
- [x] 10.2 Full rebuild: `npm run build`
- [x] 10.3 Visual test of all screensets in browser
- [x] 10.4 All OpenSpec documents updated with actual implementation
