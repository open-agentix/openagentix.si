import { describe, expect, it } from 'vitest';
import {
  isBlocked,
  outputIds,
  scenarios,
  sourceIds,
  validateScenarios,
  type Scenario,
} from '../../src/lib/scenarios';
import { bottomEdge, center, flowLayout, layoutProblems, topEdge } from '../../src/lib/flow-layout';
import { agentSlots, buildTimeline } from '../../src/lib/timeline';
import { cameraFor, storyCameras, tallStoryFocus } from '../../src/lib/camera';

describe('scenarios', () => {
  it('are consistent', () => {
    expect(validateScenarios(scenarios)).toEqual([]);
  });

  it('show every event source and every output format at least once', () => {
    expect(new Set(scenarios.map((s) => s.source))).toEqual(new Set(sourceIds));
    expect(new Set(scenarios.flatMap((s) => s.outputs))).toEqual(new Set(outputIds));
  });

  it('include pipelines of one, two and three agents and at least one blocked call', () => {
    expect(new Set(scenarios.map((s) => s.agents.length))).toEqual(new Set([1, 2, 3]));
    expect(scenarios.some(isBlocked)).toBe(true);
  });

  it('use tool names short enough for the diagram chips', () => {
    const longest = Math.max(...scenarios.flatMap((s) => s.agents.map((a) => a.tool.length)));
    expect(longest).toBeLessThanOrEqual(16);
  });

  it('report every kind of problem', () => {
    const bad = [
      { id: 'a', source: 'fax', agents: [], outputs: [] },
      {
        id: 'a',
        source: 'cron',
        agents: [
          { id: 'x', tool: 't', verdict: 'block' },
          { id: 'x', tool: 't', verdict: 'allow' },
          { id: 'y', tool: 't', verdict: 'allow' },
          { id: 'z', tool: 't', verdict: 'allow' },
        ],
        outputs: ['pr', 'pr', 'fax'],
      },
    ] as unknown as Scenario[];
    const problems = validateScenarios(bad);
    expect(problems).toEqual(
      expect.arrayContaining([
        'a: unknown source fax',
        'a: needs 1..3 agents',
        'a: needs 1..2 outputs',
        'a: duplicate id',
        'a: duplicate outputs',
        'a: unknown output fax',
        'a: duplicate agents',
        'a: a blocked call must end the pipeline',
      ]),
    );
  });
});

describe('flow layout', () => {
  it.each(['horizontal', 'vertical'] as const)('%s layout has no overlaps', (o) => {
    expect(layoutProblems(flowLayout(o))).toEqual([]);
  });

  it('detects broken geometry', () => {
    const l = flowLayout('horizontal');
    l.sources.kafka = { ...l.sources.webhook };
    l.outputs.pr = { x: 400, y: 100, w: 50, h: 50 };
    l.control = { x: -10, y: 0, w: 5000, h: 10 };
    l.tools = l.tools.slice(0, 2);
    const problems = layoutProblems(l);
    expect(problems).toEqual(
      expect.arrayContaining([
        'source:kafka overlaps source:webhook',
        'output:pr overlaps platform',
        'control outside platform',
        'agent, gate and tool counts differ',
      ]),
    );
    l.platform = { x: 0, y: 0, w: 99999, h: 10 };
    expect(layoutProblems(l)).toContain('platform outside canvas');
  });

  it('exposes edge helpers', () => {
    const b = { x: 0, y: 0, w: 10, h: 20 };
    expect(center(b)).toEqual({ x: 5, y: 10 });
    expect(topEdge(b)).toEqual({ x: 5, y: 0 });
    expect(bottomEdge(b)).toEqual({ x: 5, y: 20 });
  });
});

describe('timeline', () => {
  const layout = flowLayout('horizontal');

  it('spreads agents over slots', () => {
    expect(agentSlots(0)).toEqual([]);
    expect(agentSlots(1)).toEqual([1]);
    expect(agentSlots(2)).toEqual([0, 2]);
    expect(agentSlots(3)).toEqual([0, 1, 2]);
    expect(agentSlots(2, 2)).toEqual([0, 1]);
    expect(agentSlots(5, 3)).toEqual([0, 1, 2]);
  });

  it.each(scenarios.map((s) => [s.id, s] as const))('%s: beats stay in order and inside the duration', (_id, s) => {
    const tl = buildTimeline(s, layout);
    expect(tl.beats.length).toBeGreaterThan(5);
    for (const beat of tl.beats) {
      expect(beat.at).toBeGreaterThanOrEqual(0);
      expect(beat.at + beat.duration).toBeLessThanOrEqual(tl.duration);
    }
    const audits = tl.beats.filter((b) => b.kind === 'audit');
    expect(audits.length).toBeLessThanOrEqual(flowLayout('vertical').auditSlots);
    expect(tl.beats.filter((b) => b.kind === 'output').map((b) => (b.kind === 'output' ? b.output : ''))).toEqual(
      s.outputs,
    );
    expect(tl.beats.filter((b) => b.kind === 'gate')).toHaveLength(s.agents.length);
  });

  it('stops the pipeline at a blocked call and alerts the control agent', () => {
    const invoice = scenarios.find((s) => s.id === 'invoice')!;
    const tl = buildTimeline(invoice, layout);
    expect(tl.beats.some((b) => b.kind === 'control' && b.alert)).toBe(true);
    expect(tl.beats.filter((b) => b.kind === 'tool')).toHaveLength(1);
  });

  it('scales with speed and honours the hold time', () => {
    const s = scenarios[0]!;
    const slow = buildTimeline(s, layout, { hold: 0 });
    const fast = buildTimeline(s, layout, { speed: 2, hold: 0 });
    expect(fast.duration).toBeLessThan(slow.duration);
    expect(Math.abs(fast.duration * 2 - slow.duration)).toBeLessThan(20);
  });

  it('works with the vertical layout', () => {
    const tl = buildTimeline(scenarios[1]!, flowLayout('vertical'));
    expect(tl.slots).toEqual([0, 1, 2]);
  });
});

describe('story cameras', () => {
  it('centres a focus point', () => {
    expect(cameraFor({ x: 50, y: 50 }, 100, 100, 2)).toEqual({ scale: 2, x: 0, y: 0 });
    expect(cameraFor({ x: 0, y: 100 }, 100, 100, 1)).toEqual({ scale: 1, x: 50, y: -50 });
  });

  it.each(['horizontal', 'vertical'] as const)('provides five finite cameras for the %s story', (o) => {
    const cams = storyCameras(o);
    expect(cams).toHaveLength(5);
    for (const c of cams) {
      expect(Number.isFinite(c.x) && Number.isFinite(c.y)).toBe(true);
      expect(Math.abs(c.x)).toBeLessThan(50);
      expect(Math.abs(c.y)).toBeLessThan(50);
    }
  });

  it('moves left for the sources and right for the outputs in the wide story', () => {
    const [sources, , , , outputs] = storyCameras('horizontal');
    expect(sources!.x).toBeGreaterThan(0);
    expect(outputs!.x).toBeLessThan(0);
  });
});

describe('tall story focus', () => {
  it('moves down the diagram from sources to outputs', () => {
    const f = tallStoryFocus();
    expect(f).toHaveLength(5);
    expect(f[0]!).toBeLessThan(f[2]!);
    expect(f[2]!).toBeLessThan(f[1]!);
    expect(f[1]!).toBeLessThan(f[4]!);
    expect(f.every((v) => v > 0 && v < 100)).toBe(true);
  });
});
