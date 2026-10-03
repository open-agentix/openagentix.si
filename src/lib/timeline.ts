import { center, leftEdge, rightEdge, type FlowLayout, type Point } from './flow-layout';
import { MAX_AGENTS, type Scenario } from './scenarios';

/** One visual beat of a hero scenario. The DOM driver maps each kind to a Web Animation. */
export type Beat =
  | { kind: 'source'; at: number; duration: number; source: string }
  | { kind: 'travel'; at: number; duration: number; packet: number; from: Point; to: Point }
  | { kind: 'agent'; at: number; duration: number; slot: number }
  | { kind: 'call'; at: number; duration: number; slot: number; from: Point; to: Point }
  | { kind: 'gate'; at: number; duration: number; slot: number; verdict: 'allow' | 'block' }
  | { kind: 'tool'; at: number; duration: number; slot: number }
  | { kind: 'audit'; at: number; duration: number; index: number }
  | { kind: 'control'; at: number; duration: number; alert: boolean }
  | { kind: 'output'; at: number; duration: number; output: string };

export interface Timeline {
  scenario: string;
  beats: Beat[];
  /** Agent slot used for each agent of the scenario, in order. */
  slots: number[];
  duration: number;
}

export interface TimingOptions {
  /** Multiplier for all durations; 1 is the designed speed. */
  speed?: number;
  /** How long the finished state stays on screen before the next scenario. */
  hold?: number;
}

/** Spreads n agents over the available slots: 1 -> middle, 2 -> outer, 3 -> all. */
export function agentSlots(count: number, available = MAX_AGENTS): number[] {
  if (count <= 0) return [];
  if (count === 1) return [Math.floor((available - 1) / 2)];
  if (count === 2 && available >= 3) return [0, available - 1];
  return Array.from({ length: Math.min(count, available) }, (_, i) => i);
}

export function buildTimeline(scenario: Scenario, layout: FlowLayout, options: TimingOptions = {}): Timeline {
  const k = 1 / (options.speed ?? 1);
  const d = (ms: number) => Math.round(ms * k);
  const beats: Beat[] = [];
  const slots = agentSlots(scenario.agents.length, layout.agents.length);
  let t = 0;
  let audit = 0;

  const push = (beat: Beat) => {
    beats.push(beat);
    return beat;
  };

  push({ kind: 'source', at: t, duration: d(500), source: scenario.source });
  t += d(250);
  let position = rightEdge(layout.sources[scenario.source]);
  const hop = (to: Point, ms: number) => {
    push({ kind: 'travel', at: t, duration: d(ms), packet: 0, from: position, to });
    position = to;
    t += d(ms);
  };

  hop(layout.entry, 650);
  push({ kind: 'audit', at: t, duration: d(300), index: audit++ });

  let blocked = false;
  scenario.agents.forEach((agent, i) => {
    const slot = slots[i]!;
    const node = layout.agents[slot]!;
    hop(node, 450);
    push({ kind: 'agent', at: t, duration: d(700), slot });
    push({ kind: 'control', at: t, duration: d(600), alert: false });
    t += d(250);
    push({ kind: 'call', at: t, duration: d(350), slot, from: node, to: layout.gates[slot]! });
    t += d(350);
    push({ kind: 'gate', at: t, duration: d(500), slot, verdict: agent.verdict });
    push({ kind: 'audit', at: t, duration: d(300), index: audit++ });
    t += d(300);
    if (agent.verdict === 'block') {
      blocked = true;
      push({ kind: 'control', at: t, duration: d(900), alert: true });
      t += d(500);
      return;
    }
    push({ kind: 'call', at: t, duration: d(300), slot, from: layout.gates[slot]!, to: center(layout.tools[slot]!) });
    t += d(300);
    push({ kind: 'tool', at: t, duration: d(500), slot });
    t += d(250);
  });

  // A blocked call still produces an output: the request for human approval.
  hop(layout.exit, blocked ? 400 : 450);
  push({ kind: 'audit', at: t, duration: d(300), index: audit++ });
  scenario.outputs.forEach((output, i) => {
    const target = leftEdge(layout.outputs[output]);
    push({ kind: 'travel', at: t, duration: d(600), packet: i + 1, from: layout.exit, to: target });
    push({ kind: 'output', at: t + d(600), duration: d(900), output });
  });
  t += d(600 + 900);

  const duration = t + d(options.hold ?? 1400);
  return { scenario: scenario.id, beats, slots, duration };
}
