/**
 * Chat Effects
 * Listen to events and update chat slice
 * Following Flux: Effects ONLY listen to events and update their own slice
 * Effects NEVER call actions or emit events (would create circular flow)
 */

import { eventBus, type AppDispatch, store, type RootState } from '@hai3/uicore';
import { ChatEvents } from '../events/chatEvents';
import {
  setCurrentThreadId,
  addThread,
  removeThread,
  updateThread,
  setThreads,
  addMessage,
  updateMessage,
  toggleMessageRawMarkdown,
  removeMessage,
  removeMessagesAfter,
  setEditingMessageId,
  setEditedContent,
  setCurrentModel,
  addContextToList,
  removeContextFromList,
  addFileToList,
  removeFileFromList,
  setInputValue,
  setIsStreaming,
} from '../slices/chatSlice';
import type { Thread, Message } from '../types';

let dispatch: AppDispatch;

/**
 * Simulates a streaming backend response
 * In production, this would be replaced with real API calls
 */
const simulateStreamingResponse = (threadId: string): void => {
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

    // Create initial empty assistant message
    const assistantMessage: Message = {
      id: messageId,
      threadId,
      type: 'assistant',
      content: '',
      timestamp: new Date(),
    };

    dispatch(addMessage(assistantMessage));
    eventBus.emit(ChatEvents.StreamingStarted, { messageId });

    // Stream words gradually
    const streamInterval = setInterval(() => {
      if (wordIndex < words.length) {
        currentContent += (wordIndex > 0 ? ' ' : '') + words[wordIndex];
        wordIndex++;

        // Emit streaming content update event
        eventBus.emit(ChatEvents.StreamingContentUpdated, { messageId, content: currentContent });
      } else {
        // Streaming complete
        clearInterval(streamInterval);
        eventBus.emit(ChatEvents.StreamingCompleted);
      }
    }, 50 + Math.random() * 50); // Random delay between 50-100ms per word
  }, 500); // Initial delay before streaming starts
};

/**
 * Initialize chat effects
 * Called once during app bootstrap
 */
export const initializeChatEffects = (appDispatch: AppDispatch): void => {
  dispatch = appDispatch;

  // Thread effects
  eventBus.on(ChatEvents.ThreadSelected, ({ threadId }) => {
    dispatch(setCurrentThreadId(threadId));
  });

  eventBus.on(ChatEvents.ThreadCreated, ({ isTemporary }) => {
    const newThread: Thread = {
      id: `thread-${Date.now()}`,
      title: 'New Chat',
      preview: '',
      timestamp: new Date(),
      isTemporary,
    };
    dispatch(addThread(newThread));
    dispatch(setCurrentThreadId(newThread.id));
  });

  eventBus.on(ChatEvents.ThreadDeleted, ({ threadId }) => {
    dispatch(removeThread({ threadId }));
    // Note: selecting new thread is handled in selector/component logic
  });

  eventBus.on(ChatEvents.ThreadTitleUpdated, ({ threadId, newTitle }) => {
    dispatch(updateThread({ threadId, updates: { title: newTitle } }));
  });

  eventBus.on(ChatEvents.ThreadsReordered, ({ threads }) => {
    // Convert EnhancedChatThread to Thread
    const reorderedThreads: Thread[] = threads.map((t) => ({
      id: t.id,
      title: t.title,
      preview: t.preview,
      timestamp: t.timestamp,
      isTemporary: t.isTemporary,
    }));
    dispatch(setThreads(reorderedThreads));
  });

  eventBus.on(ChatEvents.ThreadTemporaryToggled, ({ threadId, isTemporary }) => {
    dispatch(updateThread({ threadId, updates: { isTemporary } }));
  });

  // Message effects
  eventBus.on(ChatEvents.MessageSent, ({ content }) => {
    // Draft implementation: Add user message to store
    // In real implementation, this would also call API and start streaming
    const state = store.getState() as RootState;
    const currentThreadId = state.chat.currentThreadId;

    if (!currentThreadId || !content.trim()) {
      return;
    }

    // Create user message
    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      threadId: currentThreadId,
      type: 'user',
      content: content.trim(),
      timestamp: new Date(),
    };

    // Add message to store
    dispatch(addMessage(userMessage));

    // Clear input
    dispatch(setInputValue(''));

    // Update thread preview with the new message
    dispatch(updateThread({
      threadId: currentThreadId,
      updates: {
        preview: content.trim().substring(0, 100),
        timestamp: new Date(),
      }
    }));

    // Simulate backend streaming response
    simulateStreamingResponse(currentThreadId);
  });

  eventBus.on(ChatEvents.MessageEditingStarted, ({ messageId, content }) => {
    dispatch(setEditingMessageId(messageId));
    dispatch(setEditedContent(content));
  });

  eventBus.on(ChatEvents.MessageEditedContentUpdated, ({ content }) => {
    dispatch(setEditedContent(content));
  });

  eventBus.on(ChatEvents.MessageEditSaved, ({ messageId, content }) => {
    dispatch(updateMessage({ messageId, updates: { content } }));
    dispatch(setEditingMessageId(null));
    dispatch(setEditedContent(''));
  });

  eventBus.on(ChatEvents.MessageEditCancelled, () => {
    dispatch(setEditingMessageId(null));
    dispatch(setEditedContent(''));
  });

  eventBus.on(ChatEvents.MessageLiked, ({ messageId }) => {
    dispatch(updateMessage({ 
      messageId, 
      updates: { liked: true, disliked: false } 
    }));
  });

  eventBus.on(ChatEvents.MessageDisliked, ({ messageId }) => {
    dispatch(updateMessage({ 
      messageId, 
      updates: { disliked: true, liked: false } 
    }));
  });

  eventBus.on(ChatEvents.MessageDeleted, ({ messageId }) => {
    dispatch(removeMessage({ messageId }));
  });

  eventBus.on(ChatEvents.MessageViewModeToggled, ({ messageId }) => {
    dispatch(toggleMessageRawMarkdown({ messageId }));
  });

  eventBus.on(ChatEvents.MessageRegenerated, ({ messageId }) => {
    // Get the message and thread info
    const state = store.getState() as RootState;
    const message = state.chat.messages.find((m) => m.id === messageId);

    if (!message) {
      return;
    }

    // Remove the message and all messages after it
    dispatch(removeMessage({ messageId }));
    dispatch(removeMessagesAfter({ messageId }));

    // Simulate backend streaming response for regeneration
    simulateStreamingResponse(message.threadId);
  });

  // Model and Context effects
  eventBus.on(ChatEvents.ModelChanged, ({ model }) => {
    dispatch(setCurrentModel(model));
  });

  eventBus.on(ChatEvents.ContextAdded, ({ contextId }) => {
    dispatch(addContextToList({ contextId }));
  });

  eventBus.on(ChatEvents.ContextRemoved, ({ contextId }) => {
    dispatch(removeContextFromList({ contextId }));
  });

  // File effects
  eventBus.on(ChatEvents.FileAttached, ({ file }) => {
    dispatch(addFileToList({ file }));
  });

  eventBus.on(ChatEvents.FileRemoved, ({ fileId }) => {
    dispatch(removeFileFromList({ fileId }));
  });

  // Input effects
  eventBus.on(ChatEvents.InputValueChanged, ({ value }) => {
    dispatch(setInputValue(value));
  });

  // Streaming effects
  eventBus.on(ChatEvents.StreamingStarted, ({ messageId: _messageId }) => {
    dispatch(setIsStreaming(true));
  });

  eventBus.on(ChatEvents.StreamingContentUpdated, ({ messageId, content }) => {
    dispatch(updateMessage({ messageId, updates: { content } }));
  });

  eventBus.on(ChatEvents.StreamingCompleted, () => {
    dispatch(setIsStreaming(false));
  });
};

/**
 * Cleanup chat effects
 * Called when unmounting (though effects typically live for app lifetime)
 */
export const cleanupChatEffects = (): void => {
  // EventBus cleanup would go here if needed
  // For now, effects live for the app lifetime
};
