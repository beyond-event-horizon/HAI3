import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/uikit/base/dropdowns/DropdownMenu';
import { Button, ButtonVariant } from '@/uikit/base/buttons/Button';
import { ChevronDown } from 'lucide-react';

/**
 * SimpleSelect Component (Composite)
 * Single-level selection using base DropdownMenu
 * Imports from base layer only (never skips to shadcn)
 * For simple value selection (themes, locales, etc.)
 */

export interface SimpleSelectOption {
  value: string;
  label: string;
}

export interface SimpleSelectProps {
  options: SimpleSelectOption[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  className?: string;
}

export const SimpleSelect: React.FC<SimpleSelectProps> = ({
  options,
  value,
  onChange,
  label,
  className = '',
}) => {
  // Get current display label
  const getCurrentLabel = (): string => {
    const option = options.find((opt) => opt.value === value);
    return option ? option.label : 'Select';
  };

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      {label && (
        <label className="text-sm text-muted-foreground whitespace-nowrap">
          {label}:
        </label>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant={ButtonVariant.Outline}
            className="inline-flex items-center justify-between min-w-40"
          >
            <span>{getCurrentLabel()}</span>
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {options.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onClick={() => onChange(option.value)}
            >
              {option.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

SimpleSelect.displayName = 'SimpleSelect';
