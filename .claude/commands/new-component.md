---
description: Add a new UI component following HAI3 architecture
---

Before starting, read `.ai/targets/UIKIT.md` and `.ai/targets/UIKIT_CONTRACTS.md` and summarize key rules.

Ask the user:
1. Component name (e.g., "DataTable", "ColorPicker")
2. Component type: base (from shadcn) | composite | screenset-specific
3. Component description and props

Then follow this workflow:

## If Base Component (shadcn):

1. Generate via shadcn:
   ```bash
   npx shadcn add {component}
   ```
2. Component will be added to `packages/uikit/src/base/`
3. No further changes needed

## If Composite Component:

1. **Add contract** in `packages/uikit-contracts/src/`:
   ```typescript
   // 1. Add to UiKitComponent enum
   export enum UiKitComponent {
     // ...
     {ComponentName} = '{component-name}',
   }

   // 2. Define props interface
   export interface {ComponentName}Props {
     // props here
   }

   // 3. Define component type
   export type {ComponentName}Component = React.FC<{ComponentName}Props>;

   // 4. Add to UiKitComponentMap
   export interface UiKitComponentMap {
     // ...
     [{ComponentName}]: {ComponentName}Component;
   }
   ```

2. **Create component** in `packages/uikit/src/composite/{ComponentName}.tsx`:
   - Import base components from `../base/`
   - Implement props matching contract
   - NO Redux, NO business logic, NO side effects
   - Accept value/onChange pattern for state
   - Use theme tokens for styling

3. **Export** from `packages/uikit/src/index.ts`:
   ```typescript
   export { {ComponentName} } from './composite/{ComponentName}';
   export type { {ComponentName}Props } from '@hai3/uikit-contracts';
   ```

4. **Register** in app's `src/uikit/uikitRegistry.tsx`:
   ```typescript
   import { {ComponentName} } from '@hai3/uikit';

   uikitRegistry.registerComponent(
     UiKitComponent.{ComponentName},
     {ComponentName} as import('@hai3/uikit-contracts').{ComponentName}Component
   );
   ```

## If Screenset-Specific Component:

1. Create in `src/screensets/{category}/{name}/uikit/{ComponentName}.tsx`
2. Follow same rules as composite components
3. Must be reusable within the screenset
4. NO @hai3/uicore imports or hooks
5. NO Redux or state management

## Validation:

1. Run `npm run build:packages` to ensure contracts compile
2. Run `npm run arch:check` to verify no violations
3. Run `npm run dev` and test component in UI
