import { describe, expect, it, vi } from 'vitest';
import { runLanguageRedirect } from '../../src/scripts/lang-redirect';
import { SESSION_KEY, STORAGE_KEY } from '../../src/i18n/preference';

function fakeWindow(opts: {
  pathname?: string;
  languages?: string[] | undefined;
  language?: string;
  saved?: string;
  session?: Record<string, string>;
  sessionThrows?: boolean;
  userAgent?: string;
}) {
  const local = new Map<string, string>(opts.saved ? [[STORAGE_KEY, opts.saved]] : []);
  const session = new Map<string, string>(Object.entries(opts.session ?? {}));
  const replace = vi.fn();
  const sessionStorage = opts.sessionThrows
    ? {
        getItem: () => {
          throw new Error('blocked');
        },
        setItem: () => undefined,
      }
    : { getItem: (k: string) => session.get(k) ?? null, setItem: (k: string, v: string) => void session.set(k, v) };
  const win = {
    localStorage: { getItem: (k: string) => local.get(k) ?? null, setItem: (k: string, v: string) => void local.set(k, v) },
    sessionStorage,
    document: { cookie: '' },
    location: { pathname: opts.pathname ?? '/', search: '', hash: '', protocol: 'https:', replace },
    navigator: {
      languages: 'languages' in opts ? opts.languages : ['de-DE'],
      language: opts.language ?? 'de-DE',
      userAgent: opts.userAgent ?? 'Mozilla/5.0 Firefox/140.0',
      webdriver: false,
    },
  } as unknown as Window;
  return { win, replace, session };
}

describe('runLanguageRedirect', () => {
  it('redirects on the first visit and marks the session', () => {
    const { win, replace, session } = fakeWindow({});
    expect(runLanguageRedirect(win)).toBe('/de/');
    expect(replace).toHaveBeenCalledWith('/de/');
    expect(session.get(SESSION_KEY)).toBe('1');
  });

  it('does nothing on later page views in the same session', () => {
    const { win, replace } = fakeWindow({ session: { [SESSION_KEY]: '1' } });
    expect(runLanguageRedirect(win)).toBeNull();
    expect(replace).not.toHaveBeenCalled();
  });

  it('follows a saved choice', () => {
    const { win, replace } = fakeWindow({ pathname: '/de/', saved: 'en', session: { [SESSION_KEY]: '1' } });
    runLanguageRedirect(win);
    expect(replace).toHaveBeenCalledWith('/');
  });

  it('uses navigator.language when languages is missing and survives blocked session storage', () => {
    const { win, replace } = fakeWindow({ languages: undefined, language: 'de', sessionThrows: true });
    expect(runLanguageRedirect(win)).toBe('/de/');
    expect(replace).toHaveBeenCalledOnce();
  });
});
