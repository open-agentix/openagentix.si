import { cloneDiagrams } from './clone-diagrams';
import { createHero } from './hero';
import { initScrollFx } from './scroll-fx';

export function initLanding(doc: Document, win: Window): void {
  cloneDiagrams(doc); // before the hero starts changing its own diagram
  const hero = doc.querySelector<HTMLElement>('[data-hero]');
  if (hero) createHero(hero, win);
  initScrollFx(doc, win);
}
