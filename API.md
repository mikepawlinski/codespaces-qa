# API (for test setup)

All paths are relative to BASE_URL. Recruiter endpoints need the header
Authorization: Bearer <ADMIN_API_KEY> (the key is in .env); playwright.config.ts and
tests/support/api.ts handle it.

GET  /api/questions                     recruiter: question bank, including correctOptionId
POST /api/assessments                   recruiter: {title, questionIds, timeLimitSeconds (min 5), passingScore}
POST /api/assessments/:id/invitations   recruiter: {email} -> {token, url}
GET  /api/attempts/:token               attempt state, questions, server time, deadline
POST /api/attempts/:token/start
PUT  /api/attempts/:token/answers       {questionId, optionId}
POST /api/attempts/:token/submit        {endedBy: "candidate" | "timeout"}
GET  /api/attempts/:token/result        recruiter: score, passed, saved answers with savedAt
POST /api/test/reset                    wipes and reseeds all data (test environments only)
