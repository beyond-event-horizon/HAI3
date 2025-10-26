import React from 'react';
import { CascadingSelect, type CascadingOption } from '@/uikit';

/**
 * ScreensetSelector Component
 * Redux-aware component for 2-level screenset selection
 * Uses CascadingSelect with hover-triggered cascading menu
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
  // Convert ScreensetOption[] to CascadingOption[]
  const cascadingOptions: CascadingOption[] = options.map((opt) => ({
    category: opt.category,
    items: opt.screensets,
  }));

  return (
    <CascadingSelect
      options={cascadingOptions}
      currentValue={currentValue}
      onChange={onChange}
      label="Screenset"
      className={className}
    />
  );
};

ScreensetSelector.displayName = 'ScreensetSelector';
