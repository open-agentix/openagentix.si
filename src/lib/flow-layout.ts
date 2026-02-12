import { MAX_AGENTS, outputIds, sourceIds, type OutputId, type SourceId } from './scenarios';

export interface Point {
  x: number;
  y: number;
}

export interface Box extends Point {
  w: number;
  h: number;
}

export type Orientation = 'horizontal' | 'vertical';

export interface FlowLayout {
  orientation: Orientation;
  width: number;
  height: number;
  sources: Record<SourceId, Box>;
  outputs: Record<OutputId, Box>;
  platform: Box;
  control: Box;
  /** Agent node centres, left to right. */
  agents: Point[];
  agentRadius: number;
  /** Audit gate centres, one below each agent. */
  gates: Point[];
  /** Tool chip boxes, one below each gate. */
  tools: Box[];
  audit: Box;
  /** Number of hash-chain blocks drawn in the audit band. */
  auditSlots: number;
  entry: Point;
  exit: Point;
}

export const center = (b: Box): Point => ({ x: b.x + b.w / 2, y: b.y + b.h / 2 });
export const rightEdge = (b: Box): Point => ({ x: b.x + b.w, y: b.y + b.h / 2 });
export const leftEdge = (b: Box): Point => ({ x: b.x, y: b.y + b.h / 2 });
export const topEdge = (b: Box): Point => ({ x: b.x + b.w / 2, y: b.y });
export const bottomEdge = (b: Box): Point => ({ x: b.x + b.w / 2, y: b.y + b.h });

function column<K extends string>(ids: readonly K[], x: number, top: number, step: number, w: number, h: number) {
  return Object.fromEntries(ids.map((id, i) => [id, { x, y: top + i * step, w, h }])) as Record<K, Box>;
}

function grid<K extends string>(ids: readonly K[], cols: number, left: number, top: number, w: number, h: number, gap: number) {
  return Object.fromEntries(
    ids.map((id, i) => [id, { x: left + (i % cols) * (w + gap), y: top + Math.floor(i / cols) * (h + gap), w, h }]),
  ) as Record<K, Box>;
}

function horizontal(): FlowLayout {
  const platform = { x: 320, y: 36, w: 560, h: 568 };
  const agentY = 262;
  const agents = [440, 600, 760].map((x) => ({ x, y: agentY }));
  return {
    orientation: 'horizontal',
    width: 1200,
    height: 640,
    sources: column(sourceIds, 24, 60, 90, 190, 64),
    outputs: column(outputIds, 986, 60, 90, 190, 64),
    platform,
    control: { x: 352, y: 84, w: 496, h: 64 },
    agents,
    agentRadius: 42,
    gates: agents.map((a) => ({ x: a.x, y: a.y + 104 })),
    tools: agents.map((a) => ({ x: a.x - 72, y: a.y + 150, w: 144, h: 40 })),
    audit: { x: 352, y: 506, w: 496, h: 64 },
    auditSlots: 8,
    entry: { x: platform.x, y: agentY },
    exit: { x: platform.x + platform.w, y: agentY },
  };
}

function vertical(): FlowLayout {
  const platform = { x: 16, y: 176, w: 408, h: 520 };
  const agentY = 380;
  const agents = [96, 220, 344].map((x) => ({ x, y: agentY }));
  return {
    orientation: 'vertical',
    width: 440,
    height: 880,
    sources: grid(sourceIds, 3, 16, 16, 128, 60, 12),
    outputs: grid(outputIds, 3, 16, 732, 128, 60, 12),
    platform,
    control: { x: 36, y: 222, w: 368, h: 64 },
    agents,
    agentRadius: 36,
    gates: agents.map((a) => ({ x: a.x, y: a.y + 92 })),
    tools: agents.map((a) => ({ x: a.x - 58, y: a.y + 132, w: 116, h: 40 })),
    audit: { x: 36, y: 612, w: 368, h: 64 },
    auditSlots: 6,
    entry: { x: 220, y: platform.y },
    exit: { x: 220, y: platform.y + platform.h },
  };
}

export function flowLayout(orientation: Orientation): FlowLayout {
  return orientation === 'horizontal' ? horizontal() : vertical();
}

function inside(inner: Box, outer: Box): boolean {
  return inner.x >= outer.x && inner.y >= outer.y && inner.x + inner.w <= outer.x + outer.w && inner.y + inner.h <= outer.y + outer.h;
}

function overlaps(a: Box, b: Box): boolean {
  return a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;
}

/** Geometry sanity checks used by the tests: everything in the canvas, nothing overlapping. */
export function layoutProblems(l: FlowLayout): string[] {
  const problems: string[] = [];
  const canvas = { x: 0, y: 0, w: l.width, h: l.height };
  const named: [string, Box][] = [
    ...Object.entries(l.sources).map(([k, b]) => [`source:${k}`, b] as [string, Box]),
    ...Object.entries(l.outputs).map(([k, b]) => [`output:${k}`, b] as [string, Box]),
  ];
  for (const [name, box] of [...named, ['platform', l.platform] as [string, Box]]) {
    if (!inside(box, canvas)) problems.push(`${name} outside canvas`);
  }
  for (let i = 0; i < named.length; i++) {
    for (let j = i + 1; j < named.length; j++) {
      if (overlaps(named[i]![1], named[j]![1])) problems.push(`${named[i]![0]} overlaps ${named[j]![0]}`);
    }
    if (overlaps(named[i]![1], l.platform)) problems.push(`${named[i]![0]} overlaps platform`);
  }
  const r = l.agentRadius;
  const inner: [string, Box][] = [
    ['control', l.control],
    ['audit', l.audit],
    ...l.agents.map((a, i) => [`agent:${i}`, { x: a.x - r, y: a.y - r, w: 2 * r, h: 2 * r }] as [string, Box]),
    ...l.tools.map((t, i) => [`tool:${i}`, t] as [string, Box]),
  ];
  for (const [name, box] of inner) {
    if (!inside(box, l.platform)) problems.push(`${name} outside platform`);
  }
  for (let i = 0; i < inner.length; i++) {
    for (let j = i + 1; j < inner.length; j++) {
      if (overlaps(inner[i]![1], inner[j]![1])) problems.push(`${inner[i]![0]} overlaps ${inner[j]![0]}`);
    }
  }
  if (l.agents.length !== MAX_AGENTS || l.gates.length !== MAX_AGENTS || l.tools.length !== MAX_AGENTS) {
    problems.push('agent, gate and tool counts differ');
  }
  return problems;
}
