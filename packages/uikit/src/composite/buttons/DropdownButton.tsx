import React from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '../../base/button';
import { ButtonVariant } from '@hai3/uikit-contracts';
import { cn } from '../../lib/utils';

/**
 * DropdownButton Component
 * Button with integrated dropdown chevron icon
 * Used for dropdown triggers in ThemeSelector, ScreensetSelector, etc.
 * Forwards all props to Button for DropdownMenuTrigger compatibility
 */
export interface DropdownButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: ButtonVariant;
  className?: string;
}

export const DropdownButton = React.forwardRef<
  HTMLButtonElement,
  DropdownButtonProps
>(({ children, variant = ButtonVariant.Outline, className, ...props }, ref) => {
  return (
    <Button
      ref={ref}
      variant={variant}
      className={cn('min-w-40 justify-between rtl:flex-row-reverse', className)}
      {...props}
    >
      <span>{children}</span>
      <ChevronDown className="h-4 w-4" />
    </Button>
  );
});

DropdownButton.displayName = 'DropdownButton';
