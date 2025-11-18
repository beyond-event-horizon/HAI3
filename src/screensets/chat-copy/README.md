# Chat Screenset

A full-featured chat interface screenset for HAI3, implementing a modern chat UI with thread management, message history, LLM controls, file attachments, and drag-and-drop reordering.

## Overview

This screenset was generated and enhanced following the prompt in `PROMPT.md` and the reference implementation in `HAI3-poc.old/src/components/screensets/fullmix/screens/chat`. It adheres to all HAI3 architecture guidelines including:
- Event-driven architecture (EVENTS.md)
- Self-registering patterns (GUIDELINES.md)
- UI Kit component reuse (UIKIT.md)
- Proper screenset structure (SCREENSETS.md)
- Theme-aware styling (STYLING.md)

## Structure

```
chat/
├── chatScreenset.tsx          # Screenset configuration and icon registration
├── screens/
│   └── chat/
│       └── ChatScreen.tsx     # Main chat interface screen
├── store/
│   └── chatStore.ts           # Mock store for threads, messages, and files
├── hooks/
│   └── useChatStore.ts        # React hook for store integration
├── uikit/
│   ├── components/            # Screenset-specific UI components
│   │   ├── ModelSelector.tsx
│   │   ├── ContextSelector.tsx
│   │   ├── TemporaryChatToggle.tsx
│   │   ├── ChatTitleEditor.tsx
│   │   ├── EnhancedThreadList.tsx
│   │   └── FileAttachment.tsx
│   └── icons/
│       └── MessageSquareIcon.tsx
├── PROMPT.md                  # Original generation prompt
└── README.md                  # This file
```

## Features

### Implemented
- ✅ **Thread list with collapsible sidebar**
  - Drag-and-drop reordering
  - Inline title editing (double-click or edit button)
  - Edit and delete actions on hover
  - Timestamp display with smart formatting
  - Temporary chat indicator
  - Search functionality
  - Proper theme colors matching old implementation

- ✅ **Editable chat titles**
  - Header title editor with click-to-edit
  - Thread list inline editing
  - Save/cancel actions
  - Real-time updates across components

- ✅ **Message display**
  - User/assistant avatars (blue for user, green for assistant)
  - Proper markdown rendering with react-markdown
  - Code blocks with syntax highlighting and copy button
  - Message actions (copy always visible, others on hover):
    - Copy message
    - Edit message
    - Edit and reset conversation (RotateCcw)
    - Like message (ThumbsUp with green hover)
    - Dislike message (ThumbsDown with red hover)
    - Delete message
  - File attachment display
  - Proper spacing and layout
  - Typing indicator with animated dots

- ✅ **File attachments**
  - File selection button near input
  - Preview before sending
  - File type icons (image, document, generic)
  - Size formatting
  - Remove attached files
  - Display in sent messages

- ✅ **Enhanced context selection**
  - Multi-select dropdown
  - Context chips with colors
  - Add/remove contexts
  - Visual indicators
  - Positioned near attachment button (as in old version)

- ✅ **Message input**
  - Auto-resize textarea (50px-350px height)
  - Single line height when empty (50px)
  - Enter to send, Shift+Enter for new line
  - Context selector button (positioned bottom-right)
  - File attachment button (positioned bottom-right)
  - Send button with proper alignment (50px height)
  - Proper vertical alignment of send button and input

- ✅ **Controls and settings**
  - LLM model selection (GPT-4, GPT-3.5, Claude 3, Claude 2)
  - Temporary chat mode toggle
  - Mock streaming responses
  - Auto-scroll to latest message

- ✅ **Layout and styling**
  - Header height matches thread list header
  - Proper theme-aware colors
  - Responsive design
  - Smooth transitions
  - Pre-populated mock data with 4 threads
  - Code block support in messages

### Architecture Compliance

**Event-Driven**: Ready for integration with HAI3 event system
- Store actions can be converted to emit events
- Effects can be added to sync with Redux slices
- Currently uses local mock store for demonstration

**UI Kit Reuse**: Uses shared components from `@hai3/uikit`
- `MessageBubble` - Message display (from uikit)
- `Select` - Dropdowns for model selection (from uikit)
- `Switch` - Toggle for temporary mode (from uikit)
- `Button` - Action buttons (from uikit)
- All base components (Avatar, etc.)

**Screenset-Specific Components**: Custom components for chat features
- `EnhancedThreadList` - Thread list with drag-and-drop and inline editing
- `ChatTitleEditor` - Editable title component
- `ContextSelector` - Multi-select context dropdown
- `FileAttachment` - File selection and preview components
- `ModelSelector` - LLM model dropdown
- `TemporaryChatToggle` - Temporary mode switch
- `MarkdownRenderer` - Markdown rendering with code blocks (uses react-markdown + remark-gfm)

**Self-Registration**: Follows HAI3 patterns
- Icons registered in `chatScreenset.tsx`
- Screenset auto-registers in `screensetRegistry.tsx`
- No hardcoded IDs - all exported as constants

**Styling**: Follows STYLING.md guidelines
- Uses Tailwind utility classes
- Rem-based units
- Theme-aware via CSS variables
- No hardcoded colors

## Mock Data

The store includes 4 pre-populated threads:
1. **React Best Practices** - Discussion about React hooks with code examples
2. **TypeScript Generics** - Explanation of TypeScript generics
3. **CSS Grid Layout** - (Empty, ready for new messages)
4. **Temporary Chat** - Marked as temporary

## Usage

The screenset is automatically registered and available in the HAI3 app under the "Drafts" category.

Navigate to: **Drafts > Chat**

## Enhancements from Old Implementation

Features ported from `HAI3-poc.old` chat:
- ✅ File attachment simulation with preview
- ✅ Multi-select context dropdown
- ✅ Context chips with colors
- ✅ Drag-and-drop thread reordering
- ✅ Inline title editing in thread list
- ✅ Editable title in header
- ✅ Proper header/sidebar height alignment (h-16)
- ✅ Context selector near attachment button
- ✅ Theme-aware colors for sidebar
- ✅ Timestamp formatting (Just now, 5m, 2h, 3d)
- ✅ Edit/delete buttons on hover
- ✅ Temporary chat indicator icon
- ✅ Proper markdown rendering with code blocks
- ✅ Streaming simulation with typing indicator
- ✅ Message actions (copy, edit, reset, like, dislike, delete)
- ✅ Single-line input height (50px)
- ✅ Proper send button alignment
- ✅ InScreenMenu color schema in theme

## Future Enhancements

Potential additions (not in current scope):
- Real API integration
- Message editing UI with save/reset
- Message search within threads
- Export conversation
- Right sidebar (context panel)
- Markdown rendering in messages
- Syntax highlighting for code blocks
- Message reactions (thumbs up/down)
- Thread grouping/folders
- Message regeneration

## Development Notes

### Adding New Models
Edit `uikit/components/ModelSelector.tsx` and add to the `MODELS` array.

### Adding New Contexts
Edit `uikit/components/ContextSelector.tsx` and add to the `AVAILABLE_CONTEXTS` array with id, name, and color.

### Modifying Mock Data
Edit `store/chatStore.ts` constructor to change initial threads/messages.

### File Attachment Handling
File attachments are simulated using `URL.createObjectURL()`. For real implementation:
1. Replace with actual file upload API
2. Store file references in backend
3. Handle file download/preview
4. Add file type validation
5. Implement file size limits

### Markdown Rendering
Markdown is rendered using `react-markdown` with `remark-gfm` plugin:
- Code blocks with language detection
- Syntax highlighting styling (slate-800/900 background)
- Copy button for code blocks
- Inline code with muted background
- Lists, headings, blockquotes, links
- Matches old implementation's color scheme

### Event Integration
To integrate with HAI3 event system:
1. Create event types in `@hai3/uicore` events
2. Convert store actions to emit events
3. Add effects to sync with Redux slices
4. Follow EVENTS.md patterns

## Compliance Checklist

- ✅ No hardcoded strings (all IDs are constants)
- ✅ No direct slice dispatch (uses local store, ready for events)
- ✅ Uses UI Kit components where available
- ✅ Self-registering icons
- ✅ Proper TypeScript types (no `any`)
- ✅ Vertical slice architecture
- ✅ Screenset-specific components properly isolated
- ✅ Proper import paths (relative for siblings, alias for cross-branch)
- ✅ No circular dependencies
- ✅ Theme-aware styling (uses CSS variables)
- ✅ Rem-based units throughout
- ✅ No hardcoded colors
- ✅ Follows old implementation patterns where applicable
