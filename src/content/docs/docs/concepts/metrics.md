---
title: Metrics, traces and logs
description: Prometheus metrics, OpenTelemetry traces and structured JSON logs, correlated by run ID.
sidebar:
  order: 12
---

<span class="oax-badge oax-badge--available">Available in 0.1</span>: `/metrics` (Prometheus), OTLP trace export with one span per run, JSON logs with the run ID, `/healthz` and `/readyz`. <span class="oax-badge oax-badge--next">Planned for 0.2</span>: spans per step, model and tool call and metrics for tool calls, approvals, tokens and budget exhaustion.

- **Metrics:** `/metrics` in Prometheus format: runs by status, step durations, tokens and cost by
  agent and provider, gate decisions by reason, control agent actions, queue depth.
- **Traces:** OpenTelemetry spans for runs (today), or per step, model and tool call (planned);
  the OTLP exporter is optional.
- **Logs:** structured JSON with the run ID on every line, with secrets redacted.
- **Health:** `/healthz` (process is alive) and `/readyz` (database and queue reachable).

Scrape the metrics with Prometheus or any compatible system; the Helm chart ships a
`ServiceMonitor` for the Prometheus Operator.
