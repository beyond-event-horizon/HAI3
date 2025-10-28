import React from 'react';
import { useAppSelector, useAppDispatch } from '@/core/hooks/useRedux';
import { closePopup } from './popupSlice';

export interface PopupProps {}

export const Popup: React.FC<PopupProps> = () => {
  const { content, title, visible } = useAppSelector((state) => state.popup);
  const dispatch = useAppDispatch();

  if (!visible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => dispatch(closePopup())} />
      <div className="relative z-10 w-full max-w-md bg-background rounded-lg shadow-lg flex flex-col max-h-[90vh]">
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <h2 className="text-lg font-semibold">{title}</h2>
            <button onClick={() => dispatch(closePopup())} className="p-1 rounded hover:bg-accent transition-colors" aria-label="Close popup">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        )}
        <div className="flex-1 overflow-auto px-6 py-4">{content}</div>
      </div>
    </div>
  );
};

Popup.displayName = 'Popup';
