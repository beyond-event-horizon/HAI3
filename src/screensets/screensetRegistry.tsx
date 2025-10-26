import { screensetService, type ScreensetConfig } from '@hai3/uicore';
import { HelloWorldScreen } from './drafts/demo/screens/helloworld/HelloWorldScreen';
import { DemoIconId } from './drafts/demo/uikit/icons/IconId';
import './drafts/demo/uikit/icons/WorldIcon'; // Auto-registers on import

/**
 * Screenset Registry
 * Self-registers screensets with UI Core on import
 * App just needs to import this file
 */

/**
 * Demo Screenset Configuration
 */
const demoScreenset: ScreensetConfig = {
  id: 'demo',
  name: 'Demo',
  category: 'drafts',
  defaultScreen: 'helloworld',
  screens: {
    helloworld: HelloWorldScreen,
  },
  menuItems: [
    {
      id: 'helloworld',
      label: 'Hello World',
      icon: DemoIconId.World,
    },
  ],
};

/**
 * Register screenset
 * This runs automatically when the module is imported
 * Icons self-register when their files are imported above
 */
screensetService.register(demoScreenset);

// Add more screensets here and they'll auto-register
// screensetService.register(anotherScreenset);
