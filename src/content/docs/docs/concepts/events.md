---
title: Events
description: Everything that starts a run is an event - a CloudEvents 1.0 envelope from a webhook, Kafka, a schedule or an e-mail.
sidebar:
  order: 4
---

An **event** is the reason a run exists. openagentix normalises every input into a
[CloudEvents 1.0](https://cloudevents.io/) envelope (structured JSON mode):

```json
{
  "specversion": "1.0",
  "id": "b3c1c7e4-…",
  "source": "/sources/webhook/jira",
  "type": "io.openagentix.webhook.received",
  "time": "2026-10-03T09:12:00Z",
  "datacontenttype": "application/json",
  "oaxclassification": "internal",
  "data": { "issue": { "key": "SEC-42", "severity": "high" } }
}
```

| Source | Event type | Page |
| --- | --- | --- |
| Signed webhook | `io.openagentix.webhook.received` | [Webhook](/docs/events/webhook/) |
| Kafka topic | `io.openagentix.kafka.message` | [Kafka](/docs/events/kafka/) |
| Schedule | `io.openagentix.cron.tick` | [Cron](/docs/events/cron/) |
| E-mail | `io.openagentix.mail.received` | [Mail](/docs/events/mail/) |
| Manual / CLI | `io.openagentix.manual` | [CLI](/docs/reference/cli/) |

Sources follow the URI convention `/sources/<kind>/<name>`. If a producer already sends a
structured CloudEvent, it is validated and kept as is.

## Classification

The optional extension `oaxclassification` (`public`, `internal`, `confidential`, `restricted`)
marks how sensitive the event data is. Data may only flow to providers and tools whose clearance is
equal or higher; otherwise the [control agent](/docs/concepts/control-agent/) blocks the run.

## Chat tools

Microsoft Teams and Slack reach openagentix through their outgoing or incoming webhook features,
using the generic [webhook](/docs/events/webhook/) source in the MVP. Dedicated adapters are on the
[roadmap](/docs/project/roadmap/).

## Triggers

Which events start which agent is declared in the agent's `triggers`. See
[agents.md](/docs/reference/agents-md/#triggers).
