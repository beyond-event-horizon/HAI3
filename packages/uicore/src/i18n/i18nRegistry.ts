import { Language, TextDirection, SUPPORTED_LANGUAGES, I18N_NAMESPACE_SEPARATOR, I18N_PATH_SEPARATOR, I18N_DEFAULT_NAMESPACE, HTML_LANG_ATTRIBUTE, HTML_DIR_ATTRIBUTE } from './types';
import type { TranslationDictionary, I18nConfig, LanguageMetadata, TranslationLoader } from './types';

/**
 * I18n Registry - Central translation management
 * 
 * Features:
 * - Namespace-based translations (namespace:key.subkey)
 * - Fallback chain (requested → fallback → key)
 * - Parameter interpolation ({param})
 * - Lazy loading with dynamic imports
 * - RTL support
 * - No reload on language change
 */
export class I18nRegistry {
  private dictionaries = new Map<string, Map<Language, TranslationDictionary>>();
  // namespace → language → translations
  
  private loaders = new Map<string, TranslationLoader>();
  // namespace → loader function
  
  private currentLanguage: Language = Language.English;
  private fallbackLanguage: Language = Language.English;

  constructor(config?: Partial<I18nConfig>) {
    if (config) {
      this.fallbackLanguage = config.fallbackLanguage ?? Language.English;
      this.currentLanguage = config.defaultLanguage ?? Language.English;
    }
  }

  /**
   * Register translations for a namespace
   * @param namespace - e.g., 'uikit', 'screenset.demo', 'app'
   * @param language - Language enum value
   * @param translations - Translation dictionary
   */
  register(namespace: string, language: Language, translations: TranslationDictionary): void {
    if (!this.dictionaries.has(namespace)) {
      this.dictionaries.set(namespace, new Map());
    }
    this.dictionaries.get(namespace)!.set(language, translations);
  }

  /**
   * Translate a key
   * @param key - Format: 'namespace:key.subkey' or just 'key' for default namespace
   * @param params - Interpolation parameters
   * @returns Translated string
   */
  t(key: string, params?: Record<string, string | number | boolean>): string {
    const { namespace, path } = this.parseKey(key);

    // Try current language
    let translation = this.lookup(namespace, path, this.currentLanguage);
    if (translation) {
      return this.interpolate(translation, params);
    }

    // Try fallback language
    if (this.currentLanguage !== this.fallbackLanguage) {
      translation = this.lookup(namespace, path, this.fallbackLanguage);
      if (translation) {
        return this.interpolate(translation, params);
      }
    }

    // Return key as last resort
    return key;
  }

  /**
   * Set current language, update HTML attributes, and load translations
   * Called by appEffects in response to LanguageChanged event
   * Does NOT emit events (follows Flux: Effect updates own domain only)
   */
  async setLanguage(language: Language): Promise<void> {
    if (this.currentLanguage === language) return;

    const metadata = this.getLanguageMetadata(language);
    if (!metadata) {
      console.error(`[i18n] Unsupported language: ${language}`);
      return;
    }

    this.currentLanguage = language;

    // Update HTML attributes for RTL support
    document.documentElement.setAttribute(HTML_LANG_ATTRIBUTE, language);
    document.documentElement.setAttribute(HTML_DIR_ATTRIBUTE, metadata.direction);

    // Load translations for the new language
    await this.loadLanguage(language);
  }

  /**
   * Get current language
   */
  getLanguage(): Language {
    return this.currentLanguage;
  }

  /**
   * Get language metadata
   */
  getLanguageMetadata(code?: Language): LanguageMetadata | undefined {
    return SUPPORTED_LANGUAGES.find(lang => lang.code === (code ?? this.currentLanguage));
  }

  /**
   * Get all supported languages
   */
  getSupportedLanguages(): LanguageMetadata[] {
    return SUPPORTED_LANGUAGES;
  }

  /**
   * Check if language is RTL
   */
  isRTL(code?: Language): boolean {
    return this.getLanguageMetadata(code)?.direction === TextDirection.RightToLeft;
  }

  /**
   * Check if namespace is registered
   */
  hasNamespace(namespace: string): boolean {
    return this.dictionaries.has(namespace);
  }

  /**
   * Get all registered namespaces
   */
  getNamespaces(): string[] {
    return Array.from(this.dictionaries.keys());
  }

  /**
   * Register translation loader for a namespace
   * Loader is called on-demand when language changes
   * 
   * @param namespace - Namespace identifier (e.g., 'screenset.demo')
   * @param loader - Function that loads translations for a language
   */
  registerLoader(namespace: string, loader: TranslationLoader): void {
    this.loaders.set(namespace, loader);
  }

  /**
   * Load translations for a specific language
   * Calls all registered loaders and registers their translations
   * 
   * Note: Usually called automatically by setLanguage()
   * Only call directly for preloading languages before they're selected
   * 
   * @param language - Language to load
   */
  async loadLanguage(language: Language): Promise<void> {
    const loadPromises: Promise<void>[] = [];

    for (const [namespace, loader] of this.loaders) {
      const promise = (async () => {
        try {
          const translations = await loader(language);
          this.register(namespace, language, translations);
        } catch (error) {
          console.error(`[i18n] Failed to load translations for namespace '${namespace}', language '${language}':`, error);
        }
      })();
      
      loadPromises.push(promise);
    }

    await Promise.all(loadPromises);
  }

  /**
   * Preload translations for multiple languages
   * Useful for loading common languages eagerly
   * 
   * @param languages - Array of languages to preload
   */
  async preloadLanguages(languages: Language[]): Promise<void> {
    for (const language of languages) {
      await this.loadLanguage(language);
    }
  }

  /**
   * Parse key into namespace and path
   * 'uikit:button.submit' → { namespace: 'uikit', path: 'button.submit' }
   * 'button.submit' → { namespace: 'app', path: 'button.submit' }
   */
  private parseKey(key: string): { namespace: string; path: string } {
    const colonIndex = key.indexOf(I18N_NAMESPACE_SEPARATOR);
    if (colonIndex === -1) {
      return { namespace: I18N_DEFAULT_NAMESPACE, path: key };
    }
    return {
      namespace: key.substring(0, colonIndex),
      path: key.substring(colonIndex + 1),
    };
  }

  /**
   * Look up translation in dictionary
   */
  private lookup(namespace: string, path: string, language: Language): string | null {
    const dict = this.dictionaries.get(namespace)?.get(language);
    if (!dict) return null;

    const keys = path.split(I18N_PATH_SEPARATOR);
    let value: TranslationDictionary | string = dict;
    
    for (const key of keys) {
      if (typeof value === 'string') return null;
      value = value[key];
      if (value === undefined) return null;
    }

    return typeof value === 'string' ? value : null;
  }

  /**
   * Interpolate parameters into a translation string
   * 'Hello {name}!' + { name: 'John' } → 'Hello John!'
   */
  private interpolate(text: string, params?: Record<string, string | number | boolean>): string {
    if (!params) return text;
    
    return text.replace(/\{(\w+)\}/g, (match, key) => {
      const value = params[key];
      return value !== undefined ? String(value) : match;
    });
  }
}

// Singleton instance
export const i18nRegistry = new I18nRegistry({
  defaultLanguage: Language.English,
  fallbackLanguage: Language.English,
});
