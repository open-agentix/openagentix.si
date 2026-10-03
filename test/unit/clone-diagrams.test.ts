// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';
import { cloneDiagrams } from '../../src/scripts/clone-diagrams';

describe('cloneDiagrams', () => {
  it('copies the hero diagram with unique ids and rewritten references', () => {
    document.body.innerHTML = `
      <figure data-hero>
        <svg data-orientation="horizontal"><defs><linearGradient id="g"></linearGradient></defs>
          <rect stroke="url(#g)" fill="url(#other)"></rect></svg>
      </figure>
      <div data-clone-diagram="horizontal"></div>
      <div data-clone-diagram="vertical"></div>`;
    expect(cloneDiagrams(document)).toBe(1);
    const copy = document.querySelector('[data-clone-diagram="horizontal"] svg')!;
    expect(copy.querySelector('linearGradient')!.id).toBe('story-g');
    expect(copy.querySelector('rect')!.getAttribute('stroke')).toBe('url(#story-g)');
    expect(copy.querySelector('rect')!.getAttribute('fill')).toBe('url(#other)');
    expect(document.querySelectorAll('#g')).toHaveLength(1);
    expect(cloneDiagrams(document)).toBe(0);
  });
});
