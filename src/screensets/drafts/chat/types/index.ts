/**
 * Chat Types
 * Shared type definitions for chat screenset
 */

export interface Context {
  id: string;
  name: string;
  color: string;
}

export interface AttachedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  path: string; // URL.createObjectURL result
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
