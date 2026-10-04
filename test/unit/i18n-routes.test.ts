import { describe, expect, it } from 'vitest';
import { isLiveLocale, isLocale, liveLocales, localeInfo } from '../../src/i18n/config';
import { alternatesFor, localeFromPath, matchPath, pageIds, pathFor } from '../../src/i18n/routes';

describe('locale config', () => {
  it('publishes English and German, keeps Slovenian planned', () => {
    expect(liveLocales).toEqual(['en', 'de']);
    expect(localeInfo.sl.status).toBe('planned');
  });

  it('recognises locales', () => {
    expect(isLocale('sl')).toBe(true);
    expect(isLocale('fr')).toBe(false);
    expect(isLocale(42)).toBe(false);
    expect(isLiveLocale('de')).toBe(true);
    expect(isLiveLocale('sl')).toBe(false);
  });
});

describe('routes', () => {
  it('builds unprefixed English and prefixed German paths', () => {
    expect(pathFor('home', 'en')).toBe('/');
    expect(pathFor('home', 'de')).toBe('/de/');
    expect(pathFor('imprint', 'en')).toBe('/imprint/');
    expect(pathFor('imprint', 'de')).toBe('/de/impressum/');
    expect(pathFor('privacy', 'de')).toBe('/de/datenschutz/');
    expect(pathFor('demo', 'de')).toBe('/de/demo/');
  });

  it('falls back to English slugs for planned locales', () => {
    expect(pathFor('privacy', 'sl')).toBe('/sl/privacy/');
  });

  it('lists absolute alternates for live locales only', () => {
    const alts = alternatesFor('privacy', 'https://example.org');
    expect(alts).toEqual([
      { locale: 'en', hreflang: 'en', href: 'https://example.org/privacy/' },
      { locale: 'de', hreflang: 'de', href: 'https://example.org/de/datenschutz/' },
    ]);
    expect(alternatesFor('home').map((a) => a.href)).toEqual(['/', '/de/']);
  });

  it('round-trips every page through matchPath', () => {
    for (const locale of liveLocales) {
      for (const page of pageIds) {
        expect(matchPath(pathFor(page, locale))).toEqual({ page, locale });
      }
    }
  });

  it('normalises paths before matching', () => {
    expect(matchPath('/de/impressum')).toEqual({ page: 'imprint', locale: 'de' });
    expect(matchPath('de/impressum/?x=1#top')).toEqual({ page: 'imprint', locale: 'de' });
    expect(matchPath('/index.html')).toEqual({ page: 'home', locale: 'en' });
    expect(matchPath('/docs/concepts/runs/')).toBeNull();
  });

  it('derives the locale from the first path segment', () => {
    expect(localeFromPath('/de/docs/')).toBe('de');
    expect(localeFromPath('/docs/')).toBe('en');
    expect(localeFromPath('/sl/')).toBe('en');
    expect(localeFromPath('')).toBe('en');
  });
});

describe('demoUrl', () => {
  it('points to the demo host, with the locale path for non-default locales', async () => {
    const { demoUrl } = await import('../../src/i18n/routes');
    expect(demoUrl('en')).toBe('https://demo.openagentix.si/');
    expect(demoUrl('de')).toBe('https://demo.openagentix.si/de/');
  });
});
