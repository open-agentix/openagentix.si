---
title: Agents as code (agents.md)
description: An agent is a versioned Markdown file with YAML front matter. Published versions are immutable.
sidebar:
  order: 5
---

Every agent, or pipeline of agents, is a single **`agents.md`** file: YAML front matter for
everything a machine must enforce, Markdown for the instructions a model reads.

```md
---
apiVersion: openagentix.io/v1alpha1
kind: Agent
name: ticket-updater
version: 1.0.0
owner: team-security
agents:
  - id: updater
    provider: openai
    model: gpt-4.1-mini
    tools:
      - server: tickets
        tool: get_ticket
---

## Agent: updater

Read the ticket from the event and summarise it in two sentences.
```

## Why a file

- **Reviewable.** Tools, argument rules, budgets and approvals are visible in a pull request.
- **Versioned.** `version` is a SemVer 2.0.0 string. A published version is identified by the
  SHA-256 digest of its normalised source and can never change: publishing the same version with
  different content fails with `version_immutable`, and a lower version than an existing one fails
  with `version_not_increasing`.
- **Testable.** `oax validate` checks the schema and warns about risky grants; `oax run` executes
  the file against a recorded event.

## Who writes it

The business user describes the workflow in plain language, the integrator provides the MCP
servers and connections, and the **agent engineer** turns both into the file: tool grants with
argument constraints, budgets, approvals and tests.

The complete format is in the [agents.md reference](/docs/reference/agents-md/).
