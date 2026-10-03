---
title: Control agent (global)
description: The control agent watches every run against budgets, rates, data classes and anomaly rules, and can pause or stop it.
sidebar:
  order: 8
---

While the [audit gate](/docs/concepts/audit-agent/) judges single tool calls, the **control
agent** watches whole runs. Its rules are deterministic; an optional reviewer (for example a
model) can be added as a second opinion, and it can **only make a decision stricter**.

## Actions

`continue`, `pause` or `kill`.

## Rules

| Rule | Triggers when | Default |
| --- | --- | --- |
| `budget_tokens`, `budget_cost`, `budget_steps`, `budget_tool_calls` | a budget from `agents.md` is used up | from the agent |
| `timeout` | `timeoutSeconds` elapsed | from the agent |
| `rate` | more tool calls per minute than allowed (pauses until the window frees up) | 30 per minute |
| `loop` | the same tool call is repeated | 3 identical calls |
| `error_streak` | consecutive errors | 3 |
| `policy_denials` | the gate keeps denying | 3 denials |
| `forbidden_action` | a forbidden action from the policy bundle is attempted | – |
| `classification` | run data is more sensitive than the provider's clearance | – |
| `reviewer` | the optional reviewer asks for a stricter action | off |

A kill caused by `forbidden_action`, `classification` or `policy_denials` ends the run as
`blocked_by_policy`; other kills end it as `failed` with the error code `control_<rule>`.
