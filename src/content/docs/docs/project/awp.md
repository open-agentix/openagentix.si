---
title: Agentic Workflow Protocol (AWP)
description: What the Agentic Workflow Protocol is, how openagentix relates to it, and what is and is not implemented.
sidebar:
  order: 4
---

The **Agentic Workflow Protocol (AWP)** is a specification for describing agentic workflows in a
vendor-neutral, machine-readable way: what a workflow does, within which limits it runs (budgets,
tool permissions), under which governance (ownership, approvals, data classification) and which
audit records it leaves behind. It is a specification, not a platform. It is developed in the open
by the same project as openagentix, in its own repository and with its own website:

- Specification and repository: [open-agentix/agenticWorkflowProtocol.org](https://github.com/open-agentix/agenticWorkflowProtocol.org)
- Website: [agenticworkflowprotocol.org](https://agenticworkflowprotocol.org/)

## Status

- AWP is a **draft (alpha)**. The current version is `v1alpha1`; fields, semantics and conformance
  profiles may change incompatibly before `v1`. It is not an adopted or industry standard, and
  nobody outside this project has stated support for it.
- AWP is meant to complement MCP (agents and tools) and A2A (agent to agent), not to replace them.

## How openagentix relates to AWP

- openagentix is **one implementation** of AWP and the one built alongside it. It has no special
  rights over the specification; changes go through the same public process as everyone else's.
- openagentix has its own agent format, [`agents.md`](/docs/reference/agents-md/). That format was
  designed with the AWP schema in mind, and a mapping between the two is documented in the AWP
  repository.
- **Not implemented today:** openagentix is **not conformant** to any AWP profile. It does not read
  AWP manifests, and it has published no conformance statement. Work towards conformance is in
  progress and may change.
- AWP provides governance primitives that can help organizations meet their own compliance
  requirements. Neither AWP nor openagentix makes a system compliant with any law or regulation.

If you build a runtime, validator or tool for AWP, you are welcome to open an issue or pull request
in the AWP repository.
