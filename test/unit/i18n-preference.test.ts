import { describe, expect, it } from 'vitest';
import {
  browserEnv,
  COOKIE_NAME,
  readCookie,
  readPreference,
  STORAGE_KEY,
  writePreference,
  type PreferenceEnv,
} from '../../src/i18n/preference';

function memoryStorage(initial: Record<string, string> = {}) {
  const data = new Map(Object.entries(initial));
  return {
    getItem: (k: string) => data.get(k) ?? null,
    setItem: (k: string, v: string) => void data.set(k, v),
    data,
  };
}

const throwingStorage = {
  getItem: () => {
    throw new Error('blocked');
  },
  setItem: () => {
    throw new Error('blocked');
  },
};

describe('readCookie', () => {
  it('finds a cookie among others and decodes it', () => {
    expect(readCookie('a=1; oax_lang=de; b=x%3Dy', 'oax_lang')).toBe('de');
    expect(readCookie('a=1; b=x%3Dy', 'b')).toBe('x=y');
    expect(readCookie('', 'oax_lang')).toBeNull();
  });
});

describe('readPreference', () => {
  it('prefers localStorage', () => {
    const env: PreferenceEnv = {
      storage: memoryStorage({ [STORAGE_KEY]: 'de' }),
      cookieJar: { cookie: `${COOKIE_NAME}=en` },
    };
    expect(readPreference(env)).toBe('de');
  });

  it('falls back to the cookie when storage is empty, invalid or throws', () => {
    expect(readPreference({ storage: memoryStorage(), cookieJar: { cookie: 'oax_lang=de' } })).toBe('de');
    expect(
      readPreference({ storage: memoryStorage({ [STORAGE_KEY]: 'xx' }), cookieJar: { cookie: '' } }),
    ).toBeNull();
    expect(readPreference({ storage: throwingStorage, cookieJar: { cookie: 'oax_lang=de' } })).toBe('de');
    expect(readPreference({ storage: null, cookieJar: null })).toBeNull();
  });

  it('ignores planned locales', () => {
    expect(readPreference({ storage: memoryStorage({ [STORAGE_KEY]: 'sl' }), cookieJar: null })).toBeNull();
  });
});

describe('writePreference', () => {
  it('writes to localStorage when possible and sets no cookie', () => {
    const storage = memoryStorage();
    const jar = { cookie: '' };
    expect(writePreference('de', { storage, cookieJar: jar })).toBe('storage');
    expect(storage.data.get(STORAGE_KEY)).toBe('de');
    expect(jar.cookie).toBe('');
  });

  it('falls back to a first-party cookie when storage throws', () => {
    const jar = { cookie: '' };
    expect(writePreference('de', { storage: throwingStorage, cookieJar: jar, secure: true })).toBe('cookie');
    expect(jar.cookie).toMatch(/^oax_lang=de; Max-Age=31536000; Path=\/; SameSite=Lax; Secure$/);
    const plain = { cookie: '' };
    writePreference('en', { storage: null, cookieJar: plain });
    expect(plain.cookie).not.toContain('Secure');
  });

  it('refuses planned locales and reports when nothing could be stored', () => {
    expect(writePreference('sl', { storage: memoryStorage(), cookieJar: { cookie: '' } })).toBe('none');
    expect(writePreference('de', { storage: null, cookieJar: null })).toBe('none');
  });
});

describe('browserEnv', () => {
  it('returns null handles for accessors that throw', () => {
    const win = {
      get localStorage(): Storage {
        throw new Error('SecurityError');
      },
      sessionStorage: memoryStorage(),
      document: { cookie: '' },
      location: { protocol: 'https:' },
    } as unknown as Window;
    const env = browserEnv(win);
    expect(env.storage).toBeNull();
    expect(env.session).not.toBeNull();
    expect(env.secure).toBe(true);
  });
});
