# Testing Guidelines

This document defines the testing principles for the TODO app. All new features must include appropriate tests at the relevant layers.

## Test layers

### Unit tests

- Use **Jest** to test individual functions and React components in isolation.
- Naming convention: `*.test.js` or `*.test.ts`.
- Location:
  - Backend unit tests: `packages/backend/__tests__/`
  - Frontend unit tests: `packages/frontend/src/__tests__/`
- Name files to match the unit under test (e.g., `app.test.js` tests `app.js`, `TaskList.test.tsx` tests `TaskList.tsx`).
- Mock external dependencies (network, timers, modules) so each test exercises only the unit in question.

### Integration tests

- Use **Jest + Supertest** to test backend API endpoints with real HTTP requests against the Express app.
- Naming convention: `*.test.js` or `*.test.ts`.
- Location: `packages/backend/__tests__/integration/`
- Name files intelligently based on the API surface they cover (e.g., `todos-api.test.js` for the TODO API endpoints, `auth-api.test.js` for auth endpoints).
- Use a real (in-memory or test-scoped) database/store and reset it between tests.

### End-to-end (E2E) tests

- Use **Playwright** (required framework) to test complete UI workflows through browser automation.
- Naming convention: `*.spec.js` or `*.spec.ts`.
- Location: `tests/e2e/`
- Name files based on the user journey under test (e.g., `todo-workflow.spec.js`, `task-editing.spec.js`).
- **Use one browser only** (e.g., Chromium) — do not run the suite across multiple browser projects.
- **Use the Page Object Model (POM) pattern**. Page objects live in `tests/e2e/pages/` and encapsulate selectors and interactions; specs only call page object methods.
- **Limit E2E to 5–8 critical user journeys**. Cover happy paths and key edge cases — do not attempt exhaustive coverage at this layer.

## Port configuration

Always use environment variables with sensible defaults so CI/CD workflows can dynamically detect ports.

- Backend:
  ```js
  const PORT = process.env.PORT || 3030;
  ```
- Frontend: React defaults to port `3000`; this can be overridden with the `PORT` environment variable.
- Test code must read these from the environment rather than hardcoding ports.

## Test quality requirements

- **Isolation and independence**: each test sets up its own data and does not rely on state left by other tests. Tests must be runnable in any order.
- **Setup and teardown hooks are required**: use `beforeEach`/`afterEach` (or `beforeAll`/`afterAll` where appropriate) to set up and clean up state. Tests must succeed on multiple consecutive runs.
- **Deterministic**: no reliance on real time, real network, or random data without a seed. Use fakes/mocks for time and external services.
- **Readable**: follow Arrange–Act–Assert. Test names describe the behavior under test (e.g., `it('marks a task complete when the checkbox is clicked')`).
- **Maintainable**: avoid duplication via shared fixtures and helpers. Keep selectors out of E2E specs (use POM).
- **Fast**: prefer unit > integration > E2E. Push logic down to the lowest layer it can be tested at.

## Coverage expectations

- All new features must include appropriate tests:
  - New pure functions and components → unit tests.
  - New or changed API endpoints → integration tests.
  - New critical user journeys → an E2E test (only if it qualifies as one of the 5–8 critical journeys).
- Bug fixes must include a regression test that fails before the fix and passes after.

## Running tests

- Backend unit + integration: `npm test` from `packages/backend/`.
- Frontend unit: `npm test` from `packages/frontend/`.
- E2E: `npx playwright test` from the repo root.
