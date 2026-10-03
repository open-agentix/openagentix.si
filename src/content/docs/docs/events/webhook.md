---
title: Webhook (HMAC-signed)
description: Receive signed HTTP webhooks from any system, including GitHub, Jira, Teams and Slack.
sidebar:
  order: 1
---

Webhooks are verified with **HMAC-SHA256** and protected against replay before an event is
created.

## Scheme `oax-v1` (default)

The sender signs `<timestamp>.<raw body>` with the shared secret:

```text
x-oax-timestamp: 1767225600
x-oax-signature: v1=<hex HMAC-SHA256(secret, "1767225600.<raw body>")>
x-oax-delivery: d-123            (optional, unique per delivery)
```

- The timestamp must be within **300 seconds** of the server time (configurable).
- Several `v1=` values may be sent, comma-separated, and several secrets may be configured, so you
  can rotate secrets without downtime.
- A delivery ID is accepted only once within twice the tolerance. Without `x-oax-delivery`, the
  timestamp and signature identify the delivery.

### Signing in the shell

```sh
body='{"issue":{"key":"SEC-42","severity":"high"}}'
ts=$(date +%s)
sig=$(printf '%s.%s' "$ts" "$body" | openssl dgst -sha256 -hmac "$WEBHOOK_SECRET" -hex | sed 's/^.* //')
curl -X POST "$OAX_URL/v1/events/webhook/jira" \
  -H "content-type: application/json" \
  -H "x-oax-timestamp: $ts" \
  -H "x-oax-signature: v1=$sig" \
  --data "$body"
```

The endpoint path is illustrative until the API reference is published.

## Scheme `github`

For GitHub webhooks, configure the source with the `github` scheme. The signature is read from
`x-hub-signature-256: sha256=<hex>` and the delivery ID from `x-github-delivery`. GitHub sends no
timestamp, so replay protection relies on the delivery ID.

## Payload

- Bodies up to **1 MiB** are accepted by default.
- JSON is assumed when no content type is sent or the content type contains `json`.
- A structured CloudEvent is validated and kept; anything else becomes
  `io.openagentix.webhook.received` with the body as `data`.

## Errors

`signature_missing`, `signature_invalid`, `timestamp_invalid`, `replayed`, `payload_invalid`.

## Teams and Slack

Point an outgoing webhook (or a small relay) at a webhook source; messages arrive as webhook
events. Dedicated adapters are on the [roadmap](/docs/project/roadmap/).
