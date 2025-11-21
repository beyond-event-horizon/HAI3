import React from 'react';
import { useAppSelector, setApiMode, useTranslation } from '@hai3/uicore';
import { Switch } from '@hai3/uikit';

/**
 * API Mode Toggle Component
 * Redux-aware component for toggling between mock and real API
 * Follows UI Core component pattern: reads from Redux, calls actions
 */

export interface ApiModeToggleProps {
  className?: string;
}

export const ApiModeToggle: React.FC<ApiModeToggleProps> = ({ className }) => {
  const useMockApi = useAppSelector((state) => state.uicore.app.useMockApi);
  const { t } = useTranslation();

  return (
    <div className={`flex items-center justify-between h-9 ${className}`}>
      <label
        htmlFor="api-mode-toggle"
        className="text-sm text-muted-foreground cursor-pointer select-none whitespace-nowrap"
      >
        {t('devtools:controls.mockApi')}
      </label>
      <Switch
        id="api-mode-toggle"
        checked={useMockApi}
        onCheckedChange={(checked: boolean) => setApiMode(checked)}
      />
    </div>
  );
};

ApiModeToggle.displayName = 'ApiModeToggle';
