/**
 * RouterSync Component
 * Synchronizes URL with Redux state (two-way binding)
 * Follows event-driven pattern - dispatches actions, effects handle state
 */

import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppSelector } from '../../hooks/useRedux';
import { navigateToScreen } from '../actions';
import { routeRegistry } from './routeRegistry';

/**
 * RouterSync Component
 * Handles bidirectional sync between URL and Redux state
 * - URL changes → dispatches navigation action → effects update Redux
 * - Redux changes → updates URL via navigate()
 */
export function RouterSync() {
  const navigate = useNavigate();
  const params = useParams<{ screenId: string }>();

  const selectedScreen = useAppSelector((state) => state.uicore.layout.selectedScreen);
  
  // URL → Redux: When URL changes, dispatch navigation action
  useEffect(() => {
    const urlScreenId = params.screenId;
    
    if (urlScreenId && routeRegistry.hasScreen(urlScreenId)) {
      // Call action directly (pure function) → effects handle screenset switching and state update
      navigateToScreen(urlScreenId);
    }
    
  }, [params.screenId]); // Only re-run when URL changes, not when selectedScreen changes
  
  // Redux → URL: When Redux state changes, update URL
  useEffect(() => {
    if (selectedScreen) {
      const expectedPath = `/${selectedScreen}`;
      const currentPath = `/${params.screenId}`;
      
      if (expectedPath !== currentPath) {
        navigate(expectedPath, { replace: true });
      }
    }
  }, [selectedScreen, navigate, params.screenId]);
  
  return null;
}
