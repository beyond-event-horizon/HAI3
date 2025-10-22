import React from 'react';
import { Overlay as UIKitOverlay } from '@/uikit';
import { useAppSelector, useAppDispatch } from '@/core/hooks/useRedux';
import { hideOverlay } from './overlaySlice';

/**
 * Core Overlay component
 * Wraps UI Kit Overlay and provides business logic integration
 */

export interface OverlayProps {
  // visible state and onClick handler are managed internally via Redux
}

export const Overlay: React.FC<OverlayProps> = () => {
  const dispatch = useAppDispatch();
  const visible = useAppSelector((state) => state.overlay.visible);

  const handleClick = () => {
    dispatch(hideOverlay());
  };

  return <UIKitOverlay visible={visible} onClick={handleClick} />;
};

Overlay.displayName = 'Overlay';
