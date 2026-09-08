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

<span class="oax-badge oax-badge--roadmap">Coming with the API</span> Monthly budgets per agent and
team with alerts, and a cost dashboard in the console.

## Attribution and export

<span class="oax-badge oax-badge--roadmap">Roadmap</span> Every cost line carries **tenant, agent,
use case, run, step, model and provider**. Totals can be aggregated by any of these and exported
as CSV or JSON; a Prometheus metric with bounded labels covers dashboards. Hard-stop budgets can
be set per run, agent, use case, tenant and month. Prices come from the pinned catalog described
in [your keys, your models](/docs/concepts/models-and-keys/).
