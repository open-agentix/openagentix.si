import { describe, expect, it } from 'vitest';
import { de } from '../../src/i18n/ui/de';
import { en } from '../../src/i18n/ui/en';
import { assertBuilt, readPageText } from './helpers';

const count = (haystack: string, needle: string) => haystack.split(needle).length - 1;

describe('closing line and tagline', () => {
  assertBuilt();
  it.each([
    ['index.html', en],
    ['de/index.html', de],
  ])('%s shows the closing line and the tagline exactly once', (file, dict) => {
    const html = readPageText(file);
    expect(count(html, dict.landing.closing.line)).toBe(1);
    expect(count(html, dict.common.ownerTagline.lead)).toBe(1);
    expect(count(html, dict.common.ownerTagline.rest)).toBe(1);
    // The closing block comes after the call to action and before the footer.
    expect(html.indexOf('cta-title')).toBeLessThan(html.indexOf(dict.landing.closing.line));
    expect(html.indexOf(dict.landing.closing.line)).toBeLessThan(html.indexOf('<footer'));
  });

  it('keeps the tagline in the footer of inner pages', () => {
    expect(count(readPageText('demo/index.html'), en.common.ownerTagline.lead)).toBe(1);
  });
});
