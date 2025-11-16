/**
 * Chat Domain - API Types
 * OpenAI-like API contracts for chat completions
 */

/**
 * Chat message role
 */
export enum ChatRole {
  System = 'system',
  User = 'user',
  Assistant = 'assistant',
}

/**
 * Chat message in the API request/response
 */
export interface ChatMessage {
  role: ChatRole;
  content: string;
}

/**
 * Chat completion request (OpenAI-like)
 */
export interface CreateChatCompletionRequest {
  model: string;
  messages: ChatMessage[];
  stream?: boolean;
  temperature?: number;
  max_tokens?: number;
}

/**
 * Chat completion choice (non-streaming)
 */
export interface ChatCompletionChoice {
  index: number;
  message: ChatMessage;
  finish_reason: 'stop' | 'length' | 'content_filter' | null;
}

/**
 * Chat completion response (non-streaming)
 */
export interface CreateChatCompletionResponse {
  id: string;
  object: 'chat.completion';
  created: number;
  model: string;
  choices: ChatCompletionChoice[];
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * Chat completion delta for streaming
 */
export interface ChatCompletionDelta {
  role?: ChatRole;
  content?: string;
}

/**
 * Chat completion chunk (streaming)
 */
export interface ChatCompletionChunk {
  id: string;
  object: 'chat.completion.chunk';
  created: number;
  model: string;
  choices: Array<{
    index: number;
    delta: ChatCompletionDelta;
    finish_reason: 'stop' | 'length' | 'content_filter' | null;
  }>;
}

/**
 * API Error
 */
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string | number | boolean | null>;
}

/**
 * Chat Thread (API response)
 */
export interface Thread {
  id: string;
  title: string;
  preview: string;
  timestamp: string; // ISO date string from API
  isTemporary: boolean;
}

/**
 * Chat Message (API response)
 */
export interface Message {
  id: string;
  threadId: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: string; // ISO date string from API
}

/**
 * Context for chat
 */
export interface Context {
  id: string;
  name: string;
  color: string;
}

/**
 * Get threads response
 */
export type GetThreadsResponse = Thread[];

/**
 * Get messages response
 */
export type GetMessagesResponse = Message[];

/**
 * Get contexts response
 */
export type GetContextsResponse = Context[];

/**
 * Create thread request
 * Thread title is generated from firstMessage if provided
 */
export interface CreateThreadRequest {
  title?: string; // Optional - generated from firstMessage if not provided
  firstMessage?: string; // API generates smart title from this
  isTemporary: boolean;
}

/**
 * Create thread response
 */
export type CreateThreadResponse = Thread;

/**
 * Create message request
 */
export interface CreateMessageRequest {
  threadId: string;
  type: 'user' | 'assistant';
  content: string;
}

/**
 * Create message response
 */
export type CreateMessageResponse = Message;

/**
 * Update thread request
 */
export interface UpdateThreadRequest {
  title: string;
}

/**
 * Update thread response
 */
export type UpdateThreadResponse = Thread;

/**
 * Delete thread request
 * (threadId passed as URL parameter)
 */
export interface DeleteThreadRequest {
  threadId: string;
}

/**
 * Delete thread response
 */
export interface DeleteThreadResponse {
  success: boolean;
  threadId: string;
}
