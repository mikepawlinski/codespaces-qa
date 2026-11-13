import { expect, type APIRequestContext } from '@playwright/test';

// The token returned by invite() identifies the attempt everywhere: the candidate
// page is /take/<token> and the attempt endpoints are /api/attempts/<token>.
// Timestamps are ISO 8601 strings. Recruiter calls need the key, which the
// Playwright config sends on every request; attempt calls do not check it.

type Question = {
  id: string;
  options: { id: string; label: string }[];
  correctOptionId: string;
};

type Assessment = { id: string };

type SavedAnswer = { optionId: string; savedAt: string };

// GET /api/attempts/:token. startedAt and deadline are absent until the attempt
// is started, and questions is empty until then. Questions have no correctOptionId.
export type AttemptState = {
  token: string;
  title: string;
  status: 'invited' | 'in_progress' | 'submitted';
  timeLimitSeconds: number;
  questionCount: number;
  serverTime: string;
  startedAt?: string;
  deadline?: string;
  questions: { id: string; text: string; options: { id: string; label: string }[] }[];
  answers: Record<string, SavedAnswer>;
};

// GET /api/attempts/:token/result (recruiter)
type AttemptResult = {
  score: number;
  passed: boolean;
  endedBy: 'candidate' | 'timeout';
  startedAt: string;
  deadline: string;
  submittedAt: string;
  answers: Record<string, SavedAnswer>;
};

type AssessmentSettings = {
  questionCount: number;
  timeLimitSeconds: number;
  passingScore: number;
};

const getQuestionBank = async (api: APIRequestContext): Promise<Question[]> => {
  const response = await api.get('/api/questions');
  expect(response.ok()).toBeTruthy();
  const body = await response.json();
  return Array.isArray(body) ? body : body.questions;
};

export const createAssessment = async (
  api: APIRequestContext,
  { questionCount, timeLimitSeconds, passingScore }: AssessmentSettings,
): Promise<Assessment & { questions: Question[] }> => {
  const questions = (await getQuestionBank(api)).slice(0, questionCount);
  const response = await api.post('/api/assessments', {
    data: {
      title: `Store Ops Basics ${crypto.randomUUID()}`,
      questionIds: questions.map((question) => question.id),
      timeLimitSeconds,
      passingScore,
    },
  });
  expect(response.ok()).toBeTruthy();
  const assessment: Assessment = await response.json();
  return { ...assessment, questions };
};

export const invite = async (
  api: APIRequestContext,
  assessmentId: string,
): Promise<{ token: string; url: string }> => {
  const response = await api.post(`/api/assessments/${assessmentId}/invitations`, {
    data: { email: `candidate-${crypto.randomUUID()}@example.com` },
  });
  expect(response.ok()).toBeTruthy();
  return response.json();
};

export const submitAnswersViaApi = async (
  api: APIRequestContext,
  { correct, total }: { correct: number; total: number },
): Promise<AttemptResult> => {
  const assessment = await createAssessment(api, {
    questionCount: total,
    timeLimitSeconds: 300,
    passingScore: 67,
  });
  const { token } = await invite(api, assessment.id);
  await startAttempt(api, token);

  for (const [index, question] of assessment.questions.entries()) {
    const optionId =
      index < correct
        ? question.correctOptionId
        : question.options.find((option) => option.id !== question.correctOptionId)!.id;
    const saved = await api.put(`/api/attempts/${token}/answers`, {
      data: { questionId: question.id, optionId },
    });
    expect(saved.ok()).toBeTruthy();
  }

  const submitted = await api.post(`/api/attempts/${token}/submit`, { data: { endedBy: 'candidate' } });
  expect(submitted.ok()).toBeTruthy();
  const result = await api.get(`/api/attempts/${token}/result`);
  expect(result.ok()).toBeTruthy();
  return result.json();
};

export const startAttempt = async (
  api: APIRequestContext,
  token: string,
): Promise<{ startedAt: string; deadline: string; serverTime: string }> => {
  const response = await api.post(`/api/attempts/${token}/start`);
  expect(response.ok()).toBeTruthy();
  return response.json();
};

export const getAttemptState = async (api: APIRequestContext, token: string): Promise<AttemptState> => {
  const response = await api.get(`/api/attempts/${token}`);
  expect(response.ok()).toBeTruthy();
  return response.json();
};
