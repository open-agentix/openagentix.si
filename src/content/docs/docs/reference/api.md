---
title: API reference
description: The HTTP API reference will be generated from the platform's OpenAPI 3.1 file.
sidebar:
  order: 3
  badge:
    text: TODO
    variant: caution
---

:::caution[Not generated yet]
**TODO:** this page will be generated from `openapi.yaml` in the
[platform repository](https://github.com/open-agentix/open-agentix) once the API ships with 0.1.
The API schemas are written with zod and exported as OpenAPI 3.1; the file is committed, so the
reference can be built here without contacting a server.
:::

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
