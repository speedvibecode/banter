# BANTER — MVP Product Requirements Document (PRD)

## Goal

Build a simple MVP of Banter: a platform where users create binary argument polls and the crowd votes using Banter Points to determine a final verdict.

The MVP focuses on validating the core loop:
Create Argument → Users Vote → Poll Resolves → Verdict Shared

Advanced infrastructure (distributed queues, sharding, etc) is NOT required in MVP.

---

# 1. Core MVP Principles

1. Extremely simple architecture
2. Fast poll creation (<10s)
3. Binary arguments only
4. Conviction voting (points allocation)
5. Deterministic poll resolution
6. Basic reputation scoring
7. Shareable result page

---

# 2. MVP Core User Flow

User signs up
↓
User creates poll
↓
Users vote using Banter Points
↓
Poll closes
↓
Winner determined
↓
Reputation updated
↓
Result page generated

---

# 3. MVP Features

## 3.1 Authentication

Simple auth only.

Features:

* Email signup
* Login
* Basic profile

User fields:

* id
* username
* email
* password_hash
* reputation
* polls_participated
* created_at

---

## 3.2 Poll Creation

User can create a poll.

Form fields:

* title
* option_A
* option_B
* duration
* category
* description (optional)

Poll durations for MVP:

* 5 minutes
* 30 minutes
* 2 hours
* 24 hours

Poll object:

id
creator_id
title
option_A
option_B
start_time
end_time
status
category

---

## 3.3 Voting System

Each user has **100 Banter Points per poll**.

User allocates:

A_points
B_points

Constraints:

0 ≤ A ≤ 100
0 ≤ B ≤ 100
A + B ≤ 100

Vote schema:

vote_id
user_id
poll_id
A_points
B_points
timestamp

---

## 3.4 Poll Totals

Each vote updates:

total_A += A_points

total_B += B_points

Poll page displays:

* A percentage
* B percentage
* vote count
* time remaining

---

## 3.5 Poll Resolution

When poll reaches end_time.

Winner logic (MVP):

if total_A > total_B → A wins

if total_B > total_A → B wins

if tie → random choice

Store result:

winner
closed_at

---

## 3.6 Reputation System (MVP Simplified)

Exposure:

exposure = A_points − B_points

Reputation update:

if user voted for winner:

rep += exposure

else:

rep -= exposure

For MVP ignore time decay.

---

## 3.7 Result Page

After poll closes show:

Poll title
Winner
Final percentages
Total votes

Add share button.

---

## 3.8 Feed

Homepage shows:

* Active polls
* Recently closed polls

Sorting:

Newest
Most votes

---

# 4. MVP Screens

1. Landing page
2. Login / signup
3. Poll feed
4. Poll page
5. Create poll page
6. Result page
7. Profile page

---

# 5. Database Tables

Users
Polls
Votes

Optional:
Categories

---

# 6. Suggested Tech Stack

Frontend

* Next.js
* Tailwind

Backend

* Next.js API routes

Database

* Postgres (Supabase or Neon)

Realtime (optional MVP)

* simple polling refresh

Hosting

* Vercel

---

# 7. File Structure

/app

/components
PollCard
VoteSlider
ResultCard

/lib
reputation.ts
pollLogic.ts

/pages
index.tsx
poll/[id].tsx
create.tsx
profile.tsx

/api
createPoll
vote
resolvePoll

---

# 8. Basic API Endpoints

POST /api/createPoll

POST /api/vote

GET /api/poll/:id

GET /api/feed

POST /api/resolvePoll

---

# 9. Poll Resolution Worker (Simple)

Cron job every minute:

Find polls where:

status = ACTIVE
AND end_time < now

Resolve winner.

Update reputation.

Set status CLOSED.

---

# 10. Metrics to Track

* polls created
* votes per poll
* daily users
* share clicks

---

# 11. MVP Non-Goals

Do NOT build yet:

* reputation time decay
* vote block tracking
* websocket infrastructure
* anti bot system
* private groups
* leaderboards
* notifications

These come after MVP validation.

---

# 12. MVP Success Criteria

MVP is successful if:

Users create polls
Users vote repeatedly
Polls get shared

Goal metrics:

> 10 votes per poll average

> users returning daily

---

# 13. Future Expansion

After MVP:

Add:

Realtime updates
Time decay reputation
Leaderboards
Groups
Mobile app
AI argument summaries

---

# End of MVP PRD
