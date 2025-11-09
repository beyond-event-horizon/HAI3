import { uikitRegistry } from '../uikit/uikitRegistry';
import { useTranslation } from '../i18n/useTranslation';
import { LanguageDisplayMode, TextDirection } from '../i18n/types';
import { UiKitComponent, ButtonVariant } from '@hai3/uikit-contracts';

/**
 * LanguageSelector constants
 */
const FALLBACK_SELECT_LANGUAGE_TEXT = 'Select language';
const RTL_INDICATOR_SUFFIX = ' (RTL)';

export interface LanguageSelectorProps {
  /**
   * Show language names in their native script or English
   * @default LanguageDisplayMode.Native
   */
  displayMode?: LanguageDisplayMode;
}

/**
 * Language Selector Component
 * 
 * Allows users to switch between supported languages
 * Changes apply immediately without page reload
 * Automatically updates HTML dir attribute for RTL support
 * 
 * @example
 * ```tsx
 * import { LanguageSelector, LanguageDisplayMode } from '@hai3/uicore';
 * 
 * <LanguageSelector displayMode={LanguageDisplayMode.Native} />
 * ```
 */
export function LanguageSelector({ 
  displayMode = LanguageDisplayMode.Native
}: LanguageSelectorProps = {}) {
  const { language, changeLanguage, getSupportedLanguages } = useTranslation();
  
  const DropdownMenu = uikitRegistry.getComponent(UiKitComponent.DropdownMenu);
  const DropdownMenuTrigger = uikitRegistry.getComponent(UiKitComponent.DropdownMenuTrigger);
  const DropdownMenuContent = uikitRegistry.getComponent(UiKitComponent.DropdownMenuContent);
  const DropdownMenuItem = uikitRegistry.getComponent(UiKitComponent.DropdownMenuItem);
  const Button = uikitRegistry.getComponent(UiKitComponent.Button);

  const languages = getSupportedLanguages();
  const currentLanguage = languages.find(lang => lang.code === language);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={ButtonVariant.Outline}>
          {currentLanguage 
            ? (displayMode === LanguageDisplayMode.Native ? currentLanguage.name : currentLanguage.englishName)
            : FALLBACK_SELECT_LANGUAGE_TEXT
          }
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem 
            key={lang.code} 
            onClick={() => changeLanguage(lang.code)}
          >
            {displayMode === LanguageDisplayMode.Native ? lang.name : lang.englishName}
            {lang.direction === TextDirection.RightToLeft && RTL_INDICATOR_SUFFIX}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
