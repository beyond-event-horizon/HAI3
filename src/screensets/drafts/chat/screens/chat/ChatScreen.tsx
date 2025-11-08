/**
 * ChatScreen - Main chat interface
 * Implements a full-featured chat UI with threads, messages, and controls
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
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
import { chatStore, type AttachedFile } from '../../store/chatStore';
import { useChatStore } from '../../hooks/useChatStore';
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

export const ChatScreen: React.FC = () => {
  const [isMenuCollapsed, setIsMenuCollapsed] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const editTextareaRef = useRef<HTMLTextAreaElement>(null);
  const [hoveredMessage, setHoveredMessage] = useState<string | null>(null);

  // Subscribe to store state
  const threads = useChatStore((state) => state.threads);
  const messages = useChatStore((state) => state.messages);
  const currentThreadId = useChatStore((state) => state.currentThreadId);
  const currentModel = useChatStore((state) => state.currentModel);
  const currentContext = useChatStore((state) => state.currentContext);
  const inputValue = useChatStore((state) => state.inputValue);
  const isStreaming = useChatStore((state) => state.isStreaming);
  const attachedFiles = useChatStore((state) => state.attachedFiles);
  const editingMessageId = useChatStore((state) => state.editingMessageId);
  const editedContent = useChatStore((state) => state.editedContent);

  // Get messages for current thread
  const currentMessages = messages.filter((m) => m.threadId === currentThreadId);

  // Auto-scroll to bottom when new messages arrive or thread changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages.length, currentThreadId]);

  // Get current thread
  const currentThread = threads.find((t) => t.id === currentThreadId);

  // Convert threads to EnhancedChatThread format
  const chatThreads: EnhancedChatThread[] = threads.map((t) => ({
    id: t.id,
    title: t.title,
    preview: t.preview,
    timestamp: t.timestamp,
    isTemporary: t.isTemporary,
  }));

  // Auto-resize textarea
  const autoResize = useCallback(() => {
    if (inputRef.current) {
      // Reset height to get accurate scrollHeight
      inputRef.current.style.height = '50px';
      // Calculate the actual content height
      const scrollHeight = inputRef.current.scrollHeight;
      // Only resize if content exceeds the minimum height
      if (scrollHeight > 50) {
        inputRef.current.style.height = `${Math.min(scrollHeight, 350)}px`;
      }
    }
  }, []);

  // Handlers
  const handleThreadSelect = useCallback((threadId: string) => {
    chatStore.selectThread(threadId);
  }, []);

  const handleNewThread = useCallback(() => {
    const isTemporary = currentThread?.isTemporary || false;
    chatStore.createThread(isTemporary);
  }, [currentThread]);

  const handleDeleteThread = useCallback((threadId: string) => {
    chatStore.deleteThread(threadId);
  }, []);

  const handleSendMessage = useCallback(() => {
    if (!isStreaming && (inputValue.trim() || attachedFiles.length > 0)) {
      chatStore.sendMessage(inputValue);
      // Reset height to initial 50px after sending
      if (inputRef.current) {
        inputRef.current.style.height = '50px';
      }
    }
  }, [inputValue, isStreaming, attachedFiles.length]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    chatStore.setInputValue(value);
    autoResize();
  }, [autoResize]);

  // Only auto-resize when there's actual content, not on mount
  useEffect(() => {
    if (inputValue) {
      autoResize();
    } else if (inputRef.current) {
      // Reset to initial height when empty
      inputRef.current.style.height = '50px';
    }
  }, [inputValue, autoResize]);

  // Auto-resize edit textarea when editing starts
  useEffect(() => {
    if (editingMessageId && editTextareaRef.current && editedContent) {
      editTextareaRef.current.style.height = '50px';
      const scrollHeight = editTextareaRef.current.scrollHeight;
      if (scrollHeight > 50) {
        editTextareaRef.current.style.height = `${Math.min(scrollHeight, 350)}px`;
      }
    }
  }, [editingMessageId, editedContent]);

  const handleModelChange = useCallback((model: string) => {
    chatStore.setModel(model);
  }, []);

  const handleAddContext = useCallback((contextId: string) => {
    chatStore.addContext(contextId);
  }, []);

  const handleRemoveContext = useCallback((contextId: string) => {
    chatStore.removeContext(contextId);
  }, []);

  const handleFileSelect = useCallback((file: AttachedFile) => {
    chatStore.attachFile(file);
  }, []);

  const handleFileRemove = useCallback((fileId: string) => {
    chatStore.removeFile(fileId);
  }, []);

  const handleTitleSave = useCallback((newTitle: string) => {
    if (currentThreadId) {
      chatStore.updateThreadTitle(currentThreadId, newTitle);
    }
  }, [currentThreadId]);

  const handleThreadTitleEdit = useCallback((threadId: string, newTitle: string) => {
    chatStore.updateThreadTitle(threadId, newTitle);
  }, []);

  const handleTemporaryToggle = useCallback((isTemporary: boolean) => {
    chatStore.toggleCurrentThreadTemporary(isTemporary);
  }, []);

  const handleThreadReorder = useCallback((newThreads: EnhancedChatThread[]) => {
    chatStore.reorderThreads(newThreads);
  }, []);

  const handleKeyPress = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isStreaming && (inputValue.trim() || attachedFiles.length > 0)) {
        chatStore.sendMessage(inputValue);
        // Reset height to initial 50px after sending
        if (inputRef.current) {
          inputRef.current.style.height = '50px';
        }
      }
    }
  }, [isStreaming, inputValue, attachedFiles.length]);

  const handleCopyMessage = useCallback((content: string) => {
    navigator.clipboard.writeText(content);
  }, []);

  const handleEditMessage = useCallback((messageId: string) => {
    chatStore.startEditingMessage(messageId);
  }, []);

  const handleEditedContentChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    chatStore.updateEditedContent(e.target.value);
    // Auto-resize edit textarea
    if (editTextareaRef.current) {
      editTextareaRef.current.style.height = '50px';
      const scrollHeight = editTextareaRef.current.scrollHeight;
      if (scrollHeight > 50) {
        editTextareaRef.current.style.height = `${Math.min(scrollHeight, 350)}px`;
      }
    }
  }, []);

  const handleSaveEdit = useCallback(() => {
    chatStore.saveEditedMessage();
  }, []);

  const handleCancelEdit = useCallback(() => {
    chatStore.cancelEditingMessage();
  }, []);

  const handleLikeMessage = useCallback((messageId: string) => {
    chatStore.likeMessage(messageId);
  }, []);

  const handleDislikeMessage = useCallback((messageId: string) => {
    chatStore.dislikeMessage(messageId);
  }, []);

  const handleRegenerateMessage = useCallback((messageId: string) => {
    chatStore.regenerateMessage(messageId);
  }, []);

  const handleDeleteMessage = useCallback((messageId: string) => {
    chatStore.deleteMessage(messageId);
  }, []);

  const handleToggleViewMode = useCallback((messageId: string) => {
    chatStore.toggleMessageViewMode(messageId);
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
          threads={chatThreads}
          selectedThreadId={currentThreadId || undefined}
          onThreadSelect={handleThreadSelect}
          onNewThread={handleNewThread}
          onDeleteThread={handleDeleteThread}
          onTitleEdit={handleThreadTitleEdit}
          onReorder={handleThreadReorder}
          className="h-full"
        />
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header with collapse button and editable title */}
        <div className="border-b border-border px-4 py-3 flex items-center gap-4 bg-card h-16">
          <button
            onClick={() => setIsMenuCollapsed(!isMenuCollapsed)}
            className="p-2 hover:bg-muted rounded-lg transition-colors flex-shrink-0"
            aria-label={isMenuCollapsed ? 'Expand menu' : 'Collapse menu'}
          >
            {isMenuCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
          <div className="flex-1 min-w-0">
            {currentThread && (
              <ChatTitleEditor
                title={currentThread.title}
                onSave={handleTitleSave}
              />
            )}
          </div>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto p-6 bg-muted">
          {currentMessages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-muted-foreground">
                <p className="text-lg mb-2">No messages yet</p>
                <p className="text-sm">Start a conversation by typing a message below</p>
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
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          message.type === 'user'
                            ? 'bg-blue-500 text-white'
                            : 'bg-green-500 text-white'
                        }`}
                      >
                        {message.type === 'user' ? <User size={16} /> : <Bot size={16} />}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      {editingMessageId === message.id ? (
                        <div className="space-y-3">
                          <textarea
                            ref={editTextareaRef}
                            value={editedContent}
                            onChange={handleEditedContentChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none overflow-y-auto"
                            style={{ minHeight: '50px', maxHeight: '350px', height: 'auto' }}
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={handleSaveEdit}
                              className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
                            >
                              Save
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : message.content === '' && isStreaming ? (
                        <div className="flex items-center gap-1 text-gray-500">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div
                              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: '0.1s' }}
                            ></div>
                            <div
                              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: '0.2s' }}
                            ></div>
                          </div>
                        </div>
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
                          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-gray-700"
                          title="Copy message"
                        >
                          <Copy size={14} />
                        </button>

                        {/* Additional buttons visible on hover or when liked/disliked/raw view */}
                        <div
                          className={`flex items-center gap-1 transition-opacity duration-200 ${
                            hoveredMessage === message.id || message.liked || message.disliked || message.showRawMarkdown ? 'opacity-100' : 'opacity-0'
                          }`}
                        >
                          <button
                            onClick={() => handleToggleViewMode(message.id)}
                            className={`p-1.5 hover:bg-gray-100 rounded-lg transition-colors ${
                              message.showRawMarkdown
                                ? 'text-blue-600'
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                            title={message.showRawMarkdown ? 'Show markdown view' : 'Show raw markdown'}
                          >
                            <Code size={14} />
                          </button>
                          <button
                            onClick={() => handleEditMessage(message.id)}
                            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-gray-700"
                            title="Edit message"
                          >
                            <Edit3 size={14} />
                          </button>
                          {message.type === 'assistant' && (
                            <button
                              onClick={() => handleRegenerateMessage(message.id)}
                              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-gray-700"
                              title="Regenerate response"
                            >
                              <RotateCcw size={14} />
                            </button>
                          )}
                          {message.type === 'assistant' && (
                            <>
                              <button
                                onClick={() => handleLikeMessage(message.id)}
                                className={`p-1.5 hover:bg-gray-100 rounded-lg transition-colors ${
                                  message.liked
                                    ? 'text-green-600'
                                    : 'text-gray-500 hover:text-green-600'
                                }`}
                                title="Like message"
                              >
                                <ThumbsUp 
                                  size={14} 
                                  fill={message.liked ? 'currentColor' : 'none'}
                                />
                              </button>
                              <button
                                onClick={() => handleDislikeMessage(message.id)}
                                className={`p-1.5 hover:bg-gray-100 rounded-lg transition-colors ${
                                  message.disliked
                                    ? 'text-red-600'
                                    : 'text-gray-500 hover:text-red-600'
                                }`}
                                title="Dislike message"
                              >
                                <ThumbsDown 
                                  size={14} 
                                  fill={message.disliked ? 'currentColor' : 'none'}
                                />
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => handleDeleteMessage(message.id)}
                            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-red-600"
                            title="Delete message"
                          >
                            <Trash2 size={14} />
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
        <div className="border-t border-border bg-card p-4">
          <div className="max-w-3xl mx-auto space-y-3">
            {/* Model and temporary chat toggle */}
            <div className="flex items-center justify-between text-sm">
              <ModelSelector
                value={currentModel}
                onChange={handleModelChange}
                disabled={isStreaming}
              />
              <TemporaryChatToggle
                value={currentThread?.isTemporary || false}
                onChange={handleTemporaryToggle}
                disabled={isStreaming}
              />
            </div>

            {/* Selected contexts display */}
            {currentContext.length > 0 && (
              <SelectedContextsDisplay
                selectedContexts={currentContext}
                onRemove={handleRemoveContext}
              />
            )}

            {/* File attachments preview */}
            <FileAttachmentPreview
              files={attachedFiles}
              onRemove={handleFileRemove}
            />

            {/* Message input */}
            <div className="flex gap-3 items-start">
              <div className="flex-1 relative">
                <textarea
                  ref={inputRef}
                  value={inputValue}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyPress}
                  placeholder="Message ..."
                  disabled={isStreaming}
                  className="w-full px-4 py-3 pr-24 border border-input rounded-xl bg-background resize-none focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 overflow-y-auto"
                  style={{ minHeight: '50px', height: '50px', maxHeight: '350px', lineHeight: '1.5' }}
                />
                <div className="absolute right-3 top-3 flex items-center gap-1.5">
                  <EnhancedContextSelector
                    selectedContexts={currentContext}
                    onAdd={handleAddContext}
                    onRemove={handleRemoveContext}
                    disabled={isStreaming}
                  />
                  <FileAttachmentButton
                    onFileSelect={handleFileSelect}
                    disabled={isStreaming}
                  />
                </div>
              </div>
              <button
                onClick={handleSendMessage}
                disabled={isStreaming || (!inputValue.trim() && attachedFiles.length === 0)}
                className="mt-0 h-[50px] px-4 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 flex items-center justify-center"
                aria-label="Send message"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

ChatScreen.displayName = 'ChatScreen';
