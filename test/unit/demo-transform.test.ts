import { describe, expect, it } from 'vitest';
import { pageMap, rewritePath, robotsTxt, transformDemoHtml } from '../../scripts/demo-transform.mjs';

describe('demo site transform', () => {
  it('moves the demo pages to the host root', () => {
    expect(pageMap).toEqual([
      { from: 'demo/index.html', to: 'index.html' },
      { from: 'de/demo/index.html', to: 'de/index.html' },
    ]);
    expect(rewritePath('/demo/')).toBe('/');
    expect(rewritePath('/de/demo/')).toBe('/de/');
  });

  it('keeps shipped assets local and sends every other page to the main site', () => {
    expect(rewritePath('/_astro/app.abc.css')).toBe('/_astro/app.abc.css');
    expect(rewritePath('/favicon.svg')).toBe('/favicon.svg');
    expect(rewritePath('/docs/')).toBe('https://openagentix.si/docs/');
    expect(rewritePath('/de/#trust')).toBe('https://openagentix.si/de/#trust');
  });

  it('rewrites hrefs, canonical and hreflang links, and drops the sitemap link', () => {
    const html = [
      '<link rel="canonical" href="https://demo.openagentix.si/demo/">',
      '<link rel="alternate" hreflang="de" href="https://demo.openagentix.si/de/demo/">',
      '<link rel="sitemap" href="/sitemap-index.xml">',
      '<a href="/de/demo/">DE</a><a href="/">home</a><a href="//cdn.example/x">x</a>',
      '<a href="https://github.com/open-agentix">GitHub</a>',
    ].join('');
    const out = transformDemoHtml(html);
    expect(out).toContain('<link rel="canonical" href="https://demo.openagentix.si/">');
    expect(out).toContain('hreflang="de" href="https://demo.openagentix.si/de/"');
    expect(out).not.toContain('sitemap');
    expect(out).toContain('<a href="/de/">DE</a>');
    expect(out).toContain('<a href="https://openagentix.si/">home</a>');
    expect(out).toContain('href="//cdn.example/x"');
    expect(out).toContain('href="https://github.com/open-agentix"');
  });

  it('allows indexing in robots.txt', () => {
    expect(robotsTxt()).not.toMatch(/Disallow:\s*\//);
  });
});
