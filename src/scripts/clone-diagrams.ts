/**
 * The story stage reuses the hero's flow diagrams instead of shipping a second copy in the HTML.
 * Each `[data-clone-diagram="<orientation>"]` container receives a deep clone of the hero SVG with
 * the same orientation; ids and `url(#…)` references get a new prefix so ids stay unique.
 */
export function cloneDiagrams(doc: Document, prefix = 'story'): number {
  let count = 0;
  doc.querySelectorAll<HTMLElement>('[data-clone-diagram]').forEach((target) => {
    const orientation = target.dataset['cloneDiagram'];
    const source = doc.querySelector(`[data-hero] svg[data-orientation="${orientation}"]`);
    if (!source || target.querySelector('svg')) return;
    const clone = source.cloneNode(true) as SVGSVGElement;
    const rename = new Map<string, string>();
    clone.querySelectorAll('[id]').forEach((el) => {
      const next = `${prefix}-${el.id}`;
      rename.set(el.id, next);
      el.id = next;
    });
    clone.querySelectorAll('*').forEach((el) => {
      for (const attr of Array.from(el.attributes)) {
        const value = attr.value.replace(/url\(#([^)]+)\)/g, (m, id: string) => (rename.has(id) ? `url(#${rename.get(id)})` : m));
        if (value !== attr.value) el.setAttribute(attr.name, value);
      }
    });
    target.append(clone);
    count += 1;
  });
  return count;
}
