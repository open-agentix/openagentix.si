---
title: Security model
description: What openagentix guarantees - deterministic gates, no remote instructions, secrets by reference, redaction, network policy and a tamper-evident audit trail.
sidebar:
  order: 1
---

openagentix assumes that models make mistakes and that inputs can be hostile. The platform is built
so that a confused or manipulated agent still cannot do more than its definition allows.

## Principles

1. **Deterministic gates.** Tool calls are allowed or denied by code, using the allowlist and
   argument rules in `agents.md` plus the global policy bundle. No model decides today; an optional
   model second opinion that could only make rules stricter is planned (0.4).
2. **Least privilege per agent.** An agent sees only granted tools, receives only data at or below
   its tools' and provider's clearance. Planned for 0.2: a toolbox image that contains only the
   binaries it needs (toolbox images are still planned).
3. **Separation of deciding and doing.** The [control node](/docs/concepts/control-node-and-workers/)
   holds policies, audit and the credentials catalogue and never executes tools. Workers
   authenticate with signed run tokens. Short-lived, spawned workers (container runner) are on `main`, opt-in, and ship
   with 0.2; by default the worker still runs in-process or locally.
4. **Everything on the record.** Every decision lands in the hash-chained
   [audit trail](/docs/concepts/audit-trail/) with signed checkpoints.

## No remote instructions

openagentix never fetches prompts, skills, plugins or agent definitions from the internet at run
time. Agent definitions come from the registry, published and immutable. MCP servers run from
pinned binaries (no `npx <package>@latest`), and harness adapters disable their own non-essential
network traffic. Content that arrives with events, such as e-mails, tickets or web pages, is
treated as **data**, and system prompts carry an injection guard.

## Secrets by reference

Secrets never appear in prompts, agent files or the audit trail. Configurations refer to them by
name; the platform resolves `jira.token` from the environment variable `OAX_SECRET_JIRA_TOKEN` or
the file `$OAX_SECRETS_DIR/jira.token` (for example a mounted Kubernetes Secret). With the opt-in
container runner (on `main`, ships with 0.2), each step's worker receives only that step's secrets, revoked when the step ends. By default the
in-process worker resolves the secret references of a run's MCP connections inside the worker
process; secret values never enter prompts, steps or audit payloads.

## Redaction

Before anything is logged, hashed into the audit trail or shown to a model as event data, values
are redacted:

- by key: passwords, secrets, tokens, API keys, private keys, authorization headers, cookies,
  credentials, sessions;
- by value: PEM private keys, AWS access keys, GitHub, GitLab and Slack tokens, OpenAI and Anthropic
  keys, openagentix API tokens, JWTs, `Bearer`/`Basic` credentials and passwords in URLs;
- known secret values of the run.

Redacted values become `[REDACTED]`.

## Network

- Providers have an **egress guard**: requests go only to the configured endpoint.
- `runtime.egress` declares the hosts a worker may reach. Enforcement for spawned workers is
  part of the opt-in container runner (on `main`, ships with 0.2); with the Helm chart, NetworkPolicies deny everything not listed by default.
- Bedrock can be reached through a VPC interface endpoint or a proxy only.

## Data classification

Events, agents, tools and providers carry a classification (`public` < `internal` <
`confidential` < `restricted`). Data may only flow to a tool or provider whose clearance is equal or
higher; violations are blocked before the call.

## Planned: agent lifecycle governance and stored secrets

<span class="oax-badge oax-badge--roadmap">Planned</span> Everything in this section is design only
(ADR 0017 in the platform repository, tracked as W14 in the roadmap, target 0.4). None of it is
built yet.

**Today:**

- An agent has one editable draft. Publishing turns the draft into an immutable, numbered version
  with a content digest; a published version cannot be changed. Runs use published versions only.
- Roles control who may write and publish. The `agent-engineer` role has both permissions, so the
  author can publish their own draft. There is no publish review and no approval record.
- Approvals exist at run time for tools marked as approval-required.
- Secrets are referenced by name and come from the operator's environment or mounted files. The
  platform stores no secret values and has no encrypted secret store.

**Planned:**

- **Development and published agents.** An agent stays in development until it is published.
  Edits never reach production until the next approved publish.
- **Four-eyes publish approval**, a tenant setting. Another person must approve publishing. Reviewers
  see the exact changes to `agents.md`, comment on single lines, and approve, request changes or
  reject, much like a pull-request review. Nobody can approve their own work. The approval is
  bound to the exact content, so any later edit needs a new approval.
- **Versioned, immutable published agents** that record the version number, the content digest and
  who approved them in the audit trail.
- **Personal, team and tenant secrets**, stored encrypted with a key per tenant and referenced by
  name. Runs can use a value; after it is saved nobody can read it back, and it is never shown to
  models. Personal tokens are possible for development and stay out of published agents unless the
  tenant policy explicitly allows it.
- **HashiCorp Vault and AWS Secrets Manager** as alternative secret backends.
- **Git-managed agents** will use the same review; whether a review in a Git host can count as the
  approval is a later, optional part of the design.

## Reporting a vulnerability

Please report privately through GitHub security advisories of the affected repository. See the
`SECURITY.md` file in each repository.
