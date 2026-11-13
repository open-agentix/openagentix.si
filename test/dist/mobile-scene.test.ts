import { describe, expect, it } from 'vitest';
import { assertBuilt, distFiles, read } from './helpers';

describe('responsive collection layout', () => {
  assertBuilt();
  it('provides responsive grid layouts and reduced-motion support', () => {
    const css = distFiles().filter((file) => file.endsWith('.css')).map(read).join('') + read('index.html');
    expect(css).toMatch(/(?:max-width:\s*600px|width\s*<=\s*600px)/);
    expect(css).toContain('prefers-reduced-motion:reduce');
    expect(css).not.toContain('scroll-snap-type');
  });
});
