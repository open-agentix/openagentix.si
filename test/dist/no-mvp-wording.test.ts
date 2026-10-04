import { describe, expect, it } from 'vitest';
import { assertBuilt, distFiles, read } from './helpers';

// The platform is no longer called MVP. The only allowed mention is the fixed recommendation for
// the dark software factory ("MVP and proof-of-concept development only").
const RECOMMENDATION = /MVP-?\s+(?:and|und)\s+proof-of-concept/gi;

describe('status wording', () => {
  assertBuilt();
  const pages = distFiles().filter((f) => f.endsWith('.html'));

  it('has pages to scan', () => {
    expect(pages.length).toBeGreaterThan(20);
  });

  it('does not call the platform an MVP', () => {
    const hits = pages.filter((f) => /\bMVP\b/.test(read(f).replace(RECOMMENDATION, '')));
    expect(hits).toEqual([]);
  });

  it('states the dark software factory recommendation on the landing pages', () => {
    expect(read('index.html')).toMatch(RECOMMENDATION);
    expect(read('de/index.html')).toMatch(RECOMMENDATION);
  });
});
