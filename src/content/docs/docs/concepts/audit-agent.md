---
title: Audit gate (per agent)
description: Every tool call is checked against the agent's allowlist and argument rules before it executes - by deterministic code, not a model.
sidebar:
  order: 7
---

Each agent has an **audit gate**. When the model asks for a tool call, the gate decides **before**
anything executes. It is a deterministic policy engine, not a language model, so the same request
always gets the same answer.

## What is checked, in order

1. **Global forbids** from the policy bundle (`forbiddenTools`, `forbiddenArgPatterns`).
2. **Grant:** is `server/tool` in the agent's `tools`? Otherwise `tool_not_granted`.
3. **Arguments** against the grant's constraints: type, required, pattern, enum, const, length,
   range, item count and `deny` patterns. Unknown arguments are denied unless
   `allowAdditionalArgs: true`.
4. **Call limits:** `maxCallsPerRun` per grant.
5. **Classification:** the data level of the run must not exceed the tool's clearance.
6. **Approval:** `approval: required` on the grant, or `requireApprovalTools` in the policy bundle.

All violations are collected and recorded. The result is one of `allow`, `deny` or
`require_approval`.

## Reason codes

`tool_not_granted`, `tool_forbidden`, `arg_missing`, `arg_unknown`, `arg_type`, `arg_pattern`,
`arg_enum`, `arg_const`, `arg_length`, `arg_range`, `arg_items`, `arg_denied`,
`arg_forbidden_pattern`, `call_limit`, `classification`, `approval_required`.

## Example

```yaml
tools:
  - server: tickets
    tool: update_ticket
    approval: required
    maxCallsPerRun: 1
    args:
      key: { type: string, required: true, pattern: "^SEC-\\d+$" }
      status: { type: string, enum: [triaged, in-progress, done] }
```

A call with `key: OPS-1` is denied with `arg_pattern`; a valid call pauses the run until a human
approves it. The model only ever sees tools that are granted.
