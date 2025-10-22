import React, { useEffect } from 'react';
import { Layout } from '@/core/layout';
import { DemoScreen } from '@/screensets/drafts/DemoScreen';
import { useAppDispatch } from '@/core/hooks/useRedux';
import {
  setHeaderConfig,
  setFooterConfig,
  setMenuConfig,
  type MenuItem,
} from '@/core/store';

/**
 * Main HAI3 Application Component
 * Initializes layout domain configurations via Redux
 */

const menuItems: MenuItem[] = [
  {
    id: 'home',
    label: 'Home',
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    id: 'screens',
    label: 'Screens',
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
        <line x1="9" x2="9" y1="3" y2="21" />
      </svg>
    ),
    children: [
      { id: 'drafts', label: 'Drafts' },
      { id: 'mockups', label: 'Mockups' },
      { id: 'production', label: 'Production' },
    ],
  },
  {
    id: 'components',
    label: 'Components',
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2v20M2 12h20" />
      </svg>
    ),
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
];

const App: React.FC = () => {
  const dispatch = useAppDispatch();

  // Initialize layout configuration on mount
  useEffect(() => {
    // Header configuration
    dispatch(
      setHeaderConfig({
        logo: (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-primary-foreground font-bold">
              H3
            </div>
            <span className="text-lg font-semibold">HAI3 UI-Core</span>
          </div>
        ),
        actions: (
          <div className="flex gap-2">
            <button className="px-3 py-1.5 text-sm rounded hover:bg-accent transition-colors">
              Profile
            </button>
            <button className="px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors">
              Sign Out
            </button>
          </div>
        ),
        showMenuToggle: true,
      })
    );

    // Menu configuration
    dispatch(
      setMenuConfig({
        items: menuItems,
        visible: true,
      })
    );

    // Footer configuration
    dispatch(
      setFooterConfig({
        copyright: '© 2025 HAI3 UI-Core',
        links: [
          { label: 'Documentation', href: '#' },
          { label: 'GitHub', href: '#' },
          { label: 'Support', href: '#' },
        ],
        visible: true,
      })
    );
  }, [dispatch]);

  return (
    <Layout>
      <DemoScreen />
    </Layout>
  );
};

export default App;
