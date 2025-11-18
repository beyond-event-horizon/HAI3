import { I18nRegistry, Language } from '@hai3/uicore';

/**
 * DevTools Translation Loader
 * All 36 languages must be provided for type safety
 * Namespace: "devtools"
 */
export const devtoolsTranslations = I18nRegistry.createLoader({
  [Language.English]: () => import('./en.json'),
  [Language.Arabic]: () => import('./ar.json'),
  [Language.Bengali]: () => import('./bn.json'),
  [Language.Czech]: () => import('./cs.json'),
  [Language.Danish]: () => import('./da.json'),
  [Language.German]: () => import('./de.json'),
  [Language.Greek]: () => import('./el.json'),
  [Language.Spanish]: () => import('./es.json'),
  [Language.Persian]: () => import('./fa.json'),
  [Language.Finnish]: () => import('./fi.json'),
  [Language.French]: () => import('./fr.json'),
  [Language.Hebrew]: () => import('./he.json'),
  [Language.Hindi]: () => import('./hi.json'),
  [Language.Hungarian]: () => import('./hu.json'),
  [Language.Indonesian]: () => import('./id.json'),
  [Language.Italian]: () => import('./it.json'),
  [Language.Japanese]: () => import('./ja.json'),
  [Language.Korean]: () => import('./ko.json'),
  [Language.Malay]: () => import('./ms.json'),
  [Language.Dutch]: () => import('./nl.json'),
  [Language.Norwegian]: () => import('./no.json'),
  [Language.Polish]: () => import('./pl.json'),
  [Language.Portuguese]: () => import('./pt.json'),
  [Language.Romanian]: () => import('./ro.json'),
  [Language.Russian]: () => import('./ru.json'),
  [Language.Swedish]: () => import('./sv.json'),
  [Language.Swahili]: () => import('./sw.json'),
  [Language.Tamil]: () => import('./ta.json'),
  [Language.Thai]: () => import('./th.json'),
  [Language.Tagalog]: () => import('./tl.json'),
  [Language.Turkish]: () => import('./tr.json'),
  [Language.Ukrainian]: () => import('./uk.json'),
  [Language.Urdu]: () => import('./ur.json'),
  [Language.Vietnamese]: () => import('./vi.json'),
  [Language.ChineseTraditional]: () => import('./zh-TW.json'),
  [Language.ChineseSimplified]: () => import('./zh.json'),
});
