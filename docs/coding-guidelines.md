# Coding Guidelines

This document captures the coding style and quality principles for the TODO app. The goal is a codebase that is consistent, readable, and easy to change. New code — whether in the backend, frontend, or test suites — should follow the conventions described here.

## Style and formatting

We rely on automated tooling to keep formatting uniform so that human review can focus on substance rather than whitespace. **Prettier** is the source of truth for formatting across JavaScript, TypeScript, JSON, and Markdown. Configuration lives at the repo root and must not be overridden per-package without a strong reason. Run `npx prettier --write .` (or your editor's format-on-save) before committing. Do not hand-format code in ways that fight the formatter.

The baseline conventions Prettier enforces, and that we expect in all source files, are:

- 2-space indentation; no tabs.
- Single quotes for JavaScript/TypeScript strings, double quotes only inside JSX attributes.
- Semicolons at the end of statements.
- Trailing commas in multi-line arrays, objects, and function parameter lists.
- A maximum line width of 100 characters; break long expressions across lines for readability.
- One statement per line; avoid clever one-liners that hide intent.

Names should communicate intent. Use `camelCase` for variables and functions, `PascalCase` for React components and classes, `UPPER_SNAKE_CASE` for true constants, and `kebab-case` for filenames except React component files (which match the component name, e.g., `TaskList.tsx`). Prefer descriptive names over short ones — `dueDate` beats `dd`, `markTaskComplete` beats `mtc`.

## Import organization

Imports sit at the top of every file and are grouped in the following order, with a blank line between groups:

1. **External / third-party packages** (e.g., `react`, `@mui/material`, `express`).
2. **Internal absolute or aliased modules** (e.g., shared utilities, types, or services from elsewhere in the package).
3. **Relative imports** from the same package, ordered from most distant (`../../`) to nearest (`./`).
4. **Side-effect imports** (e.g., `import './styles.css'`) and **type-only imports** at the bottom of their group.

Within each group, sort imports alphabetically by module path. Prefer named imports over default imports when both are available, and avoid wildcard (`import * as X`) imports unless the module genuinely requires them. Do not leave unused imports in committed code — the linter will flag them.

## Linting and static analysis

**ESLint** is required and runs in CI. The shared configuration extends the recommended rule sets for our stack (`eslint:recommended`, `@typescript-eslint/recommended` where TypeScript is used, `plugin:react/recommended`, and `plugin:react-hooks/recommended`). Run `npm run lint` locally before pushing; warnings should be treated as errors and either fixed or, in rare cases, suppressed inline with a short comment explaining why.

Do not disable rules globally to silence noise from a single file. If a rule is genuinely wrong for the project, propose a config change rather than scattering `eslint-disable` comments. Type errors from TypeScript (where applicable) must also be resolved before merge — `// @ts-ignore` is reserved for true third-party gaps and must include a justification.

## Code quality principles

**Keep it DRY.** Repetition is a smell. When the same logic appears in two or three places, extract it into a function, hook, or module. Constants used in more than one file belong in a shared location. That said, do not abstract prematurely — wait until the duplication is real and the right shape of the abstraction is clear. A bad abstraction is more expensive than a little duplication.

**Favor small, single-purpose units.** Functions and components should do one thing and do it well. If a function needs a paragraph to explain, it probably needs to be split. React components should have a clear responsibility (presentation, state, data fetching) rather than mixing concerns; lift shared state into hooks or context only when it is genuinely shared.

**Write code for the next reader.** Choose clarity over cleverness. Prefer explicit early returns over nested conditionals. Use guard clauses to handle edge cases up front so the happy path stays unindented. Comments should explain _why_, not _what_ — if a comment is describing what the code does, the code itself should usually be rewritten to be self-explanatory.

**Handle errors at boundaries.** Validate input at the edges of the system (API handlers, form submissions, external service calls). Internal functions should be able to trust their inputs. Do not catch exceptions just to rethrow them or to log and swallow — let them propagate to a place that can do something meaningful.

**Avoid magic values.** Numbers and strings with meaning should be named constants. URLs, port numbers, and configuration values should come from environment variables with sensible defaults (see [testing-guidelines.md](./testing-guidelines.md) for the project's port conventions).

**Keep dependencies lean.** Before adding a new package, check whether the standard library or an existing dependency already solves the problem. Every new dependency is a long-term maintenance commitment.

## Pull requests and reviews

Each pull request should be focused — one logical change per PR. Mixing unrelated refactors with feature work makes review harder and history less useful. Update or add tests alongside the code (see [testing-guidelines.md](./testing-guidelines.md)), and make sure linting, type checks, and tests all pass locally before requesting review. Reviewers should look for clarity, correctness, and adherence to these guidelines; authors should welcome feedback and prefer small follow-up commits over large rewrites during review.
