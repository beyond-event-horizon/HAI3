/**
 * ChatTitleEditor - Editable chat title component
 * Presentational component - state managed by parent per UIKIT.md guidelines
 */

import React, { useEffect, useRef } from 'react';
import { Edit3, Check, X } from 'lucide-react';
import { Button, Input } from '@hai3/uikit';
import { ButtonVariant, ButtonSize } from '@hai3/uikit-contracts';

export interface ChatTitleEditorProps {
  title: string;
  isEditing: boolean;
  editedTitle: string;
  onEditStart: () => void;
  onTitleChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
  editLabel?: string;
  saveLabel?: string;
  cancelLabel?: string;
  placeholderLabel?: string;
  className?: string;
}

export const ChatTitleEditor: React.FC<ChatTitleEditorProps> = ({
  title,
  isEditing,
  editedTitle,
  onEditStart,
  onTitleChange,
  onSave,
  onCancel,
  editLabel = 'Edit title',
  saveLabel = 'Save',
  cancelLabel = 'Cancel',
  placeholderLabel = 'Enter title',
  className = '',
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onCancel();
    }
  };

  if (isEditing) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Input
          ref={inputRef}
          value={editedTitle}
          onChange={(e) => onTitleChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholderLabel}
          className="h-8 text-base font-medium"
        />
        <Button
          variant={ButtonVariant.Ghost}
          size={ButtonSize.Icon}
          onMouseDown={(e) => e.preventDefault()}
          onClick={onSave}
          className="text-green-600 dark:text-green-500 hover:text-green-700 dark:hover:text-green-600"
          aria-label={saveLabel}
        >
          <Check size={14} />
        </Button>
        <Button
          variant={ButtonVariant.Ghost}
          size={ButtonSize.Icon}
          onMouseDown={(e) => e.preventDefault()}
          onClick={onCancel}
          className="text-destructive hover:opacity-80"
          aria-label={cancelLabel}
        >
          <X size={14} />
        </Button>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 group ${className}`}>
      <span
        className="text-lg font-semibold cursor-pointer hover:text-primary transition-colors"
        onClick={onEditStart}
        onDoubleClick={onEditStart}
        aria-label={editLabel}
      >
        {title}
      </span>
      <Button
        variant={ButtonVariant.Ghost}
        size={ButtonSize.Icon}
        onClick={onEditStart}
        className="opacity-0 group-hover:opacity-100"
        aria-label={editLabel}
      >
        <Edit3 size={14} className="text-muted-foreground" />
      </Button>
    </div>
  );
};
