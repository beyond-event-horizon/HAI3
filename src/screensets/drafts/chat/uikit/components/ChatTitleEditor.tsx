/**
 * ChatTitleEditor - Editable chat title component
 * Allows inline editing of chat titles with save/cancel actions
 */

import React, { useState, useEffect, useRef } from 'react';
import { Edit3, Check, X } from 'lucide-react';

export interface ChatTitleEditorProps {
  title: string;
  onSave: (newTitle: string) => void;
  className?: string;
}

export const ChatTitleEditor: React.FC<ChatTitleEditorProps> = ({
  title,
  onSave,
  className = '',
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setEditedTitle(title);
  }, [title]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    const trimmed = editedTitle.trim();
    if (trimmed && trimmed !== title) {
      onSave(trimmed);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedTitle(title);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <input
          ref={inputRef}
          type="text"
          value={editedTitle}
          onChange={(e) => setEditedTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleSave}
          className="flex-1 px-2 py-1 text-sm border border-input rounded bg-background focus:outline-none focus:ring-2 focus:ring-ring min-w-0"
        />
        <button
          onMouseDown={(e) => e.preventDefault()}
          onClick={handleSave}
          className="p-1 text-green-600 hover:text-green-700 hover:bg-muted rounded transition-colors"
          title="Save"
        >
          <Check size={14} />
        </button>
        <button
          onMouseDown={(e) => e.preventDefault()}
          onClick={handleCancel}
          className="p-1 text-red-600 hover:text-red-700 hover:bg-muted rounded transition-colors"
          title="Cancel"
        >
          <X size={14} />
        </button>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 group ${className}`}>
      <span
        className="text-lg font-semibold cursor-pointer hover:text-primary transition-colors"
        onClick={() => setIsEditing(true)}
        onDoubleClick={() => setIsEditing(true)}
        title="Click to edit title"
      >
        {title}
      </span>
      <button
        onClick={() => setIsEditing(true)}
        className="p-1 opacity-0 group-hover:opacity-100 hover:bg-muted rounded transition-opacity"
        title="Edit title"
      >
        <Edit3 size={14} className="text-muted-foreground" />
      </button>
    </div>
  );
};
