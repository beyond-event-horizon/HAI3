/**
 * Chat Slice
 * Redux slice for chat state management
 * Following Flux: Effects dispatch these reducers after listening to events
 */

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Message, Thread, AttachedFile, Context } from '../types';
import { DEFAULT_MODEL } from '../constants/modelConstants';

export interface ChatState {
  threads: Thread[];
  messages: Message[];
  currentThreadId: string | null;
  currentModel: string;
  currentContext: string[];
  availableContexts: Context[];
  inputValue: string;
  isStreaming: boolean;
  attachedFiles: AttachedFile[];
  editingMessageId: string | null;
  editedContent: string;
}

// Initialize with mock data for demo
const now = new Date();
const thread1Id = 'thread-1';
const thread2Id = 'thread-2';
const thread3Id = 'thread-3';
const thread4Id = 'thread-4';

const initialState: ChatState = {
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
  currentModel: DEFAULT_MODEL,
  currentContext: [],
  availableContexts: [
    { id: 'context-1', name: 'Context 1', color: 'bg-yellow-400' },
    { id: 'work-1', name: 'Work 1', color: 'bg-gray-800' },
    { id: 'hobby', name: 'Hobby', color: 'bg-blue-600' },
    { id: 'test', name: 'Test', color: 'bg-cyan-400' },
    { id: 'cooking', name: 'Cooking', color: 'bg-purple-400' },
    { id: 'books', name: 'Books', color: 'bg-yellow-600' },
    { id: 'private', name: 'Private docs', color: 'bg-red-500' },
  ],
  inputValue: '',
  isStreaming: false,
  attachedFiles: [],
  editingMessageId: null,
  editedContent: '',
};

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    // Thread management
    setThreads: (state, action: PayloadAction<Thread[]>) => {
      state.threads = action.payload;
    },
    setCurrentThreadId: (state, action: PayloadAction<string | null>) => {
      state.currentThreadId = action.payload;
    },
    addThread: (state, action: PayloadAction<Thread>) => {
      state.threads.unshift(action.payload);
    },
    removeThread: (state, action: PayloadAction<{ threadId: string }>) => {
      state.threads = state.threads.filter((t) => t.id !== action.payload.threadId);
    },
    updateThread: (state, action: PayloadAction<{ threadId: string; updates: Partial<Thread> }>) => {
      const thread = state.threads.find((t) => t.id === action.payload.threadId);
      if (thread) {
        Object.assign(thread, action.payload.updates);
      }
    },

    // Message management
    setMessages: (state, action: PayloadAction<Message[]>) => {
      state.messages = action.payload;
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
    updateMessage: (state, action: PayloadAction<{ messageId: string; updates: Partial<Message> }>) => {
      const message = state.messages.find((m) => m.id === action.payload.messageId);
      if (message) {
        Object.assign(message, action.payload.updates);
      }
    },
    removeMessage: (state, action: PayloadAction<{ messageId: string }>) => {
      state.messages = state.messages.filter((m) => m.id !== action.payload.messageId);
    },
    removeMessagesAfter: (state, action: PayloadAction<{ messageId: string }>) => {
      const index = state.messages.findIndex((m) => m.id === action.payload.messageId);
      if (index !== -1) {
        state.messages = state.messages.slice(0, index + 1);
      }
    },

    // Editing
    setEditingMessageId: (state, action: PayloadAction<string | null>) => {
      state.editingMessageId = action.payload;
    },
    setEditedContent: (state, action: PayloadAction<string>) => {
      state.editedContent = action.payload;
    },

    // Model and context
    setCurrentModel: (state, action: PayloadAction<string>) => {
      state.currentModel = action.payload;
    },
    setCurrentContext: (state, action: PayloadAction<string[]>) => {
      state.currentContext = action.payload;
    },
    setAvailableContexts: (state, action: PayloadAction<Context[]>) => {
      state.availableContexts = action.payload;
    },
    addContextToList: (state, action: PayloadAction<{ contextId: string }>) => {
      if (!state.currentContext.includes(action.payload.contextId)) {
        state.currentContext.push(action.payload.contextId);
      }
    },
    removeContextFromList: (state, action: PayloadAction<{ contextId: string }>) => {
      state.currentContext = state.currentContext.filter(id => id !== action.payload.contextId);
    },

    // Files
    setAttachedFiles: (state, action: PayloadAction<AttachedFile[]>) => {
      state.attachedFiles = action.payload;
    },
    addFileToList: (state, action: PayloadAction<{ file: AttachedFile }>) => {
      state.attachedFiles.push(action.payload.file);
    },
    removeFileFromList: (state, action: PayloadAction<{ fileId: string }>) => {
      state.attachedFiles = state.attachedFiles.filter(f => f.id !== action.payload.fileId);
    },

    // Input
    setInputValue: (state, action: PayloadAction<string>) => {
      state.inputValue = action.payload;
    },

    // Streaming
    setIsStreaming: (state, action: PayloadAction<boolean>) => {
      state.isStreaming = action.payload;
    },

    // Reset
    resetChat: () => initialState,
  },
});

export const {
  setThreads,
  setCurrentThreadId,
  addThread,
  removeThread,
  updateThread,
  setMessages,
  addMessage,
  updateMessage,
  removeMessage,
  removeMessagesAfter,
  setEditingMessageId,
  setEditedContent,
  setCurrentModel,
  setCurrentContext,
  setAvailableContexts,
  addContextToList,
  removeContextFromList,
  setAttachedFiles,
  addFileToList,
  removeFileFromList,
  setInputValue,
  setIsStreaming,
  resetChat,
} = chatSlice.actions;

export default chatSlice.reducer;
