import { defaultLocale, isLiveLocale, liveLocales, localeInfo, type Locale } from './config';

/** Pages that exist in every live locale (the docs are handled by Starlight). */
export const pageIds = ['home', 'demo', 'imprint', 'privacy', 'docs'] as const;
export type PageId = (typeof pageIds)[number];

/** Localised slugs. A missing entry falls back to the English slug. */
const slugs: Record<PageId, Partial<Record<Locale, string>> & { en: string }> = {
  home: { en: '' },
  demo: { en: 'demo' },
  imprint: { en: 'imprint', de: 'impressum' },
  privacy: { en: 'privacy', de: 'datenschutz' },
  docs: { en: 'docs' },
};

export function slugFor(page: PageId, locale: Locale): string {
  return slugs[page][locale] ?? slugs[page].en;
}

/** Root-relative path with trailing slash, e.g. `/`, `/de/`, `/de/impressum/`. */
export function pathFor(page: PageId, locale: Locale): string {
  const prefix = locale === defaultLocale ? '' : `/${locale}`;
  const slug = slugFor(page, locale);
  return `${prefix}/${slug ? `${slug}/` : ''}`;
}

/** The live demo runs on its own host; the German demo page lives under /de/. */
export const demoHost = 'https://demo.openagentix.si';
export function demoUrl(locale: Locale): string {
  return locale === defaultLocale ? `${demoHost}/` : `${demoHost}/${locale}/`;
}

export interface Alternate {
  locale: Locale;
  hreflang: string;
  href: string;
}

/** Alternate URLs for `hreflang` links and the language switcher (live locales only). */
export function alternatesFor(page: PageId, site?: string | URL): Alternate[] {
  return liveLocales.map((locale) => {
    const path = pathFor(page, locale);
    return {
      locale,
      hreflang: localeInfo[locale].bcp47,
      href: site ? new URL(path, site).href : path,
    };
  });
}

function normalise(pathname: string): string {
  let p = pathname.split(/[?#]/)[0] ?? '/';
  if (!p.startsWith('/')) p = `/${p}`;
  p = p.replace(/\/index\.html$/, '/');
  return p.endsWith('/') ? p : `${p}/`;
}

/** Which live locale a path belongs to, judged by its first segment. */
export function localeFromPath(pathname: string): Locale {
  const first = normalise(pathname).split('/')[1];
  return isLiveLocale(first) && first !== defaultLocale ? first : defaultLocale;
}

/** Maps a path back to its page and locale, or `null` for paths outside the page table (e.g. docs subpages). */
export function matchPath(pathname: string): { page: PageId; locale: Locale } | null {
  const p = normalise(pathname);
  for (const locale of liveLocales) {
    for (const page of pageIds) {
      if (pathFor(page, locale) === p) return { page, locale };
    }
  }
  return null;
}
