# Technical Architecture

## Overview

Banter is a monolithic Next.js application with server-rendered pages, route handlers, a Prisma-backed service layer, and a Neon Postgres database. The current design is intentionally simple: one deployable app, one primary database, and route-level business flows built around poll creation, voting, result resolution, reputation updates, reporting, and moderation.

## Runtime Flow

High-level request path:

1. App Router page or client component initiates an action
2. Route handler validates input and calls the relevant service
3. Service layer performs business logic and Prisma operations
4. The page re-renders or routes the user to the next state

## Main Application Areas

- `app/page.tsx`: home feed
- `app/create/page.tsx`: authenticated poll creation
- `app/poll/[id]/page.tsx`: poll detail and voting
- `app/result/[id]/page.tsx`: resolved poll result
- `app/profile/[username]/page.tsx`: profile and activity history
- `app/admin/moderation/page.tsx`: admin review workflow

## Business Logic Layers

### UI Layer

Shared UI lives in `components/`. These components should present data and handle interaction wiring, but not contain database logic.

### Route Layer

API handlers live in `app/api/`. They are the public server entry points for create, vote, report, auth, moderation, and feed queries.

### Service Layer

Core behavior lives in `services/`:

- `pollService.ts`
- `voteService.ts`
- `reportService.ts`
- `userService.ts`

This is the right place for business rules, Prisma reads and writes, and cross-entity updates.

### Library Layer

Shared utilities live in `lib/`, including:

- auth helpers
- poll calculation logic
- reputation logic
- Prisma client bootstrap
- logging

## Data Model

The current Prisma schema centers on four entities:

- `User`
- `Poll`
- `Vote`
- `Report`

Current functional relationships:

- a user creates many polls
- a user votes on many polls
- a poll collects many votes
- a poll can be reported by many users
- a report belongs to one poll and one reporter

## Poll Lifecycle

1. Authenticated user creates a poll
2. Poll is stored with `ACTIVE` status and an `endTime`
3. Authenticated users submit one vote per poll with a 100-point allocation across options A and B
4. Poll totals update as votes arrive
5. When a poll has expired, resolution logic determines the winner
6. User reputation updates according to the existing exposure logic
7. Poll moves to `CLOSED`

## Moderation Lifecycle

1. Authenticated user reports a poll
2. Report is stored with a moderation status
3. Admin visits `/admin/moderation`
4. Admin can ignore a report or mark the related poll removed

## Auth

The app currently uses NextAuth credentials auth. Session checks are enforced where needed for protected product flows such as poll creation, voting, and moderation access.

## Database and Deploy

- Database: Neon Postgres
- ORM: Prisma
- Hosting: Vercel

Deploys currently use `npm run build` on Vercel. Database migration work is intentionally separated into an explicit operational command, `npm run deploy:db`. Treat migration changes as deployment-sensitive even though they are no longer coupled to every app build.

## Current Constraints

- No realtime transport
- No queue system
- No external worker service
- No dedicated rate-limiting layer yet
- No separate backend service

Those are product and infrastructure decisions to revisit deliberately, not things to add casually.

## Engineering Guidance

- Reuse existing service functions before adding new ones
- Avoid direct Prisma access in UI code
- Keep route handlers thin
- Keep docs aligned to the shipped system, not speculative future phases
