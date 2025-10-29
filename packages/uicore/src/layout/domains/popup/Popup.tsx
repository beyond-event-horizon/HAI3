import React from 'react';
import { IconButton, ButtonVariant, IconButtonSize } from '@hai3/uikit';
import { useAppSelector, useAppDispatch } from '@/core/hooks/useRedux';
import { closePopup } from './popupSlice';
import { iconService } from '@/core/icons/iconService';

export interface PopupProps {}

export const Popup: React.FC<PopupProps> = () => {
  const { stack } = useAppSelector((state) => state.popup);
  const dispatch = useAppDispatch();

  if (stack.length === 0) return null;

  const topPopup = stack[stack.length - 1];
  const closeIcon = iconService.get('close');

  return (
    <div className="fixed inset-0 flex items-center justify-center" style={{ zIndex: topPopup.zIndex }}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => dispatch(closePopup(topPopup.id))} />
      <div className="relative z-10 w-full max-w-md bg-background rounded-lg shadow-lg flex flex-col max-h-[90vh]">
        {topPopup.title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <h2 className="text-lg font-semibold">{topPopup.title}</h2>
            {closeIcon && (
              <IconButton
                variant={ButtonVariant.Ghost}
                size={IconButtonSize.Small}
                onClick={() => dispatch(closePopup(topPopup.id))}
                aria-label="Close popup"
              >
                {closeIcon}
              </IconButton>
            )}
          </div>
        )}
        <div className="flex-1 overflow-auto px-6 py-4">{topPopup.component}</div>
      </div>
    </div>
  );
};

Popup.displayName = 'Popup';
