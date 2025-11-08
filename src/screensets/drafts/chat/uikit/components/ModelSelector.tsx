/**
 * ModelSelector - LLM model selection component
 * Screenset-specific composite component
 */

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@hai3/uikit';

export interface ModelSelectorProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

const MODELS = [
  { id: 'gpt-5', name: 'GPT-5' },
  { id: 'gpt-4.5-turbo', name: 'GPT-4.5 Turbo' },
  { id: 'claude-4.5', name: 'Claude 4.5' },
  { id: 'claude-4', name: 'Claude 4' },
];

export const ModelSelector = ({
  value,
  onChange,
  disabled = false,
  className = '',
}: ModelSelectorProps) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <label className="text-sm font-medium text-muted-foreground">Model:</label>
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Select model" />
        </SelectTrigger>
        <SelectContent>
          {MODELS.map((model) => (
            <SelectItem key={model.id} value={model.id}>
              {model.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
