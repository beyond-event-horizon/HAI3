import * as React from 'react';
import {
  Select as ShadcnSelect,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/uikit/base/_shadcn/select';

/**
 * Base Select Component
 * Wraps shadcn Select with HAI3 API
 */

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectOptionGroup {
  label: string;
  options: SelectOption[];
}

export interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
  options?: SelectOption[];
  optionGroups?: SelectOptionGroup[];
  placeholder?: string;
  className?: string;
}

export const Select: React.FC<SelectProps> = ({
  value,
  onValueChange,
  options,
  optionGroups,
  placeholder = 'Select...',
  className = '',
}) => {
  return (
    <ShadcnSelect value={value} onValueChange={onValueChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {/* Flat options */}
        {options?.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}

        {/* Grouped options */}
        {optionGroups?.map((group) => (
          <SelectGroup key={group.label}>
            <SelectLabel>{group.label}</SelectLabel>
            {group.options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        ))}
      </SelectContent>
    </ShadcnSelect>
  );
};

Select.displayName = 'Select';
