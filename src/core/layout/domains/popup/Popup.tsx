import React from 'react';
import { Popup as UIKitPopup } from '@/uikit';
import { useAppSelector, useAppDispatch } from '@/core/hooks/useRedux';
import { closePopup } from './popupSlice';

/**
 * Core Popup component
 * Manages all popups from Redux state
 */

export interface PopupProps {
  // Popup stack is managed internally via Redux
}

export const Popup: React.FC<PopupProps> = () => {
  const dispatch = useAppDispatch();
  const popupStack = useAppSelector((state) => state.popup.stack);

  return (
    <>
      {popupStack.map((popup) => (
        <UIKitPopup
          key={popup.id}
          title={popup.title}
          open={true}
          onClose={() => dispatch(closePopup(popup.id))}
          zIndex={popup.zIndex}
        >
          <div>Popup: {popup.component}</div>
        </UIKitPopup>
      ))}
    </>
  );
};

Popup.displayName = 'Popup';
