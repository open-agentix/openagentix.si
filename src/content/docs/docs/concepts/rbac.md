---
title: Roles and permissions (RBAC)
description: Six roles, permissions per resource, scoped globally, per team, per tenant or per agent.
sidebar:
  order: 9
---

| Role | Typical person | Highlights |
| --- | --- | --- |
| `admin` | platform owner | all permissions |
| `agent-engineer` | builds agents | write and publish agents, run and cancel runs, manage own API tokens |
| `integrator` | connects systems | manage event sources and connections, read policies |
| `operator` | runs the service | run, cancel and **approve** runs |
| `auditor` | compliance, security | read, verify and export the audit trail; read policies, connections, users, settings |
| `viewer` | everyone else | read agents, runs, events and costs |

## Permissions

`agents:read|write|publish`, `runs:read|execute|cancel|approve`, `events:read`,
`sources:read|write`, `connections:read|write`, `policies:read|write`,
`audit:read|verify|export`, `costs:read`, `users:read|write`, `tokens:read|write`,
`settings:read|write`.

Nobody can change or delete audit entries; the audit trail is append-only by design.

## Scope

A role binding is `{ role, teamId }`. `teamId: null` grants the role globally; otherwise it
applies to the team's agents, runs and connections. API tokens for machines can carry `scopes`
that narrow their permissions further. Tenants and per-agent bindings are described in
[Tenants and per-agent access](/docs/concepts/tenants-and-access/).

## Sign-in

<span class="oax-badge oax-badge--roadmap">Coming with the API</span> OIDC (Keycloak, Entra ID,
Okta and others), LDAP/AD bind with group-to-role mapping, a local admin bootstrap account and
hashed, scoped, expiring API tokens. Every API route declares the permission it needs, and tests
enforce it.
