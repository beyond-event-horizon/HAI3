/**
 * ChatScreen - Main chat interface
 * Implements a full-featured chat UI with threads, messages, and controls
 */

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Send,
  Copy,
  Edit3,
  RotateCcw,
  ThumbsUp,
  ThumbsDown,
  Trash2,
  User,
  Bot,
  Code,
} from 'lucide-react';
import {
  Button,
  Textarea,
  Skeleton,
} from '@hai3/uikit';
import { ButtonVariant, ButtonSize } from '@hai3/uikit-contracts';
import { TextLoader, useAppSelector, useTranslation } from '@hai3/uicore';
import * as chatActions from '../../actions/chatActions';
import type { AttachedFile } from '../../types';
import '../../chatStore'; // Import for module augmentation side effect
import { ModelSelector } from '../../uikit/components/ModelSelector';
import { TemporaryChatToggle } from '../../uikit/components/TemporaryChatToggle';
import { ChatTitleEditor } from '../../uikit/components/ChatTitleEditor';
import { EnhancedThreadList, type EnhancedChatThread } from '../../uikit/components/EnhancedThreadList';
import {
  EnhancedContextSelector,
  SelectedContextsDisplay,
} from '../../uikit/components/EnhancedContextSelector';
import {
  FileAttachmentButton,
  FileAttachmentPreview,
  MessageFileDisplay,
} from '../../uikit/components/FileAttachment';
import { MarkdownRenderer } from '../../uikit/components/MarkdownRenderer';

export const CHAT_SCREEN_ID = 'chat';

const ChatScreenInternal: React.FC = () => {
  const { t, translationsReady } = useTranslation();
  const tk = (key: string) => t(`screenset.chat:screens.chat.${key}`);
  
  const [isMenuCollapsed, setIsMenuCollapsed] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const editTextareaRef = useRef<HTMLTextAreaElement>(null);
  const [hoveredMessage, setHoveredMessage] = useState<string | null>(null);
  const [isContextSelectorOpen, setIsContextSelectorOpen] = useState(false);
  const [isTitleEditing, setIsTitleEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');

  // Subscribe to Redux state from global uicore store
  // Chat slice was dynamically registered and RootState augmented in types.ts
  const chat = useAppSelector((state) => state.chat);
  const {
    threads,
    messages,
    currentThreadId,
    currentModel,
    currentContext,
    inputValue,
    isStreaming,
    attachedFiles,
    editingMessageId,
    editedContent,
  } = chat;

  // Get messages for current thread
  const currentMessages = messages.filter((m) => m.threadId === currentThreadId);

  // Auto-scroll to bottom when new messages arrive or thread changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages.length, currentThreadId]);

  // Get current thread
  const currentThread = useMemo(
    () => threads.find((t) => t.id === currentThreadId) || { isTemporary: false, title: 'New Chat' },
    [threads, currentThreadId]
  );

  // Handlers
  const handleThreadSelect = useCallback((threadId: string) => {
    chatActions.selectThread(threadId);
  }, []);

  const handleNewThread = useCallback(() => {
    const isTemporary = currentThread?.isTemporary || false;
    chatActions.createThread(isTemporary);
  }, [currentThread]);

  const handleDeleteThread = useCallback((threadId: string) => {
    chatActions.deleteThread(threadId);
  }, []);

  const handleSendMessage = useCallback(() => {
    if (!isStreaming && (inputValue.trim() || attachedFiles.length > 0)) {
      chatActions.sendMessage(inputValue);
    }
  }, [inputValue, isStreaming, attachedFiles.length]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    chatActions.changeInputValue(value);
  }, []);

  const handleModelChange = useCallback((model: string) => {
    chatActions.changeModel(model);
  }, []);

  const handleAddContext = useCallback((contextId: string) => {
    chatActions.addContext(contextId);
  }, []);

  const handleRemoveContext = useCallback((contextId: string) => {
    chatActions.removeContext(contextId);
  }, []);

  const handleFileSelect = useCallback((file: AttachedFile) => {
    chatActions.attachFile(file);
  }, []);

  const handleFileRemove = useCallback((fileId: string) => {
    chatActions.removeFile(fileId);
  }, []);

  const handleTitleEditStart = useCallback(() => {
    if (currentThread) {
      setIsTitleEditing(true);
      setEditedTitle(currentThread.title);
    }
  }, [currentThread]);

  const handleTitleSave = useCallback((newTitle: string) => {
    if (currentThreadId && newTitle.trim()) {
      chatActions.updateThreadTitle(currentThreadId, newTitle.trim());
    }
    setIsTitleEditing(false);
    setEditedTitle('');
  }, [currentThreadId]);

  const handleTitleCancel = useCallback(() => {
    setIsTitleEditing(false);
    setEditedTitle('');
  }, []);

  const handleThreadTitleEdit = useCallback((threadId: string, newTitle: string) => {
    chatActions.updateThreadTitle(threadId, newTitle);
  }, []);

  const handleTemporaryToggle = useCallback((isTemporary: boolean) => {
    if (currentThreadId) {
      chatActions.toggleThreadTemporary(currentThreadId, isTemporary);
    }
  }, [currentThreadId]);

  const handleThreadReorder = useCallback((newThreads: EnhancedChatThread[]) => {
    chatActions.reorderThreads(newThreads);
  }, []);

  const handleKeyPress = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isStreaming && (inputValue.trim() || attachedFiles.length > 0)) {
        chatActions.sendMessage(inputValue);
      }
    }
  }, [isStreaming, inputValue, attachedFiles.length]);

  const handleCopyMessage = useCallback((content: string) => {
    navigator.clipboard.writeText(content);
  }, []);

  const handleEditMessage = useCallback((messageId: string) => {
    const message = currentMessages.find(m => m.id === messageId);
    if (message) {
      chatActions.startEditingMessage(messageId, message.content);
    }
  }, [currentMessages]);

  const handleEditedContentChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    chatActions.updateEditedContent(e.target.value);
  }, []);

  const handleSaveEdit = useCallback(() => {
    if (editingMessageId && editedContent.trim()) {
      chatActions.saveEditedMessage(editingMessageId, editedContent);
    }
  }, [editingMessageId, editedContent]);

  const handleCancelEdit = useCallback(() => {
    chatActions.cancelEditingMessage();
  }, []);

  const handleLikeMessage = useCallback((messageId: string) => {
    chatActions.likeMessage(messageId);
  }, []);

  const handleDislikeMessage = useCallback((messageId: string) => {
    chatActions.dislikeMessage(messageId);
  }, []);

  const handleRegenerateMessage = useCallback((messageId: string) => {
    chatActions.regenerateMessage(messageId);
  }, []);

  const handleDeleteMessage = useCallback((messageId: string) => {
    chatActions.deleteMessage(messageId);
  }, []);

  const handleToggleViewMode = useCallback((messageId: string) => {
    chatActions.toggleMessageViewMode(messageId);
  }, []);

  return (
    <div className="flex h-full bg-background">
      {/* Left sidebar - Thread list */}
      <div
        className={`border-r border-border bg-card transition-all duration-300 ${
          isMenuCollapsed ? 'w-0' : 'w-80'
        } overflow-hidden flex-shrink-0`}
      >
        <EnhancedThreadList
          threads={threads}
          currentThreadId={currentThreadId}
          onThreadSelect={handleThreadSelect}
          onNewThread={handleNewThread}
          onThreadDelete={handleDeleteThread}
          onThreadTitleEdit={handleThreadTitleEdit}
          onReorder={handleThreadReorder}
          heading={
            <TextLoader skeletonClassName="h-7 w-32">
              {tk('recent_chats')}
            </TextLoader>
          }
          newThreadLabel={tk('new_thread')}
          searchPlaceholder={translationsReady ? tk('search_threads') : undefined}
          tempIndicator={
            <TextLoader skeletonClassName="text-xs w-12" inheritColor>
              {tk('temp_indicator')}
            </TextLoader>
          }
          editLabel={tk('edit_message')}
          deleteLabel={tk('delete_thread')}
          noMatchingChatsMessage={
            <TextLoader skeletonClassName="h-4 w-40">
              {tk('no_matching_chats')}
            </TextLoader>
          }
          noChatsYetMessage={
            <TextLoader skeletonClassName="h-4 w-24">
              {tk('no_chats_yet')}
            </TextLoader>
          }
          className="h-full"
        />
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header with collapse button and editable title */}
        <div className="border-b border-border px-4 py-3 flex items-center gap-4 bg-card">
          <Button
            variant={ButtonVariant.Ghost}
            size={ButtonSize.Icon}
            onClick={() => setIsMenuCollapsed(!isMenuCollapsed)}
            aria-label={isMenuCollapsed ? tk('expand_menu') : tk('collapse_menu')}
            className="[&_svg]:size-5"
          >
            {isMenuCollapsed ? <ChevronRight /> : <ChevronLeft />}
          </Button>
          <div className="flex-1 min-w-0">
            {currentThread && (
              <ChatTitleEditor
                title={currentThread.title}
                isEditing={isTitleEditing}
                editedTitle={editedTitle}
                onEditStart={handleTitleEditStart}
                onTitleChange={setEditedTitle}
                onSave={() => handleTitleSave(editedTitle)}
                onCancel={handleTitleCancel}
                editLabel={tk('edit_title')}
                saveLabel={tk('save')}
                cancelLabel={tk('cancel')}
                placeholderLabel={tk('click_to_edit_title')}
              />
            )}
          </div>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto p-6 bg-muted">
          {currentMessages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-muted-foreground">
                <TextLoader skeletonClassName="h-7 w-48 mx-auto mb-2">
                  <p className="text-lg mb-2">{tk('no_messages')}</p>
                </TextLoader>
                <TextLoader skeletonClassName="h-5 w-96 mx-auto">
                  <p className="text-sm">{tk('no_messages_description')}</p>
                </TextLoader>
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto">
              {currentMessages.map((message) => (
                <div
                  key={message.id}
                  className="mb-8 group"
                  onMouseEnter={() => setHoveredMessage(message.id)}
                  onMouseLeave={() => setHoveredMessage(null)}
                >
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center [&_svg]:size-4 ${
                          message.type === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-secondary text-secondary-foreground'
                        }`}
                      >
                        {message.type === 'user' ? <User /> : <Bot />}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      {editingMessageId === message.id ? (
                        <div className="space-y-3">
                          <Textarea
                            ref={editTextareaRef}
                            value={editedContent}
                            onChange={handleEditedContentChange}
                            autoResize
                            minHeight={50}
                            maxHeight={350}
                            className="w-full resize-none overflow-y-auto leading-normal"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={handleSaveEdit}
                              className="px-3 py-1 bg-primary text-primary-foreground text-sm rounded hover:bg-primary/90 transition-colors"
                            >
                              <TextLoader skeletonClassName="h-4 w-12" inheritColor>
                                {tk('save')}
                              </TextLoader>
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="px-3 py-1 bg-secondary text-secondary-foreground text-sm rounded hover:bg-secondary/90 transition-colors"
                            >
                              <TextLoader skeletonClassName="h-4 w-14" inheritColor>
                                {tk('cancel')}
                              </TextLoader>
                            </button>
                          </div>
                        </div>
                      ) : message.content === '' && isStreaming ? (
                        <Skeleton className="h-6 w-32" />
                      ) : (
                        <>
                          {message.showRawMarkdown ? (
                            <pre className="whitespace-pre-wrap font-mono text-sm bg-muted p-3 rounded-lg">
                              {message.content}
                            </pre>
                          ) : (
                            <MarkdownRenderer content={message.content} />
                          )}
                          {message.files && <MessageFileDisplay files={message.files} />}
                        </>
                      )}

                      {/* Message Actions */}
                      {editingMessageId !== message.id && (
                        <div className="flex items-center gap-1 mt-2">
                        {/* Always visible copy button */}
                        <button
                          onClick={() => handleCopyMessage(message.content)}
                          className="p-1.5 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground [&_svg]:size-3.5"
                          title={tk('copy_message')}
                        >
                          <Copy />
                        </button>

                        {/* Additional buttons visible on hover or when liked/disliked/raw view */}
                        <div
                          className={`flex items-center gap-1 transition-opacity duration-200 ${
                            hoveredMessage === message.id || message.liked || message.disliked || message.showRawMarkdown ? 'opacity-100' : 'opacity-0'
                          }`}
                        >
                          <button
                            onClick={() => handleToggleViewMode(message.id)}
                            className={`p-1.5 hover:bg-muted rounded-lg transition-colors [&_svg]:size-3.5 ${
                              message.showRawMarkdown
                                ? 'bg-muted text-foreground'
                                : 'text-muted-foreground hover:text-foreground'
                            }`}
                            title={message.showRawMarkdown ? tk('show_markdown_view') : tk('show_raw_markdown')}
                          >
                            <Code />
                          </button>
                          <button
                            onClick={() => handleEditMessage(message.id)}
                            className="p-1.5 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground [&_svg]:size-3.5"
                            title={tk('edit_message')}
                          >
                            <Edit3 />
                          </button>
                          {message.type === 'assistant' && (
                            <button
                              onClick={() => handleRegenerateMessage(message.id)}
                              className="p-1.5 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground [&_svg]:size-3.5"
                              title={tk('regenerate_response')}
                            >
                              <RotateCcw />
                            </button>
                          )}
                          {message.type === 'assistant' && (
                            <>
                              <button
                                onClick={() => handleLikeMessage(message.id)}
                                className={`p-1.5 hover:bg-muted rounded-lg transition-colors [&_svg]:size-3.5 ${
                                  message.liked
                                    ? 'text-green-600 dark:text-green-500'
                                    : 'text-muted-foreground hover:text-foreground'
                                }`}
                                title={tk('like_message')}
                              >
                                <ThumbsUp 
                                  fill={message.liked ? 'currentColor' : 'none'}
                                />
                              </button>
                              <button
                                onClick={() => handleDislikeMessage(message.id)}
                                className={`p-1.5 hover:bg-muted rounded-lg transition-colors [&_svg]:size-3.5 ${
                                  message.disliked
                                    ? 'text-red-600 dark:text-red-500'
                                    : 'text-muted-foreground hover:text-foreground'
                                }`}
                                title={tk('dislike_message')}
                              >
                                <ThumbsDown 
                                  fill={message.disliked ? 'currentColor' : 'none'}
                                />
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => handleDeleteMessage(message.id)}
                            className="p-1.5 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-destructive [&_svg]:size-3.5"
                            title={tk('delete_message')}
                          >
                            <Trash2 />
                          </button>
                        </div>
                      </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}


              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input area with controls */}
        <div className="border-t border-border bg-card px-4 py-3">
          <div className="max-w-3xl mx-auto space-y-3">
            {/* Model and temporary chat toggle */}
            <div className="flex items-center gap-3">
              <ModelSelector
                value={currentModel}
                onChange={handleModelChange}
                placeholder={tk('select_model')}
                disabled={isStreaming}
              >
                <TextLoader skeletonClassName="h-4 w-12" inheritColor>
                  {tk('model_label')}
                </TextLoader>
              </ModelSelector>
              <TemporaryChatToggle
                value={currentThread?.isTemporary || false}
                onChange={handleTemporaryToggle}
                disabled={isStreaming}
              >
                <TextLoader skeletonClassName="h-4 w-28" inheritColor>
                  {tk('temporary_chat')}
                </TextLoader>
              </TemporaryChatToggle>
            </div>

            {/* Selected contexts display */}
            {currentContext.length > 0 && (
              <SelectedContextsDisplay
                availableContexts={chat.availableContexts}
                selectedContexts={currentContext}
                onRemove={handleRemoveContext}
                removeAriaLabelFormatter={(name) => `Remove ${name}`}
              >
                <TextLoader skeletonClassName="h-4 w-16" inheritColor>
                  {tk('context_label')}
                </TextLoader>
              </SelectedContextsDisplay>
            )}

            {/* File attachments preview */}
            <FileAttachmentPreview
              files={attachedFiles}
              onRemove={handleFileRemove}
              removeLabel={tk('remove_file')}
            />

            {/* Message input */}
            <div className="flex gap-2 items-end">
              <div className="flex-1 relative">
                <Textarea
                  ref={inputRef}
                  value={inputValue}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyPress}
                  placeholder={translationsReady ? tk('message_placeholder') : undefined}
                  disabled={isStreaming}
                  size="sm"
                  autoResize
                  className="w-full pe-20 rounded-lg resize-none overflow-y-auto"
                />
                <div className="absolute end-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <EnhancedContextSelector
                    availableContexts={chat.availableContexts}
                    selectedContexts={currentContext}
                    isOpen={isContextSelectorOpen}
                    onToggleOpen={() => setIsContextSelectorOpen(!isContextSelectorOpen)}
                    onAdd={handleAddContext}
                    onRemove={handleRemoveContext}
                    placeholderLabel={
                      <TextLoader skeletonClassName="h-4 w-20" inheritColor>
                        {tk('add_context')}
                      </TextLoader>
                    }
                    selectContextLabel={
                      <TextLoader skeletonClassName="h-4 w-24">
                        {tk('select_context')}
                      </TextLoader>
                    }
                    disabled={isStreaming}
                  />
                  <FileAttachmentButton
                    onFileSelect={handleFileSelect}
                    disabled={isStreaming}
                    attachLabel={tk('attach_file')}
                  />
                </div>
              </div>
              <Button
                variant={ButtonVariant.Default}
                onClick={handleSendMessage}
                disabled={isStreaming || (!inputValue.trim() && attachedFiles.length === 0)}
                className="h-11 px-4 rounded-lg [&_svg]:size-5"
                aria-label={tk('send_message')}
              >
                <Send />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * ChatScreen - Main chat interface  
 * Uses global Redux store (accessed via HAI3Provider in main.tsx)
 * Chat slice is registered in chatStore.ts
 */
export const ChatScreen: React.FC = ChatScreenInternal;

ChatScreen.displayName = 'ChatScreen';
