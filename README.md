# Playwright Demo Framework

[![Playwright Tests](https://github.com/dilara2777/playwright-demo-framework/actions/workflows/ci.yml/badge.svg)](https://github.com/dilara2777/playwright-demo-framework/actions/workflows/ci.yml)
[![Playwright](https://img.shields.io/npm/v/@playwright/test?label=Playwright&color=2EAD33&logo=playwright)](https://www.npmjs.com/package/@playwright/test)
[![TypeScript](https://img.shields.io/npm/v/typescript?label=TypeScript&color=3178C6&logo=typescript)](https://www.npmjs.com/package/typescript)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A demo end-to-end test automation framework built from scratch in **Playwright + TypeScript** against the public [SauceDemo](https://www.saucedemo.com) store (login, inventory, cart, checkout), plus a small API test suite against [JSONPlaceholder](https://jsonplaceholder.typicode.com).

This is a portfolio demo project written from scratch for learning and demonstration. It is **not** company code and does not contain any proprietary work.

## Architecture

- **Page Object Model** — `src/pages/`: `LoginPage`, `InventoryPage`, `CartPage`, `CheckoutPage`, with `getByTestId` / `getByRole` locators and methods that read like user actions
- **Fixtures** — `src/fixtures/`: page objects and a pre-authenticated session injected via `test.extend`; the signed-in user is selectable per file with `test.use({ currentUser: 'problem' })` (default `standard`)
- **Test data** — `src/data/`: the public demo users and checkout data from the site's own login page
- **Config** — `playwright.config.ts`: base URL, Chromium + Firefox projects, parallel execution, retries, trace on first retry, screenshot/video only on failure, HTML reporter
- **CI** — `.github/workflows/ci.yml`: typecheck, lint, format check, full suite on GitHub Actions, HTML report as an artifact

### Fixture lifecycle

- Every test gets a fresh browser page and fresh page objects; no state is shared between tests.
- `loggedIn` signs in once per test through the UI (no cookies or storage state are reused), so a test never depends on another test's login.
- Test data (`src/data/`) is separate from configuration (`playwright.config.ts`): users and checkout data live in one place and are imported, never hard-coded in tests.
- The signed-in user is an option fixture: override it per file with `test.use({ currentUser: 'problem' })`; the default is `standard`. Only users who can log in work here (not `lockedOut`).

```
playwright.config.ts      # baseURL, retries, trace/screenshot/video on failure, HTML reporter
eslint.config.mjs         # ESLint flat config (recommended JS + typescript-eslint)
.prettierrc.json               # Prettier: single quotes, trailing commas, print width 100
src/
  pages/                  # Page Object Model: LoginPage, InventoryPage, CartPage, CheckoutPage
  fixtures/               # test.extend fixtures (page objects + logged-in session)
  data/                   # public demo users + checkout test data
tests/
  login.spec.ts           # valid / locked-out / invalid / empty credentials
  inventory.spec.ts       # sorting, add to cart, cart badge
  cart-checkout.spec.ts   # full checkout flow + validation error + remove from cart
  api.spec.ts             # GET / POST / 404 + negative cases against JSONPlaceholder
.github/workflows/ci.yml  # GitHub Actions: Node 20, Chromium + Firefox, typecheck + lint + format check + tests
```

## Features

- **Page Object Model** with `getByTestId` / `getByRole` locators and methods that read like user actions
- **Fixtures** — page objects and a pre-authenticated session injected via `test.extend`
- **Parallel execution** (`fullyParallel`, workers per environment)
- **Retries** — 1 locally, 2 in CI
- **Flaky-test support** — trace on first retry, screenshot and video only on failure
- **Web-first assertions** — `toHaveText` / `toHaveCount` instead of instant reads like `allTextContents()` / `count()`, which do not auto-wait
- **Smoke suite** — key flows tagged `@smoke` (login, full checkout, add to cart); run with `npm run test:smoke`
- **Test tagging** — `@smoke` for key flows and `@api` for the API suite (`npx playwright test --grep @api`)
- **API testing** in the same framework and runner via `APIRequestContext`, including negative cases (404 with an empty body, POST to an unknown route)
- **Strict TypeScript** (`tsc --noEmit`), **ESLint** and **Prettier** — all three run in CI before the test suite
- **HTML reporter** (`playwright-report/`, uploaded as a CI artifact)

## Quality Engineering Approach

This framework is built around one idea: a test suite is only useful if engineers trust it. A red build should mean a real product problem, not a flaky test.

- **Reliable execution** — web-first assertions (`toHaveText` / `toHaveCount`) instead of instant reads that race the page; retries (1 locally, 2 in CI) with a trace on the first retry, so a retry is diagnosed, not hidden.
- **Product defects vs test instability** — a failure produces a trace, a screenshot and a video, so the cause can be told apart from a timing flake without re-running blindly.
- **CI quality gates** — typecheck, lint and format check run before the test suite, so style and type errors fail fast and never look like test failures.
- **Maintainability** — Page Objects read like user actions, test data is separate from config, and fixtures keep setup in one place, so adding a test means writing the test, not the plumbing.

## Test report

`npm test` runs 16 tests on Chromium and Firefox (32 executions). Sample run on Firefox, all passing:

```
Running 16 tests using 2 workers

  ✓   1 [firefox] › tests/api.spec.ts:11:3 › API (JSONPlaceholder) › GET /posts/1 returns the expected resource @api (372ms)
  ✓   2 [firefox] › tests/api.spec.ts:24:3 › API (JSONPlaceholder) › GET /users returns a list of 10 users @api (365ms)
  ✓   4 [firefox] › tests/api.spec.ts:49:3 › API (JSONPlaceholder) › GET /posts/99999 returns 404 with an empty body @api (272ms)
  ✓   3 [firefox] › tests/api.spec.ts:38:3 › API (JSONPlaceholder) › POST /posts creates a resource and returns 201 @api (414ms)
  ✓   5 [firefox] › tests/api.spec.ts:56:3 › API (JSONPlaceholder) › POST to an unknown route returns 404 @api (414ms)
  ✓   6 [firefox] › tests/cart-checkout.spec.ts:5:3 › Cart and checkout › full checkout flow completes an order @smoke (8.2s)
  ✓   7 [firefox] › tests/cart-checkout.spec.ts:32:3 › Cart and checkout › checkout without a first name shows a validation error (7.5s)
  ✓   8 [firefox] › tests/cart-checkout.spec.ts:47:3 › Cart and checkout › removing an item from the cart leaves it empty (3.6s)
  ✓   9 [firefox] › tests/inventory.spec.ts:4:3 › Inventory › products are listed and sorting A to Z works (4.2s)
  ✓  10 [firefox] › tests/inventory.spec.ts:12:3 › Inventory › sorting by price low to high orders products ascending (3.6s)
  ✓  11 [firefox] › tests/inventory.spec.ts:20:3 › Inventory › adding products updates the cart badge @smoke (3.1s)
  ✓  13 [firefox] › tests/login.spec.ts:5:3 › Login › valid credentials open the inventory page @smoke (3.3s)
  ✓  12 [firefox] › tests/inventory.spec.ts:29:3 › Inventory › removing a product updates the cart badge back (3.9s)
  ✓  14 [firefox] › tests/login.spec.ts:17:3 › Login › locked-out user sees an error message (2.4s)
  ✓  15 [firefox] › tests/login.spec.ts:25:3 › Login › invalid password shows an error and stays on the login page (2.6s)
  ✓  16 [firefox] › tests/login.spec.ts:39:3 › Login › empty credentials show the username-required error (1.9s)

  16 passed (26.9s)
```

## Scripts

| Script                 | What it does                                          |
| ---------------------- | ----------------------------------------------------- |
| `npm test`             | Full suite, headless (Chromium + Firefox)             |
| `npm run test:ui`      | Interactive UI mode                                   |
| `npm run test:headed`  | Headed browser                                        |
| `npm run test:debug`   | Playwright inspector                                  |
| `npm run test:smoke`   | Only the `@smoke` tests (3 tests, Chromium + Firefox) |
| `npm run typecheck`    | Strict TypeScript check (`tsc --noEmit`)              |
| `npm run lint`         | ESLint                                                |
| `npm run format`       | Prettier, rewrite files                               |
| `npm run format:check` | Prettier, check only                                  |
| `npm run report`       | Open the last HTML report                             |

## How to run

```bash
npm ci
npx playwright install chromium firefox   # first time only
npm test                          # headless run
npm run test:smoke                # quick smoke run (3 tests, Chromium + Firefox)
npm run test:ui                   # interactive UI mode
npm run test:headed               # headed browser
npm run report                    # open the last HTML report
npm run typecheck                 # strict TypeScript check
npm run lint                      # ESLint
npm run format                    # Prettier
```

## CI

Every push and pull request to `main` runs typecheck + lint + format check + the full suite (Chromium and Firefox) on GitHub Actions (Ubuntu, Node 20). The HTML report is uploaded as an artifact (`playwright-report`, kept 14 days).

## Test data

The demo site publishes its own credentials on the login page; they are the only credentials in this repo (no real accounts, no secrets):

| User                      | Password       |
| ------------------------- | -------------- |
| `standard_user`           | `secret_sauce` |
| `locked_out_user`         | `secret_sauce` |
| `problem_user`            | `secret_sauce` |
| `performance_glitch_user` | `secret_sauce` |
| `error_user`              | `secret_sauce` |
| `visual_user`             | `secret_sauce` |
