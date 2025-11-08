/**
 * MessageBubble - Chat message display component
 * Pure presentational component for displaying chat messages
 */

import { User, Bot } from 'lucide-react';
import { Avatar, AvatarFallback } from '../../base/avatar';

export enum MessageType {
  User = 'user',
  Assistant = 'assistant',
}

export interface MessageBubbleProps {
  type: MessageType;
  content: string;
  timestamp?: Date;
  className?: string;
  onCopy?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const MessageBubble = ({
  type,
  content,
  className = '',
  onCopy,
  onEdit,
  onDelete,
}: MessageBubbleProps) => {
  const isUser = type === MessageType.User;

  return (
    <div className={`flex gap-4 group ${className}`}>
      {/* Avatar */}
      <Avatar className="h-8 w-8 flex-shrink-0">
        <AvatarFallback
          className={isUser ? 'bg-blue-500 text-white' : 'bg-green-500 text-white'}
        >
          {isUser ? <User size={16} /> : <Bot size={16} />}
        </AvatarFallback>
      </Avatar>

      {/* Message content */}
      <div className="flex-1 min-w-0">
        <div className="prose prose-sm max-w-none">
          <div className="leading-relaxed whitespace-pre-wrap">{content}</div>
        </div>

        {/* Message actions */}
        {(onCopy || onEdit || onDelete) && (
          <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {onCopy && (
              <button
                onClick={onCopy}
                className="p-1.5 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"
                title="Copy message"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
              </button>
            )}
            {onEdit && (
              <button
                onClick={onEdit}
                className="p-1.5 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"
                title="Edit message"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </button>
            )}
            {onDelete && (
              <button
                onClick={onDelete}
                className="p-1.5 hover:bg-destructive/10 rounded-lg transition-colors text-muted-foreground hover:text-destructive"
                title="Delete message"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
