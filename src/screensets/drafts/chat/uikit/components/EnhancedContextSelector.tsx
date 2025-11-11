/**
 * EnhancedContextSelector - Multi-select context dropdown (Presentational)
 * Pure UI component - state managed by parent per UIKIT.md guidelines
 * 
 * @deprecated Use ContextSelector and ContextSelectorContainer instead
 */

import React, { useRef } from 'react';
import { ChevronDown, X } from 'lucide-react';
import type { Context } from '../../types';

export interface EnhancedContextSelectorProps {
  availableContexts: Context[];
  selectedContexts: string[];
  isOpen: boolean;
  onToggleOpen: () => void;
  onAdd: (contextId: string) => void;
  onRemove: (contextId: string) => void;
  placeholderLabel?: string;
  disabled?: boolean;
  className?: string;
}

export const EnhancedContextSelector: React.FC<EnhancedContextSelectorProps> = ({
  availableContexts,
  selectedContexts,
  isOpen,
  onToggleOpen,
  onAdd,
  onRemove,
  disabled = false,
  className = '',
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <button
        onClick={onToggleOpen}
        disabled={disabled}
        className="flex items-center gap-2 px-3 py-1.5 border border-input rounded-lg hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="text-sm">Add context</span>
        <ChevronDown size={16} />
      </button>

      {isOpen && (
        <div className="absolute bottom-full right-0 mb-2 w-64 bg-popover border border-border rounded-lg shadow-lg z-50">
          <div className="p-3 border-b border-border">
            <h3 className="font-medium text-sm">Select Context</h3>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {availableContexts.map((context) => {
              const isSelected = selectedContexts.includes(context.id);
              return (
                <div
                  key={context.id}
                  onClick={() => {
                    if (isSelected) {
                      onRemove(context.id);
                    } else {
                      onAdd(context.id);
                    }
                  }}
                  className="px-4 py-2.5 hover:bg-muted cursor-pointer transition-colors flex items-center gap-3"
                >
                  <div className={`w-4 h-4 ${context.color} rounded flex-shrink-0`} />
                  <span className="flex-1 text-sm">{context.name}</span>
                  {isSelected && (
                    <div className="w-4 h-4 bg-primary rounded-sm flex items-center justify-center flex-shrink-0">
                      <div className="w-2 h-2 bg-primary-foreground rounded-sm" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Selected contexts */}
      {selectedContexts.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
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
      )}
    </div>
  );
};

// Component to display selected contexts
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
  className = '',
}) => {
  if (selectedContexts.length === 0) return null;

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      <span className="text-sm text-muted-foreground">Context:</span>
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
