/**
 * ContextSelectorContainer - Container component for ContextSelector
 * Handles business logic and Redux connection per SCREENSETS.md guidelines
 */

import React from 'react';
import { useSelector } from 'react-redux';
import type { ChatRootState } from '../chatStore';
import { ContextSelector, SelectedContextsDisplay } from '../uikit/components/ContextSelector';
import * as chatActions from '../actions/chatActions';

export interface ContextSelectorContainerProps {
  className?: string;
}

export const ContextSelectorContainer: React.FC<ContextSelectorContainerProps> = ({
  className = '',
}) => {
  const availableContexts = useSelector((state: ChatRootState) => state.chat.availableContexts);
  const selectedContexts = useSelector((state: ChatRootState) => state.chat.currentContext);

  const handleToggle = (contextId: string): void => {
    if (selectedContexts.includes(contextId)) {
      chatActions.removeContext(contextId);
    } else {
      chatActions.addContext(contextId);
    }
  };

  const handleRemove = (contextId: string): void => {
    chatActions.removeContext(contextId);
  };

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <ContextSelector
        availableContexts={availableContexts}
        selectedContexts={selectedContexts}
        onToggle={handleToggle}
      />
      <SelectedContextsDisplay
        availableContexts={availableContexts}
        selectedContexts={selectedContexts}
        onRemove={handleRemove}
      />
    </div>
  );
};
