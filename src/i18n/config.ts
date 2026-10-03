/** All locales the site knows about. `planned` locales have translation files but no routes yet. */
export const locales = ['en', 'de', 'sl'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export interface LocaleInfo {
  code: Locale;
  /** Name of the language in that language, shown in the switcher. */
  nativeName: string;
  /** BCP 47 tag for `lang` and `hreflang` attributes. */
  bcp47: string;
  /** Locale used for date formatting. */
  dateLocale: string;
  status: 'live' | 'planned';
}

export const localeInfo: Record<Locale, LocaleInfo> = {
  en: { code: 'en', nativeName: 'English', bcp47: 'en', dateLocale: 'en-GB', status: 'live' },
  de: { code: 'de', nativeName: 'Deutsch', bcp47: 'de', dateLocale: 'de-DE', status: 'live' },
  sl: { code: 'sl', nativeName: 'Slovenščina', bcp47: 'sl', dateLocale: 'sl-SI', status: 'planned' },
};

/** Locales that are published and offered in the switcher. */
export const liveLocales: readonly Locale[] = locales.filter((l) => localeInfo[l].status === 'live');

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (locales as readonly string[]).includes(value);
}

export function isLiveLocale(value: unknown): value is Locale {
  return isLocale(value) && localeInfo[value].status === 'live';
}
