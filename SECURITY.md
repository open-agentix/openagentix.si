# Security Policy

## Reporting a vulnerability

**Please do not open public issues for security problems.**

Report privately through
[GitHub Security Advisories](https://github.com/open-agentix/openagentix.si/security/advisories/new)
("Report a vulnerability"). Include the affected page or file, a description, steps to reproduce and
the impact you expect. We acknowledge reports within 3 working days and coordinate disclosure with
you.

Vulnerabilities in the platform itself belong to the
[platform repository](https://github.com/open-agentix/open-agentix/security/advisories/new).

## Scope

This repository builds a static website. Interesting findings include:

- any request from the built site to a third-party host (the site must not make any),
- cross-site scripting through content or translation files,
- supply-chain issues in the build (dependencies, GitHub Actions),
- leaks of personal data beyond what the privacy policy describes.

## Hardening in place

- No third-party requests: fonts, icons and scripts are self-hosted; a test scans every built file.
- Dependencies are pinned to exact versions with a committed lockfile; install scripts of
  dependencies are disabled (`pnpm-workspace.yaml`).
- GitHub Actions are pinned by commit SHA and run with read-only permissions.
- Dependabot watches npm packages and Actions.
