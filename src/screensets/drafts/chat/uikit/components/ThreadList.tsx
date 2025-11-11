/**
 * ThreadList - Thread list with drag-and-drop and inline editing (Presentational)
 * Pure UI component - state managed by parent per UIKIT.md guidelines
 */

import React from 'react';
import { Plus, Search, Edit3, Trash2, Clock, GripVertical } from 'lucide-react';
import { Button, Input } from '@hai3/uikit';
import { ButtonVariant, ButtonSize } from '@hai3/uikit-contracts';

export interface ChatThread {
  id: string;
  title: string;
  preview: string;
  timestamp: Date;
  isTemporary: boolean;
}

export interface ThreadListProps {
  threads: ChatThread[];
  selectedThreadId?: string;
  editingThreadId: string | null;
  editedTitle: string;
  draggedIndex: number | null;
  searchQuery: string;
  formatTimestamp: (date: Date) => string;
  onThreadSelect: (threadId: string) => void;
  onNewThread: () => void;
  onDeleteThread?: (threadId: string) => void;
  onEditStart: (threadId: string, title: string, e: React.MouseEvent) => void;
  onEditSave: (threadId: string) => void;
  onEditCancel: () => void;
  onEditedTitleChange: (value: string) => void;
  onSearchChange: (query: string) => void;
  onDragStart: (index: number) => void;
  onDragOver: (e: React.DragEvent, index: number) => void;
  onDragEnd: () => void;
  tk: (key: string) => string;
  className?: string;
}

export const ThreadList: React.FC<ThreadListProps> = ({
  threads,
  selectedThreadId,
  editingThreadId,
  editedTitle,
  draggedIndex,
  searchQuery,
  formatTimestamp,
  onThreadSelect,
  onNewThread,
  onDeleteThread,
  onEditStart,
  onEditSave,
  onEditCancel,
  onEditedTitleChange,
  onSearchChange,
  onDragStart,
  onDragOver,
  onDragEnd,
  tk,
  className = '',
}) => {
  return (
    <div className={`flex flex-col h-full bg-card ${className}`}>
      {/* Header */}
      <div className="px-4 py-3 border-b border-border h-16 flex items-center">
        <div className="flex items-center justify-between flex-1">
          <h2 className="text-lg font-semibold overflow-hidden text-ellipsis whitespace-nowrap">
            {tk('recent_chats')}
          </h2>
          <Button
            variant={ButtonVariant.Ghost}
            size={ButtonSize.Icon}
            onClick={onNewThread}
            aria-label={tk('new_chat')}
          >
            <Plus size={16} />
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 py-3 border-b border-border">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder={tk('search_chats')}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full ps-9"
          />
        </div>
      </div>

      {/* Thread List */}
      <div className="flex-1 overflow-y-auto">
        {threads.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground text-sm">
            {tk('no_chats')}
          </div>
        ) : (
          threads.map((thread, index) => {
            const isSelected = thread.id === selectedThreadId;
            const isEditing = thread.id === editingThreadId;
            const isDragging = draggedIndex === index;

            return (
              <div
                key={thread.id}
                draggable={!isEditing}
                onDragStart={() => onDragStart(index)}
                onDragOver={(e) => onDragOver(e, index)}
                onDragEnd={onDragEnd}
                onClick={() => !isEditing && onThreadSelect(thread.id)}
                className={`
                  px-4 py-3 border-b border-border cursor-pointer transition-colors
                  ${isSelected ? 'bg-muted' : 'hover:bg-muted/50'}
                  ${isDragging ? 'opacity-50' : ''}
                `}
              >
                <div className="flex items-start gap-3">
                  {/* Drag Handle */}
                  <div className="pt-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing">
                    <GripVertical size={16} className="text-muted-foreground" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      {/* Title */}
                      <div className="flex-1 min-w-0 flex items-center gap-2">
                        {isEditing ? (
                          <Input
                            type="text"
                            value={editedTitle}
                            onChange={(e) => onEditedTitleChange(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                onEditSave(thread.id);
                              } else if (e.key === 'Escape') {
                                e.preventDefault();
                                onEditCancel();
                              }
                            }}
                            onBlur={() => onEditSave(thread.id)}
                            onClick={(e) => e.stopPropagation()}
                            className="flex-1"
                            autoFocus
                          />
                        ) : (
                          <>
                            <span className="font-medium truncate">{thread.title}</span>
                            {thread.isTemporary && (
                              <Clock size={14} className="text-muted-foreground flex-shrink-0" />
                            )}
                          </>
                        )}
                      </div>

                      {/* Actions */}
                      {!isEditing && (
                        <div className="flex items-center gap-1">
                          {onDeleteThread && (
                            <Button
                              variant={ButtonVariant.Ghost}
                              size={ButtonSize.Icon}
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteThread(thread.id);
                              }}
                              className="opacity-0 group-hover:opacity-100"
                              aria-label={tk('delete_chat')}
                            >
                              <Trash2 size={14} />
                            </Button>
                          )}
                          <Button
                            variant={ButtonVariant.Ghost}
                            size={ButtonSize.Icon}
                            onClick={(e) => onEditStart(thread.id, thread.title, e)}
                            className="opacity-0 group-hover:opacity-100"
                            aria-label={tk('edit_title')}
                          >
                            <Edit3 size={14} />
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Preview & Timestamp */}
                    {!isEditing && (
                      <div className="flex items-center justify-between gap-2 mt-1">
                        <p className="text-sm text-muted-foreground truncate">{thread.preview}</p>
                        <span className="text-xs text-muted-foreground flex-shrink-0">
                          {formatTimestamp(thread.timestamp)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
