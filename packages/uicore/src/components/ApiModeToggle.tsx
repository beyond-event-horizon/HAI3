import React from 'react';
import { useAppSelector } from '../hooks/useRedux';
import { setApiMode } from '../core/actions';
import { uikitRegistry } from '../uikit/uikitRegistry';
import { UiKitComponent } from '@hai3/uikit-contracts';

/**
 * API Mode Toggle Component
 * Redux-aware component for toggling between mock and real API
 * Follows UI Core component pattern: reads from Redux, calls actions
 * 
 * NOTE: Uses UI Kit registry instead of direct import
 * This allows the app to use any UI Kit implementation
 */

export interface ApiModeToggleProps {
  className?: string;
}

export const ApiModeToggle: React.FC<ApiModeToggleProps> = ({ className }) => {
  const useMockApi = useAppSelector((state) => state.app.useMockApi);
  const Switch = uikitRegistry.getComponent(UiKitComponent.Switch);

  return (
    <div className={className}>
      <div className="flex items-center gap-2">
        <label
          htmlFor="api-mode-toggle"
          className="cursor-pointer select-none"
        >
          Mock API
        </label>
        <Switch
          checked={useMockApi}
          onCheckedChange={(checked: boolean) => setApiMode(checked)}
        />
      </div>
    </div>
  );
};

ApiModeToggle.displayName = 'ApiModeToggle';
