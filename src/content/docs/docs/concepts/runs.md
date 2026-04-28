---
title: Runs and steps
description: One event causes one run. Every model call, tool call and decision is recorded as a step.
sidebar:
  order: 6
---

A **run** is one execution of an agent definition caused by one event. A pipeline runs its agents
in order; each agent sees the event and the output of the previous agent.

## States

```text
queued ──▶ running ──▶ succeeded
   │          │  ▲ └──▶ failed | cancelled | blocked_by_policy
   │          ▼  │
   │   awaiting_approval ──▶ failed | cancelled | blocked_by_policy
   └──▶ cancelled
```

`succeeded`, `failed`, `cancelled` and `blocked_by_policy` are final. A run waits in
`awaiting_approval` when a tool that requires approval is called; approvers have
`approvals.timeoutSeconds` (default 3600) to decide.

## Steps

Each step has a kind and a status:

| Kind | Meaning |
| --- | --- |
| `model_call` | A request to the model provider, with token usage and cost |
| `tool_call` | An MCP tool call that passed the gate |
| `policy_decision` | The audit gate's decision for a requested call |
| `approval` | A human approval request and its outcome |
| `control` | A control agent action (pause, kill) |
| `output` | A result in one of the agent's output formats |
| `error` | An error with a stable code |

Statuses are `ok`, `error`, `denied`, `pending`, `approved` and `rejected`.

## Configuring a run

Budgets, approvals, timeouts and the runner are declared in `agents.md`
(see [reference](/docs/reference/agents-md/)). Pipeline and agent budgets are merged per field and
the stricter value wins.
