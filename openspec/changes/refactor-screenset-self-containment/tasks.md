# Implementation Tasks

## Phased Approach

This implementation uses a **phased approach** to minimize risk:

1. **Phase 1**: Refactor chat screenset only (proof of concept)
2. **Review & Polish**: User reviews, adjusts chat screenset implementation
3. **Phase 2**: Infrastructure and automation (auto-discovery, ESLint, etc.)
4. **Phase 3**: Migrate remaining screensets (demo, chat-copy, etc.)
5. **Phase 4**: Documentation updates (.ai, .claude, CLAUDE.md)
6. **Phase 5**: Final validation and cleanup

---

## PHASE 1: Refactor Chat Screenset (Proof of Concept)

**Goal**: Refactor ONLY the chat screenset to follow new conventions, validate the approach works.

### 1.1 Update chat screenset slice to use constant
- [ ] 1.1.1 Update `chatSlice.ts`: Change `name: 'chat'` to `name: CHAT_SCREENSET_ID`
- [ ] 1.1.2 Verify slice name uses constant reference (not string literal)
- [ ] 1.1.3 Update `registerSlice('chat', ...)` call to use `CHAT_SCREENSET_ID`

### 1.2 Update chat event namespace to use template literals
- [ ] 1.2.1 Update `chatEvents.ts`: Change all enum values to use template literals
- [ ] 1.2.2 Example: `ThreadSelected = 'chat/threadSelected'` → `` `${CHAT_SCREENSET_ID}/threadSelected` ``
- [ ] 1.2.3 Verify all ~20 event enum values updated
- [ ] 1.2.4 Verify EventPayloadMap keys match template literal format

### 1.3 Update chat icon IDs to use template literals
- [ ] 1.3.1 Update `MessageSquareIcon.tsx`: Change icon ID to template literal
- [ ] 1.3.2 Example: `'message-square'` → `` `${CHAT_SCREENSET_ID}:message-square` ``
- [ ] 1.3.3 Verify icon registration uses new namespaced ID

### 1.4 Update chat API domain to use constant
- [ ] 1.4.1 Update `ChatApiService.ts`: Change `CHAT_DOMAIN = 'chat'` to `CHAT_DOMAIN = CHAT_SCREENSET_ID`
- [ ] 1.4.2 Verify ApiServicesMap module augmentation uses same constant

### 1.5 Update chat translation keys to use template literals
- [ ] 1.5.1 Find all `t('screenset.chat:...')` calls in chat screenset
- [ ] 1.5.2 Update to use template literals: `` t(`screenset.${CHAT_SCREENSET_ID}:...`) ``
- [ ] 1.5.3 Find all `t('screen.chat.chat:...')` calls
- [ ] 1.5.4 Update to use template literals: `` t(`screen.${CHAT_SCREENSET_ID}.${CHAT_SCREEN_ID}:...`) ``

### 1.6 Validate chat screenset changes
- [ ] 1.6.1 Run `npm run type-check` (must pass)
- [ ] 1.6.2 Run `npm run arch:check` (must pass)
- [ ] 1.6.3 Run `npm run lint` (must pass)
- [ ] 1.6.4 Start dev server: `npm run dev`

### 1.7 Test chat screenset via MCP
- [ ] 1.7.1 Navigate to chat screenset via Chrome DevTools MCP
- [ ] 1.7.2 Test thread creation, selection, deletion
- [ ] 1.7.3 Test message sending and streaming
- [ ] 1.7.4 Test model and context selection
- [ ] 1.7.5 Verify all translations load correctly
- [ ] 1.7.6 Verify icons render correctly
- [ ] 1.7.7 Check browser console for errors (should be zero)

### 1.8 Document learnings from chat refactoring
- [ ] 1.8.1 Note any patterns that worked well
- [ ] 1.8.2 Note any challenges or edge cases encountered
- [ ] 1.8.3 Identify any adjustments needed before proceeding

---

## 🛑 CHECKPOINT: Review & Polish

**At this point, STOP and review the chat screenset changes with the user.**

Questions to address:
- Do the conventions feel natural?
- Are there any pain points in the approach?
- Should anything be adjusted before proceeding?
- Is the code more maintainable than before?

**Only proceed to Phase 2 after user approval.**

---

## PHASE 2: Infrastructure & Automation

**Goal**: Add infrastructure support for conventions and automated enforcement.

### 2.1 Update registerSlice to enforce conventions
- [ ] 2.1.1 Modify `registerSlice()` to validate slice name = state key
- [ ] 2.1.2 Add TypeScript assertion: state key must match slice name
- [ ] 2.1.3 Update registerSlice documentation with convention
- [ ] 2.1.4 Test with chat screenset (should pass validation)

### 2.2 Implement auto-discovery for screensets
- [ ] 2.2.1 Update `screensetRegistry.tsx` to use `import.meta.glob('./*/*[Ss]creenset.tsx', { eager: true })`
- [ ] 2.2.2 Remove all manual screenset imports
- [ ] 2.2.3 Add documentation comment explaining auto-discovery
- [ ] 2.2.4 Test that all existing screensets are discovered
- [ ] 2.2.5 Verify app loads without errors

### 2.3 Create ESLint rules for screenset conventions
- [ ] 2.3.1 Set up `eslint-plugin-local/` directory
- [ ] 2.3.2 Create rule: `screenset-slice-name-matches-id`
- [ ] 2.3.3 Create rule: `screenset-event-namespace`
- [ ] 2.3.4 Create rule: `screenset-icon-namespace`
- [ ] 2.3.5 Create rule: `screenset-api-domain-convention`
- [ ] 2.3.6 Create rule: `screenset-file-naming`
- [ ] 2.3.7 Create rule: `screenset-translation-keys`
- [ ] 2.3.8 Add rules to `.eslintrc.js`
- [ ] 2.3.9 Run `npm run lint` on chat screenset (should pass)
- [ ] 2.3.10 Document each rule with examples

### 2.4 Update dependency-cruiser rules
- [ ] 2.4.1 Add rule: `no-cross-screenset-imports`
- [ ] 2.4.2 Add rule: `screensets-use-workspace-packages`
- [ ] 2.4.3 Add rule: `no-uicore-internal-imports`
- [ ] 2.4.4 Add rule: `no-circular-screenset-deps`
- [ ] 2.4.5 Update `.dependency-cruiser.js` configuration
- [ ] 2.4.6 Run `npm run arch:deps` (should pass)
- [ ] 2.4.7 Document rules in config file

### 2.5 Add optional utility functions (if helpful)
- [ ] 2.5.1 Consider adding `deriveEventNamespace(screensetId)` helper (optional)
- [ ] 2.5.2 Consider adding `deriveIconId(screensetId, iconName)` helper (optional)
- [ ] 2.5.3 Document utilities in uicore if added

---

## PHASE 3: Migrate Remaining Screensets

**Goal**: Apply the polished approach to all other screensets.

### 3.1 Migrate demo screenset
- [ ] 3.1.1 Apply same pattern as chat screenset
- [ ] 3.1.2 Update slice name to use DEMO_SCREENSET_ID constant
- [ ] 3.1.3 Update event enum values to use template literals
- [ ] 3.1.4 Update icon IDs to use template literals
- [ ] 3.1.5 Update translation keys to use template literals
- [ ] 3.1.6 Run ESLint (should pass)
- [ ] 3.1.7 Test via MCP

### 3.2 Migrate chat-copy screenset
- [ ] 3.2.1 Apply same pattern as chat screenset
- [ ] 3.2.2 Update slice name to use CHAT_COPY_SCREENSET_ID constant
- [ ] 3.2.3 Update event enum values to use template literals
- [ ] 3.2.4 Update icon IDs to use template literals
- [ ] 3.2.5 Update API domain to use constant
- [ ] 3.2.6 Update translation keys to use template literals
- [ ] 3.2.7 Run ESLint (should pass)
- [ ] 3.2.8 Test via MCP

### 3.3 Identify and migrate any other screensets
- [ ] 3.3.1 Check `src/screensets/` for additional screensets
- [ ] 3.3.2 Apply migration pattern to each
- [ ] 3.3.3 Test each via MCP

### 3.4 Test duplication with new approach
- [ ] 3.4.1 Duplicate demo screenset: `cp -r src/screensets/demo src/screensets/demo-test`
- [ ] 3.4.2 Update DEMO_TEST_SCREENSET_ID constant only
- [ ] 3.4.3 Update screen IDs in screenIds.ts
- [ ] 3.4.4 Verify auto-discovery picks up new screenset
- [ ] 3.4.5 Run `npm run type-check` (should pass)
- [ ] 3.4.6 Test demo-test screenset via MCP
- [ ] 3.4.7 Delete test screenset
- [ ] 3.4.8 Confirm 3-step duplication works!

---

## PHASE 4: Documentation Updates

**Goal**: Update all documentation to reflect new conventions and simplified workflow.

### 4.1 Update CLAUDE.md
- [ ] 4.1.1 Update "Creating a New Screenset" section with new conventions
- [ ] 4.1.2 Update "Common Pitfalls" with convention violations
- [ ] 4.1.3 Add "Screenset Naming Conventions" section
- [ ] 4.1.4 Document auto-discovery via glob pattern
- [ ] 4.1.5 Update "Screenset Architecture" section with self-containment
- [ ] 4.1.6 Add "Automated Enforcement" section documenting ESLint rules
- [ ] 4.1.7 Update all code examples to use template literals

### 4.2 Update .ai/targets/SCREENSETS.md
- [ ] 4.2.1 Document all naming conventions with examples
- [ ] 4.2.2 Document auto-discovery pattern
- [ ] 4.2.3 Update all examples to use constants/template literals
- [ ] 4.2.4 Add section on ESLint enforcement

### 4.3 Update .ai/workflows/DUPLICATE_SCREENSET.md
- [ ] 4.3.1 Reduce workflow to 3 steps (copy, update IDs, done)
- [ ] 4.3.2 Remove all manual import/registration steps
- [ ] 4.3.3 Remove manual event/slice/icon renaming steps
- [ ] 4.3.4 Document what automatically updates
- [ ] 4.3.5 Update validation steps

### 4.4 Update .claude/commands/duplicate-screenset.md
- [ ] 4.4.1 Simplify to 3-step process
- [ ] 4.4.2 Remove Step 7 (Register) - auto-discovered
- [ ] 4.4.3 Simplify Step 2 (IDs) - only update constants
- [ ] 4.4.4 Remove manual renaming instructions
- [ ] 4.4.5 Add auto-discovery explanation

### 4.5 Update .claude/commands/new-screenset.md
- [ ] 4.5.1 Document all naming conventions
- [ ] 4.5.2 Show template literal patterns
- [ ] 4.5.3 Remove manual registration instructions
- [ ] 4.5.4 Update all code examples
- [ ] 4.5.5 Add ESLint enforcement notes

### 4.6 Update .claude/commands/new-screen.md
- [ ] 4.6.1 Update to use template literals in examples
- [ ] 4.6.2 Ensure consistency with conventions

### 4.7 Update .claude/commands/new-api-service.md
- [ ] 4.7.1 Document domain convention
- [ ] 4.7.2 Clarify framework vs screenset-owned
- [ ] 4.7.3 Update examples

---

## PHASE 5: Final Validation & Cleanup

**Goal**: Ensure everything works together and is production-ready.

### 5.1 Full architecture validation
- [ ] 5.1.1 Run `npm run type-check` (must pass)
- [ ] 5.1.2 Run `npm run arch:check` (must pass)
- [ ] 5.1.3 Run `npm run arch:deps` (must pass with new rules)
- [ ] 5.1.4 Run `npm run lint` (must pass - zero errors)
- [ ] 5.1.5 Verify ESLint rules work as expected
- [ ] 5.1.6 Verify dependency-cruiser rules work as expected

### 5.2 Comprehensive MCP testing
- [ ] 5.2.1 Test all screensets via Chrome DevTools MCP
- [ ] 5.2.2 Test navigation between screensets
- [ ] 5.2.3 Test Redux state isolation (no cross-contamination)
- [ ] 5.2.4 Test event bus isolation (events namespaced correctly)
- [ ] 5.2.5 Test API service isolation (domains don't conflict)
- [ ] 5.2.6 Test translations load correctly for all screensets
- [ ] 5.2.7 Verify icons render correctly with namespaced IDs
- [ ] 5.2.8 Check browser console (should be zero errors)

### 5.3 Integration testing
- [ ] 5.3.1 Test screenset switching maintains state correctly
- [ ] 5.3.2 Test multiple screensets loaded simultaneously
- [ ] 5.3.3 Test state persistence across navigation
- [ ] 5.3.4 Test API mocking works per screenset

### 5.4 Final cleanup
- [ ] 5.4.1 Remove any test/debug code
- [ ] 5.4.2 Verify no console.log statements in production code
- [ ] 5.4.3 Clean up any commented-out code
- [ ] 5.4.4 Ensure all TODOs are addressed or documented

### 5.5 Build verification
- [ ] 5.5.1 Run production build: `npm run build`
- [ ] 5.5.2 Verify build completes without errors
- [ ] 5.5.3 Check bundle sizes are reasonable
- [ ] 5.5.4 Test production bundle locally
- [ ] 5.5.5 Verify auto-discovery works in production build

### 5.6 Documentation final review
- [ ] 5.6.1 Review all updated documentation for accuracy
- [ ] 5.6.2 Ensure all examples match actual implementation
- [ ] 5.6.3 Verify no references to old patterns remain
- [ ] 5.6.4 Add comprehensive migration notes to CHANGELOG.md
- [ ] 5.6.5 Update version number if applicable

### 5.7 Create screenset template (optional)
- [ ] 5.7.1 Create template in `.templates/screenset/` with all conventions
- [ ] 5.7.2 Include example using all patterns (template literals, constants, etc.)
- [ ] 5.7.3 Document how to use the template
