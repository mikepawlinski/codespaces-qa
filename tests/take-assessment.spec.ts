import { test, expect } from './fixtures';
import { createAssessment, invite, submitAnswersViaApi } from './support/api';

test.beforeEach(async ({ api }) => {
  await api.post('/api/test/reset');
});

test('candidate completes assessment and sees result', async ({ page, api }) => {
  const assessment = await createAssessment(api, { questionCount: 3, timeLimitSeconds: 60, passingScore: 67 });
  const { token } = await invite(api, assessment.id);
  await page.goto(`/take/${token}`);
  await page.getByRole('button', { name: 'Start' }).click();
  for (let i = 0; i < 3; i++) {
    await page.locator('.option').first().click();
    await page.waitForTimeout(2000); // wait for autosave
    if (i < 2) await page.getByRole('button', { name: 'Next' }).click();
  }
  await page.getByRole('button', { name: 'Submit' }).click();
  await expect(page.locator('.score')).toContainText('%');
});

test('score for 2 of 3 correct', async ({ api }) => {
  const result = await submitAnswersViaApi(api, { correct: 2, total: 3 });
  expect(result.score).toBe(67);
});
