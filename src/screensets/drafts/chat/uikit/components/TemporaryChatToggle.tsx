/**
 * TemporaryChatToggle - Toggle for temporary chat mode
 * Screenset-specific composite component
 */

import { Switch } from '@hai3/uikit';

export interface TemporaryChatToggleProps {
  value: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export const TemporaryChatToggle = ({
  value,
  onChange,
  disabled = false,
  className = '',
}: TemporaryChatToggleProps) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Switch
        id="temporary-chat"
        checked={value}
        onCheckedChange={onChange}
        disabled={disabled}
      />
      <label
        htmlFor="temporary-chat"
        className="text-sm font-medium text-muted-foreground cursor-pointer"
      >
        Temporary Chat
      </label>
    </div>
  );
};
