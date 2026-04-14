import { describe, expect, it } from 'vitest';
import { liveLocales } from '../../src/i18n/config';
import { alternatesFor, pageIds, pathFor } from '../../src/i18n/routes';
import { SITE_URL } from '../../src/project';
import { assertBuilt, distFiles, read } from './helpers';

const fileFor = (path: string) => `${path.replace(/^\//, '')}index.html`;

describe('localised pages', () => {
  assertBuilt();
  const files = new Set(distFiles());

  it('exist for every page and live locale', () => {
    const missing = pageIds.flatMap((p) => liveLocales.map((l) => fileFor(pathFor(p, l)))).filter((f) => !files.has(f));
    expect(missing).toEqual([]);
  });

  it('do not publish the planned Slovenian locale yet', () => {
    expect([...files].filter((f) => f.startsWith('sl/'))).toEqual([]);
  });

  it.each(pageIds.filter((p) => p !== 'docs'))('%s declares lang, hreflang alternates and x-default', (page) => {
    for (const locale of liveLocales) {
      const html = read(fileFor(pathFor(page, locale)));
      expect(html).toMatch(new RegExp(`<html[^>]+lang="${locale}"`));
      for (const alt of alternatesFor(page, SITE_URL)) {
        expect(html).toContain(`<link rel="alternate" hreflang="${alt.hreflang}" href="${alt.href}"`);
      }
      expect(html).toContain(`hreflang="x-default" href="${new URL(pathFor(page, 'en'), SITE_URL).href}"`);
      expect(html).toMatch(/<meta name="description" content="[^"]{40,}"/);
      expect(html).toMatch(/<title>[^<]{10,}<\/title>/);
    }
  });

  it('has hreflang links on the docs index', () => {
    expect(read('docs/index.html')).toMatch(/hreflang="de"/);
  });
});
