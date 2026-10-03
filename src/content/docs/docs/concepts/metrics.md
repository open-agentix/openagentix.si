---
title: Metrics, traces and logs
description: Prometheus metrics, OpenTelemetry traces and structured JSON logs, correlated by run ID.
sidebar:
  order: 12
---

<span class="oax-badge oax-badge--roadmap">Coming with the API</span> The observability endpoints
are part of the 0.1 scope and ship with the API and worker.

- **Metrics:** `/metrics` in Prometheus format: runs by status, step durations, tokens and cost by
  agent and provider, gate decisions by reason, control agent actions, queue depth.
- **Traces:** OpenTelemetry spans for runs, model calls and tool calls; the OTLP exporter is
  optional.
- **Logs:** structured JSON with the run ID on every line, with secrets redacted.
- **Health:** `/healthz` (process is alive) and `/readyz` (database and queue reachable).

Scrape the metrics with Prometheus or any compatible system; the Helm chart ships a
`ServiceMonitor` for the Prometheus Operator.
