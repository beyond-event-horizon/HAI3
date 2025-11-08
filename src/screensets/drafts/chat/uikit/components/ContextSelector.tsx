/**
 * ContextSelector - Context selection component
 * Screenset-specific composite component
 */

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@hai3/uikit';

export interface ContextSelectorProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

const CONTEXTS = [
  { id: 'general', name: 'General' },
  { id: 'code', name: 'Code Assistant' },
  { id: 'creative', name: 'Creative Writing' },
  { id: 'technical', name: 'Technical Documentation' },
];

export const ContextSelector = ({
  value,
  onChange,
  disabled = false,
  className = '',
}: ContextSelectorProps) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <label className="text-sm font-medium text-muted-foreground">Context:</label>
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Select context" />
        </SelectTrigger>
        <SelectContent>
          {CONTEXTS.map((context) => (
            <SelectItem key={context.id} value={context.id}>
              {context.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
