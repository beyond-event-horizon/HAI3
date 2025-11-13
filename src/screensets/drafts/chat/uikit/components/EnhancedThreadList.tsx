/**
 * EnhancedThreadList - Thread list with drag-and-drop reordering and inline editing
 * Screenset-specific component with advanced features
 */

import React, { useState } from 'react';
import { Plus, Search, Edit3, Trash2, Clock, GripVertical } from 'lucide-react';
import { Button } from '@hai3/uikit';
import { ButtonVariant, ButtonSize } from '@hai3/uikit-contracts';
// All styles are now inline - no design tokens needed

export interface EnhancedChatThread {
  id: string;
  title: string;
  preview: string;
  timestamp: Date;
  isTemporary: boolean;
}

export interface EnhancedThreadListProps {
  threads: EnhancedChatThread[];
  currentThreadId: string | null;
  onThreadSelect: (threadId: string) => void;
  onNewThread: () => void;
  onThreadDelete: (threadId: string) => void;
  onThreadTitleEdit: (threadId: string, newTitle: string) => void;
  onReorder: (newThreads: EnhancedChatThread[]) => void;
  heading?: React.ReactNode;
  newThreadLabel?: string;
  searchPlaceholder?: string;
  tempIndicator?: React.ReactNode;
  editLabel?: string;
  deleteLabel?: string;
  noMatchingChatsMessage?: React.ReactNode;
  noChatsYetMessage?: React.ReactNode;
  className?: string;
}

export const EnhancedThreadList: React.FC<EnhancedThreadListProps> = ({
  threads,
  currentThreadId,
  onThreadSelect,
  onNewThread,
  onThreadDelete,
  onThreadTitleEdit,
  onReorder,
  heading,
  newThreadLabel = 'New Thread',
  searchPlaceholder,
  tempIndicator,
  editLabel = 'Edit',
  deleteLabel = 'Delete',
  noMatchingChatsMessage,
  noChatsYetMessage,
  className = '',
}) => {
  const [editingThreadId, setEditingThreadId] = useState<string | null>(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter threads based on search query
  const filteredThreads = threads.filter((thread) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      thread.title.toLowerCase().includes(query) ||
      thread.preview.toLowerCase().includes(query)
    );
  });

  const formatTimestamp = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'just now';
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
      onThreadTitleEdit?.(threadId, trimmed);
    }
    setEditingThreadId(null);
  };

  const handleEditCancel = () => {
    setEditingThreadId(null);
    setEditedTitle('');
  };

  const handleDragStart = (threadId: string) => {
    const index = threads.findIndex(t => t.id === threadId);
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, targetThreadId: string) => {
    e.preventDefault();
    if (draggedIndex === null) return;

    const targetIndex = threads.findIndex(t => t.id === targetThreadId);
    if (draggedIndex === targetIndex) return;

    const newThreads = [...threads];
    const draggedThread = newThreads[draggedIndex];
    newThreads.splice(draggedIndex, 1);
    newThreads.splice(targetIndex, 0, draggedThread);

    onReorder?.(newThreads);
    setDraggedIndex(targetIndex);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <div className={`flex flex-col h-full bg-card ${className}`}>
      {/* Header */}
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        {heading && <h2 className="text-lg font-semibold">{heading}</h2>}
        <Button
          variant={ButtonVariant.Default}
          size={ButtonSize.Icon}
          onClick={onNewThread}
          aria-label={newThreadLabel}
          className="[&_svg]:size-4"
        >
          <Plus />
        </Button>
      </div>

      {/* Search */}
      <div className="px-4 py-2 border-b border-border">
        <div className="relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none [&_svg]:size-4">
            <Search />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full h-9 pl-9 pr-3 py-2 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      {/* Thread list */}
      <div className="flex-1 overflow-y-auto">
        {filteredThreads.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground text-sm">
            {searchQuery ? noMatchingChatsMessage : noChatsYetMessage}
          </div>
        ) : (
          filteredThreads.map((thread) => {
            const originalIndex = threads.findIndex(t => t.id === thread.id);
            return (
            <div
              key={thread.id}
              draggable={!editingThreadId}
              onDragStart={() => handleDragStart(thread.id)}
              onDragOver={(e) => handleDragOver(e, thread.id)}
              onDragEnd={handleDragEnd}
              onClick={() => !editingThreadId && onThreadSelect(thread.id)}
              className={`group relative p-3 border-b border-border cursor-pointer transition-colors hover:bg-muted/50 ${
                currentThreadId === thread.id ? 'bg-muted' : ''
              } ${draggedIndex === originalIndex ? 'opacity-50' : ''}`}
            >
              <div className="flex items-start gap-2">
                {/* Drag handle */}
                <div className="flex-shrink-0 pt-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing [&_svg]:size-3.5">
                  <GripVertical className="text-muted-foreground" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
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
                        title="Double click to edit"
                      >
                        {thread.title}
                        {thread.isTemporary && (
                          <span className="ms-2 text-xs text-muted-foreground">{tempIndicator}</span>
                        )}
                      </h3>
                    )}

                    {/* Timestamp and actions */}
                    <div className="flex items-center gap-1 group-hover:opacity-0 transition-opacity">
                      {thread.isTemporary && (
                        <div className="[&_svg]:size-3.5 text-orange-600 dark:text-orange-500">
                          <Clock />
                        </div>
                      )}
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {formatTimestamp(thread.timestamp)}
                      </span>
                    </div>

                    {/* Action buttons */}
                    <div className="absolute end-3 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                      <Button
                        variant={ButtonVariant.Ghost}
                        size={ButtonSize.Icon}
                        onClick={(e) => handleEditStart(thread.id, thread.title, e)}
                        className="h-6 w-6 [&_svg]:size-3.5"
                        aria-label={editLabel}
                      >
                        <Edit3 />
                      </Button>
                      <Button
                        variant={ButtonVariant.Ghost}
                        size={ButtonSize.Icon}
                        onClick={(e) => {
                          e.stopPropagation();
                          onThreadDelete(thread.id);
                        }}
                        className="h-6 w-6 [&_svg]:size-3.5 text-destructive"
                        aria-label={deleteLabel}
                      >
                        <Trash2 className="text-destructive" />
                      </Button>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground truncate">
                    {thread.preview}
                  </p>
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
