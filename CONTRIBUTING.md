# Contributing to openagentix.si

Thanks for helping! This repository holds the openagentix website and documentation. The project-wide
rules are summarised in the docs under
[Project → Contributing](https://openagentix.si/docs/project/contributing/); this file covers what is
specific to this repository.

## Ground rules

- **Small, reviewable changes.** One concern per commit and per pull request.
- **Tests come with the code** in the same commit. Coverage of `src/i18n`, `src/lib` and
  `src/scripts` must stay at or above **80 %** (lines, branches, functions, statements).
- **No third-party requests.** Never add CDN links, remote fonts, analytics, embeds or anything else
  that makes a visitor's browser contact another host. `pnpm test:dist` fails if you do.
- **No hard-coded copy.** User-facing text lives in `src/i18n/ui/<locale>/` (UI) or in
  `src/content/` (docs). English is the source; German must cover every key.
- **English** for code, comments, commit messages and pull requests.
- **Accessibility and speed are features.** Keep contrast, focus states, keyboard access and
  `prefers-reduced-motion` working, animate only `transform` and `opacity`, and stay within the
  budgets in `src/lib/budget.ts` and `lighthouserc.json`.

## Developer Certificate of Origin (DCO)

Every commit must be signed off, certifying the [Developer Certificate of Origin](https://developercertificate.org/):

```sh
git commit -s -m "docs(events): explain webhook secret rotation"
```

This adds `Signed-off-by: Your Name <you@example.com>`. Pull requests with unsigned commits cannot
be merged.

## Conventional Commits 1.0.0

Format: `<type>(<scope>)<!>: <description>`, imperative, English, at most 100 characters.

| Type | Use for | Release |
| --- | --- | --- |
| `feat` | new pages, sections, features | minor |
| `fix` | bugs, wrong copy, broken links | patch |
| `docs` | documentation content | none |
| `perf`, `refactor`, `style`, `test`, `build`, `ci`, `chore` | as named | none |

Breaking changes (for example removed URLs) use `!` or a `BREAKING CHANGE:` footer.

## Semantic Versioning 2.0.0

The website is versioned with [SemVer](https://semver.org) in `package.json`; the version is shown
in the footer. Releases update `CHANGELOG.md` ([Keep a Changelog](https://keepachangelog.com/)) and
are tagged `vX.Y.Z`.

## Local setup

Requirements: Node.js 22.12+ (22 and 24 LTS), pnpm (version pinned in `package.json`).

```sh
pnpm install --frozen-lockfile
pnpm dev                 # http://localhost:4321
pnpm check               # astro check (types, content)
pnpm test:coverage       # unit tests with coverage gate
pnpm build               # static site in dist/
pnpm test:dist           # third-party request scan, links, budget, hreflang on dist/
pnpm lhci                # Lighthouse CI against dist/ (needs a local Chrome or Chromium; set CHROME_PATH)
```

## Translations

- UI copy: `src/i18n/ui/en/*.ts` is the source; `de` must provide every key (a test checks this).
- Slovenian (`sl`) is prepared but not published; missing keys fall back to English.
- Docs are English first; translated pages go to `src/content/docs/<locale>/docs/`.

## Adding dependencies

Avoid them where you can. If you must: exact version, a reason in the pull request, nothing that
downloads code, browsers or instructions at install or run time. Install scripts are disabled by
default (`allowBuilds` in `pnpm-workspace.yaml`).
