/**
 * ThreadListContainer - Container component for ThreadList
 * Handles business logic and local UI state per SCREENSETS.md guidelines
 */

import React, { useState } from 'react';
import { useTranslation } from '@hai3/uicore';
import { ThreadList, type ChatThread } from '../uikit/components/ThreadList';
import { formatTimestamp } from '../utils/formatters';
import { CHAT_COPY_SCREENSET_ID } from '../chatCopyScreenset';

export interface ThreadListContainerProps {
  threads: ChatThread[];
  selectedThreadId?: string;
  onThreadSelect: (threadId: string) => void;
  onNewThread: () => void;
  onDeleteThread?: (threadId: string) => void;
  onTitleEdit?: (threadId: string, newTitle: string) => void;
  onReorder?: (threads: ChatThread[]) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  className?: string;
}

export const ThreadListContainer: React.FC<ThreadListContainerProps> = ({
  threads,
  selectedThreadId,
  onThreadSelect,
  onNewThread,
  onDeleteThread,
  onTitleEdit,
  onReorder,
  searchQuery,
  onSearchChange,
  className = '',
}) => {
  const { t } = useTranslation();
  const tk = (key: string) => t(`screenset.${CHAT_COPY_SCREENSET_ID}:screens.chat-copy.${key}`);

  // Local UI state for editing
  const [editingThreadId, setEditingThreadId] = useState<string | null>(null);
  const [editedTitle, setEditedTitle] = useState('');

  // Local UI state for drag & drop
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleEditStart = (threadId: string, title: string, e: React.MouseEvent): void => {
    e.stopPropagation();
    setEditingThreadId(threadId);
    setEditedTitle(title);
  };

  const handleEditSave = (threadId: string): void => {
    const trimmed = editedTitle.trim();
    const thread = threads.find((t) => t.id === threadId);
    if (trimmed && thread && trimmed !== thread.title) {
      onTitleEdit?.(threadId, trimmed);
    }
    setEditingThreadId(null);
    setEditedTitle('');
  };

  const handleEditCancel = (): void => {
    setEditingThreadId(null);
    setEditedTitle('');
  };

  const handleDragStart = (index: number): void => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number): void => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newThreads = [...threads];
    const draggedThread = newThreads[draggedIndex];
    newThreads.splice(draggedIndex, 1);
    newThreads.splice(index, 0, draggedThread);

    onReorder?.(newThreads);
    setDraggedIndex(index);
  };

  const handleDragEnd = (): void => {
    setDraggedIndex(null);
  };

  const formatTimestampWithTranslation = (date: Date): string => {
    return formatTimestamp(date, tk);
  };

  return (
    <ThreadList
      threads={threads}
      selectedThreadId={selectedThreadId}
      editingThreadId={editingThreadId}
      editedTitle={editedTitle}
      draggedIndex={draggedIndex}
      searchQuery={searchQuery}
      formatTimestamp={formatTimestampWithTranslation}
      onThreadSelect={onThreadSelect}
      onNewThread={onNewThread}
      onDeleteThread={onDeleteThread}
      onEditStart={handleEditStart}
      onEditSave={handleEditSave}
      onEditCancel={handleEditCancel}
      onEditedTitleChange={setEditedTitle}
      onSearchChange={onSearchChange}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      tk={tk}
      className={className}
    />
  );
};
