# Governance

This repository follows the governance of the openagentix project, described in
[`GOVERNANCE.md` of the platform repository](https://github.com/open-agentix/open-agentix/blob/main/GOVERNANCE.md)
and summarised on the website under [Docs → Project → Governance](https://openagentix.si/docs/project/governance/).

## Built by an agent

**open-agentix – the agentic platform. Built by agentix-zero, an AI agent. That is how much we
trust our goal and vision.**

agentix-zero is the project's agent account and authors most changes in this repository. It has no
decision rights of its own; the maintainers own all decisions. The project lead acts as the
maintainer of this repository.

## How changes are reviewed

The platform is built mostly by AI agents under the maintainer's direction.

- Pull requests are authored by agents (the implementation model).
- A second, independent review agent (a stronger model) reviews each pull request. For
  security-relevant changes this is a dedicated adversarial security review with a fix round and
  real test runs.
- The lead agent merges (squash merge) under the maintainer's standing authorisation.
- There is **no guarantee that a human reads every change before it is merged.**
- The maintainer sets the direction, answers design questions, can inspect, revert and block
  changes at any time, and decides on releases.
- External contributions from people are reviewed by the maintainer.

Requiring a human approval for sensitive paths (for example authentication, tenancy, runners and
migrations) through `CODEOWNERS` and branch protection is possible and planned as an optional
governance setting. It is not enforced today.

This is about how the project is developed. The runtime approval of agent actions (approval steps
in `agents.md`) is a separate product feature and is unchanged.

**How to verify:** the pull request history shows who authored, reviewed and merged each change and
keeps the review comments; the ADRs in the platform repository record the significant decisions; the
CHANGELOG lists what shipped in each release.

## Maintainers

| Maintainer | Role |
| --- | --- |
| Project lead | sets direction, reviews contributions from people, releases, owns decisions |
| agentix-zero | agent account, authors changes, no decision rights |

## Decisions

Everyday changes are decided in pull requests (see above) with one approval. Changes to the
licence or the "no third-party requests" rule need the project
lead's approval.
