---
title: E-mail
description: Turn inbound e-mail into events through a signed webhook, for example from Cloudflare Email Routing or an IMAP bridge.
sidebar:
  order: 4
---

In 0.1, mail arrives as JSON through a signed [webhook](/docs/events/webhook/). A small
forwarder, such as a Cloudflare Email Routing worker or an IMAP bridge, posts each message:

```json
{
  "from": "billing@supplier.example",
  "to": ["invoices@example.com"],
  "subject": "Invoice 2026-118",
  "text": "Please find the invoice attached…",
  "messageId": "<abc@supplier.example>",
  "date": "2026-10-03T08:15:00Z"
}
```

| Field | Notes |
| --- | --- |
| `from` | required |
| `to` | string or list |
| `subject` | defaults to empty |
| `text`, `html` | `html` is converted to text when `text` is missing |
| `messageId`, `date`, `headers` | optional |

The event is `io.openagentix.mail.received` with
`data: { from, to, subject, body, date }`; the body is truncated to 100,000 characters and the
`messageId` becomes the event ID.

:::caution
Mail is untrusted input. Treat everything in it as data, never as instructions: give mail-driven
agents narrow tool grants and require approval for anything that moves money or data.
:::

Direct IMAP polling is on the [roadmap](/docs/project/roadmap/).
