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
  details?: unknown;
}
