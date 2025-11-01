import React from 'react';
import { Switch } from '@hai3/uikit';
import { useAppSelector } from '@/core/hooks/useRedux';
import { setApiMode } from '../core/actions';

/**
 * API Mode Toggle Component
 * Redux-aware component for toggling between mock and real API
 * Follows UI Core component pattern: reads from Redux, calls actions
 */

export interface ApiModeToggleProps {
  className?: string;
}

export const ApiModeToggle: React.FC<ApiModeToggleProps> = ({ className }) => {
  const useMockApi = useAppSelector((state) => state.app.useMockApi);

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
          id="api-mode-toggle"
        />
      </div>
    </div>
  );
};

ApiModeToggle.displayName = 'ApiModeToggle';
