import { describe, expect, it } from 'vitest';
import { isBot, negotiate, primaryLanguages, redirectTarget, type RedirectInput } from '../../src/i18n/detect';

const chrome =
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36';

const base: RedirectInput = {
  pathname: '/',
  saved: null,
  languages: ['de-DE', 'de', 'en'],
  userAgent: chrome,
  alreadyDetected: false,
};

describe('primaryLanguages', () => {
  it('normalises, de-duplicates and drops wildcards', () => {
    expect(primaryLanguages(['de-AT', 'DE', 'en_GB', '*', ' sl ', ''])).toEqual(['de', 'en', 'sl']);
  });
});

describe('negotiate', () => {
  it('picks the first supported language', () => {
    expect(negotiate(['fr-FR', 'de-CH', 'en'])).toBe('de');
    expect(negotiate(['en-US', 'de'])).toBe('en');
  });

  it('ignores planned locales and falls back to English', () => {
    expect(negotiate(['sl-SI'])).toBe('en');
    expect(negotiate([])).toBe('en');
  });
});

describe('isBot', () => {
  it.each([
    'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
    'Mozilla/5.0 (compatible; bingbot/2.0)',
    'Slackbot-LinkExpanding 1.0',
    'facebookexternalhit/1.1',
    'Mozilla/5.0 Chrome-Lighthouse',
    'Mozilla/5.0 HeadlessChrome/140.0',
    'curl/8.5.0',
    '',
  ])('treats %j as a bot', (ua) => {
    expect(isBot(ua)).toBe(true);
  });

  it('accepts a normal browser and flags webdriver sessions', () => {
    expect(isBot(chrome)).toBe(false);
    expect(isBot(chrome, true)).toBe(true);
  });
});

describe('redirectTarget', () => {
  it('sends a German browser from / to /de/ on the first visit', () => {
    expect(redirectTarget(base)).toBe('/de/');
  });

  it('keeps the page, query and hash when switching', () => {
    expect(redirectTarget({ ...base, pathname: '/demo/', search: '?a=1', hash: '#cookies' })).toBe(
      '/de/demo/?a=1#cookies',
    );
  });

  it('does not redirect bots', () => {
    expect(redirectTarget({ ...base, userAgent: 'Googlebot/2.1' })).toBeNull();
    expect(redirectTarget({ ...base, webdriver: true })).toBeNull();
  });

  it('detects only once per session', () => {
    expect(redirectTarget({ ...base, alreadyDetected: true })).toBeNull();
  });

  it('respects explicitly localised links when nothing was saved', () => {
    expect(redirectTarget({ ...base, pathname: '/de/', languages: ['en-US'] })).toBeNull();
  });

  it('lets a saved choice win in both directions', () => {
    expect(redirectTarget({ ...base, saved: 'en' })).toBeNull();
    expect(redirectTarget({ ...base, pathname: '/de/demo/', saved: 'en' })).toBe('/demo/');
    expect(
      redirectTarget({ ...base, pathname: '/demo/', saved: 'de', alreadyDetected: true, languages: [] }),
    ).toBe('/de/demo/');
  });

  it('stays when the browser language equals the page or is unsupported', () => {
    expect(redirectTarget({ ...base, languages: ['en'] })).toBeNull();
    expect(redirectTarget({ ...base, languages: ['ja'] })).toBeNull();
  });

  it('ignores paths outside the page table', () => {
    expect(redirectTarget({ ...base, pathname: '/docs/concepts/runs/' })).toBeNull();
  });

  it('never targets a planned locale', () => {
    expect(redirectTarget({ ...base, saved: 'sl' })).toBeNull();
  });
});
