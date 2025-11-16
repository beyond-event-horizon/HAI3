/**
 * Mock data for chat service
 * Simulated responses for chat completions
 */

import type { MockMap, JsonValue } from '@hai3/uicore';
import { ChatRole, type CreateChatCompletionResponse, type CreateChatCompletionRequest } from './api';

/**
 * Sample assistant responses for mock chat completions
 */
export const mockAssistantResponses = [
  'That\'s a great question! Let me help you with that.',
  'Here\'s what I think about that topic...',
  `Great question! Let me break this down for you in detail.

**Key Points to Consider:**

1. **Understanding the basics** - It's important to start with a solid foundation. This will help you grasp more complex concepts later.

2. **Practical applications** - Theory is great, but seeing how things work in practice makes all the difference.

3. **Common pitfalls** - Be aware of these common mistakes that many people make when starting out.

Here's a simple example to illustrate:

\`\`\`javascript
function example() {
  console.log("This is how it works!");
  return true;
}
\`\`\`

The key takeaway is to practice regularly and don't be afraid to experiment. Remember, everyone starts somewhere, and making mistakes is part of the learning process.`,
  `I'd be happy to explain that in more detail! This is actually a fascinating topic with several important aspects to consider.

**First**, let's look at the fundamental principles:
- The core concept revolves around understanding the relationship between different components
- Each element plays a crucial role in the overall system
- Timing and coordination are essential for success

**Second**, here are some best practices:

1. Always start with a clear plan
2. Break down complex problems into smaller, manageable pieces
3. Test your assumptions early and often
4. Document your process for future reference

**Example scenario:**

Imagine you're building a house. You wouldn't start with the roof, right? You'd begin with a solid foundation, then build the walls, and finally add the roof. The same principle applies here.

\`\`\`typescript
interface BuildingBlock {
  foundation: boolean;
  walls: number;
  roof: boolean;
}
\`\`\`

Hope this helps clarify things! Let me know if you have any questions.`,
  `Based on my understanding, here are some key points to consider:

**Overview:**
This is a multifaceted topic that requires careful consideration of various factors. Let me walk you through the most important aspects.

**Main Considerations:**

1. **Performance** - Efficiency matters, especially at scale
2. **Maintainability** - Code should be easy to understand and modify
3. **Security** - Always consider potential vulnerabilities
4. **User Experience** - The end user should always be your priority

**Detailed Breakdown:**

When approaching this problem, you'll want to think about both the short-term and long-term implications. In the short term, you might be tempted to take shortcuts, but these often lead to technical debt that becomes costly to address later.

For example, consider this pattern:

\`\`\`python
def process_data(data):
    # Clean the data
    cleaned = data.strip()
    # Transform it
    transformed = cleaned.upper()
    # Return result
    return transformed
\`\`\`

The important thing is to maintain consistency and follow established patterns in your codebase.`,
];

/**
 * Generate a mock chat completion response
 */
function generateMockCompletion(requestModel: string): CreateChatCompletionResponse {
  const randomResponse = mockAssistantResponses[Math.floor(Math.random() * mockAssistantResponses.length)];

  return {
    id: `chatcmpl-mock-${Date.now()}`,
    object: 'chat.completion',
    created: Math.floor(Date.now() / 1000),
    model: requestModel,
    choices: [
      {
        index: 0,
        message: {
          role: ChatRole.Assistant,
          content: randomResponse,
        },
        finish_reason: 'stop',
      },
    ],
    usage: {
      prompt_tokens: 50,
      completion_tokens: randomResponse.split(' ').length,
      total_tokens: 50 + randomResponse.split(' ').length,
    },
  };
}

/**
 * Mock responses for chat service endpoints
 * Type-safe mapping of endpoints to response factories
 */
export const chatMockMap = {
  'POST /completions': (requestData?: JsonValue) => {
    const request = requestData as CreateChatCompletionRequest | undefined;
    return generateMockCompletion(request?.model || 'gpt-3.5-turbo');
  },
  // SSE streaming endpoint - returns completion that SseProtocol will stream word-by-word
  'GET /completions/stream': (requestData?: JsonValue) => {
    const request = requestData as CreateChatCompletionRequest | undefined;
    return generateMockCompletion(request?.model || 'gpt-3.5-turbo');
  },
} satisfies MockMap;
