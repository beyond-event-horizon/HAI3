import { i18nRegistry } from '@hai3/uicore';
import { devtoolsTranslations } from './translationLoader';

/**
 * Register DevTools translations on module import
 * This ensures translations are available before any component renders
 */
i18nRegistry.registerLoader('devtools', devtoolsTranslations);
