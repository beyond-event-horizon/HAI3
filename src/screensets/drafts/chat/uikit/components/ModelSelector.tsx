/**
 * ModelSelector - LLM model selection component
 * Screenset-specific composite component
 */

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@hai3/uikit';
import { ChatModel } from '../../constants/modelConstants';

export interface ModelSelectorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  models?: Array<{ id: string; name: string }>;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const MODELS = [
  { id: ChatModel.GPT5, name: 'GPT-5' },
  { id: ChatModel.GPT45Turbo, name: 'GPT-4.5 Turbo' },
  { id: ChatModel.Claude45, name: 'Claude 4.5' },
  { id: ChatModel.Claude4, name: 'Claude 4' },
];

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  value,
  onChange,
  placeholder = 'Select model',
  models = MODELS,
  disabled = false,
  className = '',
  children,
}) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {children && (
        <label className="text-sm font-medium text-muted-foreground">
          {children}
        </label>
      )}
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {models.map((model) => (
            <SelectItem key={model.id} value={model.id}>
              {model.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
