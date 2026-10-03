# Security Policy

## Reporting a vulnerability

Please report vulnerabilities privately through
[GitHub security advisories](https://github.com/ozgurulukir/gantt-elastic-personal/security/advisories/new)
rather than opening a public issue.

## Scope

Gantt-elastic is a client-side charting library:

- **In scope** — anything that ships to the consumer: `src/` components, the
  compiled artifacts in `dist/`, the bundled standalone build, and the
  `examples/` pages (e.g. XSS via `html: true` task/user/column values being
  rendered with `v-html`, prototype pollution through the deep-merge helpers).
- **Out of scope** — the development toolchain (webpack config, cypress
  harness), the upstream `neuronetio/gantt-elastic` repository, and demo
  dependencies loaded from CDNs in the example pages.

Task fields render as plain text by default; opt-in HTML (`html: true` columns,
`options.title.html`) is sanitized through DOMPurify (`src/html.js`) before
injection. Sanitizer bypasses fall under this policy — please report them.

## Supported versions

Only the latest commit on `master` is supported. This is a personal fork of an
archived project — if you need guaranteed maintenance, pin a commit SHA.
