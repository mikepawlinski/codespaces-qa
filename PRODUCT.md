# Skills Assessment

TL;DR: Recruiters create short, timed skills tests and send candidates a link. Candidates take
the test in the browser and see their score and whether they passed. A wrong result can cost a
real person a job, so timing, saving answers and scoring have to be right.

## Who uses it
- Recruiter: creates an assessment (questions, time limit, passing score) and invites candidates
  by email. In this exercise the recruiter has no UI; use the API (see API.md).
- Candidate: opens the invite link. No login.

## Candidate flow
1. /take/<token>         intro: title, number of questions, time limit. Start begins the timer.
2. /take/<token>/q/<n>   one single-choice question per page, Previous/Next, timer, Submit.
3. /take/<token>/done    "Thank you" or "Time's up", score and Pass/Fail.

## Good to know
- The server owns the deadline; the browser shows a countdown.
- Answers save automatically; there is no Save button.
