/**
 * EnhancedThreadList - Thread list with drag-and-drop reordering and inline editing
 * Screenset-specific component with advanced features
 */

import React, { useState } from 'react';
import { Plus, Search, Edit3, Trash2, Clock, GripVertical } from 'lucide-react';
import { Button } from '@hai3/uikit';
import { ButtonVariant, ButtonSize } from '@hai3/uikit-contracts';

export interface EnhancedChatThread {
  id: string;
  title: string;
  preview: string;
  timestamp: Date;
  isTemporary: boolean;
}

export interface EnhancedThreadListProps {
  threads: EnhancedChatThread[];
  selectedThreadId?: string;
  onThreadSelect: (threadId: string) => void;
  onNewThread: () => void;
  onDeleteThread?: (threadId: string) => void;
  onTitleEdit?: (threadId: string, newTitle: string) => void;
  onReorder?: (threads: EnhancedChatThread[]) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  className?: string;
}

export const EnhancedThreadList: React.FC<EnhancedThreadListProps> = ({
  threads,
  selectedThreadId,
  onThreadSelect,
  onNewThread,
  onDeleteThread,
  onTitleEdit,
  onReorder,
  searchQuery = '',
  onSearchChange,
  className = '',
}) => {
  const [editingThreadId, setEditingThreadId] = useState<string | null>(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const formatTimestamp = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    return date.toLocaleDateString();
  };

  const handleEditStart = (threadId: string, title: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingThreadId(threadId);
    setEditedTitle(title);
  };

  const handleEditSave = (threadId: string) => {
    const trimmed = editedTitle.trim();
    if (trimmed && trimmed !== threads.find((t) => t.id === threadId)?.title) {
      onTitleEdit?.(threadId, trimmed);
    }
    setEditingThreadId(null);
  };

  const handleEditCancel = () => {
    setEditingThreadId(null);
    setEditedTitle('');
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newThreads = [...threads];
    const draggedThread = newThreads[draggedIndex];
    newThreads.splice(draggedIndex, 1);
    newThreads.splice(index, 0, draggedThread);

    onReorder?.(newThreads);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <div className={`flex flex-col h-full bg-card ${className}`}>
      {/* Header */}
      <div className="px-4 py-3 border-b border-border h-16 flex items-center">
        <div className="flex items-center justify-between flex-1">
          <h2 className="text-lg font-semibold overflow-hidden text-ellipsis whitespace-nowrap">Recent Chats</h2>
          <Button
            variant={ButtonVariant.Ghost}
            size={ButtonSize.Icon}
            onClick={onNewThread}
            aria-label="New chat"
          >
            <Plus size={16} />
          </Button>
        </div>

        {/* Search */}
        {onSearchChange && (
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-input rounded-lg text-sm bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
        )}
      </div>

      {/* Thread list */}
      <div className="flex-1 overflow-y-auto">
        {threads.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground text-sm">
            No chats yet. Start a new conversation!
          </div>
        ) : (
          threads.map((thread, index) => (
            <div
              key={thread.id}
              draggable={!editingThreadId}
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              onClick={() => !editingThreadId && onThreadSelect(thread.id)}
              className={`group relative p-3 border-b border-border cursor-pointer transition-colors hover:bg-muted/50 ${
                selectedThreadId === thread.id ? 'bg-muted' : ''
              } ${draggedIndex === index ? 'opacity-50' : ''}`}
            >
              <div className="flex items-start gap-2">
                {/* Drag handle */}
                <div className="flex-shrink-0 pt-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing">
                  <GripVertical size={14} className="text-muted-foreground" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    {editingThreadId === thread.id ? (
                      <input
                        type="text"
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleEditSave(thread.id);
                          } else if (e.key === 'Escape') {
                            e.preventDefault();
                            handleEditCancel();
                          }
                        }}
                        onBlur={() => handleEditSave(thread.id)}
                        onClick={(e) => e.stopPropagation()}
                        className="flex-1 px-2 py-1 text-sm border border-input rounded bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                        autoFocus
                      />
                    ) : (
                      <h3
                        className="font-medium text-sm truncate flex-1"
                        onDoubleClick={(e) => handleEditStart(thread.id, thread.title, e)}
                        title="Double-click to edit"
                      >
                        {thread.title}
                        {thread.isTemporary && (
                          <span className="ml-2 text-xs text-muted-foreground">(Temp)</span>
                        )}
                      </h3>
                    )}

                    {/* Timestamp and actions */}
                    <div className="flex items-center gap-1">
                      {thread.isTemporary && (
                        <Clock size={12} className="text-orange-400" />
                      )}
                      <span className="text-xs text-muted-foreground whitespace-nowrap group-hover:opacity-0 transition-opacity">
                        {formatTimestamp(thread.timestamp)}
                      </span>

                      {/* Action buttons */}
                      <div className="absolute right-3 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                        {onTitleEdit && (
                          <button
                            onClick={(e) => handleEditStart(thread.id, thread.title, e)}
                            className="p-1 hover:bg-muted rounded transition-colors"
                            title="Edit title"
                          >
                            <Edit3 size={12} className="text-muted-foreground" />
                          </button>
                        )}
                        {onDeleteThread && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteThread(thread.id);
                            }}
                            className="p-1 hover:bg-destructive/10 rounded transition-colors"
                            title="Delete chat"
                          >
                            <Trash2 size={12} className="text-destructive" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground truncate">
                    {thread.preview}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
