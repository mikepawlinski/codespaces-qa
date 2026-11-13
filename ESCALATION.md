# Escalation: candidate failed an assessment they say they passed

Customer: a retail chain using our assessments for store manager hiring.

A candidate took the 3-question "Store Ops Basics" assessment (time limit 5 minutes,
passing score 67%). They say they answered the first question, then refreshed the page
because it looked stuck. The timer showed 5:00 again, so they took their time with the
other two. They saw "Time's up", a score of 33% and Fail. The recruiter wants to know
if the result is right.

Our existing test for this flow (tests/take-assessment.spec.ts) is green.

Your task (45 minutes, use your AI agent however you like):
1. Tell us why the existing test did not catch this.
2. Reproduce what the candidate saw and show where it breaks, with tests based on REQUIREMENTS.md.
3. Leave the suite stable enough to run in CI with 4 workers.
4. Finish with a short bug report for the developers.

You don't have the app's code: test it at BASE_URL. The interviewer is your product owner:
ask them anything.
