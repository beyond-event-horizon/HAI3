import React from 'react';
import { useAppSelector, useAppDispatch } from '../../../hooks/useRedux';
import { hideOverlay } from './overlaySlice';

export interface OverlayProps {}

export const Overlay: React.FC<OverlayProps> = () => {
  const { visible } = useAppSelector((state) => state.overlay);
  const dispatch = useAppDispatch();

  if (!visible) return null;

  return (
    <div className="fixed inset-0 transition-opacity duration-300 bg-black/50 backdrop-blur-sm z-40" onClick={() => dispatch(hideOverlay())} />
  );
};

Overlay.displayName = 'Overlay';
