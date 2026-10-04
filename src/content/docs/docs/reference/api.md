---
title: API reference
description: The HTTP API reference will be generated from the platform's OpenAPI 3.1 file.
sidebar:
  order: 3
  badge:
    text: Roadmap 1.0
    variant: caution
---

The API is described by [`openapi.yaml`](https://github.com/open-agentix/open-agentix/blob/main/openapi.yaml)
(OpenAPI 3.1) in the platform repository. The API schemas are written with zod and exported as
OpenAPI 3.1; the file is committed, so the reference can be built here without contacting a server.
A rendered reference on this site is planned for 1.0.

## What to expect

- Versioned under `/v1`, JSON over HTTPS.
- Authentication with OIDC sessions or scoped API tokens; every route declares the permission it
  needs (see [RBAC](/docs/concepts/rbac/)).
- Resources: agents, runs and steps, events and sources, connections, policies, audit (read,
  verify, export), costs, users, tokens, settings.
- Run steps stream over Server-Sent Events.

## Worker endpoints

Workers talk to the control node with a signed run token
(`Authorization: Bearer oaxrt.…`): `POST /v1/worker/runs/{runId}/gate` before every tool call,
`…/steps` to report steps, `…/approvals` for approval requests, `GET …/status` and
`POST …/complete`. See [Control node and worker nodes](/docs/concepts/control-node-and-workers/).
