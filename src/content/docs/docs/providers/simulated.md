---
title: Simulated provider
description: A deterministic provider for tests, CI and the public demo. No network, no cost.
sidebar:
  order: 6
---

The `simulated` provider plays back scripted responses from the agent's `simulation` block. It
makes no network calls and costs nothing, so pipelines can be tested in CI and the public demo can
run without model costs.

```yaml
agents:
  - id: updater
    provider: simulated
    model: sim-1
    simulation:
      responses:
        - toolCalls:
            - server: tickets
              tool: get_ticket
              args: { key: "{{event.data.issue.key}}" }
        - text: "Ticket {{event.data.issue.key}} checked."
```

- The n-th model call of an agent returns the n-th response.
- Templates `{{…}}` can read `event.*`, `input` (the previous agent's output) and
  `lastToolResult`. A template that is the whole string keeps the original type.
- When the script runs out, a generic answer is returned.
- Token usage is estimated (characters / 4) unless `usage` is scripted.

Tool calls in the script still pass the [audit gate](/docs/concepts/audit-agent/), so simulated runs
test your policies for real.
