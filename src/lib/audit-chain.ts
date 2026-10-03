/**
 * A tiny model of the platform's hash-chained audit trail, used to render a real (not faked) chain
 * on the landing page at build time. Each entry's hash covers the previous hash plus its own fields.
 */
export interface AuditInput {
  actor: string;
  action: string;
  target: string;
  at: string;
}

export interface AuditEntry extends AuditInput {
  seq: number;
  prev: string;
  hash: string;
}

export type HashFn = (data: string) => string;

export const GENESIS = '0'.repeat(64);

export function canonical(seq: number, prev: string, e: AuditInput): string {
  return JSON.stringify({ seq, prev, actor: e.actor, action: e.action, target: e.target, at: e.at });
}

export function buildChain(inputs: readonly AuditInput[], hash: HashFn): AuditEntry[] {
  const out: AuditEntry[] = [];
  let prev = GENESIS;
  inputs.forEach((e, seq) => {
    const h = hash(canonical(seq, prev, e));
    out.push({ ...e, seq, prev, hash: h });
    prev = h;
  });
  return out;
}

/** Index of the first entry that does not verify, or -1 when the whole chain is intact. */
export function verifyChain(entries: readonly AuditEntry[], hash: HashFn): number {
  let prev = GENESIS;
  for (const [i, e] of entries.entries()) {
    if (e.prev !== prev || hash(canonical(e.seq, e.prev, e)) !== e.hash) return i;
    prev = e.hash;
  }
  return -1;
}

export const shortHash = (h: string) => `${h.slice(0, 6)}…${h.slice(-4)}`;

/** Sample entries shown on the landing page. */
export const sampleAudit: AuditInput[] = [
  { actor: 'webhook:github', action: 'event.received', target: 'run/4821', at: '2026-10-03T03:00:00Z' },
  { actor: 'agent:cve-triage', action: 'tool.allowed', target: 'trivy.scan', at: '2026-10-03T03:00:07Z' },
  { actor: 'agent:fixer', action: 'tool.allowed', target: 'github.open_pr', at: '2026-10-03T03:00:31Z' },
  { actor: 'agent:fixer', action: 'tool.blocked', target: 'github.merge', at: '2026-10-03T03:00:33Z' },
  { actor: 'worker', action: 'run.succeeded', target: 'run/4821', at: '2026-10-03T03:00:41Z' },
];
