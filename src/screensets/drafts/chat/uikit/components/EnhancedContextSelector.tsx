/**
 * EnhancedContextSelector - Multi-select context dropdown
 * Allows selecting multiple contexts with visual indicators
 */

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, X } from 'lucide-react';

export interface Context {
  id: string;
  name: string;
  color: string;
}

export interface EnhancedContextSelectorProps {
  selectedContexts: string[];
  onAdd: (contextId: string) => void;
  onRemove: (contextId: string) => void;
  disabled?: boolean;
  className?: string;
}

const AVAILABLE_CONTEXTS: Context[] = [
  { id: 'context-1', name: 'Context 1', color: 'bg-yellow-400' },
  { id: 'work-1', name: 'Work 1', color: 'bg-gray-800' },
  { id: 'hobby', name: 'Hobby', color: 'bg-blue-600' },
  { id: 'test', name: 'Test', color: 'bg-cyan-400' },
  { id: 'cooking', name: 'Cooking', color: 'bg-purple-400' },
  { id: 'books', name: 'Books', color: 'bg-yellow-600' },
  { id: 'private', name: 'Private docs', color: 'bg-red-500' },
];

export const EnhancedContextSelector: React.FC<EnhancedContextSelectorProps> = ({
  selectedContexts,
  onAdd,
  onRemove,
  disabled = false,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleToggleContext = (contextId: string) => {
    if (selectedContexts.includes(contextId)) {
      onRemove(contextId);
    } else {
      onAdd(contextId);
    }
  };

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors disabled:opacity-50"
        title="Add context"
      >
        <ChevronDown size={16} />
      </button>

      {isOpen && (
        <div className="absolute bottom-full right-0 mb-2 w-64 bg-popover border border-border rounded-lg shadow-lg z-50">
          <div className="p-3 border-b border-border">
            <h3 className="font-medium text-sm">Select Context</h3>
          </div>
          <div className="py-1 max-h-64 overflow-y-auto">
            {AVAILABLE_CONTEXTS.map((context) => {
              const isSelected = selectedContexts.includes(context.id);
              return (
                <button
                  key={context.id}
                  onClick={() => handleToggleContext(context.id)}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors flex items-center gap-2 ${
                    isSelected ? 'bg-muted' : ''
                  }`}
                >
                  <div className={`w-3 h-3 ${context.color} rounded flex-shrink-0`} />
                  <span className="flex-1">{context.name}</span>
                  {isSelected && (
                    <span className="text-xs text-muted-foreground">✓</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// Component to display selected contexts
export interface SelectedContextsDisplayProps {
  selectedContexts: string[];
  onRemove: (contextId: string) => void;
  className?: string;
}

export const SelectedContextsDisplay: React.FC<SelectedContextsDisplayProps> = ({
  selectedContexts,
  onRemove,
  className = '',
}) => {
  if (selectedContexts.length === 0) return null;

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      <span className="text-sm text-muted-foreground">Context:</span>
      {selectedContexts.map((contextId) => {
        const context = AVAILABLE_CONTEXTS.find((c) => c.id === contextId);
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
