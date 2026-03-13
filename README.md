# Banter MVP

Banter is a Next.js MVP for binary argument polls with conviction voting, deterministic poll resolution, reputation updates, and moderation reports.

## Setup

1. Copy `.env.example` to `.env`.
2. Install dependencies with `npm install`.
3. Run `npx prisma migrate dev`.
4. Start the app with `npm run dev`.
5. Optionally seed demo content with `npm run seed`.

## Required local software

- Node.js 18.18+ or 20+
- npm
- PostgreSQL, or a hosted Postgres database such as Neon

## Auth setup

- `NEXTAUTH_SECRET` is required.
- `NEXTAUTH_URL` should be `http://localhost:3000` for local dev.
- `ADMIN_EMAILS` is a comma-separated list of emails allowed to access moderation.

## Demo account

- Email: `demo@banter.app`
- Password: `banterdemo123`

This account is created when you run `npm run seed`.

## Included MVP slices

- Poll creation
- Vote submission with 100-point allocation
- Feed and poll pages
- Result pages and poll resolution worker
- Profile page
- Report flow and moderation dashboard
- Credentials auth with signup and login
