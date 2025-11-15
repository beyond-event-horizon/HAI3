/**
 * Chat Domain - API Service
 * Service for chat completions (OpenAI-like API)
 *
 * Vertical Slice: This folder contains everything for the chat API domain:
 * - ChatApiService.ts (this file)
 * - api.ts (types)
 * - mocks.ts (mock responses)
 */

import { BaseApiService, type BaseApiServiceConfig } from '@hai3/uicore';
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
 * - Non-streaming completions
 * - Streaming completions (future)
 */
export class ChatApiService extends BaseApiService {
  constructor(config: Omit<BaseApiServiceConfig, 'baseURL'>) {
    super({
      ...config,
      baseURL: '/api/chat',
    });
  }

  /**
   * Create a chat completion (non-streaming)
   */
  async createCompletion(request: CreateChatCompletionRequest): Promise<CreateChatCompletionResponse> {
    return this.post<CreateChatCompletionResponse>('/completions', request);
  }

  /**
   * Create a streaming chat completion (future implementation)
   * Would return an async generator or EventSource for SSE
   */
  async *createCompletionStream(
    request: CreateChatCompletionRequest
  ): AsyncGenerator<ChatCompletionChunk, void, unknown> {
    // Future implementation for streaming
    // For now, simulate streaming by yielding mock chunks
    const response = await this.createCompletion({ ...request, stream: false });
    const content = response.choices[0]?.message.content || '';
    const words = content.split(' ');

    for (let i = 0; i < words.length; i++) {
      yield {
        id: response.id,
        object: 'chat.completion.chunk',
        created: response.created,
        model: response.model,
        choices: [
          {
            index: 0,
            delta: {
              content: (i === 0 ? '' : ' ') + words[i],
            },
            finish_reason: i === words.length - 1 ? 'stop' : null,
          },
        ],
      };

      // Simulate delay between words
      await new Promise((resolve) => setTimeout(resolve, 50 + Math.random() * 50));
    }
  }
}

// Register service type in ApiServicesMap via module augmentation
declare module '@hai3/uicore' {
  interface ApiServicesMap {
    [CHAT_DOMAIN]: ChatApiService;
  }
}
