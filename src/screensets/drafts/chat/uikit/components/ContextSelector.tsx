/**
 * ContextSelector - Multi-select context dropdown (Presentational)
 * Pure UI component - state managed by parent per UIKIT.md guidelines
 */

import React from 'react';
import { X } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Button,
} from '@hai3/uikit';
import { ButtonVariant, ButtonSize } from '@hai3/uikit-contracts';
import type { Context } from '../../types';

export interface ContextSelectorProps {
  availableContexts: Context[];
  selectedContexts: string[];
  onToggle: (contextId: string) => void;
  placeholderLabel?: string;
  disabled?: boolean;
  className?: string;
}

export const ContextSelector: React.FC<ContextSelectorProps> = ({
  availableContexts,
  selectedContexts,
  onToggle,
  placeholderLabel = 'Add context',
  disabled = false,
  className = '',
}) => {
  return (
    <Select disabled={disabled}>
      <SelectTrigger className={`w-50 ${className}`}>
        <SelectValue placeholder={placeholderLabel} />
      </SelectTrigger>
      <SelectContent>
        {availableContexts.map((context) => {
          const isSelected = selectedContexts.includes(context.id);
          return (
            <SelectItem
              key={context.id}
              value={context.id}
              onSelect={() => onToggle(context.id)}
            >
              <div className="flex items-center gap-2 w-full">
                <div className={`w-3 h-3 ${context.color} rounded flex-shrink-0`} />
                <span className="flex-1">{context.name}</span>
                {isSelected && <span className="text-xs text-muted-foreground">✓</span>}
              </div>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};

/**
 * SelectedContextsDisplay - Shows selected contexts with remove buttons (Presentational)
 */
export interface SelectedContextsDisplayProps {
  availableContexts: Context[];
  selectedContexts: string[];
  onRemove: (contextId: string) => void;
  contextLabel?: string;
  removeAriaLabelFormatter?: (name: string) => string;
  className?: string;
}

export const SelectedContextsDisplay: React.FC<SelectedContextsDisplayProps> = ({
  availableContexts,
  selectedContexts,
  onRemove,
  contextLabel = 'Context:',
  removeAriaLabelFormatter = (name) => `Remove ${name}`,
  className = '',
}) => {
  if (selectedContexts.length === 0) return null;

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      <span className="text-sm text-muted-foreground">{contextLabel}</span>
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
            <Button
              variant={ButtonVariant.Ghost}
              size={ButtonSize.Icon}
              onClick={() => onRemove(contextId)}
              className="h-4 w-4 p-0 hover:bg-background rounded-full"
              aria-label={removeAriaLabelFormatter(context.name)}
            >
              <X size={12} />
            </Button>
          </div>
        );
      })}
    </div>
  );
};
