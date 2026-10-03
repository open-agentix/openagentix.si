---
title: Audit trail
description: An append-only, SHA-256 hash-chained log with signed checkpoints. Tampering is detectable.
sidebar:
  order: 10
---

Every decision and step is written to the **audit trail**. It is revision-safe: entries are only
ever appended, and each one includes the hash of the entry before it.

## Entry

| Field | Content |
| --- | --- |
| `seq` | sequence number, starting at 1 |
| `ts` | ISO timestamp |
| `actor` | who acted, e.g. `agent:triage` or a user |
| `action` | e.g. `policy.decision`, `step.tool_call`, `approval.decided`, `run.completed` |
| `target`, `runId` | what was acted on, in which run |
| `payload` | the details, **redacted** before hashing |
| `payloadDigest` | SHA-256 of the payload |
| `prevHash` | hash of the previous entry (64 zeros for the first) |
| `hash` | SHA-256 over the canonical JSON of the fields above |

Canonical JSON means sorted keys and no whitespace, so anyone can recompute a hash.

## Checkpoints

Periodically a checkpoint `{seq, hash, ts, keyId}` is signed with an **Ed25519** key from the
configuration. A checkpoint anchors everything before it: even someone with database access cannot
rewrite history without the signing key.

## Verification

Verification walks the chain and reports `hash_mismatch`, `broken_link`, `gap`,
`payload_mismatch`, `checkpoint_signature`, `checkpoint_mismatch` or `unknown_key`. The local CLI
verifies the chain of every run and prints `audit: valid (N entries, head …)`.

## In the database

<span class="oax-badge oax-badge--roadmap">Coming with the API</span> The table is append-only: the
platform's database role has no `UPDATE` or `DELETE` privilege on it, and a trigger rejects both.
