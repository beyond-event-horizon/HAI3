> NOTE: the screensets/drafts/chat/ screenset has been generated and enhanced using the following prompt

# 🔧 SYSTEM INSTRUCTION

You are a senior front-end engineer working in a large-scale monorepo using the HAI3 / @.ai design system.
Your task is to design and implement a new “Chat” screenset in the Drafts category, following all repository and UI-kit conventions.

Follow the steps exactly. Do not skip or merge steps.
Before coding, summarize the work decomposition you will follow.
Each step must produce complete, syntactically correct TypeScript/React code ready to commit.

# ⚙️ PROJECT CONTEXT

Framework: React + TypeScript + Tailwind + shadcn/ui

Design system: @.ai (themes, components, repo layout)

Store: idiomatic local store or Zustand-style mock

API layer: simulated (mocked request/response, including streaming)

Repo modules to modify:

```
screens/drafts/chat/
ui-kit/
theme/@themeTypes.ts
```

# 🧩 OBJECTIVES (High-Level)

Goal: Introduce a new chat screenset under Drafts, visually close to the old ./HAI3-poc.old/src/components/screensets/fullmix/screens/chat implementation, with full mock functionality (chat threads, messages, editing, deletion, LLM/context selection, etc.), but without the right sidebar.

# 🪜 WORK DECOMPOSITION (execute step by step)

## Phase 1: Setup & Structure

Create screenset Drafts > Chat:

- Path: screens/drafts/chat/
- Follow naming, export, and index conventions of @.ai
- Add ChatScreen root component and placeholder layout

UI parity:

- Match the layout, structure, and visible elements of the old @chat implementation
- Put model selection and context switcher near the message composer as it was in original chat
- Put the temporary chat switcher near the model selection, as it was in original chat
- Omit the right sidebar entirely for now
- Add message timestamp formatting helper
- Implement scrolling to latest message
- Support placeholder avatars for each thread

## Phase 2: UI Kit & Theme Integration

UI-kit dependency audit

Identify all missing primitives and composites required by Chat (e.g., message bubble, thread list, input box)

Extend ui-kit/ so that the ChatScreen uses shared components only

Do not hardcode UI components inside the screen

Add in-screen left menu:

- Create InScreenMenu component with background color matching HAI3-poc.old chat
- The InScreenMenu left menu must take 100% of screen height
- Make it collapsible/expandable via a header icon (same behavior as original chat)
- Populate it with chat thread list, there must be 4 simulated threads with prepopulated messages inside, including code blocks, as it was in the HAI3-poc.old chat

Theme definitions

- Add a proper styling section in @themeTypes.ts
- Use colors from old chat; add equivalents for other themes
- Ensure icons and spacing follow @.ai alignment conventions

## Phase 3: Mocked API + Store

Simulate API layer

Implement mock handlers for:

- GET /threads
- GET /messages/:threadId
- POST /messages (send)
- PUT /messages/:id (edit)
- DELETE /messages/:id

Support streaming response simulation for chat messages

- Follow existing @.ai API simulation structure

Implement local store:

- Create a modular store for threads and messages (Zustand-like or matching @.ai store pattern)
- Ensure store and API layers are properly separated
- Fully support add/edit/delete/reset operations

## Phase 4: Chat Features

Context selection:

- Implement as a separate component (ChatContextSelector)
- Use API + store simulation in idiomatic way

Match old @chat functionality:

- LLM model selection
- Implement as separate component (ChatModelSelector)
- Connect via same API/store mock layer

Use design patterns from @.ai

Temporary Chat switcher:

- Implement as separate component (TemporaryChatToggle)
- Use same mock store pattern and API simulation

## Phase 5: Integration & Finalization

Integrate all components into ChatScreen:

- Left menu (collapsible)
- Message area (mock streaming)
- Context/model switchers

Message composer:

- Implement as separate component (ChatInput)
- Use same mock store pattern and API simulation

Message edit/delete/reset behavior:

- Implement as separate component (ChatMessageActions)
- Use same mock store pattern and API simulation

Theming & styling in @themeTypes.ts

Component reusability (no screen-specific hardcoding)

Proper folder structure and exports

# ✅ FINAL DELIVERABLES

- screens/drafts/chat/ChatScreen.tsx — full screen implementation
- ui-kit/chat/ — new shared components (e.g., MessageBubble, ChatInput, ThreadList, etc.)
- store/chatStore.ts — simulated store logic
- api/chatMock.ts — mock streaming handlers
- @themeTypes.ts — updated with new chat theme section

# 🚨 STRICT REQUIREMENTS

- MUST adhere to current @.ai guidelines (themes, components, repo layout, API/store structure)
- NO inline component definitions inside screen file
- NO shortcuts or skipped steps
- Each feature must use idiomatic, maintainable code patterns
- Ensure consistent naming, imports, and folder hierarchy
