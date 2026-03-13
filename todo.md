# BANTER — MVP Ultimate TODO List

This document defines the **complete step‑by‑step build order** for the Banter MVP.

It is intended to be followed by **GitHub Copilot or AI coding agents** so development proceeds in a clean, predictable order.

Each step must be completed and verified before moving to the next.

---

# Phase 1 — Project Setup

1. Initialize Next.js project
2. Enable TypeScript
3. Enable TailwindCSS
4. Configure ESLint
5. Install core dependencies

Dependencies:

* prisma
* @prisma/client
* zod
* next-auth
* lucide-react
* pino
* posthog-js

6. Initialize Prisma
7. Configure environment variables

.env must include:

DATABASE_URL
NEXTAUTH_SECRET
NEXTAUTH_URL

---

# Phase 2 — Database Foundation

1. Implement Prisma schema

Tables:

User
Poll
Vote
Report

2. Add required indexes

3. Add vote constraints

4. Run Prisma migration

5. Generate Prisma client

6. Verify database connection

---

# Phase 3 — Core Library Layer

Create core library utilities.

Files:

/lib/prisma.ts
/lib/pollLogic.ts
/lib/reputation.ts

Tasks:

1. Prisma client singleton
2. Poll winner calculation
3. Exposure calculation
4. Reputation change calculation

Verify with simple tests.

---

# Phase 4 — Service Layer

Create services responsible for business logic.

Services:

/services/pollService.ts
/services/voteService.ts
/services/userService.ts
/services/reportService.ts

Tasks:

pollService

* createPoll
* getPoll
* listActivePolls
* listRecentPolls
* resolvePoll

voteService

* validateVote
* submitVote
* updatePollTotals

userService

* getUser
* updateReputation

reportService

* createReport
* listReports

Verify services compile and run.

---

# Phase 5 — API Layer

Create API routes using Next.js server routes.

Endpoints:

POST /api/polls/create
POST /api/polls/vote
GET /api/feed
GET /api/poll/[id]
POST /api/report

Tasks:

1. Validate input with Zod
2. Call service layer
3. Return typed responses

Verify each endpoint with test requests.

---

# Phase 6 — Poll Resolution Worker

Create poll resolution script.

/scripts/resolvePolls.ts

Tasks:

1. Query expired polls
2. Determine winner
3. Update poll status
4. Update user reputations
5. Mark poll closed

Run worker manually and verify.

Later connect worker to cron.

---

# Phase 7 — UI Component Layer

Create reusable components.

Components:

PollCard
VoteSlider
VoteBar
ResultCard
CountdownTimer

Tasks:

1. Follow design system
2. Ensure responsive layout
3. Enforce voting constraints in VoteSlider

Verify components render correctly.

---

# Phase 8 — Page Implementation

Create core pages.

Pages:

/app/page.tsx
/app/create/page.tsx
/app/poll/[id]/page.tsx
/app/result/[id]/page.tsx
/app/profile/[id]/page.tsx

Tasks:

Feed page

* fetch active polls
* render PollCard

Create poll page

* form submission

Poll page

* display poll
* integrate VoteSlider

Result page

* display final verdict

Profile page

* show reputation

Verify routing works.

---

# Phase 9 — Moderation System

Tasks:

1. Add Report button to poll page
2. Create report submission modal
3. Implement /api/report endpoint

Create moderation dashboard:

/admin/moderation

Display:

* reported polls
* report counts

Allow actions:

* ignore report
* mark poll removed

---

# Phase 10 — Authentication

Implement NextAuth.

Tasks:

1. Email signup
2. Login
3. Session management
4. Protect poll creation
5. Protect voting endpoint

Verify user sessions work.

---

# Phase 11 — Basic Security

Tasks:

1. Server‑side validation
2. Prevent duplicate voting
3. Add API rate limits
4. Validate poll input

---

# Phase 12 — Logging & Monitoring

Tasks:

1. Add structured logging (Pino)
2. Integrate Sentry
3. Log critical actions

Log events:

poll creation
vote submission
poll resolution
report submission

---

# Phase 13 — Testing

Manual tests:

1. Create poll
2. Multiple users vote
3. Poll resolves
4. Reputation updates
5. Report poll

Verify:

* no crashes
* correct winner
* reputation updates correctly

---

# Phase 14 — Deployment

Tasks:

1. Push repository to GitHub
2. Deploy frontend to Vercel
3. Connect Neon Postgres
4. Configure environment variables
5. Run migrations in production

Verify deployed system.

---

# Phase 15 — Launch Preparation

Tasks:

1. Seed first polls
2. Verify moderation dashboard
3. Test report workflow
4. Verify poll resolution worker

---

# Final Completion Criteria

The MVP is considered complete when:

Users can:

* create polls
* vote with Banter Points
* see poll results
* gain or lose reputation
* report abusive polls

Admins can:

* review reported polls
* moderate content

The system must run reliably without data loss.

This completes the Banter MVP.
