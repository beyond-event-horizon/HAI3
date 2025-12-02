# Tasks: Refactor Template System

## Phase 0: Audit monorepo-unique files (PRESERVE THESE)

- [ ] **0.1** Identify monorepo-unique scripts in scripts/:
  - copy-templates.ts (CLI build script - stays in packages/cli/scripts/)
  - Any other monorepo-only scripts
- [ ] **0.2** Identify monorepo-unique configs at root:
  - package.json, package-lock.json (monorepo workspace config)
  - turbo.json or similar (if any)
  - Any CI/CD configs (.github/, etc.)
- [ ] **0.3** Identify monorepo-only AI commands (hai3dev-* vs hai3-*):
  - hai3-update-guidelines → hai3dev command (not for standalone projects)
  - Document which commands are @standalone vs monorepo-only
- [ ] **0.4** Document what goes in presets/monorepo/ (extends standalone):
  - Additional eslint rules (if any)
  - Additional scripts (if any)
  - Additional configs (if any)
- [ ] **0.5** Verify nothing is lost after refactoring:
  - `npm run lint` passes
  - `npm run arch:check` passes
  - `npm run build` passes

## Phase 1: Clean up presets/standalone/

- [ ] **1.1** Restructure ai/ subfolder:
  - Rename ai/.ai/ → ai-overrides/ (contains ONLY @standalone:override files)
  - Remove ai/openspec/ (users init openspec themselves)
  - Remove ai/.cline/, ai/.aider/ (dropping support for now)
  - Remove empty ai/ folder
- [ ] **1.2** Move eslint-plugin-local from root to presets/standalone/:
  - Move /eslint-plugin-local/ → presets/standalone/eslint-plugin-local/
  - Update monorepo's eslint.config.js to reference ./presets/standalone/eslint-plugin-local
- [ ] **1.3** Verify presets/standalone/ structure matches design:
  ```
  presets/standalone/
  ├── ai-overrides/      # ONLY @standalone:override files
  ├── eslint-plugin-local/
  ├── configs/
  └── scripts/
  ```

## Phase 2: Simplify copy-templates.ts

- [ ] **2.1** Implement Stage 1a: Copy static presets
  - Copy presets/standalone/ to templates/
  - Flatten configs/ to templates root
  - Flatten scripts/ to templates/scripts/
- [ ] **2.2** Implement Stage 1b: Copy root project files
  - Copy root files (index.html, vite.config.ts, etc.)
  - Copy directories (src/themes/, src/uikit/, src/icons/)
  - Copy src/screensets/demo/
- [ ] **2.3** Keep Stage 1c: Assemble .ai/ from markers (existing logic)
- [ ] **2.4** Keep Stage 2: Generate IDE rules and command adapters (existing logic)
- [ ] **2.5** Update command adapter generation to exclude hai3dev-* commands from standalone
- [ ] **2.6** Refactor hai3-new-* commands to use OpenSpec workflow:
  - hai3-new-screenset → creates OpenSpec proposal, then implements after approval
  - hai3-new-screen → creates OpenSpec proposal, then implements after approval
  - hai3-new-component → creates OpenSpec proposal, then implements after approval
  - hai3-new-action → creates OpenSpec proposal, then implements after approval
  - hai3-new-api-service → creates OpenSpec proposal, then implements after approval
  - Each command should: 1) Create proposal 2) Wait for approval 3) Apply implementation
  - **IMPORTANT**: hai3-new-screenset MUST use `hai3 screenset create` CLI during apply step to ensure screenset uniformity (not manual file creation)
- [ ] **2.7** Remove old config lists (rootFiles[], directories[], ideConfigs[])
- [ ] **2.8** Update `.ai/targets/AI_COMMANDS.md` to align with `.ai/targets/AI.md`:
  - Document hai3-* commands (for standalone projects)
  - Document hai3dev-* commands (monorepo-only, framework development)
  - Document that hai3-new-* commands use OpenSpec workflow
- [ ] **2.9** Test: `npm run build:packages` succeeds
- [ ] **2.10** Test: templates/ contains expected structure

## Phase 3: Create shared SYNC_TEMPLATES

- [ ] **3.1** Create `packages/cli/src/core/templates.ts` with:
  - SYNC_TEMPLATES[] constant
  - syncTemplates() function
  - getTemplatesDir() helper
- [ ] **3.2** Update create command to use shared syncTemplates()
- [ ] **3.3** Update update command to use shared syncTemplates()
- [ ] **3.4** Remove duplicate SYNC_TEMPLATES from update/index.ts
- [ ] **3.5** Test: `hai3 create test-project` works
- [ ] **3.6** Test: `hai3 update --templates-only` works

## Phase 4: Validation

### 4A: Monorepo validation (this project)
- [ ] **4A.1** `npm run lint` passes
- [ ] **4A.2** `npm run type-check` passes
- [ ] **4A.3** `npm run arch:check` passes
- [ ] **4A.4** `npm run arch:deps` passes
- [ ] **4A.5** `npm run build` passes
- [ ] **4A.6** `npm run dev` starts successfully
- [ ] **4A.7** Verify eslint.config.js correctly references ./presets/standalone/eslint-plugin-local
- [ ] **4A.8** Verify hai3dev-* commands are available in monorepo
- [ ] **4A.9** Verify hai3-* commands are available in monorepo

### 4B: New project validation (hai3 create)
- [ ] **4B.1** Run `hai3 create test-new-project`
- [ ] **4B.2** `npm ci` succeeds
- [ ] **4B.3** `npm run dev` starts successfully
- [ ] **4B.4** `npm run lint` passes
- [ ] **4B.5** `npm run type-check` passes
- [ ] **4B.6** `npm run arch:check` passes
- [ ] **4B.7** Verify hai3-* commands are available (.claude/, .cursor/, .windsurf/)
- [ ] **4B.8** Verify hai3dev-* commands are NOT present (monorepo-only)
- [ ] **4B.9** Verify openspec commands are available
- [ ] **4B.10** Initialize openspec: `openspec init`
- [ ] **4B.11** Test hai3-new-screenset creates OpenSpec proposal (not direct implementation)
- [ ] **4B.12** Test OpenSpec workflow: proposal → approval → apply
- [ ] **4B.13** Verify demo screenset works
- [ ] **4B.14** Clean up test project

### 4C: Updated project validation (hai3 update)
- [ ] **4C.1** Create a test project or use existing
- [ ] **4C.2** Modify some template files to simulate drift
- [ ] **4C.3** Run `hai3 update --templates-only`
- [ ] **4C.4** Verify modified template files are restored
- [ ] **4C.5** Verify openspec/ folder is NOT overwritten
- [ ] **4C.6** Verify user's custom screensets are preserved
- [ ] **4C.7** `npm run dev` starts successfully
- [ ] **4C.8** `npm run lint` passes
- [ ] **4C.9** Clean up test project

### 4D: Final cleanup
- [ ] **4D.1** Remove obsolete code and comments
- [ ] **4D.2** Update documentation if needed

## Dependencies

- Phase 0 must complete FIRST (audit before changing)
- Phase 1 depends on Phase 0
- Phase 2 depends on Phase 1
- Phase 3 depends on Phase 2
- Phase 4 validates all phases

## Parallelizable

- Phase 0.1, 0.2, 0.3 can run in parallel (audit tasks)
- Phase 1 tasks are sequential
- Phase 2.1 and 2.2 can run in parallel
- Phase 3.2 and 3.3 can run in parallel after 3.1
