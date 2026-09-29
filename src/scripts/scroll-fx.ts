/**
 * Scroll effects. Modern browsers use CSS scroll-driven animations (`animation-timeline`) for
 * reveals and parallax; this module only adds the small fallbacks (IntersectionObserver + rAF) and
 * tracks the active step of pinned scenes, which is discrete state CSS cannot express.
 */

/** Window plus the optional platform constructors these effects feature-detect. */
export type FxWindow = Window & {
  IntersectionObserver?: typeof IntersectionObserver;
  CSS?: { supports(condition: string): boolean };
};

export function supportsScrollTimeline(win: FxWindow): boolean {
  return typeof win.CSS?.supports === 'function' && win.CSS.supports('animation-timeline: view()');
}

export function prefersReducedMotion(win: FxWindow): boolean {
  return typeof win.matchMedia === 'function' && win.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Vertical parallax offset in px: proportional to the distance of `top` from the viewport centre. */
export function parallaxOffset(top: number, height: number, speed: number, max = 160): number {
  const value = -(top - height / 2) * speed;
  return Math.max(-max, Math.min(max, Math.round(value * 10) / 10)) + 0;
}

/** Widest viewport that gets the phone layout (keep in sync with the media queries in ScrollScene/Story). */
export const PHONE_MAX_WIDTH = 820;

/**
 * Where text is read, as a fraction of the viewport height. Wide screens read at the middle. On
 * phones the pinned stage sits above the steps, so the line sits just below the stuck stage; without
 * a measurable stage it falls back to a fixed 72 %.
 */
export function readingLine(win: FxWindow, scene?: Element | null): number {
  if (win.innerWidth > PHONE_MAX_WIDTH) return 0.45;
  const stage = scene?.querySelector<HTMLElement>('[data-scene-stage]');
  if (!stage || typeof win.getComputedStyle !== 'function' || !win.innerHeight) return 0.72;
  const top = parseFloat(win.getComputedStyle(stage).top);
  const bottom = (Number.isFinite(top) ? top : 0) + stage.offsetHeight;
  if (!bottom) return 0.72;
  return Math.min(0.85, Math.max(0.3, (bottom + 16) / win.innerHeight));
}

/** Index of the last step whose top has passed the reading line (a fraction of the viewport height). */
export function activeStepIndex(tops: readonly number[], viewportHeight: number, line = 0.45): number {
  const y = viewportHeight * line;
  let active = 0;
  tops.forEach((top, i) => {
    if (top <= y) active = i;
  });
  return active;
}

/** Tracks which step of each `[data-scene]` is active and mirrors it to `data-step`. */
export function initScenes(root: ParentNode, win: FxWindow): number {
  const scenes = Array.from(root.querySelectorAll<HTMLElement>('[data-scene]'));
  scenes.forEach((scene) => {
    const steps = Array.from(scene.querySelectorAll<HTMLElement>('[data-scene-step]'));
    const progress = scene.querySelector<HTMLElement>('[data-scene-progress]');
    const template = progress?.dataset['template'] ?? '';
    let current = -1;
    let line = readingLine(win, scene);
    const update = () => {
      const index = activeStepIndex(
        steps.map((s) => s.getBoundingClientRect().top),
        win.innerHeight,
        line,
      );
      if (index === current) return;
      current = index;
      scene.dataset['step'] = String(index);
      steps.forEach((s, i) => s.classList.toggle('is-active', i === index));
      if (progress) {
        progress.textContent = template
          .replace('{current}', String(index + 1))
          .replace('{total}', String(steps.length));
      }
    };
    let observer: IntersectionObserver | undefined;
    const observe = () => {
      observer?.disconnect();
      if (typeof win.IntersectionObserver !== 'function') return;
      // Re-evaluate whenever a step crosses the reading band; cheap and scroll-listener free.
      // The band starts exactly at the reading line so a step that fully covers it is also past the line.
      const top = Number((line * 100).toFixed(3));
      observer = new win.IntersectionObserver(update, {
        rootMargin: `-${top}% 0px -${Number((99 - top).toFixed(3))}% 0px`,
        threshold: [0, 1],
      });
      steps.forEach((s) => observer!.observe(s));
    };
    observe();
    // Only a width change (rotation, split view) moves the line; toolbar show/hide must not rebuild it.
    let width = win.innerWidth;
    win.addEventListener(
      'resize',
      () => {
        if (win.innerWidth === width) return;
        width = win.innerWidth;
        line = readingLine(win, scene);
        observe();
        update();
      },
      { passive: true },
    );
    update();
  });
  return scenes.length;
}

/** Fallback reveal for browsers without scroll timelines. */
export function initReveals(root: ParentNode, win: FxWindow): 'css' | 'observer' | 'static' {
  if (supportsScrollTimeline(win)) return 'css';
  const items = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal]'));
  if (typeof win.IntersectionObserver !== 'function') {
    items.forEach((el) => el.classList.add('in-view'));
    return 'static';
  }
  const observer = new win.IntersectionObserver(
    (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: '0px 0px -10% 0px' },
  );
  items.forEach((el) => observer.observe(el));
  return 'observer';
}

/** rAF parallax fallback; only elements currently in view are updated. */
export function initParallax(root: ParentNode, win: FxWindow): 'css' | 'off' | 'raf' {
  if (supportsScrollTimeline(win)) return 'css';
  if (prefersReducedMotion(win) || typeof win.IntersectionObserver !== 'function') return 'off';
  const items = Array.from(root.querySelectorAll<HTMLElement>('[data-parallax]'));
  const visible = new Set<HTMLElement>();
  let scheduled = false;
  const frame = () => {
    scheduled = false;
    visible.forEach((el) => {
      const speed = Number(el.dataset['parallax'] ?? '0.1');
      const rect = el.getBoundingClientRect();
      el.style.transform = `translate3d(0, ${parallaxOffset(rect.top, win.innerHeight, speed)}px, 0)`;
    });
  };
  const schedule = () => {
    if (!scheduled && visible.size > 0) {
      scheduled = true;
      win.requestAnimationFrame(frame);
    }
  };
  const observer = new win.IntersectionObserver((entries: IntersectionObserverEntry[]) => {
    entries.forEach((e) => {
      if (e.isIntersecting) visible.add(e.target as HTMLElement);
      else visible.delete(e.target as HTMLElement);
    });
    schedule();
  });
  items.forEach((el) => observer.observe(el));
  win.addEventListener('scroll', schedule, { passive: true });
  return 'raf';
}

export function initScrollFx(root: ParentNode, win: FxWindow) {
  return {
    scenes: initScenes(root, win),
    reveals: initReveals(root, win),
    parallax: initParallax(root, win),
  };
}
