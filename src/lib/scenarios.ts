/** Event sources shown on the left of the hero diagram. */
export const sourceIds = ['kafka', 'webhook', 'stream', 'mail', 'teams', 'cron'] as const;
export type SourceId = (typeof sourceIds)[number];

/** Output formats shown on the right of the hero diagram. */
export const outputIds = ['pr', 'cve', 'ticket', 'message', 'report', 'metrics'] as const;
export type OutputId = (typeof outputIds)[number];

export const MAX_AGENTS = 3;
export const MAX_OUTPUTS = 2;

export interface ScenarioAgent {
  /** Key into the scenario's translated agent names. */
  id: string;
  /** MCP tool the agent calls; shown verbatim (code identifier, not translated). */
  tool: string;
  /** Decision of the per-agent audit gate for that tool call. */
  verdict: 'allow' | 'block';
}

export interface Scenario {
  id: string;
  source: SourceId;
  agents: ScenarioAgent[];
  outputs: OutputId[];
}

export const scenarios: Scenario[] = [
  {
    id: 'cve',
    source: 'cron',
    agents: [
      { id: 'triage', tool: 'trivy.scan', verdict: 'allow' },
      { id: 'fixer', tool: 'github.open_pr', verdict: 'allow' },
    ],
    outputs: ['cve', 'pr'],
  },
  {
    id: 'ticket',
    source: 'webhook',
    agents: [
      { id: 'classifier', tool: 'jira.get_issue', verdict: 'allow' },
      { id: 'checker', tool: 'wiki.search', verdict: 'allow' },
      { id: 'updater', tool: 'jira.update', verdict: 'allow' },
    ],
    outputs: ['ticket'],
  },
  {
    id: 'orders',
    source: 'kafka',
    agents: [
      { id: 'investigator', tool: 'postgres.query', verdict: 'allow' },
      { id: 'reporter', tool: 'docs.render', verdict: 'allow' },
    ],
    outputs: ['report', 'message'],
  },
  {
    id: 'invoice',
    source: 'mail',
    agents: [
      { id: 'reader', tool: 'mail.read', verdict: 'allow' },
      { id: 'payer', tool: 'bank.transfer', verdict: 'block' },
    ],
    outputs: ['message'],
  },
  {
    id: 'incident',
    source: 'teams',
    agents: [
      { id: 'analyst', tool: 'loki.query', verdict: 'allow' },
      { id: 'summariser', tool: 'teams.post', verdict: 'allow' },
    ],
    outputs: ['message', 'metrics'],
  },
  {
    id: 'anomaly',
    source: 'stream',
    agents: [{ id: 'watcher', tool: 'prom.query', verdict: 'allow' }],
    outputs: ['metrics', 'report'],
  },
];

/** Returns a list of problems; an empty list means the scenarios are consistent. */
export function validateScenarios(list: readonly Scenario[]): string[] {
  const problems: string[] = [];
  const ids = new Set<string>();
  for (const s of list) {
    if (ids.has(s.id)) problems.push(`${s.id}: duplicate id`);
    ids.add(s.id);
    if (!sourceIds.includes(s.source)) problems.push(`${s.id}: unknown source ${s.source}`);
    if (s.agents.length < 1 || s.agents.length > MAX_AGENTS) {
      problems.push(`${s.id}: needs 1..${MAX_AGENTS} agents`);
    }
    if (s.outputs.length < 1 || s.outputs.length > MAX_OUTPUTS) {
      problems.push(`${s.id}: needs 1..${MAX_OUTPUTS} outputs`);
    }
    if (new Set(s.outputs).size !== s.outputs.length) problems.push(`${s.id}: duplicate outputs`);
    for (const o of s.outputs) {
      if (!outputIds.includes(o)) problems.push(`${s.id}: unknown output ${o}`);
    }
    const agentIds = s.agents.map((a) => a.id);
    if (new Set(agentIds).size !== agentIds.length) problems.push(`${s.id}: duplicate agents`);
    const blocked = s.agents.findIndex((a) => a.verdict === 'block');
    if (blocked !== -1 && blocked !== s.agents.length - 1) {
      problems.push(`${s.id}: a blocked call must end the pipeline`);
    }
  }
  return problems;
}

/** True when the scenario ends with a call blocked by the audit gate. */
export function isBlocked(s: Scenario): boolean {
  return s.agents.some((a) => a.verdict === 'block');
}
