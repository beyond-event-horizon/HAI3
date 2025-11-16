/**
 * Mock data for chat service
 * Simulated responses for chat completions
 */

import { trim, upperFirst, truncate } from 'lodash';
import type { MockMap, JsonValue } from '@hai3/uicore';
import {
  ChatRole,
  type CreateChatCompletionResponse,
  type CreateChatCompletionRequest,
  type CreateThreadRequest,
  type CreateMessageRequest,
  type UpdateThreadRequest,
} from './api';

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
 * Generate a smart thread title from the first message
 * Mimics ChatGPT/Claude behavior - creates concise titles from user input
 * Uses lodash for all string operations (required by GUIDELINES.md)
 */
function generateSmartTitle(firstMessage: string): string {
  const maxLength = 50;

  // Trim whitespace using lodash
  let title = trim(firstMessage);

  // Remove question marks and common prefixes (no lodash equivalent for regex)
  title = title
    .replace(/^(how do i|how to|what is|what are|can you|please|help me)\s+/gi, '')
    .replace(/\?+$/, '');

  // Capitalize first letter using lodash
  title = upperFirst(title);

  // Truncate with ellipsis using lodash
  title = truncate(title, {
    length: maxLength,
    omission: '...',
  });

  return title || 'New Chat';
}

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
 * Mock threads data
 */
const now = Date.now();
export const mockThreads = [
  {
    id: 'thread-1',
    title: 'React Best Practices',
    preview: 'What are the best practices for React hooks?',
    timestamp: new Date(now - 3600000).toISOString(),
    isTemporary: false,
  },
  {
    id: 'thread-2',
    title: 'TypeScript Generics',
    preview: 'Can you explain TypeScript generics?',
    timestamp: new Date(now - 7200000).toISOString(),
    isTemporary: false,
  },
  {
    id: 'thread-3',
    title: 'CSS Grid Layout',
    preview: 'How to create a responsive grid with CSS Grid?',
    timestamp: new Date(now - 10800000).toISOString(),
    isTemporary: false,
  },
  {
    id: 'thread-4',
    title: 'Temporary Chat',
    preview: 'This is a temporary conversation',
    timestamp: new Date(now - 14400000).toISOString(),
    isTemporary: true,
  },
];

/**
 * Mock messages data
 */
export const mockMessages = [
  {
    id: 'msg-1',
    threadId: 'thread-1',
    type: 'user',
    content: 'What are the best practices for React hooks?',
    timestamp: new Date(now - 3600000).toISOString(),
  },
  {
    id: 'msg-2',
    threadId: 'thread-1',
    type: 'assistant',
    content: `Here are some best practices for React hooks:

1. **Only call hooks at the top level** - Don't call hooks inside loops, conditions, or nested functions.

2. **Only call hooks from React functions** - Call them from React function components or custom hooks.

3. **Use the ESLint plugin** - Install and configure \`eslint-plugin-react-hooks\` to catch common mistakes.

4. **Custom hooks should start with "use"** - This naming convention helps identify hooks and allows linting tools to work properly.

Example of a custom hook:
\`\`\`typescript
function useWindowSize() {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    function updateSize() {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return size;
}
\`\`\`

5. **Optimize with useMemo and useCallback** - But only when necessary to prevent unnecessary re-renders.`,
    timestamp: new Date(now - 3590000).toISOString(),
  },
  {
    id: 'msg-3',
    threadId: 'thread-2',
    type: 'user',
    content: 'Can you explain TypeScript generics?',
    timestamp: new Date(now - 7200000).toISOString(),
  },
  {
    id: 'msg-4',
    threadId: 'thread-2',
    type: 'assistant',
    content: `TypeScript generics allow you to create reusable components that work with multiple types.

Here's a simple example:
\`\`\`typescript
function identity<T>(arg: T): T {
  return arg;
}

// Usage
const output1 = identity<string>("hello");
const output2 = identity<number>(42);
\`\`\`

Generics are especially useful for:
- Type-safe collections
- Reusable utility functions
- Component props that accept various types`,
    timestamp: new Date(now - 7190000).toISOString(),
  },
  {
    id: 'msg-5',
    threadId: 'thread-3',
    type: 'user',
    content: 'How to create a responsive grid with CSS Grid?',
    timestamp: new Date(now - 10800000).toISOString(),
  },
  {
    id: 'msg-6',
    threadId: 'thread-3',
    type: 'assistant',
    content: `CSS Grid is a powerful layout system for creating responsive designs. Here's a comprehensive example:

\`\`\`css
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  padding: 1rem;
}

.grid-item {
  background: #f0f0f0;
  padding: 1.5rem;
  border-radius: 8px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .grid-container {
    grid-template-columns: 1fr;
  }
}
\`\`\`

Key features:
- **auto-fit**: Automatically fits as many columns as possible
- **minmax()**: Sets minimum and maximum column width
- **gap**: Spacing between grid items
- **1fr**: Flexible fraction unit for equal distribution

This creates a responsive grid that adapts to screen size without media queries!`,
    timestamp: new Date(now - 10790000).toISOString(),
  },
  {
    id: 'msg-7',
    threadId: 'thread-4',
    type: 'user',
    content: 'What is a temporary chat?',
    timestamp: new Date(now - 14400000).toISOString(),
  },
  {
    id: 'msg-8',
    threadId: 'thread-4',
    type: 'assistant',
    content: `A temporary chat is a conversation that won't be saved to your history. It's useful for:

- **Privacy**: Sensitive questions that you don't want stored
- **Testing**: Trying out prompts without cluttering your history
- **Quick queries**: One-off questions that don't need to be saved

Temporary chats are marked with a clock icon (⏱️) and will be automatically deleted when you close the session or after a certain period of inactivity.

You can enable temporary mode using the toggle near the input field.`,
    timestamp: new Date(now - 14390000).toISOString(),
  },
];

/**
 * Mock available contexts
 */
export const mockContexts = [
  { id: 'context-1', name: 'Context 1', color: 'bg-yellow-400' },
  { id: 'work-1', name: 'Work 1', color: 'bg-gray-800' },
  { id: 'hobby', name: 'Hobby', color: 'bg-blue-600' },
  { id: 'test', name: 'Test', color: 'bg-cyan-400' },
  { id: 'cooking', name: 'Cooking', color: 'bg-purple-400' },
  { id: 'books', name: 'Books', color: 'bg-yellow-600' },
  { id: 'private', name: 'Private docs', color: 'bg-red-500' },
];

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
  // Get all threads
  'GET /threads': () => mockThreads,
  // Get all messages
  'GET /messages': () => mockMessages,
  // Get available contexts
  'GET /contexts': () => mockContexts,
  // Create a new thread
  'POST /threads': (requestData?: JsonValue) => {
    const request = requestData as CreateThreadRequest | undefined;

    // Generate title from firstMessage if provided, otherwise use provided title
    const title = request?.firstMessage
      ? generateSmartTitle(request.firstMessage)
      : (request?.title || 'New Chat');

    return {
      id: `thread-${Date.now()}`,
      title,
      preview: request?.firstMessage?.substring(0, 100) || '',
      timestamp: new Date().toISOString(),
      isTemporary: request?.isTemporary || false,
    };
  },
  // Create a new message
  'POST /messages': (requestData?: JsonValue) => {
    const request = requestData as CreateMessageRequest | undefined;
    return {
      id: `msg-${Date.now()}`,
      threadId: request?.threadId || '',
      type: request?.type || 'user',
      content: request?.content || '',
      timestamp: new Date().toISOString(),
    };
  },
  // Update a thread (pattern matches /threads/any-id)
  'PATCH /threads/:id': (requestData?: JsonValue) => {
    const request = requestData as UpdateThreadRequest | undefined;
    // In a real implementation, we'd update the thread in a data store
    // For mocks, we just return the updated thread
    return {
      id: 'thread-updated',
      title: request?.title || 'Updated Thread',
      preview: '',
      timestamp: new Date().toISOString(),
      isTemporary: false,
    };
  },
  // Delete a thread (pattern matches /threads/any-id)
  'DELETE /threads/:id': () => {
    // In a real implementation, we'd delete the thread from a data store
    // For mocks, we just return success
    return {
      success: true,
      threadId: 'thread-deleted',
    };
  },
} satisfies MockMap;
