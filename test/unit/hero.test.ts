// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { beatAnimation, createHero } from '../../src/scripts/hero';
import { scenarios } from '../../src/lib/scenarios';
import type { Beat } from '../../src/lib/timeline';

interface FakeAnimation {
  el: Element;
  keyframes: Keyframe[];
  options: KeyframeAnimationOptions;
  state: 'running' | 'paused' | 'cancelled';
  finish: () => void;
  pause: () => void;
  play: () => void;
  cancel: () => void;
  finished: Promise<void>;
}

let animations: FakeAnimation[] = [];
const original = Element.prototype.animate;

function installFakeAnimate() {
  Element.prototype.animate = function (this: Element, keyframes, options) {
    let resolve!: () => void;
    let reject!: (e: unknown) => void;
    const finished = new Promise<void>((res, rej) => {
      resolve = res;
      reject = rej;
    });
    finished.catch(() => undefined);
    const a: FakeAnimation = {
      el: this,
      keyframes: keyframes as Keyframe[],
      options: options as KeyframeAnimationOptions,
      state: 'running',
      finish: () => resolve(),
      pause: () => void (a.state = 'paused'),
      play: () => void (a.state = 'running'),
      cancel: () => {
        a.state = 'cancelled';
        reject(new Error('cancelled'));
      },
      finished,
    };
    animations.push(a);
    return a as unknown as Animation;
  } as typeof Element.prototype.animate;
}

function svgFixture(orientation: string) {
  const slots = [0, 1, 2]
    .map(
      (i) => `
      <g data-agent="${i}"><circle class="glow"/><text data-agent-name></text></g>
      <g data-gate="${i}"><path class="ok"/><path class="no"/></g>
      <g data-tool="${i}"><rect class="glow"/><text data-tool-name></text></g>`,
    )
    .join('');
  const nodes = ['kafka', 'webhook', 'stream', 'mail', 'teams', 'cron']
    .map((s) => `<g data-node="source:${s}"><rect class="glow"/></g>`)
    .join('');
  const outputs = ['pr', 'cve', 'ticket', 'message', 'report', 'metrics']
    .map((s) => `<g data-node="output:${s}"><rect class="glow"/></g>`)
    .join('');
  const audit = [0, 1, 2, 3, 4, 5].map((i) => `<rect data-audit-slot="${i}"/>`).join('');
  return `<svg data-orientation="${orientation}">${nodes}${outputs}${slots}${audit}
    <g data-control><rect class="glow"/><rect class="alert"/></g>
    <circle data-packet="0"/><circle data-packet="1"/><circle data-packet="2"/><circle data-spark/></svg>`;
}

function mount() {
  document.body.innerHTML = `
    <figure data-hero>
      ${svgFixture('horizontal')}
      ${svgFixture('vertical')}
      <p data-caption="cve">cve</p><p data-caption="ticket" hidden>ticket</p>
      <button data-hero-toggle data-label-pause="Pause" data-label-play="Play"></button>
      <script type="application/json" data-hero-data>{"names":{"cve":{"triage":"CVE triage"}}}</script>
    </figure>`;
  return document.querySelector<HTMLElement>('[data-hero]')!;
}

function fakeWin(opts: { wide?: boolean; reduced?: boolean } = {}) {
  const observers: ((entries: Partial<IntersectionObserverEntry>[]) => void)[] = [];
  return {
    observers,
    win: {
      document,
      matchMedia: (q: string) => ({
        matches: q.includes('reduced-motion') ? (opts.reduced ?? false) : (opts.wide ?? true),
      }),
      IntersectionObserver: class {
        constructor(cb: (entries: Partial<IntersectionObserverEntry>[]) => void) {
          observers.push(cb);
        }
        observe() {}
      },
    } as unknown as Window,
  };
}

const flush = () => new Promise((r) => setTimeout(r, 0));

beforeEach(() => {
  animations = [];
  installFakeAnimate();
});

afterEach(() => {
  Element.prototype.animate = original;
});

describe('beatAnimation', () => {
  it('returns null for missing targets', () => {
    const svg = document.createElement('div');
    const beats: Beat[] = [
      { kind: 'source', at: 0, duration: 1, source: 'kafka' },
      { kind: 'control', at: 0, duration: 1, alert: true },
      { kind: 'gate', at: 0, duration: 1, slot: 0, verdict: 'allow' },
      { kind: 'audit', at: 0, duration: 1, index: 0 },
      { kind: 'travel', at: 0, duration: 1, packet: 0, from: { x: 0, y: 0 }, to: { x: 1, y: 1 } },
    ];
    beats.forEach((b) => expect(beatAnimation(svg, b)).toBeNull());
  });
});

describe('createHero', () => {
  it('plays scenarios in a loop with names, captions and idle slots', async () => {
    const root = mount();
    const { win } = fakeWin();
    const hero = createHero(root, win, { scenarios: scenarios.slice(0, 2), hold: 0 });
    await hero.ready;
    const svg = root.querySelector('svg[data-orientation="horizontal"]')!;
    expect(svg.querySelector('[data-agent="0"] [data-agent-name]')!.textContent).toBe('CVE triage');
    expect(svg.querySelector('[data-agent="2"] [data-agent-name]')!.textContent).toBe('fixer');
    expect(svg.querySelector('[data-tool="0"] [data-tool-name]')!.textContent).toBe('trivy.scan_image');
    expect(svg.querySelector('[data-agent="1"]')!.classList.contains('is-idle')).toBe(true);
    expect(animations.length).toBeGreaterThan(10);
    const packet = animations.find((a) => a.el.getAttribute('data-packet') === '0')!;
    expect(packet.options.fill).toBe('none');

    const clock = animations.at(-1)!;
    clock.finish();
    await flush();
    await flush();
    expect(root.querySelector<HTMLElement>('[data-caption="ticket"]')!.hidden).toBe(false);
    expect(root.querySelector<HTMLElement>('[data-caption="cve"]')!.hidden).toBe(true);
    expect(animations.filter((a) => a.state === 'cancelled').length).toBeGreaterThan(0);
    hero.stop();
    await flush();
  });

  it('uses the vertical diagram on narrow screens', async () => {
    const root = mount();
    createHero(root, fakeWin({ wide: false }).win, { hold: 0 });
    await flush();
    expect(animations.some((a) => a.el.closest('svg')?.getAttribute('data-orientation') === 'vertical')).toBe(true);
  });

  it('pauses on hover, the button, hidden tabs and when off screen', async () => {
    const root = mount();
    const { win, observers } = fakeWin();
    const hero = createHero(root, win, { hold: 0 });
    await hero.ready;
    const button = root.querySelector<HTMLButtonElement>('[data-hero-toggle]')!;
    expect(button.getAttribute('aria-label')).toBe('Pause');

    root.dispatchEvent(new Event('pointerenter'));
    expect(hero.paused).toBe(true);
    expect(animations.every((a) => a.state === 'paused')).toBe(true);
    root.dispatchEvent(new Event('pointerleave'));
    expect(hero.paused).toBe(false);
    expect(animations.every((a) => a.state === 'running')).toBe(true);

    button.click();
    expect(hero.paused).toBe(true);
    expect(button.getAttribute('aria-pressed')).toBe('true');
    expect(button.getAttribute('aria-label')).toBe('Play');
    root.dispatchEvent(new Event('pointerenter'));
    button.click();
    expect(hero.paused).toBe(false);

    Object.defineProperty(document, 'visibilityState', { value: 'hidden', configurable: true });
    document.dispatchEvent(new Event('visibilitychange'));
    expect(hero.paused).toBe(true);
    Object.defineProperty(document, 'visibilityState', { value: 'visible', configurable: true });
    document.dispatchEvent(new Event('visibilitychange'));
    expect(hero.paused).toBe(false);

    observers[0]!([{ isIntersecting: false }]);
    expect(hero.paused).toBe(true);
    observers[0]!([{ isIntersecting: true }]);
    expect(hero.paused).toBe(false);
    hero.stop();
  });

  it('starts paused animations when a pause was requested before scheduling', async () => {
    const root = mount();
    const { win, observers } = fakeWin();
    const hero = createHero(root, win, { hold: 0 });
    observers[0]!([{ isIntersecting: false }]);
    await hero.ready;
    expect(animations.every((a) => a.state === 'paused')).toBe(true);
    hero.stop();
  });

  it('stays static with reduced motion or without the Web Animations API', async () => {
    const root = mount();
    const hero = createHero(root, fakeWin({ reduced: true }).win);
    await hero.ready;
    expect(root.dataset['static']).toBe('true');
    expect(animations).toHaveLength(0);

    const root2 = mount();
    Element.prototype.animate = undefined as unknown as typeof Element.prototype.animate;
    await createHero(root2, fakeWin().win).ready;
    expect(root2.dataset['static']).toBe('true');
  });

  it('survives missing or broken data and a missing diagram', async () => {
    document.body.innerHTML = `<figure data-hero><script type="application/json" data-hero-data>{oops</script></figure>`;
    const root = document.querySelector<HTMLElement>('[data-hero]')!;
    const hero = createHero(root, fakeWin().win, { hold: 0 });
    await flush();
    expect(animations).toHaveLength(0);
    hero.stop();
    await flush();
    document.body.innerHTML = `<figure data-hero>${svgFixture('horizontal')}</figure>`;
    const hero2 = createHero(document.querySelector<HTMLElement>('[data-hero]')!, fakeWin().win, { hold: 0, speed: 2 });
    await hero2.ready;
    expect(document.querySelector('[data-agent="0"] [data-agent-name]')!.textContent).toBe('triage');
    hero2.stop();
  });
});
