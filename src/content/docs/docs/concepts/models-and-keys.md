---
title: Your keys, your models
description: Bring your own model keys. Model lists, context sizes and prices come from a pinned models.dev snapshot.
sidebar:
  order: 13
---

<span class="oax-badge oax-badge--roadmap">Roadmap</span> The provider adapters are described in the
[providers overview](/docs/providers/overview/). This page covers the key and catalog design that
builds on them.

## Bring your own key (BYOK)

A provider connection holds a **secret reference**, never the secret value. The value is resolved
inside the worker at call time and is redacted from prompts, logs and the audit trail.

Keys can be scoped to the platform, a tenant, a team or a single agent. The narrowest scope that
matches wins, so one agent can use a dedicated key with its own spending limit.

## Model catalog from models.dev

The list of models, their context sizes and their prices is imported from a **pinned snapshot** of
[models.dev](https://models.dev) data:

- the snapshot is vendored as a JSON file in the repository,
- it is refreshed by a reviewed pull request or a scheduled job in the repository,
- agents and workers **never fetch it at run time**.

That keeps the [air-gapped mode](/docs/concepts/air-gapped/) intact and makes every price in an
audit entry reproducible. Private or local models (for example Ollama) get local overrides next
to the snapshot.

## Costs follow the catalog

The [price table](/docs/concepts/costs/) is derived from the catalog plus your overrides, so a new
model shows up with a price instead of as an unpriced call.
