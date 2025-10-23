import React from 'react';
import { Button as ShadcnButton, type ButtonProps as ShadcnButtonProps } from '@/uikit/_shadcn/button';
import { ButtonVariant, ButtonSize } from './types';

/**
 * Button component for HAI3 UI-Core
 * Wraps shadcn/ui Button with same interface
 */

export interface ButtonProps extends ShadcnButtonProps {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => {
    return <ShadcnButton ref={ref} {...props} />;
  }
);

Button.displayName = 'Button';

// Export enums for consumers
export { ButtonVariant, ButtonSize };
