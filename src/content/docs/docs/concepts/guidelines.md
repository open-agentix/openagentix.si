---
title: Guidelines and the hardening agent
description: Versioned development guidelines per agent or tenant, enforced by a global hardening agent that can only tighten decisions.
sidebar:
  order: 16
---

<span class="oax-badge oax-badge--roadmap">Roadmap</span>

## Development guidelines

A **guideline set** is a versioned document that describes how a development agent works: coding
standards, branching and commit rules, test coverage, security rules and forbidden dependencies.

- It attaches to an agent or to a tenant.
- It becomes part of the [agent contract](/docs/reference/agents-md/).
- It is evaluated in the agent's evaluation suite and recorded for every run in the audit trail.

## The global hardening agent

The **hardening agent** is a platform-wide or tenant-wide agent bound by policy. It reviews the
output and the pull requests of development agents against the company-wide rules.

- It can only make decisions **stricter**, never weaken a policy.
- Its findings go to the audit trail.

## Order of precedence

Guidelines resolve in the order **global, tenant, agent**. Where they disagree, the stricter rule
wins.
