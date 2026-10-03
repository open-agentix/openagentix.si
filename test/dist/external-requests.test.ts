import { describe, expect, it } from 'vitest';
import { scanFile } from '../../src/lib/external-scan';
import { SITE_URL } from '../../src/project';
import { assertBuilt, distFiles, read } from './helpers';

// The built site must not make the browser contact any third-party host.
describe('built site makes no third-party requests', () => {
  assertBuilt();
  const own = [new URL(SITE_URL).hostname];
  const files = distFiles().filter((f) => /\.(html|css|m?js)$/.test(f));

  it('has files to scan', () => {
    expect(files.length).toBeGreaterThan(10);
  });

  it('references no third-party hosts in script, link, media, @import or url()', () => {
    const findings = files.flatMap((file) => scanFile(file, read(file), own).map((r) => `${file}: ${r.kind} ${r.url}`));
    expect(findings).toEqual([]);
  });
});
