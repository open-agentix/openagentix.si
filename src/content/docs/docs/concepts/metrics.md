---
title: Metrics, traces and logs
description: Prometheus metrics, OpenTelemetry traces and structured JSON logs, correlated by run ID.
sidebar:
  order: 12
---

<span class="oax-badge oax-badge--available">Available in 0.1</span>: `/metrics` (Prometheus), OTLP trace export with one span per run, JSON logs with the run ID, `/healthz` and `/readyz`. <span class="oax-badge oax-badge--next">Next release</span>: the trace model below (spans per step, model call and tool call, run trace identity, sampling) and the completed metric set are implemented on `main` and not yet in a tagged release.

- **Metrics:** `/metrics` in Prometheus format (API and worker). Labels hold closed sets only:
  never a tenant, agent, connection or event source name, a use case, a tool name or a run ID.
  Per-tenant numbers come from the cost and run APIs.
- **Traces:** OpenTelemetry (OTLP over HTTP), optional and off until you set an endpoint. One trace
  per run: admission, one span per worker attempt, and below it the steps, model calls, policy
  checks, approval waits and tool calls. Attributes follow an explicit allowlist, and the
  OpenTelemetry GenAI conventions that are still experimental upstream.
- **Logs:** structured JSON with the run ID on every line, with secrets redacted. Log lines written
  inside a span also carry the trace and span ID.
- **Health:** `/healthz` (process is alive) and `/readyz` (database and queue reachable).

Scrape the metrics with Prometheus or any compatible system; the Helm chart ships a
`ServiceMonitor` for the Prometheus Operator.

## What traces contain, and what they never contain

Telemetry is metadata only: names, versions, token counts, cost, latency, error codes and policy
outcomes. Prompts, responses, tool arguments and results, exception messages, stack traces, HTTP
bodies and query strings, headers, user e-mail addresses and tenant names are never exported.
Tenants appear as UUIDs. Content capture and tenant-owned exporters are not built. Traces are an
operations tool: the audit chain stays the source of truth, and each audit entry of a run links to
its trace ID.

## Sampling and collectors

By default every run is exported. You can sample by ratio and always keep traces of errors, denied
tool calls, approvals that were not granted, budget breaches and guard findings. The platform sends
all tenants to one endpoint with a tenant UUID on every span; separating tenants is done in your
OpenTelemetry Collector (the guide has a reviewed configuration) and your backend. Examples for
Grafana Tempo, Jaeger, Langfuse and Arize Phoenix are in the guide; statements about those products
are vendor behaviour as of October 2026 and can change.

The full reference (span names, attribute table, configuration, air-gapped rules) is
[`docs/observability.md`](https://github.com/open-agentix/open-agentix/blob/main/docs/observability.md)
in the repository.
