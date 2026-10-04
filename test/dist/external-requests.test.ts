import { describe, expect, it } from 'vitest';
import { scanFile } from '../../src/lib/external-scan';
import { OWN_HOSTS, SITE_URL } from '../../src/project';
import { assertBuilt, distFiles, read } from './helpers';

// The built site must not make the browser contact any third-party host.
describe('built site makes no third-party requests', () => {
  assertBuilt();
  const own = [new URL(SITE_URL).hostname, ...OWN_HOSTS];
  const files = distFiles().filter((f) => /\.(html|css|m?js)$/.test(f));

  it('has files to scan', () => {
    expect(files.length).toBeGreaterThan(10);
  });

  it('references no third-party hosts in script, link, media, @import or url()', () => {
    const findings = files.flatMap((file) => scanFile(file, read(file), own).map((r) => `${file}: ${r.kind} ${r.url}`));
    expect(findings).toEqual([]);
  });
});

describe('blog link', () => {
  it.each(['index.html', 'de/index.html'])('%s links to the project blog in the header and the footer', (file) => {
    const html = read(file);
    expect(html.split('href="https://blog.openagentix.si/"').length - 1).toBe(2);
  });
});
