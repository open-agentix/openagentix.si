---
title: agents.md reference
description: Every field of the agents.md format, with complete examples for a single agent and a pipeline.
sidebar:
  order: 1
---

An `agents.md` file starts with YAML front matter between `---` lines, followed by Markdown. All
objects are strict: unknown keys are rejected. Slugs (`name`, `owner`, agent `id`, MCP `server`)
match `^[a-z][a-z0-9-]{0,62}$`.

## Top level

| Field | Type | Required | Default |
| --- | --- | --- | --- |
| `apiVersion` | `openagentix.io/v1alpha1` | yes | |
| `kind` | `Agent` or `AgentPipeline` | yes | |
| `name` | slug | yes | |
| `version` | SemVer 2.0.0 | yes | |
| `description` | string | no | |
| `owner` | slug (team) | yes | |
| `classification` | `public`, `internal`, `confidential`, `restricted` | no | `internal` |
| `labels` | map of strings | no | `{}` |
| `triggers` | list, see [Triggers](#triggers) | no | `[{ type: manual }]` |
| `budget` | see [Budget](#budget) | no | platform defaults |
| `approvals` | `{ approverRoles, timeoutSeconds }` | no | `[operator, admin]`, `3600` |
| `runtime` | see [Runtime](#runtime) | no | `{ runner: in-process, egress: [] }` |
| `agents` | list of agents (at least one) | yes | |
| `pipeline` | list of agent ids, execution order | no | order of `agents` |

`kind: Agent` allows exactly one agent; use `AgentPipeline` for more.

## Triggers

```yaml
triggers:
  - type: webhook
    source: jira          # name of a configured webhook source
  - type: mail
    source: invoices
  - type: kafka
    topic: orders.failed
  - type: cron
    schedule: "0 3 * * *"
    timezone: Europe/Berlin
  - type: manual
```

## Budget

All fields are optional; set them on the pipeline and per agent. For each field the stricter value
wins.

| Field | Type |
| --- | --- |
| `maxTokens` | integer > 0 |
| `maxCostUsd` | number > 0 |
| `maxSteps` | integer > 0 |
| `maxToolCalls` | integer > 0 |
| `timeoutSeconds` | integer > 0 |

## Runtime

| Field | Values | Default |
| --- | --- | --- |
| `runner` | `in-process`, `local`, `container`, `kubernetes-job`, `aws-lambda`, `github-actions`, `gitlab-ci` | `in-process` |
| `toolbox` | e.g. `trivy`, `git+node` | none |
| `egress` | host names the worker may reach besides the control node | `[]` |

See [Runners](/docs/concepts/runners/) and [Toolbox images](/docs/concepts/toolbox-images/) for
what is available today.

## Agents

| Field | Type | Required | Default |
| --- | --- | --- | --- |
| `id` | slug | yes | |
| `description` | string | no | |
| `provider` | name of a configured provider | yes | |
| `model` | model name of that provider | yes | |
| `temperature` | 0 to 2 | no | |
| `maxTokensPerCall` | integer > 0 | no | |
| `instructions` | string (alternative to the `## Agent:` section) | no | |
| `tools` | list of [tool grants](#tool-grants) | no | `[]` |
| `toolbox` | overrides `runtime.toolbox` | no | |
| `outputs` | list of `{ format, target? }` | no | `[{ format: markdown }]` |
| `budget` | as above | no | |
| `simulation` | scripted responses for the `simulated` provider | no | |

Output formats: `markdown`, `text`, `json`, `report`, `message`, `ticket-update`, `pull-request`.

### Instructions

Write each agent's instructions in a `## Agent: <id>` section of the Markdown body. Text before the
first `##` heading is the overview. A section for an unknown agent id is an error; an agent without
instructions fails validation.

## Tool grants

| Field | Meaning | Default |
| --- | --- | --- |
| `server` | MCP server or connection name | required |
| `tool` | tool name; a trailing `*` matches a prefix; `*` matches all | required |
| `args` | map of argument name to [constraint](#argument-constraints) | `{}` |
| `allowAdditionalArgs` | allow arguments that are not listed | `false` |
| `approval` | `none` or `required` | `none` |
| `maxCallsPerRun` | integer > 0 | unlimited |
| `classification` | highest data level the tool may receive | pipeline classification |

### Argument constraints

| Key | Applies to | Meaning |
| --- | --- | --- |
| `type` | all | `string`, `number`, `integer`, `boolean`, `array`, `object` |
| `required` | all | must be present (default `false`) |
| `pattern` | string | regular expression (Unicode) that must match |
| `enum`, `const` | scalars | allowed values |
| `minLength`, `maxLength` | string | length limits |
| `minimum`, `maximum` | number, integer | range |
| `maxItems` | array | item limit |
| `deny` | all | regular expressions that must not match any string inside the value |

## Example: one agent with an approval

```md
---
apiVersion: openagentix.io/v1alpha1
kind: Agent
name: ticket-updater
version: 1.0.0
description: Move triaged security tickets to the next state - with human approval.
owner: team-security
classification: internal
triggers:
  - type: webhook
    source: jira
approvals:
  approverRoles: [operator, admin]
  timeoutSeconds: 3600
budget:
  maxTokens: 20000
  maxCostUsd: 0.2
  maxSteps: 8
  timeoutSeconds: 3900
agents:
  - id: updater
    provider: simulated
    model: sim-1
    outputs:
      - format: ticket-update
    tools:
      - server: tickets
        tool: get_ticket
        args:
          key: { type: string, required: true, pattern: "^SEC-\\d+$" }
      - server: tickets
        tool: update_ticket
        approval: required
        maxCallsPerRun: 1
        args:
          key: { type: string, required: true, pattern: "^SEC-\\d+$" }
          status: { type: string, enum: [triaged, in-progress, done] }
          labels: { type: array, maxItems: 5 }
---

# Ticket updater

## Agent: updater

Read the ticket from the event, then set its status to `triaged` and add the labels `security` and
the severity. Status changes require a human approval; if the approval is rejected, stop and say so.
```

## Example: a pipeline of two agents

```md
---
apiVersion: openagentix.io/v1alpha1
kind: AgentPipeline
name: cve-triage
version: 1.0.0
owner: team-security
runtime:
  runner: in-process
  toolbox: trivy
budget:
  maxTokens: 50000
  maxCostUsd: 0.5
  maxSteps: 12
  maxToolCalls: 6
  timeoutSeconds: 300
agents:
  - id: triage
    provider: openai
    model: gpt-4.1-mini
    outputs: [{ format: json }]
    tools:
      - server: cve-db
        tool: lookup_cve
        args:
          id: { type: string, required: true, pattern: "^CVE-\\d{4}-\\d{4,}$" }
  - id: notify
    provider: openai
    model: gpt-4.1-mini
    tools:
      - server: tickets
        tool: add_comment
        maxCallsPerRun: 1
        args:
          key: { type: string, required: true }
          comment: { type: string, maxLength: 2000 }
pipeline: [triage, notify]
---

## Agent: triage

Look up the CVE from the event and rate its impact on our image as JSON.

## Agent: notify

Post a short comment with the rating to the ticket named in the event.
```

Each agent receives the event and the output of the previous agent.

## Validation

`oax validate agents.md` reports errors (invalid SemVer, duplicate ids, `kind: Agent` with several
agents, unknown ids in `pipeline`, duplicate grants) and warnings (agents that never run, tool
classification below the pipeline's, wildcard grants without constraints or approval, simulated
calls to tools that are not granted, missing pipeline budget).
