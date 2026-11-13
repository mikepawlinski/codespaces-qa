import { expect, type APIRequestContext } from '@playwright/test';

type Question = {
  id: string;
  options: { id: string; label: string }[];
  correctOptionId: string;
};

type Assessment = { id: string };

type AttemptResult = {
  score: number;
  passed: boolean;
  answers: Record<string, { optionId: string; savedAt: string }>;
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
  expect((await api.post(`/api/attempts/${token}/start`)).ok()).toBeTruthy();

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
