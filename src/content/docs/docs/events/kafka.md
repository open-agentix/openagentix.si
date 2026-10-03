---
title: Kafka
description: Consume Kafka topics with SASL and TLS; CloudEvents binary and structured modes are understood.
sidebar:
  order: 2
---

```json
{
  "name": "orders",
  "brokers": ["kafka-1:9093", "kafka-2:9093"],
  "clientId": "openagentix",
  "groupId": "openagentix-orders",
  "topics": ["orders.failed"],
  "fromBeginning": false,
  "ssl": { "caSecret": "kafka.ca", "rejectUnauthorized": true },
  "sasl": { "mechanism": "scram-sha-512", "username": "oax", "passwordSecret": "kafka.password" }
}
```

| Field | Default |
| --- | --- |
| `clientId` | `openagentix` |
| `fromBeginning` | `false` |
| `ssl` | `false`; `true` or `{ caSecret, certSecret, keySecret, rejectUnauthorized }` with PEM material in secrets |
| `sasl.mechanism` | `plain`, `scram-sha-256` or `scram-sha-512` |

Secrets are [references](/docs/security/model/#secrets-by-reference), never values.

## Messages

1. **CloudEvents binary mode:** headers `ce_specversion: 1.0` and `ce_type` (plus `ce_id`,
   `ce_source`, `ce_subject`, `ce_time`, `content-type`).
2. **Structured mode:** a JSON body with `specversion`.
3. **Anything else** becomes `io.openagentix.kafka.message` with the ID
   `<topic>-<partition>-<offset>` and `data: { topic, partition, key, value }`.

If handling a message fails, the consumer retries it.

Trigger an agent with:

```yaml
triggers:
  - type: kafka
    topic: orders.failed
```
