import { flowLayout, type Orientation, type Point } from './flow-layout';

/** A "camera" over the flow diagram: zoom factor plus translation in % of the diagram size. */
export interface Camera {
  scale: number;
  x: number;
  y: number;
}

/** Centres `focus` (viewBox units) in a diagram of `width` x `height` at the given zoom. */
export function cameraFor(focus: Point, width: number, height: number, scale: number): Camera {
  const round = (n: number) => Math.round(n * 100) / 100 + 0;
  return {
    scale,
    x: round(((width / 2 - focus.x) / width) * 100),
    y: round(((height / 2 - focus.y) / height) * 100),
  };
}

/** Focus point and zoom for each step of the "how it works" story: event, gate, agents, control, outputs. */
export function storyCameras(orientation: Orientation): Camera[] {
  const l = flowLayout(orientation);
  const mid = (a: number, b: number) => (a + b) / 2;
  const sources = Object.values(l.sources);
  const outputs = Object.values(l.outputs);
  const sourceCenter = {
    x: mid(Math.min(...sources.map((b) => b.x)), Math.max(...sources.map((b) => b.x + b.w))),
    y: mid(Math.min(...sources.map((b) => b.y)), Math.max(...sources.map((b) => b.y + b.h))),
  };
  const outputCenter = {
    x: mid(Math.min(...outputs.map((b) => b.x)), Math.max(...outputs.map((b) => b.x + b.w))),
    y: mid(Math.min(...outputs.map((b) => b.y)), Math.max(...outputs.map((b) => b.y + b.h))),
  };
  const gateRow = { x: l.agents[1]!.x, y: mid(l.gates[1]!.y, l.tools[1]!.y + l.tools[1]!.h) };
  const agentRow = l.agents[1]!;
  const platform = { x: l.platform.x + l.platform.w / 2, y: l.platform.y + l.platform.h / 2 };
  const zoom = orientation === 'horizontal' ? [1.5, 1.7, 1.55, 1.12, 1.5] : [1, 1, 1, 1, 1];
  const focus: Point[] = [
    { x: mid(sourceCenter.x, l.entry.x), y: sourceCenter.y },
    gateRow,
    agentRow,
    platform,
    { x: mid(l.exit.x, outputCenter.x), y: outputCenter.y },
  ];
  return focus.map((p, i) => cameraFor(p, l.width, l.height, zoom[i]!));
}

/** Aspect ratio of the phone story window: the diagram is 440 units wide and `PHONE_WINDOW_HEIGHT` tall. */
export const PHONE_WINDOW_HEIGHT = 372;

/**
 * Top edge of the phone window (in % of the vertical diagram height) for each story step. The window
 * is a fixed-size frame over the tall diagram, so the part a step talks about always lies fully inside it.
 */
export function phoneStoryTops(): number[] {
  const l = flowLayout('vertical');
  const room = l.height - PHONE_WINDOW_HEIGHT;
  const clamp = (y: number) => Math.max(0, Math.min(room, y));
  const tops = [
    0,
    // Gates, tools and the audit band share one window with the agents.
    l.audit.y + l.audit.h + 4 - PHONE_WINDOW_HEIGHT,
    l.audit.y + l.audit.h + 4 - PHONE_WINDOW_HEIGHT,
    l.control.y - 14,
    room,
  ];
  return tops.map((y) => Math.round((clamp(y) / l.height) * 1000) / 10);
}
