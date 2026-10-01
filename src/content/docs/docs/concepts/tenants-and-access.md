---
title: Tenants and per-agent access
description: Tenants isolate agents, runs, keys, audit and costs. Roles can be granted per tenant and per agent.
sidebar:
  order: 12
---

<span class="oax-badge oax-badge--next">Next release (0.2)</span>: tenants as the isolation boundary and connections scoped to platform, tenant, team or agent. <span class="oax-badge oax-badge--available">Available in 0.1</span>: roles per agent (resource-scoped bindings). <span class="oax-badge oax-badge--roadmap">Planned</span>: identity providers per tenant and SCIM (0.3), per-tenant audit chains (1.0).
Check the [roadmap](/docs/project/roadmap/) for what ships in which release.

## Tenants

A **tenant** is the isolation boundary. Agents, runs, provider connections, keys, MCP servers, the
audit partition and costs all belong to exactly one tenant. Nothing crosses the boundary unless a
platform admin explicitly allows it.

A single homelab server can run with one tenant and one person who holds every role. Nothing in
the model forces an organisation chart on you.

## Roles per tenant and per agent

The six [roles](/docs/concepts/rbac/) stay as they are: `admin`, `agent-engineer`, `integrator`,
`operator`, `auditor`, `viewer`. A role binding can additionally be limited to single agents:

```yaml
bindings:
  - subject: user:anna
    role: agent-engineer
    tenant: payments
    agents: [invoice-reader]      # omit to cover the whole tenant
```

For people who are bound to specific agents:

- list endpoints and the console show only the agents they are bound to,
- direct access to any other agent answers `404`, as if it did not exist,
- the denial is written to the [audit trail](/docs/concepts/audit-trail/).

## Perspectives and roles

The documentation talks about four **perspectives** (business user, integrator, agent engineer,
auditor). They describe who looks at the platform for which reason. **Roles** are the RBAC roles
above; one person can hold several, and in a small setup usually does.

## Optional enterprise layers

OIDC, LDAP/AD group mapping and signed audit checkpoints are optional layers on top of the same
core.
