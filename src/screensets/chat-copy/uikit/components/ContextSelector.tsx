/**
 * ContextSelector - Multi-select context dropdown (Presentational)
 * Pure UI component - state managed by parent per UIKIT.md guidelines
 * Uses base DropdownMenu components from @hai3/uikit
 */

import React from 'react';
import { ChevronDown, X } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@hai3/uikit';
import type { Context } from '../../types';

export interface ContextSelectorProps {
  availableContexts: Context[];
  selectedContexts: string[];
  isOpen: boolean;
  onToggleOpen: () => void;
  onAdd: (contextId: string) => void;
  onRemove: (contextId: string) => void;
  placeholderLabel?: React.ReactNode;
  selectContextLabel?: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export const ContextSelector: React.FC<ContextSelectorProps> = ({
  availableContexts,
  selectedContexts,
  isOpen,
  onToggleOpen,
  onAdd,
  onRemove,
  placeholderLabel,
  selectContextLabel,
  disabled = false,
  className = '',
}) => {
  return (
    <DropdownMenu open={isOpen} onOpenChange={onToggleOpen}>
      <DropdownMenuTrigger asChild disabled={disabled}>
        <button
          className={`flex flex-row items-center gap-2 px-3 py-1.5 border border-input rounded-lg hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed [direction:ltr] ${className}`}
        >
          {placeholderLabel && <span className="text-sm" dir="auto">{placeholderLabel}</span>}
          <ChevronDown size={16} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        {selectContextLabel && (
          <div className="px-2 py-1.5 text-sm font-medium border-b">
            {selectContextLabel}
          </div>
        )}
        <div className="max-h-64 overflow-y-auto">
          {availableContexts.map((context) => {
            const isSelected = selectedContexts.includes(context.id);
            return (
              <DropdownMenuItem
                key={context.id}
                onSelect={(e) => {
                  e.preventDefault();
                  if (isSelected) {
                    onRemove(context.id);
                  } else {
                    onAdd(context.id);
                  }
                }}
                className="flex items-center gap-3 cursor-pointer"
              >
                <div className={`w-4 h-4 ${context.color} rounded flex-shrink-0`} />
                <span className="flex-1 text-sm">{context.name}</span>
                {isSelected && (
                  <div className="w-4 h-4 bg-primary rounded-sm flex items-center justify-center flex-shrink-0">
                    <div className="w-2 h-2 bg-primary-foreground rounded-sm" />
                  </div>
                )}
              </DropdownMenuItem>
            );
          })}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// Component to display selected contexts
export interface SelectedContextsDisplayProps {
  availableContexts: Context[];
  selectedContexts: string[];
  onRemove: (contextId: string) => void;
  removeAriaLabelFormatter?: (name: string) => string;
  className?: string;
  children?: React.ReactNode;
}

export const SelectedContextsDisplay: React.FC<SelectedContextsDisplayProps> = ({
  availableContexts,
  selectedContexts,
  onRemove,
  className = '',
  children,
}) => {
  if (selectedContexts.length === 0) return null;

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {children && <span className="text-sm text-muted-foreground">{children}</span>}
      {selectedContexts.map((contextId) => {
        const context = availableContexts.find((c) => c.id === contextId);
        if (!context) return null;
        return (
          <div
            key={contextId}
            className="flex items-center gap-2 px-3 py-1 bg-muted rounded-full text-sm"
          >
            <div className={`w-3 h-3 ${context.color} rounded`} />
            <span>{context.name}</span>
            <button
              onClick={() => onRemove(contextId)}
              className="hover:bg-background rounded-full p-0.5 transition-colors"
            >
              <X size={12} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
