# AI Workflow: Validate Changes

## WHEN
Before commit/merge; after AI-generated edits.

## GOAL
Ensure compliance with `.ai/GUIDELINES.md` and `.ai/targets/**`, and preserve UI behavior/styling.

## CHECKS
1) Architecture:
   npm run arch:check

2) Functional & Styling:
   - Connect to dev server via Google Chrome MCP Tools
   - Exercise all affected flows and screens
   - Verify UI uses `@hai3/uikit`, themes, and event-driven behavior

## ACCEPT
- `npm run arch:check` passes without errors
- No visual/behavioral regressions
- No console errors or missing registrations

## FAIL
- Follow `.ai/workflows/FIX_RULE_VIOLATION.md`