import React from 'react';
import { uikitRegistry } from '../uikit/uikitRegistry';
import { UiKitComponent, type CascadingDropdownOption } from '@hai3/uikit-contracts';

/**
 * ScreensetSelector Component
 * Redux-aware component for 2-level screenset selection
 * Uses CascadingDropdown with nested DropdownMenuSub
 */

export interface ScreensetOption {
  category: string;
  screensets: Array<{ id: string; name: string }>;
}

export interface ScreensetSelectorProps {
  options: ScreensetOption[];
  currentValue: string; // Format: "category:screensetId"
  onChange: (value: string) => void; // Receives "category:screensetId"
  className?: string;
}

export const ScreensetSelector: React.FC<ScreensetSelectorProps> = ({
  options,
  currentValue,
  onChange,
  className = '',
}) => {
  const CascadingDropdown = uikitRegistry.getComponent(UiKitComponent.CascadingDropdown);

  // Convert ScreensetOption[] to CascadingDropdownOption[]
  const cascadingOptions: CascadingDropdownOption[] = options.map((opt) => ({
    category: opt.category,
    items: opt.screensets,
  }));

  return (
    <CascadingDropdown
      options={cascadingOptions}
      currentValue={currentValue}
      onChange={onChange}
      label="Screenset"
      className={className}
    />
  );
};

ScreensetSelector.displayName = 'ScreensetSelector';
