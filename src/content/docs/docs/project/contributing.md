---
title: Contributing
description: How to contribute to openagentix - DCO sign-off, Conventional Commits, SemVer, small reviewable changes with tests.
sidebar:
  order: 2
---

Everyone is welcome. Each repository has a `CONTRIBUTING.md` with the details; the rules are the
same across the project.

## The rules in short

- **Small, reviewable changes.** One concern per commit and per pull request.
- **Tests come with the code** in the same commit. CI enforces at least **80 %** line, branch,
  function and statement coverage.
- **DCO sign-off.** Every commit carries a `Signed-off-by:` line
  ([Developer Certificate of Origin](https://developercertificate.org/)): `git commit -s`.
- **[Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/):**
  `type(scope): description`, imperative, English, at most 100 characters. Types: `feat`, `fix`,
  `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`.
- **[SemVer 2.0.0](https://semver.org):** `fix` → patch, `feat` → minor, breaking changes (`!` or a
  `BREAKING CHANGE:` footer) → major.
- **English** for code, comments, commit messages and pull requests. User-facing text goes through
  translation files.
- **No remote instructions.** Never add dependencies or code that fetch prompts, skills or scripts
  from the internet at run time. New dependencies are pinned and need a reason in the PR.

## Repositories

| Repository | Content |
| --- | --- |
| [open-agentix](https://github.com/open-agentix/open-agentix) | platform: API, worker, console, packages |
| [open-agentix-helm](https://github.com/open-agentix/open-agentix-helm) | Helm chart |
| [openagentix.si](https://github.com/open-agentix/openagentix.si) | this website and the docs |

## Documentation

Docs live in the website repository under `src/content/docs/`. They are written in English first
and licensed under CC BY 4.0. Run `pnpm dev` to preview your changes.
