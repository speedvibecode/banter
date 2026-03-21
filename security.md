# Security and Operational Notes

## Scope

This document describes the current security-relevant behavior of the Banter app and the main operational cautions for shipping changes safely.

## Current Security Controls

### Authentication

- NextAuth credentials auth is used for sign up and login flows.
- Protected flows require a valid session.
- Admin moderation access is restricted by configured admin email allowlisting.

### Server-Side Validation

Poll creation, voting, reporting, auth, and moderation all depend on server-side route handling and service-layer checks. UI validation is not treated as a security boundary.

### Voting Integrity

The current system enforces the application rule that users vote once per poll and allocate points across exactly two options. Vote and poll totals are maintained on the server side.

### Moderation

- Polls can be reported by authenticated users
- Admins can review reports through `/admin/moderation`
- Poll removal is handled as a status transition, not a hard delete in the normal moderation flow

## Database Safety

### Neon

Production uses Neon Postgres. Treat Neon branch selection and connection strings carefully. Runtime and direct Prisma URLs should stay aligned to the same branch.

### Prisma Migrations

Production deploys run `prisma migrate deploy` as part of the Vercel build command. Any new migration added to the repo should be reviewed as a production change, not just a code change.

### Migration Prep Script

The repo includes `scripts/prepareMigrations.js`, which runs before `prisma migrate deploy` in production builds. That means deploys can include pre-migration data cleanup behavior if this script is changed. Treat edits to that file as high-risk operational changes.

## Secrets and Environment Variables

Do not commit:

- `.env`
- `.env.local`
- Vercel local metadata
- raw credentials or tokens

Required sensitive configuration includes:

- `DATABASE_URL`
- `DATABASE_URL_UNPOOLED`
- `NEXTAUTH_SECRET`
- `ADMIN_EMAILS`

## Launch-Readiness Gaps

These are still worth addressing before a public launch:

- explicit rate limiting on sensitive endpoints
- more formal audit logging for admin actions
- clearer incident/recovery procedure for production DB changes
- review of auth/session settings and cookie behavior in production
- backup and restore runbook for Neon

## Safe Change Rules

- Do not change Prisma schema casually
- Do not add migration scripts without understanding deploy impact
- Do not move business logic into UI components
- Do not ship docs that describe behavior the app does not actually have

## Release Checklist for Sensitive Changes

Before shipping anything that touches auth, moderation, votes, or database behavior:

1. Run typecheck
2. Run production build
3. Review affected routes and services
4. Confirm Vercel environment variables
5. Confirm Neon target branch and migration state if database behavior is involved
