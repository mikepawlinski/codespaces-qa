# Test conventions

- Locators: getByRole / getByLabel first. No CSS or XPath chains.
- Assertions: web-first expect only. No waitForTimeout.
- Each test creates its own data through tests/support/api.ts. Never rely on another test.
- Start test titles with the requirement ID: test('R5 rounds 2 of 3 correct to 67%', ...).
- A test that shows a known app bug is marked test.fail() with a one-line note.
