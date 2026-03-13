# BANTER — Technical Architecture & Database Specification (MVP → Scalable)

## Purpose

This document defines the **complete technical foundation** for the Banter platform so that GitHub Copilot / AI coding agents can build the system consistently.

It includes:

• full tech stack
• system architecture
• database schema
• API contracts
• background jobs
• scaling path

The design supports:

1. **Fast MVP development**
2. **Easy scaling later**

The initial build should remain **simple**, but the architecture must not block future expansion.

---

# 1. High-Level Architecture

The MVP architecture follows a **monolithic full‑stack design** using Next.js.

Client (Next.js React)
↓
API Routes
↓
Service Layer
↓
Database (Postgres)

Optional:

Cron Worker → Poll resolution

Later scaling introduces:

Queue
Realtime engine
Event pipeline

---

# 2. Ultimate Tech Stack

## Frontend

Framework:

Next.js 14 (App Router)

Language:

TypeScript

Styling:

TailwindCSS

Icons:

Lucide Icons

State:

React state (MVP)

Future:

Zustand

---

## Backend

Runtime:

Next.js Server Functions

Language:

TypeScript

Validation:

Zod

ORM:

Prisma

---

## Database

Primary DB:

PostgreSQL

Hosting options:

Supabase
Neon
Railway

Recommended MVP:

Neon Postgres

---

## Authentication

Options:

NextAuth
Supabase Auth

Recommended:

NextAuth + Email login

Future:

Phone verification

---

## Hosting

Frontend + API

Vercel

Database

Neon

---

## Observability

Logging

Pino

Error Tracking

Sentry

Analytics

PostHog

---

# 3. Repository Structure

```
/app

/app/feed
/app/poll/[id]
/app/result/[id]
/app/create
/app/profile

/components
PollCard
VoteSlider
ResultCard
VoteBar
CountdownTimer

/lib
prisma.ts
pollLogic.ts
reputation.ts
resolvePolls.ts

/services
pollService.ts
voteService.ts
userService.ts

/api
createPoll
vote
resolvePoll
feed

/prisma
schema.prisma

/docs
PRD
UI
DesignSystem
TechDoc
```

---

# 4. Core Database Schema

## Users Table

```
User

id UUID PK
username TEXT UNIQUE
email TEXT UNIQUE
password_hash TEXT

reputation INT DEFAULT 0

polls_participated INT DEFAULT 0
polls_created INT DEFAULT 0

created_at TIMESTAMP
```

Indexes

email
username

---

## Poll Table

```
Poll

id UUID PK

creator_id UUID FK

category TEXT

title TEXT

description TEXT

option_a TEXT
option_b TEXT

start_time TIMESTAMP
end_time TIMESTAMP

status TEXT

(total voting totals)

total_a INT DEFAULT 0
total_b INT DEFAULT 0

vote_count INT DEFAULT 0

winner TEXT

created_at TIMESTAMP
```

Indexes

status
end_time
creator_id

---

## Vote Table

```
Vote

id UUID PK

user_id UUID FK
poll_id UUID FK

A_points INT
B_points INT

exposure INT

created_at TIMESTAMP
```

Constraints

```
A_points >= 0
B_points >= 0
A_points + B_points <= 100
```

Indexes

poll_id
user_id

Unique constraint

(user_id, poll_id)

User can vote only once per poll.

---

## Category Table (Optional MVP)

```
Category

id UUID

name TEXT

slug TEXT
```

Examples

sports
relationships
technology
workplace

---

# 5. Reputation Logic

Exposure calculation

```
exposure = A_points - B_points
```

Reputation change

If A wins

```
rep += exposure
```

If B wins

```
rep -= exposure
```

Future extension

Time decay multiplier

---

# 6. API Endpoints

## Create Poll

POST

```
/api/polls/create
```

Request

```
title
optionA
optionB
duration
category
```

Response

```
pollId
```

---

## Vote

POST

```
/api/polls/vote
```

Request

```
pollId
A_points
B_points
```

Server tasks

Validate constraints

Store vote

Update poll totals

---

## Feed

GET

```
/api/feed
```

Returns

```
active polls
recent polls
```

---

## Poll Details

GET

```
/api/poll/[id]
```

Returns

Poll info
Totals
Time remaining

---

# 7. Poll Resolution Worker

A background worker runs every minute.

Logic

```
find polls where
status = ACTIVE
end_time < now()

resolve winner

update poll

update user reputations

mark poll CLOSED
```

---

# 8. Poll Resolution Algorithm (MVP)

```
if total_a > total_b
winner = A

if total_b > total_a
winner = B

if tie
winner = random
```

---

# 9. Feed Query Logic

Active feed

```
status = ACTIVE
order by created_at desc
```

Recent feed

```
status = CLOSED
order by end_time desc
```

Future ranking

Vote velocity
Engagement

---

# 10. Security Rules

Validate votes server side

Prevent duplicate votes

Rate limit API

Phone verification (future)

---

# 11. Scaling Path

When traffic grows introduce:

Realtime

WebSockets

Queue

Kafka / Redis Streams

Vote Workers

Poll Sharding

Event sourcing

---

# 12. Realtime Upgrade (Phase 2)

Replace polling with:

WebSocket

Live vote updates

Sentiment graphs

---

# 13. Anti‑Bot Layer (Phase 2)

Signals

Voting speed
Device fingerprint
IP clustering

---

# 14. Analytics

Track

polls_created
votes_per_poll
retention
share_rate

---

# 15. Performance Targets

MVP

<200ms API response

<1s page load

---

# 16. Developer Rules

All logic goes through services

No database calls directly in UI

Use types everywhere

Use Zod validation

---

# 17. Future Infrastructure

When scaling to millions

Add

Kafka vote ingestion

Worker clusters

Realtime vote engine

Sentiment time series

---

# 18. Final System Principle

The system must always guarantee:

Every poll produces a **deterministic verdict**.

The platform is not a poll system.

It is a **social arbitration engine**.
