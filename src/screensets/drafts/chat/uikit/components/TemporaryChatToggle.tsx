/**
 * TemporaryChatToggle - Toggle for temporary chat mode
 * Screenset-specific composite component
 */

import { Switch } from '@hai3/uikit';

export interface TemporaryChatToggleProps {
  value: boolean;
  onChange: (value: boolean) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
}

export const TemporaryChatToggle: React.FC<TemporaryChatToggleProps> = ({
  value,
  onChange,
  label = 'Temporary chat',
  disabled = false,
  className = '',
}) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Switch
        id="temporary-chat"
        checked={value}
        onCheckedChange={onChange}
        disabled={disabled}
        aria-label={label}
      />
      <label
        htmlFor="temporary-chat"
        className="text-sm font-medium text-muted-foreground cursor-pointer"
      >
        {label}
      </label>
    </div>
  );
};
