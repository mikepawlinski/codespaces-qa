import { test as base, expect, type APIRequestContext } from '@playwright/test';

type Fixtures = { api: APIRequestContext };

export const test = base.extend<Fixtures>({
  api: async ({ request }, use) => {
    await use(request);
  },
});

export { expect };
