import { describe, expect, it } from 'vitest';
import { deepMerge, format, getDictionary, leafPaths } from '../../src/i18n/translate';
import { en } from '../../src/i18n/ui/en';
import { de } from '../../src/i18n/ui/de';
import { sl } from '../../src/i18n/ui/sl';

describe('dictionaries', () => {
  it('German covers every English key', () => {
    expect(leafPaths(de).sort()).toEqual(leafPaths(en).sort());
  });

  it('German has no empty strings', () => {
    const empty = leafPaths(de).filter((path) => {
      const value = path.split('.').reduce<unknown>((node, key) => (node as Record<string, unknown>)[key], de);
      return typeof value === 'string' && value.trim() === '';
    });
    expect(empty).toEqual([]);
  });

  it('Slovenian only contains keys that exist in English', () => {
    const known = new Set(leafPaths(en));
    expect(leafPaths(sl).filter((p) => !known.has(p))).toEqual([]);
  });

  it('falls back to English for missing Slovenian keys', () => {
    const d = getDictionary('sl');
    expect(d.common.skipToContent).toBe('Preskoči na vsebino');
    expect(d.common.nav.docs).toBe(en.common.nav.docs);
  });

  it('returns the source dictionary for English and the full one for German', () => {
    expect(getDictionary('en')).toBe(en);
    expect(getDictionary('de').common.nav.docs).toBe('Doku');
  });
});

describe('deepMerge', () => {
  it('replaces arrays and primitives, merges objects, ignores undefined', () => {
    const base = { a: 1, list: [1, 2], nested: { x: 'x', y: 'y' } };
    const override = { list: [3], nested: { y: 'Y' }, a: undefined } as unknown as Parameters<typeof deepMerge<typeof base>>[1];
    expect(deepMerge(base, override)).toEqual({
      a: 1,
      list: [3],
      nested: { x: 'x', y: 'Y' },
    });
    expect(deepMerge(base, undefined)).toBe(base);
  });
});

describe('format', () => {
  it('fills known placeholders and keeps unknown ones', () => {
    expect(format('Hi {name}, {missing}', { name: 'Ada' })).toBe('Hi Ada, {missing}');
    expect(format('v{v}', { v: 1 })).toBe('v1');
  });
});

describe('leafPaths', () => {
  it('treats arrays as leaves', () => {
    expect(leafPaths({ a: { b: 'c' }, d: [1, 2] })).toEqual(['a.b', 'd']);
  });
});
