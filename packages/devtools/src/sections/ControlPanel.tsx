import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector, screensetRegistry, selectScreenset, useTranslation } from '@hai3/uicore';
import { ThemeSelector } from './ThemeSelector';
import { ScreensetSelector, type ScreensetOption } from './ScreensetSelector';
import { LanguageSelector } from './LanguageSelector';
import { ApiModeToggle } from './ApiModeToggle';

/**
 * All possible screenset categories
 */
const ALL_CATEGORIES = ['drafts', 'mockups', 'production'];

/**
 * Build screenset options for selector
 * Returns all categories, even if empty
 */
const buildScreensetOptions = (): ScreensetOption[] => {
  return ALL_CATEGORIES.map((category) => ({
    category,
    screensets: screensetRegistry.getMetadataByCategory(category),
  }));
};

export const ControlPanel: React.FC = () => {
  const dispatch = useAppDispatch();
  const currentScreenset = useAppSelector((state) => state.uicore.layout.currentScreenset);
  const [screensetOptions, setScreensetOptions] = useState<ScreensetOption[]>([]);
  const { t } = useTranslation();

  useEffect(() => {
    const options = buildScreensetOptions();
    setScreensetOptions(options);
  }, []);

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {t('devtools:controls.heading')}
        </h3>

        <div className="space-y-3">
          {screensetOptions.length > 0 && (
            <ScreensetSelector
              options={screensetOptions}
              currentValue={currentScreenset}
              onChange={(value: string) => dispatch(selectScreenset(value))}
            />
          )}
          <ApiModeToggle />
          <ThemeSelector />
          <LanguageSelector />
        </div>
      </div>
    </div>
  );
};

ControlPanel.displayName = 'ControlPanel';
