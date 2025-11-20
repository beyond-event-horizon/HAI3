/**
 * Chat Domain - API Service
 * Service for chat completions (OpenAI-like API)
 *
 * Vertical Slice: This folder contains everything for the chat API domain:
 * - ChatApiService.ts (this file)
 * - api.ts (types)
 * - mocks.ts (mock responses)
 */

import { BaseApiService, RestProtocol, SseProtocol, apiRegistry, type MockMap } from '@hai3/uicore';
import type {
  CreateChatCompletionRequest,
  CreateChatCompletionResponse,
  ChatCompletionChunk,
  GetThreadsResponse,
  GetMessagesResponse,
  GetContextsResponse,
  CreateThreadRequest,
  CreateThreadResponse,
  CreateMessageRequest,
  CreateMessageResponse,
  UpdateThreadRequest,
  UpdateThreadResponse,
  DeleteThreadResponse,
} from './api';
import { CHAT_COPY_SCREENSET_ID } from '../ids';

/**
 * Chat Copy domain identifier
 * Uses template literal with CHAT_COPY_SCREENSET_ID for auto-updating namespace
 * When CHAT_COPY_SCREENSET_ID changes, this domain automatically updates
 */
export const CHAT_DOMAIN = `${CHAT_COPY_SCREENSET_ID}:chat` as const;

/**
 * Chat API Service
 * Manages chat completion endpoints:
 * - Non-streaming completions (REST)
 * - Streaming completions (SSE)
 */
export class ChatApiService extends BaseApiService {
  constructor() {
    super(
      { baseURL: '/api/chat' },
      new RestProtocol({
        timeout: 30000,
      }),
      new SseProtocol({
        withCredentials: true,
      })
    );
  }

  /**
   * Get mock map from registry
   */
  protected getMockMap(): MockMap {
    return apiRegistry.getMockMap(CHAT_DOMAIN);
  }

  /**
   * Create a chat completion (non-streaming REST endpoint)
   */
  async createCompletion(request: CreateChatCompletionRequest): Promise<CreateChatCompletionResponse> {
    return this.protocol(RestProtocol).post<CreateChatCompletionResponse, CreateChatCompletionRequest>(
      '/completions',
      request
    );
  }

  /**
   * Create a streaming chat completion (SSE endpoint)
   * Returns connection ID for cleanup
   *
   * @param request - Chat completion request
   * @param onChunk - Callback for each SSE chunk
   * @param onComplete - Optional callback when stream completes
   * @returns Connection ID for disconnecting
   */
  createCompletionStream(
    _request: CreateChatCompletionRequest,
    onChunk: (chunk: ChatCompletionChunk) => void,
    onComplete?: () => void
  ): string {
    return this.protocol(SseProtocol).connect(
      '/completions/stream',
      (event: MessageEvent) => {
        try {
          const chunk = JSON.parse(event.data) as ChatCompletionChunk;
          onChunk(chunk);
        } catch (error) {
          console.error('Failed to parse SSE chunk:', error);
        }
      },
      onComplete
    );
  }

  /**
   * Disconnect active stream
   *
   * @param connectionId - Connection ID returned from createCompletionStream()
   */
  disconnectStream(connectionId: string): void {
    this.protocol(SseProtocol).disconnect(connectionId);
  }

  /**
   * Get all threads
   */
  async getThreads(): Promise<GetThreadsResponse> {
    return this.protocol(RestProtocol).get<GetThreadsResponse>('/threads');
  }

  /**
   * Get all messages
   */
  async getMessages(): Promise<GetMessagesResponse> {
    return this.protocol(RestProtocol).get<GetMessagesResponse>('/messages');
  }

  /**
   * Get available contexts
   */
  async getContexts(): Promise<GetContextsResponse> {
    return this.protocol(RestProtocol).get<GetContextsResponse>('/contexts');
  }

  /**
   * Create a new thread
   */
  async createThread(request: CreateThreadRequest): Promise<CreateThreadResponse> {
    return this.protocol(RestProtocol).post<CreateThreadResponse, CreateThreadRequest>('/threads', request);
  }

  /**
   * Create a new message
   */
  async createMessage(request: CreateMessageRequest): Promise<CreateMessageResponse> {
    return this.protocol(RestProtocol).post<CreateMessageResponse, CreateMessageRequest>('/messages', request);
  }

  /**
   * Update a thread
   */
  async updateThread(threadId: string, request: UpdateThreadRequest): Promise<UpdateThreadResponse> {
    return this.protocol(RestProtocol).patch<UpdateThreadResponse, UpdateThreadRequest>(`/threads/${threadId}`, request);
  }

  /**
   * Delete a thread
   */
  async deleteThread(threadId: string): Promise<DeleteThreadResponse> {
    return this.protocol(RestProtocol).delete<DeleteThreadResponse>(`/threads/${threadId}`);
  }
}

// Register service type in ApiServicesMap via module augmentation
declare module '@hai3/uicore' {
  interface ApiServicesMap {
    [CHAT_DOMAIN]: ChatApiService;
  }
}

// Self-register with API registry
apiRegistry.register(CHAT_DOMAIN, ChatApiService);
