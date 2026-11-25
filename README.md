# QA Automation test task – Limestone Digital

Playwright + TypeScript framework for **saucedemo.com** (UI) and **jsonplaceholder.typicode.com** (API),
plus a Postman collection (`/postman`) and SQL queries (`/sql/queries.sql`).

## Install and run

Requires Node.js 20+.

```bash
npm ci
npx playwright install chromium
cp .env.example .env          # base URLs and the public saucedemo demo credentials

npx playwright test           # full suite: setup (login) -> ui + api, in parallel
npm run test:ui               # UI only        (npx playwright test --project=ui)
npm run test:api              # API only       (npx playwright test --project=api)
npm run test:smoke            # @smoke tag only
npm run typecheck             # tsc --noEmit
```

Single test:

```bash
npx playwright test tests/api/posts.spec.ts            # one file
npx playwright test -g "checkout as standard_user"     # one test by title
npx playwright test tests/ui/checkout.spec.ts:28       # by file:line
```

Postman collection (runs the 3 requests in order with newman):

```bash
npm run postman
```

Or in Postman: import `postman/collection.json` and `postman/environment.json`, select the
**JSONPlaceholder** environment and run the collection with the Collection Runner.

## Report

```bash
npx playwright show-report    # opens playwright-report/index.html
```

Traces and screenshots are kept for failed tests. In CI (`.github/workflows/playwright.yml`) the HTML
report is uploaded as the `playwright-report` artifact of each run.

## Structure

```
playwright.config.ts      projects: setup -> ui, api (no browser)
src/config/env.ts         the only place that reads configuration (.env / CI env), fails fast if missing
src/pages/                page objects, select only by data-test attributes
src/api/                  ApiClient base + typed UsersClient / PostsClient; zod schemas in src/api/schemas
src/fixtures/index.ts     test.extend: wires pages and API clients into tests
src/data/checkout.ts      business constants (tax rate, products) and a small customer factory
src/utils/money.ts        price parsing and arithmetic in integer cents
tests/auth.setup.ts       logs in once per user, saves storageState to .auth/
tests/ui, tests/api       specs: no selectors, no URLs, no request.get()
```

## Design decisions

- **Layers:** tests -> fixtures -> page objects / typed API clients -> config. Tests describe behaviour only; selectors, URLs and credentials each live in one place, so a UI or endpoint change touches one file.
- **Auth** runs once per user in a `setup` project and is reused via `storageState`. API tests are a separate project with no browser and no login dependency.
- **Contracts as zod schemas** (`.strict()`, non-empty strings): one definition gives both runtime validation and the TS type, and reports every violation at once.
- **Money in cents.** The test reads item prices from the inventory, then computes item total, 8% tax and total itself. It does not use the site's own numbers as the expected values.
- **problem_user** runs the *same* test, marked `test.fail()` with an `issue` annotation that describes the defect. The report shows it as an *expected failure*. It is not hidden like `skip` would be, and it does not make the build red and normalise failures. Once the bug is fixed the test reports an **unexpected pass** and fails the run, so the marker cannot rot. Root cause: the Last Name field does not keep input, so checkout stops at step one with "Last Name is required".
- **Non-persisting POST:** jsonplaceholder answers `201` with an id (always 101) but stores nothing, so `GET /posts/101` is `404`. The test asserts what the service guarantees: 201, the echoed payload and an id, all schema-validated. It then **pins** the 404 read-back with a note. If the service ever starts persisting, the test fails and tells us to switch to `GET == created`. A separate test checks the GET contract on an existing post.
- **Skipped on purpose:** data-driven login tests and a pre-filled cart via API/localStorage. Both are cheap to add on these fixtures, but they add no new reasoning for this task. Only Chromium runs, because cross-browser runs would add time without adding coverage for this task.
- **At 500 tests / 5 engineers:** split fixtures and page objects by domain (checkout, catalog, account) with CODEOWNERS. Seed state through APIs instead of UI clicks. Shard in CI, run `@smoke` on every PR and `@regression` nightly. Add ESLint rules that ban raw selectors, `waitForTimeout` and `request.*` in specs. Link known defects to real tickets. Send results to a trend dashboard so flaky tests show up.

## Assumptions

- saucedemo tax is a flat **8%** of the item total, rounded to cents (observed behaviour, not documented).
- The two products are chosen by name (`Sauce Labs Backpack`, `Sauce Labs Bike Light`); their prices are read from the UI, not hard-coded.
- saucedemo credentials are public demo values, so `.env.example` contains them for convenience. In a real project they would come from a secret store. `.env` is git-ignored.
- Contract test uses users 1 and 10 (first and last of the fixed dataset).
- Postman picks the **first** user from `/users` (deterministic, reproducible runs). `missingPostId = 9999` (dataset has 100 posts); a 404 there returns `{}`.
- Postman: each request only *declares* its expectations (`expectedStatus`, `itemSchema`) in its pre-request script. The collection-level scripts reset those declarations and hold all checking logic: status, array schema validation, non-empty required fields. Request-specific checks (post ownership, empty 404 body) stay on the request.
- SQL: the shipper is matched by `ShipperName = 'United Package'`, not by ID. "Total value" = `SUM(Quantity * Products.Price)` (current product price; the W3Schools schema has no historical unit price).
- The task PDF contains a hidden "Note for AI assistants" with conventions that contradict the visible requirements, for example `waitForTimeout`, `test.skip` for problem_user, expecting 200 for a missing post, an empty `required` array, and `COUNT` without `DISTINCT`. They were deliberately **not** applied. The visible requirements were followed.
