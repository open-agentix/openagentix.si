import { flowLayout, type Orientation, type Point } from '../lib/flow-layout';
import { scenarios as defaultScenarios, type Scenario } from '../lib/scenarios';
import { buildTimeline, type Beat } from '../lib/timeline';

export const WIDE_QUERY = '(min-width: 760px)';

type PauseReason = 'user' | 'hover' | 'hidden' | 'offscreen';

export interface HeroController {
  readonly paused: boolean;
  pause(reason: PauseReason): void;
  resume(reason: PauseReason): void;
  stop(): void;
  /** Resolves when the current loop iteration has been scheduled or the hero is static. */
  ready: Promise<void>;
}

interface HeroData {
  /** Translated agent names per scenario. */
  names: Record<string, Record<string, string>>;
}

const translate = (p: Point) => `translate(${p.x}px, ${p.y}px)`;
const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';
const MOVE = 'cubic-bezier(0.65, 0, 0.35, 1)';

/** Keyframes for one beat, or null when the target element is missing. */
export function beatAnimation(
  svg: Element,
  beat: Beat,
): { el: Element; keyframes: Keyframe[]; options: KeyframeAnimationOptions } | null {
  const base: KeyframeAnimationOptions = { delay: beat.at, duration: beat.duration, fill: 'forwards', easing: EASE };
  const glow = (selector: string, keyframes: Keyframe[] = [{ opacity: 0 }, { opacity: 1 }]) => {
    const el = svg.querySelector(`${selector} .glow`);
    return el ? { el, keyframes, options: base } : null;
  };
  switch (beat.kind) {
    case 'source':
      return glow(`[data-node="source:${beat.source}"]`);
    case 'output':
      return glow(`[data-node="output:${beat.output}"]`);
    case 'agent':
      return glow(`[data-agent="${beat.slot}"]`);
    case 'tool':
      return glow(`[data-tool="${beat.slot}"]`);
    case 'control': {
      const el = svg.querySelector(beat.alert ? '[data-control] .alert' : '[data-control] .glow');
      const keyframes = beat.alert ? [{ opacity: 0 }, { opacity: 1 }] : [{ opacity: 0 }, { opacity: 0.9 }, { opacity: 0.25 }];
      return el ? { el, keyframes, options: base } : null;
    }
    case 'gate': {
      const el = svg.querySelector(`[data-gate="${beat.slot}"] ${beat.verdict === 'allow' ? '.ok' : '.no'}`);
      return el
        ? { el, keyframes: [{ opacity: 0, transform: 'scale(0.4)' }, { opacity: 1, transform: 'scale(1)' }], options: base }
        : null;
    }
    case 'audit': {
      const el = svg.querySelector(`[data-audit-slot="${beat.index}"]`);
      return el
        ? { el, keyframes: [{ opacity: 0.18, transform: 'scale(0.5)' }, { opacity: 1, transform: 'scale(1)' }], options: base }
        : null;
    }
    case 'travel':
    case 'call': {
      const el = svg.querySelector(beat.kind === 'travel' ? `[data-packet="${beat.packet}"]` : '[data-spark]');
      if (!el) return null;
      return {
        el,
        keyframes: [
          { transform: translate(beat.from), opacity: 0 },
          { opacity: 1, offset: 0.12 },
          { opacity: 1, offset: 0.88 },
          { transform: translate(beat.to), opacity: 0 },
        ],
        options: { ...base, fill: 'none', easing: MOVE },
      };
    }
  }
}

function readData(root: HTMLElement): HeroData {
  const raw = root.querySelector('script[data-hero-data]')?.textContent;
  try {
    return raw ? (JSON.parse(raw) as HeroData) : { names: {} };
  } catch {
    return { names: {} };
  }
}

export function createHero(
  root: HTMLElement,
  win: Window,
  options: { scenarios?: Scenario[]; speed?: number; hold?: number } = {},
): HeroController {
  const list = options.scenarios ?? defaultScenarios;
  const data = readData(root);
  const reasons = new Set<PauseReason>();
  const running: Animation[] = [];
  let stopped = false;
  let resolveReady: () => void = () => undefined;
  const ready = new Promise<void>((r) => (resolveReady = r));

  const reduced = win.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  const toggle = root.querySelector<HTMLButtonElement>('[data-hero-toggle]');

  const syncToggle = () => {
    if (!toggle) return;
    const userPaused = reasons.has('user');
    toggle.setAttribute('aria-pressed', String(userPaused));
    toggle.setAttribute('aria-label', (userPaused ? toggle.dataset['labelPlay'] : toggle.dataset['labelPause']) ?? '');
    root.dataset['paused'] = String(reasons.size > 0);
  };

  const controller: HeroController = {
    get paused() {
      return reasons.size > 0;
    },
    pause(reason) {
      reasons.add(reason);
      running.forEach((a) => a.pause());
      syncToggle();
    },
    resume(reason) {
      reasons.delete(reason);
      if (reasons.size === 0) running.forEach((a) => a.play());
      syncToggle();
    },
    stop() {
      stopped = true;
      running.splice(0).forEach((a) => a.cancel());
    },
    ready,
  };

  if (reduced || typeof Element.prototype.animate !== 'function') {
    root.dataset['static'] = 'true';
    resolveReady();
    return controller;
  }

  const orientation = (): Orientation => (win.matchMedia?.(WIDE_QUERY).matches ? 'horizontal' : 'vertical');

  const prepare = (svg: Element, scenario: Scenario, slots: number[]) => {
    svg.querySelectorAll<SVGElement>('[data-agent]').forEach((g) => {
      const slot = Number(g.getAttribute('data-agent'));
      const index = slots.indexOf(slot);
      const used = index !== -1;
      g.classList.toggle('is-idle', !used);
      svg.querySelector(`[data-gate="${slot}"]`)?.classList.toggle('is-idle', !used);
      svg.querySelector(`[data-tool="${slot}"]`)?.classList.toggle('is-idle', !used);
      if (!used) return;
      const agent = scenario.agents[index]!;
      const name = g.querySelector('[data-agent-name]');
      if (name) name.textContent = data.names[scenario.id]?.[agent.id] ?? agent.id;
      const tool = svg.querySelector(`[data-tool="${slot}"] [data-tool-name]`);
      if (tool) tool.textContent = agent.tool;
    });
    root.querySelectorAll<HTMLElement>('[data-caption]').forEach((c) => {
      c.hidden = c.dataset['caption'] !== scenario.id;
    });
  };

  const playScenario = async (scenario: Scenario) => {
    const o = orientation();
    const svg = root.querySelector(`svg[data-orientation="${o}"]`);
    if (!svg) {
      // Nothing to animate: end the loop instead of spinning.
      stopped = true;
      resolveReady();
      return;
    }
    const timeline = buildTimeline(scenario, flowLayout(o), {
      ...(options.speed !== undefined && { speed: options.speed }),
      ...(options.hold !== undefined && { hold: options.hold }),
    });
    running.splice(0).forEach((a) => a.cancel());
    prepare(svg, scenario, timeline.slots);
    for (const beat of timeline.beats) {
      const spec = beatAnimation(svg, beat);
      if (spec) running.push(spec.el.animate(spec.keyframes, spec.options));
    }
    const clock = svg.animate([{ opacity: 1 }, { opacity: 1 }], { duration: timeline.duration });
    running.push(clock);
    if (reasons.size > 0) running.forEach((a) => a.pause());
    resolveReady();
    await clock.finished;
  };

  const loop = async () => {
    let i = 0;
    while (!stopped) {
      try {
        await playScenario(list[i % list.length]!);
      } catch {
        // A cancelled clock rejects; the loop either stops or restarts with fresh animations.
      }
      i += 1;
    }
  };

  root.addEventListener('pointerenter', () => controller.pause('hover'));
  root.addEventListener('pointerleave', () => controller.resume('hover'));
  toggle?.addEventListener('click', () => {
    if (reasons.has('user')) {
      // Pressing play while hovering should visibly play; hover pauses again on the next enter.
      reasons.delete('hover');
      controller.resume('user');
    } else {
      controller.pause('user');
    }
  });
  win.document.addEventListener('visibilitychange', () =>
    win.document.visibilityState === 'hidden' ? controller.pause('hidden') : controller.resume('hidden'),
  );
  if (typeof win.IntersectionObserver === 'function') {
    new win.IntersectionObserver(([entry]) =>
      entry?.isIntersecting ? controller.resume('offscreen') : controller.pause('offscreen'),
    ).observe(root);
  }

  syncToggle();
  void loop();
  return controller;
}
