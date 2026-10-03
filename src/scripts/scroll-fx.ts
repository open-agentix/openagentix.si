/**
 * Scroll effects. Modern browsers use CSS scroll-driven animations (`animation-timeline`) for
 * reveals and parallax; this module only adds the small fallbacks (IntersectionObserver + rAF) and
 * tracks the active step of pinned scenes, which is discrete state CSS cannot express.
 */

export function supportsScrollTimeline(win: Window): boolean {
  return typeof win.CSS?.supports === 'function' && win.CSS.supports('animation-timeline: view()');
}

export function prefersReducedMotion(win: Window): boolean {
  return typeof win.matchMedia === 'function' && win.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Vertical parallax offset in px: proportional to the distance of `top` from the viewport centre. */
export function parallaxOffset(top: number, height: number, speed: number, max = 160): number {
  const value = -(top - height / 2) * speed;
  return Math.max(-max, Math.min(max, Math.round(value * 10) / 10)) + 0;
}

/** Where text is read: lower on narrow screens, where the pinned stage sits above the steps. */
export function readingLine(win: Window): number {
  return win.innerWidth < 760 ? 0.72 : 0.45;
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
export function initScenes(root: ParentNode, win: Window): number {
  const scenes = Array.from(root.querySelectorAll<HTMLElement>('[data-scene]'));
  scenes.forEach((scene) => {
    const steps = Array.from(scene.querySelectorAll<HTMLElement>('[data-scene-step]'));
    const progress = scene.querySelector<HTMLElement>('[data-scene-progress]');
    const template = progress?.dataset['template'] ?? '';
    let current = -1;
    const update = () => {
      const index = activeStepIndex(
        steps.map((s) => s.getBoundingClientRect().top),
        win.innerHeight,
        readingLine(win),
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
    if (typeof win.IntersectionObserver === 'function') {
      // Re-evaluate whenever a step crosses the reading band; cheap and scroll-listener free.
      const top = Math.round(readingLine(win) * 100);
      const observer = new win.IntersectionObserver(update, {
        rootMargin: `-${top}% 0px -${99 - top}% 0px`,
        threshold: [0, 1],
      });
      steps.forEach((s) => observer.observe(s));
    }
    update();
  });
  return scenes.length;
}

/** Fallback reveal for browsers without scroll timelines. */
export function initReveals(root: ParentNode, win: Window): 'css' | 'observer' | 'static' {
  if (supportsScrollTimeline(win)) return 'css';
  const items = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal]'));
  if (typeof win.IntersectionObserver !== 'function') {
    items.forEach((el) => el.classList.add('in-view'));
    return 'static';
  }
  const observer = new win.IntersectionObserver(
    (entries) => {
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
export function initParallax(root: ParentNode, win: Window): 'css' | 'off' | 'raf' {
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
  const observer = new win.IntersectionObserver((entries) => {
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

export function initScrollFx(root: ParentNode, win: Window) {
  return {
    scenes: initScenes(root, win),
    reveals: initReveals(root, win),
    parallax: initParallax(root, win),
  };
}
