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
