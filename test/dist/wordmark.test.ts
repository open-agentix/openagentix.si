import { describe, expect, it } from 'vitest';
import { assertBuilt, read } from './helpers';

describe('header wordmark', () => {
  assertBuilt();
  it.each(['index.html', 'de/index.html'])('%s shows a two-line wordmark with an accessible name', (file) => {
    const html = read(file);
    expect(html).toContain('aria-label="openagentix"');
    expect(html).toMatch(/open<span class="blue[^"]*"[^>]*>agentix<\/span>/);
    expect(html).toContain('SuperIntelligence');
  });
});
