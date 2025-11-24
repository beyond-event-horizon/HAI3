import { split } from 'lodash';
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
 * - Translation loader creation utilities
 * - Auto-discovery from directory paths
 */
export class I18nRegistry {
  /**
   * Maps Language enum values to their corresponding JSON file names
   * Used by registerFromDirectory() for auto-discovery
   */
  static readonly LANGUAGE_FILE_MAP: Record<Language, string> = {
    // Western European
    [Language.English]: 'en.json',
    [Language.Spanish]: 'es.json',
    [Language.French]: 'fr.json',
    [Language.German]: 'de.json',
    [Language.Italian]: 'it.json',
    [Language.Portuguese]: 'pt.json',
    [Language.Dutch]: 'nl.json',

    // Eastern European
    [Language.Russian]: 'ru.json',
    [Language.Polish]: 'pl.json',
    [Language.Ukrainian]: 'uk.json',
    [Language.Czech]: 'cs.json',

    // Middle East & North Africa (RTL)
    [Language.Arabic]: 'ar.json',
    [Language.Hebrew]: 'he.json',
    [Language.Persian]: 'fa.json',
    [Language.Urdu]: 'ur.json',
    [Language.Turkish]: 'tr.json',

    // Asian
    [Language.ChineseSimplified]: 'zh.json',
    [Language.ChineseTraditional]: 'zh-TW.json',
    [Language.Japanese]: 'ja.json',
    [Language.Korean]: 'ko.json',
    [Language.Vietnamese]: 'vi.json',
    [Language.Thai]: 'th.json',
    [Language.Indonesian]: 'id.json',
    [Language.Hindi]: 'hi.json',
    [Language.Bengali]: 'bn.json',

    // Nordic
    [Language.Swedish]: 'sv.json',
    [Language.Danish]: 'da.json',
    [Language.Norwegian]: 'no.json',
    [Language.Finnish]: 'fi.json',

    // Other
    [Language.Greek]: 'el.json',
    [Language.Romanian]: 'ro.json',
    [Language.Hungarian]: 'hu.json',

    // Additional major languages
    [Language.Malay]: 'ms.json',
    [Language.Tagalog]: 'tl.json',
    [Language.Tamil]: 'ta.json',
    [Language.Swahili]: 'sw.json',
  };

  /**
   * Create a translation loader function from a map of language-specific imports
   *
   * This helper eliminates boilerplate when building translation loaders for screensets.
   * Screensets provide a map of imports (which must be in the same file for Vite to analyze),
   * and this function returns a loader function compatible with the registry.
   *
   * @param translationMap - Map of Language to dynamic import functions
   * @returns Translation loader function
   *
   * @example
   * ```typescript
   * // In demoScreenset.tsx
   * const screensetLoader = I18nRegistry.createLoader({
   *   [Language.English]: () => import('./i18n/en.json'),
   *   [Language.Spanish]: () => import('./i18n/es.json'),
   *   // ... all 36 languages
   * });
   *
   * export const demoScreenset: ScreensetConfig = {
   *   localization: screensetLoader,
   *   // ...
   * };
   * ```
   */
  static createLoader(
    translationMap: Record<Language, () => Promise<{ default: TranslationDictionary }>>
  ): TranslationLoader {
    return async (language: Language): Promise<TranslationDictionary> => {
      try {
        const module = await translationMap[language]();
        return module.default;
      } catch (error) {
        console.error(
          `[i18n] Failed to load ${language} translations (${I18nRegistry.LANGUAGE_FILE_MAP[language]}):`,
          error
        );
        return {};
      }
    };
  }
  private dictionaries = new Map<string, Map<Language, TranslationDictionary>>();
  // namespace → language → translations
  
  private loaders = new Map<string, TranslationLoader>();
  // namespace → loader function
  
  private currentLanguage: Language | null = null; // null until first language is set

  constructor(_config?: Partial<I18nConfig>) {
    // No default language - wait for user's language to be loaded
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

    // Try current language (if set)
    if (this.currentLanguage) {
      const translation = this.lookup(namespace, path, this.currentLanguage);
      if (translation) {
        return this.interpolate(translation, params);
      }
    }

    // Return key as last resort (no language loaded yet)
    return key;
  }

  /**
   * Set current language, update HTML attributes, and load translations
   * Called by appEffects in response to LanguageChanged event
   * Does NOT emit events (follows Flux: Effect updates own domain only)
   */
  async setLanguage(language: Language): Promise<void> {
    const metadata = this.getLanguageMetadata(language);
    if (!metadata) {
      console.error(`[i18n] Unsupported language: ${language}`);
      return;
    }

    // Always update currentLanguage and HTML attributes
    this.currentLanguage = language;

    // Update HTML attributes for RTL support
    document.documentElement.setAttribute(HTML_LANG_ATTRIBUTE, language);
    document.documentElement.setAttribute(HTML_DIR_ATTRIBUTE, metadata.direction);

    // Always load translations (idempotent - won't reload if already loaded)
    await this.loadLanguage(language);
  }

  /**
   * Get current language
   * Returns null if no language set yet
   */
  getLanguage(): Language | null {
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
   * Auto-discover translation files in a directory and register them
   *
   * This method eliminates the need for manual `Record<Language, ...>` maps by automatically
   * mapping all 36 languages to their corresponding JSON files (e.g., Language.English → en.json).
   *
   * @param namespace - Translation namespace (e.g., 'screenset.demo', 'screen.demo.helloworld')
   * @param relativePath - Path to i18n directory relative to the caller (e.g., './i18n', './screens/hello/i18n')
   *
   * @example
   * ```typescript
   * // Register screenset-level translations
   * i18nRegistry.registerFromDirectory('screenset.demo', './i18n');
   * ```
   *
   * @example
   * ```typescript
   * // Register screen-level translations
   * i18nRegistry.registerFromDirectory('screen.demo.helloworld', './screens/helloworld/i18n');
   * ```
   */
  registerFromDirectory(namespace: string, relativePath: string): void {
    // Build dynamic import map for all languages
    const translationMap: Record<Language, () => Promise<{ default: TranslationDictionary }>> =
      {} as Record<Language, () => Promise<{ default: TranslationDictionary }>>;

    for (const [language, filename] of Object.entries(I18nRegistry.LANGUAGE_FILE_MAP)) {
      const lang = language as Language;
      // Use dynamic import with @vite-ignore to allow runtime path resolution
      translationMap[lang] = () => import(/* @vite-ignore */ `${relativePath}/${filename}`);
    }

    // Register loader using the static createLoader method
    this.registerLoader(namespace, I18nRegistry.createLoader(translationMap));
  }

  /**
   * Load translations for a specific language
   * Calls registered loaders and registers their translations
   *
   * Note: Usually called automatically by setLanguage()
   * Only call directly for preloading languages before they're selected
   *
   * IMPORTANT:
   * - Screen-level translations (screen.*) are loaded lazily by useScreenTranslations hook
   * - Screenset-level translations (screenset.*) are loaded lazily when screenset is selected
   * - Only core translations (uikit, app, etc.) are loaded during language change
   *
   * @param language - Language to load
   */
  async loadLanguage(language: Language): Promise<void> {
    const loadPromises: Promise<void>[] = [];

    for (const [namespace, loader] of this.loaders) {
      // Skip screen-level loaders - they're loaded by useScreenTranslations hook
      if (namespace.startsWith('screen.')) {
        continue;
      }

      // Skip screenset-level loaders - they're loaded when screenset is selected
      // This enables lazy loading: only active screenset translations are loaded
      if (namespace.startsWith('screenset.')) {
        continue;
      }

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
   * Load translations for a specific screenset
   * Called when navigating to a screenset or when language changes while a screenset is active
   *
   * @param screensetId - The screenset ID (e.g., 'demo', 'chat')
   * @param language - Language to load (defaults to current language)
   */
  async loadScreensetTranslations(screensetId: string, language?: Language): Promise<void> {
    const lang = language ?? this.currentLanguage;
    if (!lang) {
      console.warn('[i18n] Cannot load screenset translations: no language set');
      return;
    }

    const namespace = `screenset.${screensetId}`;
    const loader = this.loaders.get(namespace);

    if (!loader) {
      console.warn(`[i18n] No loader registered for namespace '${namespace}'`);
      return;
    }

    // Skip if already loaded for this language
    const existingDict = this.dictionaries.get(namespace)?.get(lang);
    if (existingDict) {
      return;
    }

    try {
      const translations = await loader(lang);
      this.register(namespace, lang, translations);
    } catch (error) {
      console.error(`[i18n] Failed to load translations for namespace '${namespace}', language '${lang}':`, error);
    }
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
    const parts = split(key, I18N_NAMESPACE_SEPARATOR, 2);
    if (parts.length === 1) {
      return { namespace: I18N_DEFAULT_NAMESPACE, path: key };
    }
    return {
      namespace: parts[0],
      path: parts[1],
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
