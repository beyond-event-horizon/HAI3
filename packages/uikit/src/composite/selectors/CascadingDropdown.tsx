import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/uikit/base/dropdown-menu';
import { Button } from '@/uikit/base/button';
import { ButtonVariant } from '@hai3/uikit-contracts';
import { ChevronDown } from 'lucide-react';
import { type CascadingDropdownProps } from '@hai3/uikit-contracts';

/**
 * CascadingDropdown Component (Composite)
 * Two-level dropdown using DropdownMenuSub for nested selection
 * First level: Categories, Second level: Items
 */

export const CascadingDropdown: React.FC<CascadingDropdownProps> = ({
  options,
  currentValue,
  onChange,
  label = 'Select',
  className = '',
}) => {
  // Format names
  const formatName = (name: string): string => {
    return name
      .split(/[-_]/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Get current display value
  const getCurrentDisplay = (): string => {
    const [category, itemId] = currentValue.split(':');
    if (!category || !itemId) return 'Select';
    const categoryGroup = options.find((opt) => opt.category === category);
    const item = categoryGroup?.items.find((i) => i.id === itemId);
    return item ? item.name : 'Select';
  };

  const handleItemClick = (category: string, itemId: string): void => {
    onChange(`${category}:${itemId}`);
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
            <span>{formatName(getCurrentDisplay())}</span>
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {options.map((categoryGroup) => (
            <DropdownMenuSub key={categoryGroup.category}>
              <DropdownMenuSubTrigger disabled={categoryGroup.items.length === 0}>
                {formatName(categoryGroup.category)}
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                {categoryGroup.items.map((item) => (
                  <DropdownMenuItem
                    key={item.id}
                    onClick={() => handleItemClick(categoryGroup.category, item.id)}
                  >
                    {formatName(item.name)}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

CascadingDropdown.displayName = 'CascadingDropdown';
