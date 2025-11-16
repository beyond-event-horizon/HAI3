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
} from './api';

/**
 * Chat domain identifier
 * Per GUIDELINES.md: Define constants where used, not in central file
 */
export const CHAT_DOMAIN = 'chat' as const;

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
}

// Register service type in ApiServicesMap via module augmentation
declare module '@hai3/uicore' {
  interface ApiServicesMap {
    [CHAT_DOMAIN]: ChatApiService;
  }
}

// Self-register with API registry
apiRegistry.register(CHAT_DOMAIN, ChatApiService);
