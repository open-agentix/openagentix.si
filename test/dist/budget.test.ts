import { gzipSync } from 'node:zlib';
import { describe, expect, it } from 'vitest';
import { budgetViolations, forbiddenImage, pageAssets, reachableScripts } from '../../src/lib/budget';
import { assertBuilt, distFiles, read, readBytes } from './helpers';

const gz = (s: string | Buffer) => gzipSync(s, { level: 9 }).length;
const toFile = (sitePath: string) => sitePath.replace(/^\//, '');

describe('performance budget', () => {
  assertBuilt();
  const files = new Set(distFiles());

  it.each(['index.html', 'de/index.html'])('%s stays within the budget', (page) => {
    const html = read(page);
    const assets = pageAssets(html);
    const scripts = reachableScripts(assets.scripts, (p) => (files.has(toFile(p)) ? read(toFile(p)) : null));
    const js = scripts.reduce((sum, p) => sum + gz(read(toFile(p))), 0) + assets.inlineScripts.reduce((s, c) => s + gz(c), 0);
    const css =
      assets.styles.reduce((sum, p) => sum + gz(read(toFile(p))), 0) + assets.inlineStyles.reduce((s, c) => s + gz(c), 0);
    const measured = { js, css, html: gz(html), fonts: assets.preloadedFonts.length };
    console.info(`${page}: js=${js} B css=${css} B html=${measured.html} B (gzip)`);
    expect(budgetViolations(measured)).toEqual([]);
  });

  it('ships no legacy raster images', () => {
    expect([...files].filter((f) => forbiddenImage.test(f))).toEqual([]);
  });

  it('ships only subset fonts', () => {
    const fonts = [...files].filter((f) => f.endsWith('.woff2'));
    expect(fonts.length).toBeLessThanOrEqual(4);
    for (const f of fonts) expect(readBytes(f).length).toBeLessThan(60 * 1024);
  });
});
