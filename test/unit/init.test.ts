// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';
import { initSite } from '../../src/scripts/site-init';
import { initLanding } from '../../src/scripts/landing-init';

describe('page entry points', () => {
  it('wire the site chrome', () => {
    document.body.innerHTML = `
      <button data-theme-toggle></button>
      <button data-menu-button aria-controls="nav" aria-expanded="false"></button><nav id="nav"></nav>`;
    initSite(document, window);
    expect(document.querySelector('[data-menu-button]')!.getAttribute('aria-expanded')).toBe('false');
    expect(document.querySelector('[data-theme-toggle]')!.hasAttribute('aria-pressed')).toBe(true);
  });

  it('start the landing effects, with or without a hero', () => {
    document.body.innerHTML = `<section data-scene><div data-scene-step></div></section>`;
    initLanding(document, window);
    expect(document.querySelector<HTMLElement>('[data-scene]')!.dataset['step']).toBe('0');
    document.body.innerHTML = `<figure data-hero></figure>`;
    expect(() => initLanding(document, window)).not.toThrow();
  });
});
