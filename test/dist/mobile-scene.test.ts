import { describe, expect, it } from 'vitest';
import { assertBuilt, distFiles, read } from './helpers';

/** All CSS of the build: linked style sheets plus inline <style> blocks of the landing pages. */
function allCss(): string {
  const sheets = distFiles()
    .filter((f) => f.endsWith('.css'))
    .map((f) => read(f));
  const inline = ['index.html', 'de/index.html'].flatMap((f) =>
    Array.from(read(f).matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g), (m) => m[1]!),
  );
  // The CSS minifier may rewrite legacy media features into range syntax; compare in one notation.
  return [...sheets, ...inline]
    .join('\n')
    .replace(/\(width<=(\d+)px\)/g, '(max-width:$1px)')
    .replace(/\(height<=(\d+)px\)/g, '(max-height:$1px)');
}

describe('how-it-works scene on phones (structure, no browser)', () => {
  assertBuilt();

  it.each(['index.html', 'de/index.html'])('%s has a stage, five steps and five progress dots', (file) => {
    const html = read(file);
    const scene = html.slice(html.indexOf('id="how"'));
    expect((scene.slice(0, scene.indexOf('</section>')).match(/data-scene-step[ >]/g) ?? []).length).toBe(5);
    expect(scene).toContain('data-scene-stage');
    expect((scene.slice(0, scene.indexOf('</ol>')).match(/class="dot[ "]/g) ?? []).length).toBe(5);
    // The phone window is reserved up front, so filling in the diagram later cannot shift the layout.
    expect(html).toContain('data-clone-diagram="vertical"');
  });

  it('ships a phone layout that scales the stage instead of clipping it', () => {
    const css = allCss().replace(/\s+/g, '');
    expect(css).toContain('@media(max-width:820px)');
    expect(css).toContain('aspect-ratio:440/372');
    // The minifier may fold calc(44svh * 440 / 372) into 52.043svh.
    expect(css).toMatch(/44svh|52\.04\d*svh/);
    expect(css).toContain('(max-height:520px)and(orientation:landscape)');
    expect(css).toMatch(/min-height:52svh/);
  });

  it('keeps the page freely scrollable: no scroll snapping or locking', () => {
    const css = allCss();
    expect(css).not.toMatch(/scroll-snap-type/);
  });

  it('animates the phone camera with a transform only and honours reduced motion', () => {
    const css = allCss().replace(/\s+/g, '');
    expect(css).toMatch(/\.camera--tall[^{]*\{[^}]*transform:translate3d\(0,calc\(var\(--vy\)\*-1\),0\)/);
    expect(css).toContain('@media(max-width:820px)and(prefers-reduced-motion:reduce)');
    expect(css).toContain('@media(prefers-reduced-motion:reduce)');
  });
});
