import { describe, expect, it } from 'vitest';
import { findBrokenLinks } from '../../src/lib/link-check';
import { assertBuilt, distFiles, read } from './helpers';

describe('internal links', () => {
  assertBuilt();
  const files = distFiles();
  const pages = files.filter((f) => f.endsWith('.html')).map((file) => ({ file, html: read(file) }));

  it('all point to existing pages and anchors', () => {
    expect(findBrokenLinks(pages, new Set(files))).toEqual([]);
  });
});
