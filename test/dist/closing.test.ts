import { describe, expect, it } from 'vitest';
import { assertBuilt, readPageText } from './helpers';

describe('collection landing page', () => {
  assertBuilt();
  it.each(['index.html', 'de/index.html'])('%s presents the collection and its news', (file) => {
    const html = readPageText(file);
    for (const name of ['OpenGlassUI', 'Awesome OpenCode', 'Open Model Prism']) expect(html).toContain(name);
    for (const section of ['products', 'news', 'about']) expect(html).toContain(`id="${section}"`);
    expect(html).toContain('data-news-grid');
    expect((html.match(/class="news-item/g) ?? []).length).toBe(4);
  });
});
