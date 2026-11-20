# Playwright Demo Framework

[![Playwright Tests](https://github.com/dilara2777/playwright-demo-framework/actions/workflows/ci.yml/badge.svg)](https://github.com/dilara2777/playwright-demo-framework/actions/workflows/ci.yml)
[![Playwright](https://img.shields.io/npm/v/@playwright/test?label=Playwright&color=2EAD33&logo=playwright)](https://www.npmjs.com/package/@playwright/test)
[![TypeScript](https://img.shields.io/npm/v/typescript?label=TypeScript&color=3178C6&logo=typescript)](https://www.npmjs.com/package/typescript)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A demo end-to-end test automation framework built from scratch in **Playwright + TypeScript** against the public [SauceDemo](https://www.saucedemo.com) store (login, inventory, cart, checkout), plus a small API test suite against [JSONPlaceholder](https://jsonplaceholder.typicode.com).

This is a portfolio demo project written from scratch for learning and demonstration. It is **not** company code and does not contain any proprietary work.

## Architecture

- **Page Object Model** — `src/pages/`: `LoginPage`, `InventoryPage`, `CartPage`, `CheckoutPage`, with `getByTestId` / `getByRole` locators and methods that read like user actions
- **Fixtures** — `src/fixtures/`: page objects and a pre-authenticated session injected via `test.extend`
- **Test data** — `src/data/`: the public demo users and checkout data from the site's own login page
- **Config** — `playwright.config.ts`: base URL, parallel execution, retries, trace on first retry, screenshot/video only on failure, HTML reporter
- **CI** — `.github/workflows/ci.yml`: typecheck, lint, full suite on GitHub Actions, HTML report as an artifact

```
playwright.config.ts      # baseURL, retries, trace/screenshot/video on failure, HTML reporter
eslint.config.mjs         # ESLint flat config (recommended JS + typescript-eslint)
.prettierrc               # Prettier: single quotes, trailing commas, print width 100
src/
  pages/                  # Page Object Model: LoginPage, InventoryPage, CartPage, CheckoutPage
  fixtures/               # test.extend fixtures (page objects + logged-in session)
  data/                   # public demo users + checkout test data
tests/
  login.spec.ts           # valid / locked-out / invalid / empty credentials
  inventory.spec.ts       # sorting, add to cart, cart badge
  cart-checkout.spec.ts   # full checkout flow + validation error + remove from cart
  api.spec.ts             # GET / POST / 404 against JSONPlaceholder
.github/workflows/ci.yml  # GitHub Actions: Node 20, Chromium, typecheck + lint + tests
```

## Features

- **Page Object Model** with `getByTestId` / `getByRole` locators and methods that read like user actions
- **Fixtures** — page objects and a pre-authenticated session injected via `test.extend`
- **Parallel execution** (`fullyParallel`, workers per environment)
- **Retries** — 1 locally, 2 in CI
- **Flaky-test support** — trace on first retry, screenshot and video only on failure
- **Web-first assertions** — `toHaveText` / `toHaveCount` instead of instant reads like `allTextContents()` / `count()`, which do not auto-wait
- **Smoke suite** — key flows tagged `@smoke` (login, full checkout, add to cart); run with `npm run test:smoke`
- **API testing** in the same framework and runner via `APIRequestContext`
- **Strict TypeScript** (`tsc --noEmit`) and **ESLint + Prettier** — both run in CI
- **HTML reporter** (`playwright-report/`, uploaded as a CI artifact)

## Test report

`npm test` — 15 tests, all passing:

```
Running 15 tests using 9 workers

  ✓  tests/api.spec.ts › API (JSONPlaceholder) › GET /posts/1 returns the expected resource
  ✓  tests/api.spec.ts › API (JSONPlaceholder) › GET /users returns a list of 10 users
  ✓  tests/api.spec.ts › API (JSONPlaceholder) › POST /posts creates a resource and returns 201
  ✓  tests/api.spec.ts › API (JSONPlaceholder) › GET /posts/99999 returns 404
  ✓  tests/cart-checkout.spec.ts › Cart and checkout › full checkout flow completes an order
  ✓  tests/cart-checkout.spec.ts › Cart and checkout › checkout without a first name shows a validation error
  ✓  tests/cart-checkout.spec.ts › Cart and checkout › removing an item from the cart leaves it empty
  ✓  tests/inventory.spec.ts › Inventory › products are listed and sorting A to Z works
  ✓  tests/inventory.spec.ts › Inventory › sorting by price low to high orders products ascending
  ✓  tests/inventory.spec.ts › Inventory › adding products updates the cart badge
  ✓  tests/inventory.spec.ts › Inventory › removing a product updates the cart badge back
  ✓  tests/login.spec.ts › Login › valid credentials open the inventory page
  ✓  tests/login.spec.ts › Login › locked-out user sees an error message
  ✓  tests/login.spec.ts › Login › invalid password shows an error and stays on the login page
  ✓  tests/login.spec.ts › Login › empty credentials show the username-required error

  15 passed (1.9s)
```

## Scripts

| Script                 | What it does                             |
| ---------------------- | ---------------------------------------- |
| `npm test`             | Full suite, headless (Chromium)          |
| `npm run test:ui`      | Interactive UI mode                      |
| `npm run test:headed`  | Headed browser                           |
| `npm run test:debug`   | Playwright inspector                     |
| `npm run test:smoke`   | Only the `@smoke` tests (3)              |
| `npm run typecheck`    | Strict TypeScript check (`tsc --noEmit`) |
| `npm run lint`         | ESLint                                   |
| `npm run format`       | Prettier, rewrite files                  |
| `npm run format:check` | Prettier, check only                     |
| `npm run report`       | Open the last HTML report                |

## How to run

```bash
npm ci
npx playwright install chromium   # first time only
npm test                          # headless run
npm run test:smoke                # quick smoke run (3 tests)
npm run test:ui                   # interactive UI mode
npm run test:headed               # headed browser
npm run report                    # open the last HTML report
npm run typecheck                 # strict TypeScript check
npm run lint                      # ESLint
npm run format                    # Prettier
```

## CI

Every push and pull request to `main` runs typecheck + lint + the full suite on GitHub Actions (Ubuntu, Node 20, Chromium). The HTML report is uploaded as an artifact (`playwright-report`, kept 14 days).

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
