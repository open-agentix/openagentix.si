import { isLiveLocale, type Locale } from './config';

export const STORAGE_KEY = 'oax-lang';
export const COOKIE_NAME = 'oax_lang';
export const SESSION_KEY = 'oax-lang-detected';
const ONE_YEAR = 60 * 60 * 24 * 365;

type KeyValueStore = Pick<Storage, 'getItem' | 'setItem'>;

export interface PreferenceEnv {
  storage: KeyValueStore | null;
  cookieJar: { cookie: string } | null;
  secure?: boolean;
}

export function readCookie(cookie: string, name: string): string | null {
  for (const part of cookie.split(';')) {
    const [key, ...rest] = part.trim().split('=');
    if (key === name) return decodeURIComponent(rest.join('='));
  }
  return null;
}

/** The language the visitor chose explicitly; localStorage first, cookie as fallback. */
export function readPreference(env: PreferenceEnv): Locale | null {
  try {
    const stored = env.storage?.getItem(STORAGE_KEY);
    if (isLiveLocale(stored)) return stored;
  } catch {
    // Storage can throw in privacy modes; fall through to the cookie.
  }
  const fromCookie = env.cookieJar ? readCookie(env.cookieJar.cookie, COOKIE_NAME) : null;
  return isLiveLocale(fromCookie) ? fromCookie : null;
}

/**
 * Remembers an explicit language choice. Uses localStorage when available and only falls back to
 * a first-party cookie (the only cookie this site ever sets) when storage is blocked.
 */
export function writePreference(locale: Locale, env: PreferenceEnv): 'storage' | 'cookie' | 'none' {
  if (!isLiveLocale(locale)) return 'none';
  try {
    if (env.storage) {
      env.storage.setItem(STORAGE_KEY, locale);
      return 'storage';
    }
  } catch {
    // Fall back to the cookie below.
  }
  if (env.cookieJar) {
    const secure = env.secure ? '; Secure' : '';
    env.cookieJar.cookie = `${COOKIE_NAME}=${locale}; Max-Age=${ONE_YEAR}; Path=/; SameSite=Lax${secure}`;
    return 'cookie';
  }
  return 'none';
}

/** Collects storage handles defensively; any of them can throw when site data is blocked. */
export function browserEnv(win: Window): PreferenceEnv & { session: KeyValueStore | null } {
  const safe = <T>(get: () => T): T | null => {
    try {
      return get();
    } catch {
      return null;
    }
  };
  return {
    storage: safe(() => win.localStorage),
    session: safe(() => win.sessionStorage),
    cookieJar: safe(() => win.document),
    secure: win.location.protocol === 'https:',
  };
}
