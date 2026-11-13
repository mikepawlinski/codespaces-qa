# QA exercise: timed skills assessment

Playwright test repo for a hosted skills-assessment app. Recruiters create timed tests through an API and candidates take them in the browser. You test the app from the outside at `BASE_URL`; its source code is not available.

## Run it

In GitHub Codespaces, dependencies and Chromium install on creation. Set `BASE_URL` and `ADMIN_API_KEY` as Codespaces secrets, or ask the interviewer for the values and put them in `.env`.

Locally:

```sh
pnpm install
pnpm exec playwright install chromium
cp .env.example .env   # fill in BASE_URL and ADMIN_API_KEY
pnpm test
```

Playwright runs Chromium with 4 workers, no retries, and keeps a trace for failed tests.

## Your task

A customer escalation: a candidate says they passed an assessment, but the result shows Fail. The existing test for this flow is green. You have 45 minutes and may use your AI agent however you like. The interviewer plays the product owner, so ask them anything.

1. Explain why the existing test did not catch the problem.
2. Reproduce what the candidate saw and show where it breaks, with tests based on `REQUIREMENTS.md`.
3. Leave the suite stable enough to run in CI with 4 workers.
4. Write a short bug report for the developers.

The full brief is in `ESCALATION.md`.

## Files

| File | Content |
| --- | --- |
| `ESCALATION.md` | the task |
| `PRODUCT.md` | what the app does |
| `REQUIREMENTS.md` | expected behaviour |
| `API.md` | endpoints for test setup |
| `CONVENTIONS.md` | test conventions |
| `tests/` | existing test, `fixtures.ts`, `support/api.ts` |
