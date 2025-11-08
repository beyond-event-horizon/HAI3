/**
 * Chat Store
 * Mock store for chat threads and messages
 * Simulates a Zustand-like store pattern
 */

export interface AttachedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  path?: string;
}

export interface Message {
  id: string;
  threadId: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  files?: AttachedFile[];
  liked?: boolean;
  disliked?: boolean;
  showRawMarkdown?: boolean;
}

export interface Thread {
  id: string;
  title: string;
  preview: string;
  timestamp: Date;
  isTemporary: boolean;
}

export interface ChatState {
  threads: Thread[];
  messages: Message[];
  currentThreadId: string | null;
  currentModel: string;
  currentContext: string[];
  inputValue: string;
  isStreaming: boolean;
  attachedFiles: AttachedFile[];
  editingMessageId: string | null;
  editedContent: string;
}

type Listener = (state: ChatState) => void;

class ChatStore {
  private state: ChatState;
  private listeners: Set<Listener> = new Set();

  constructor() {
    // Initialize with mock data
    const now = new Date();
    const thread1Id = 'thread-1';
    const thread2Id = 'thread-2';
    const thread3Id = 'thread-3';
    const thread4Id = 'thread-4';

    this.state = {
      threads: [
        {
          id: thread1Id,
          title: 'React Best Practices',
          preview: 'What are the best practices for React hooks?',
          timestamp: new Date(now.getTime() - 3600000),
          isTemporary: false,
        },
        {
          id: thread2Id,
          title: 'TypeScript Generics',
          preview: 'Can you explain TypeScript generics?',
          timestamp: new Date(now.getTime() - 7200000),
          isTemporary: false,
        },
        {
          id: thread3Id,
          title: 'CSS Grid Layout',
          preview: 'How to create a responsive grid with CSS Grid?',
          timestamp: new Date(now.getTime() - 10800000),
          isTemporary: false,
        },
        {
          id: thread4Id,
          title: 'Temporary Chat',
          preview: 'This is a temporary conversation',
          timestamp: new Date(now.getTime() - 14400000),
          isTemporary: true,
        },
      ],
      messages: [
        {
          id: 'msg-1',
          threadId: thread1Id,
          type: 'user',
          content: 'What are the best practices for React hooks?',
          timestamp: new Date(now.getTime() - 3600000),
        },
        {
          id: 'msg-2',
          threadId: thread1Id,
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
          timestamp: new Date(now.getTime() - 3590000),
        },
        {
          id: 'msg-3',
          threadId: thread2Id,
          type: 'user',
          content: 'Can you explain TypeScript generics?',
          timestamp: new Date(now.getTime() - 7200000),
        },
        {
          id: 'msg-4',
          threadId: thread2Id,
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
          timestamp: new Date(now.getTime() - 7190000),
        },
        {
          id: 'msg-5',
          threadId: thread3Id,
          type: 'user',
          content: 'How to create a responsive grid with CSS Grid?',
          timestamp: new Date(now.getTime() - 10800000),
        },
        {
          id: 'msg-6',
          threadId: thread3Id,
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
          timestamp: new Date(now.getTime() - 10790000),
        },
        {
          id: 'msg-7',
          threadId: thread4Id,
          type: 'user',
          content: 'What is a temporary chat?',
          timestamp: new Date(now.getTime() - 14400000),
        },
        {
          id: 'msg-8',
          threadId: thread4Id,
          type: 'assistant',
          content: `A temporary chat is a conversation that won't be saved to your history. It's useful for:

- **Privacy**: Sensitive questions that you don't want stored
- **Testing**: Trying out prompts without cluttering your history
- **Quick queries**: One-off questions that don't need to be saved

Temporary chats are marked with a clock icon (⏱️) and will be automatically deleted when you close the session or after a certain period of inactivity.

You can enable temporary mode using the toggle near the input field.`,
          timestamp: new Date(now.getTime() - 14390000),
        },
      ],
      currentThreadId: thread1Id,
      currentModel: 'gpt-5',
      currentContext: [],
      inputValue: '',
      isStreaming: false,
      attachedFiles: [],
      editingMessageId: null,
      editedContent: '',
    };
  }

  getState(): ChatState {
    return this.state;
  }

  setState(partial: Partial<ChatState>): void {
    this.state = { ...this.state, ...partial };
    this.notifyListeners();
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener(this.state));
  }

  // Actions
  selectThread(threadId: string): void {
    this.setState({ currentThreadId: threadId });
  }

  createThread(isTemporary: boolean = false): string {
    const newThreadId = `thread-${Date.now()}`;
    const newThread: Thread = {
      id: newThreadId,
      title: 'New Chat',
      preview: '',
      timestamp: new Date(),
      isTemporary,
    };
    this.setState({
      threads: [newThread, ...this.state.threads],
      currentThreadId: newThreadId,
    });
    return newThreadId;
  }

  deleteThread(threadId: string): void {
    const threads = this.state.threads.filter((t) => t.id !== threadId);
    const messages = this.state.messages.filter((m) => m.threadId !== threadId);
    const currentThreadId =
      this.state.currentThreadId === threadId
        ? threads[0]?.id || null
        : this.state.currentThreadId;
    this.setState({ threads, messages, currentThreadId });
  }

  sendMessage(content: string): void {
    if (!this.state.currentThreadId || (!content.trim() && this.state.attachedFiles.length === 0)) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      threadId: this.state.currentThreadId,
      type: 'user',
      content: content.trim(),
      timestamp: new Date(),
      files: this.state.attachedFiles.length > 0 ? [...this.state.attachedFiles] : undefined,
    };

    // Update thread preview and title if it's a new thread
    const threads = this.state.threads.map((t) => {
      if (t.id === this.state.currentThreadId && t.title === 'New Chat') {
        return {
          ...t,
          title: content.trim().slice(0, 50),
          preview: content.trim().slice(0, 100),
          timestamp: new Date(),
        };
      }
      return t;
    });

    this.setState({
      messages: [...this.state.messages, userMessage],
      threads,
      inputValue: '',
      isStreaming: true,
      attachedFiles: [],
    });

    // Simulate streaming response
    this.simulateStreamingResponse(this.state.currentThreadId);
  }

  private simulateStreamingResponse(threadId: string): void {
    // Simulate initial delay before streaming starts
    setTimeout(() => {
      const responses = [
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

      const fullContent = responses[Math.floor(Math.random() * responses.length)];
      const messageId = `msg-${Date.now()}`;
      
      // Split content into words for streaming
      const words = fullContent.split(' ');
      let currentContent = '';
      let wordIndex = 0;

      // Create initial empty message
      const assistantMessage: Message = {
        id: messageId,
        threadId,
        type: 'assistant',
        content: '',
        timestamp: new Date(),
      };

      this.setState({
        messages: [...this.state.messages, assistantMessage],
      });

      // Stream words gradually
      const streamInterval = setInterval(() => {
        if (wordIndex < words.length) {
          currentContent += (wordIndex > 0 ? ' ' : '') + words[wordIndex];
          wordIndex++;

          // Update message content
          const updatedMessages = this.state.messages.map((m) =>
            m.id === messageId ? { ...m, content: currentContent } : m
          );

          this.setState({ messages: updatedMessages });
        } else {
          // Streaming complete
          clearInterval(streamInterval);
          this.setState({ isStreaming: false });
        }
      }, 50 + Math.random() * 50); // Random delay between 50-100ms per word
    }, 500); // Initial delay before streaming starts
  }

  startEditingMessage(messageId: string): void {
    const message = this.state.messages.find((m) => m.id === messageId);
    if (message) {
      this.setState({
        editingMessageId: messageId,
        editedContent: message.content,
      });
    }
  }

  updateEditedContent(content: string): void {
    this.setState({ editedContent: content });
  }

  saveEditedMessage(): void {
    if (!this.state.editingMessageId) return;

    const messages = this.state.messages.map((m) =>
      m.id === this.state.editingMessageId
        ? { ...m, content: this.state.editedContent }
        : m
    );

    // Simulate API call
    console.log('API: Updating message', this.state.editingMessageId, this.state.editedContent);

    this.setState({
      messages,
      editingMessageId: null,
      editedContent: '',
    });
  }

  cancelEditingMessage(): void {
    this.setState({
      editingMessageId: null,
      editedContent: '',
    });
  }

  likeMessage(messageId: string): void {
    const messages = this.state.messages.map((m) => {
      if (m.id === messageId) {
        const newLiked = !m.liked;
        // Simulate API call to backend
        console.log('API: POST /messages/like', {
          messageId,
          liked: newLiked,
          timestamp: new Date().toISOString(),
        });
        return { ...m, liked: newLiked, disliked: false };
      }
      return m;
    });
    this.setState({ messages });
  }

  dislikeMessage(messageId: string): void {
    const messages = this.state.messages.map((m) => {
      if (m.id === messageId) {
        const newDisliked = !m.disliked;
        // Simulate API call to backend
        console.log('API: POST /messages/dislike', {
          messageId,
          disliked: newDisliked,
          timestamp: new Date().toISOString(),
        });
        return { ...m, disliked: newDisliked, liked: false };
      }
      return m;
    });
    this.setState({ messages });
  }

  deleteMessage(messageId: string): void {
    const messages = this.state.messages.filter((m) => m.id !== messageId);
    this.setState({ messages });
  }

  toggleMessageViewMode(messageId: string): void {
    const messages = this.state.messages.map((m) => {
      if (m.id === messageId) {
        const newShowRaw = !m.showRawMarkdown;
        // Simulate API call to backend
        console.log('API: POST /messages/view-mode', {
          messageId,
          showRawMarkdown: newShowRaw,
          timestamp: new Date().toISOString(),
        });
        return { ...m, showRawMarkdown: newShowRaw };
      }
      return m;
    });
    this.setState({ messages });
  }

  regenerateMessage(messageId: string): void {
    const message = this.state.messages.find((m) => m.id === messageId);
    if (!message || message.type !== 'assistant') return;

    // Find the index of the message to regenerate
    const messageIndex = this.state.messages.findIndex((m) => m.id === messageId);
    if (messageIndex === -1) return;

    // Simulate API call
    console.log('API: Regenerating message', messageId, '- removing message and all below');

    // Replace the message content with empty string (keep the message in place)
    // and remove all messages after it
    const messages = this.state.messages.slice(0, messageIndex + 1).map((m) =>
      m.id === messageId ? { ...m, content: '' } : m
    );

    // Update state with message cleared and set streaming
    this.setState({ 
      messages,
      isStreaming: true 
    });

    // Simulate initial delay before streaming starts
    setTimeout(() => {
      const responses = [
        "Let me provide a different perspective on that... because my previous message was not that accurate",
        "Here's another way to think about it:\n\nImagine you're a robot, or a teapot, or a toaster",
        "I can explain this differently:",
        "Allow me to rephrase that response:",
        "Here's an alternative explanation:",
      ];

      const fullContent = responses[Math.floor(Math.random() * responses.length)];
      
      // Split content into words for streaming
      const words = fullContent.split(' ');
      let currentContent = '';
      let wordIndex = 0;

      // Stream words gradually
      const streamInterval = setInterval(() => {
        if (wordIndex < words.length) {
          currentContent += (wordIndex > 0 ? ' ' : '') + words[wordIndex];
          wordIndex++;

          // Update message content
          const updatedMessages = this.state.messages.map((m) =>
            m.id === messageId ? { ...m, content: currentContent } : m
          );

          this.setState({ messages: updatedMessages });
        } else {
          // Streaming complete
          clearInterval(streamInterval);
          this.setState({ isStreaming: false });
        }
      }, 50 + Math.random() * 50); // Random delay between 50-100ms per word
    }, 500); // Initial delay before streaming starts
  }

  setModel(model: string): void {
    this.setState({ currentModel: model });
  }

  setContext(contexts: string[]): void {
    this.setState({ currentContext: contexts });
  }

  addContext(contextId: string): void {
    const contexts = [...this.state.currentContext, contextId];
    this.setState({ currentContext: contexts });
  }

  removeContext(contextId: string): void {
    const contexts = this.state.currentContext.filter((id) => id !== contextId);
    this.setState({ currentContext: contexts });
  }

  attachFile(file: AttachedFile): void {
    this.setState({ attachedFiles: [...this.state.attachedFiles, file] });
  }

  removeFile(fileId: string): void {
    const files = this.state.attachedFiles.filter((f) => f.id !== fileId);
    this.setState({ attachedFiles: files });
  }

  clearAttachedFiles(): void {
    this.setState({ attachedFiles: [] });
  }

  reorderThreads(newThreads: Thread[]): void {
    this.setState({ threads: newThreads });
  }

  updateThreadTitle(threadId: string, newTitle: string): void {
    const threads = this.state.threads.map((t) =>
      t.id === threadId ? { ...t, title: newTitle } : t
    );
    this.setState({ threads });
  }

  toggleCurrentThreadTemporary(isTemporary: boolean): void {
    if (!this.state.currentThreadId) return;
    const threads = this.state.threads.map((t) =>
      t.id === this.state.currentThreadId ? { ...t, isTemporary } : t
    );
    this.setState({ threads });
  }

  setInputValue(value: string): void {
    this.setState({ inputValue: value });
  }
}

// Export singleton instance
export const chatStore = new ChatStore();
