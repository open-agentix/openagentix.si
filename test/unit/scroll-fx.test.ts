// @vitest-environment happy-dom
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  activeStepIndex,
  initParallax,
  initReveals,
  initScenes,
  initScrollFx,
  parallaxOffset,
  prefersReducedMotion,
  supportsScrollTimeline,
} from '../../src/scripts/scroll-fx';

type IOCallback = (entries: Partial<IntersectionObserverEntry>[]) => void;

function fakeWin(opts: { timeline?: boolean; io?: boolean; reduced?: boolean; height?: number } = {}) {
  const observers: { cb: IOCallback; targets: Element[]; unobserved: Element[] }[] = [];
  class FakeIO {
    record: { cb: IOCallback; targets: Element[]; unobserved: Element[] };
    constructor(cb: IOCallback) {
      this.record = { cb, targets: [], unobserved: [] };
      observers.push(this.record);
    }
    observe(t: Element) {
      this.record.targets.push(t);
    }
    unobserve(t: Element) {
      this.record.unobserved.push(t);
    }
  }
  const listeners: Record<string, () => void> = {};
  const frames: FrameRequestCallback[] = [];
  const win = {
    innerHeight: opts.height ?? 1000,
    CSS: { supports: () => opts.timeline ?? false },
    matchMedia: () => ({ matches: opts.reduced ?? false }),
    IntersectionObserver: opts.io === false ? undefined : FakeIO,
    requestAnimationFrame: (cb: FrameRequestCallback) => frames.push(cb),
    addEventListener: (type: string, cb: () => void) => {
      listeners[type] = cb;
    },
  } as unknown as Window;
  return { win, observers, listeners, frames };
}

function stubTop(el: Element, top: number) {
  el.getBoundingClientRect = () => ({ top }) as DOMRect;
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('pure helpers', () => {
  it('computes a clamped parallax offset around the viewport centre', () => {
    expect(parallaxOffset(500, 1000, 0.2)).toBe(0);
    expect(parallaxOffset(1000, 1000, 0.2)).toBe(-100);
    expect(parallaxOffset(-2000, 1000, 0.5)).toBe(160);
    expect(parallaxOffset(5000, 1000, 0.5, 50)).toBe(-50);
  });

  it('finds the step crossing the reading line', () => {
    expect(activeStepIndex([100, 900, 1700], 1000)).toBe(0);
    expect(activeStepIndex([-800, 300, 1100], 1000)).toBe(1);
    expect(activeStepIndex([-1600, -800, 100], 1000)).toBe(2);
    expect(activeStepIndex([], 1000)).toBe(0);
  });

  it('detects capabilities defensively', () => {
    expect(supportsScrollTimeline(fakeWin({ timeline: true }).win)).toBe(true);
    expect(supportsScrollTimeline({} as Window)).toBe(false);
    expect(prefersReducedMotion(fakeWin({ reduced: true }).win)).toBe(true);
    expect(prefersReducedMotion({} as Window)).toBe(false);
  });
});

describe('initScenes', () => {
  it('marks the active step and updates the progress text', () => {
    document.body.innerHTML = `
      <section data-scene>
        <p data-scene-progress data-template="Step {current} of {total}"></p>
        <div data-scene-step></div><div data-scene-step></div><div data-scene-step></div>
      </section>`;
    const scene = document.querySelector<HTMLElement>('[data-scene]')!;
    const steps = Array.from(document.querySelectorAll('[data-scene-step]'));
    [100, 900, 1700].forEach((t, i) => stubTop(steps[i]!, t));
    const { win, observers } = fakeWin();
    expect(initScenes(document, win)).toBe(1);
    expect(scene.dataset['step']).toBe('0');
    expect(document.querySelector('[data-scene-progress]')!.textContent).toBe('Step 1 of 3');

    [-800, 300, 1100].forEach((t, i) => stubTop(steps[i]!, t));
    observers[0]!.cb([]);
    expect(scene.dataset['step']).toBe('1');
    expect(steps[1]!.classList.contains('is-active')).toBe(true);
    expect(steps[0]!.classList.contains('is-active')).toBe(false);
    observers[0]!.cb([]);
    expect(observers[0]!.targets).toHaveLength(3);
  });

  it('still sets an initial step without IntersectionObserver or progress element', () => {
    document.body.innerHTML = `<section data-scene><div data-scene-step></div></section>`;
    initScenes(document, fakeWin({ io: false }).win);
    expect(document.querySelector<HTMLElement>('[data-scene]')!.dataset['step']).toBe('0');
  });
});

describe('initReveals', () => {
  it('leaves reveals to CSS when scroll timelines are supported', () => {
    expect(initReveals(document, fakeWin({ timeline: true }).win)).toBe('css');
  });

  it('shows everything at once without IntersectionObserver', () => {
    document.body.innerHTML = '<div data-reveal></div>';
    expect(initReveals(document, fakeWin({ io: false }).win)).toBe('static');
    expect(document.querySelector('[data-reveal]')!.classList.contains('in-view')).toBe(true);
  });

  it('reveals elements as they intersect', () => {
    document.body.innerHTML = '<div data-reveal id="a"></div><div data-reveal id="b"></div>';
    const { win, observers } = fakeWin();
    expect(initReveals(document, win)).toBe('observer');
    const a = document.getElementById('a')!;
    const b = document.getElementById('b')!;
    observers[0]!.cb([
      { isIntersecting: true, target: a },
      { isIntersecting: false, target: b },
    ]);
    expect(a.classList.contains('in-view')).toBe(true);
    expect(b.classList.contains('in-view')).toBe(false);
    expect(observers[0]!.unobserved).toEqual([a]);
  });
});

describe('initParallax', () => {
  it('defers to CSS or switches off for reduced motion', () => {
    expect(initParallax(document, fakeWin({ timeline: true }).win)).toBe('css');
    expect(initParallax(document, fakeWin({ reduced: true }).win)).toBe('off');
    expect(initParallax(document, fakeWin({ io: false }).win)).toBe('off');
  });

  it('moves visible elements on the next animation frame', () => {
    document.body.innerHTML = '<div data-parallax="0.2" id="p"></div><div data-parallax id="q"></div>';
    const p = document.getElementById('p')!;
    const q = document.getElementById('q')!;
    stubTop(p, 1000);
    stubTop(q, 500);
    const { win, observers, listeners, frames } = fakeWin();
    expect(initParallax(document, win)).toBe('raf');
    observers[0]!.cb([
      { isIntersecting: true, target: p },
      { isIntersecting: true, target: q },
    ]);
    listeners['scroll']!();
    expect(frames).toHaveLength(1);
    frames[0]!(0);
    expect(p.style.transform).toBe('translate3d(0, -100px, 0)');
    expect(q.style.transform).toBe('translate3d(0, 0px, 0)');
    observers[0]!.cb([
      { isIntersecting: false, target: p },
      { isIntersecting: false, target: q },
    ]);
    listeners['scroll']!();
    expect(frames).toHaveLength(1);
  });
});

describe('initScrollFx', () => {
  it('combines all effects', () => {
    const spy = vi.fn();
    const { win } = fakeWin({ timeline: true });
    spy(initScrollFx(document, win));
    expect(spy).toHaveBeenCalledWith({ scenes: 0, reveals: 'css', parallax: 'css' });
  });
});
