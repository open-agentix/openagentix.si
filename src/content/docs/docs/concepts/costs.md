---
title: Costs and budgets
description: Every model call and tool call is priced. Budgets stop runs instead of just warning.
sidebar:
  order: 11
---

Each step records tokens in and out and its cost. Amounts are tracked as integer **micro-USD**, so
there are no rounding surprises.

## Price table

Prices come from a configurable table:

```json
[
  { "provider": "openai", "model": "gpt-4.1-mini", "inputPerMTok": 0.4, "outputPerMTok": 1.6 },
  { "provider": "bedrock", "model": "anthropic.*", "inputPerMTok": 3, "outputPerMTok": 15 },
  { "provider": "mcp", "model": "*", "inputPerMTok": 0, "outputPerMTok": 0, "perToolCallUsd": 0.001 }
]
```

The values above are examples; use your contract prices. Exact model names win over globs. Prices
are looked up by provider name first, then by provider kind. `simulated/*` and `ollama/*` cost
nothing. A call without a matching price is recorded with `priced: false`, so gaps are visible.

## Budgets

```yaml
budget:
  maxTokens: 50000
  maxCostUsd: 0.5
  maxSteps: 12
  maxToolCalls: 6
  timeoutSeconds: 300
```

Budgets can be set for the pipeline and for each agent; the stricter value wins. When a budget is
used up, the [control agent](/docs/concepts/control-agent/) stops the run.

<span class="oax-badge oax-badge--available">Available in 0.1</span> Monthly team budgets and the cost dashboard. <span class="oax-badge oax-badge--next">Next release (0.2)</span> Monthly tenant and use-case budgets with hard stop, alerts at 50/80/100 % as events and audit entries. <span class="oax-badge oax-badge--roadmap">Planned for 0.2</span> Monthly per-agent budgets and alert delivery to chat and mail.

## Attribution and export

<span class="oax-badge oax-badge--available">Available in 0.1</span> Every cost line carries **tenant, agent, use case, run, step, model and provider**. Totals can be aggregated by any of these and exported as CSV or JSON; a Prometheus metric with bounded labels covers dashboards. Hard stops exist per run (each agent's `budget`), per team and month (0.1) and per tenant and use case and month (next release); monthly per-agent budgets are planned for 0.2. Prices come from the pinned catalog described in [your keys, your models](/docs/concepts/models-and-keys/).
