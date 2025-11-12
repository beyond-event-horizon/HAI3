import React from 'react';

export interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

/**
 * FormInput Component
 * Reusable form input component with predefined styles
 */
export const FormInput: React.FC<FormInputProps> = ({ 
  className = '',
  id,
  ...props 
}) => {
  const baseClassName = "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50";
  
  // Link input styling
  const isLink = id === 'link';
  const linkClassName = isLink ? "font-mono text-sm" : "";

  return (
    <input
      id={id}
      className={`${baseClassName} ${linkClassName} ${className}`.trim()}
      {...props}
    />
  );
};

