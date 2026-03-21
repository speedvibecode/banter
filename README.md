# Banter

Banter is a Next.js application for binary argument polls. Users can create polls, allocate 100 points across two outcomes, see live and resolved results, build reputation from correct convictions, report abusive polls, and moderate reported content through an admin dashboard.

## Stack

- Next.js 14 App Router
- TypeScript
- Tailwind CSS
- Prisma
- NextAuth credentials auth
- Neon Postgres
- Vercel

## Current Product Surface

- Home feed with active polls and recent verdicts
- Poll creation flow at `/create`
- Poll detail and voting flow at `/poll/[id]`
- Result page at `/result/[id]`
- User profile page at `/profile/[username]`
- Report submission flow on poll pages
- Admin moderation page at `/admin/moderation`

## Environment Variables

Required runtime variables:

- `DATABASE_URL`
- `DATABASE_URL_UNPOOLED`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `ADMIN_EMAILS`

Notes:

- `DATABASE_URL` should use the pooled Neon connection string.
- `DATABASE_URL_UNPOOLED` should use the direct Neon connection string for Prisma direct access.
- Both database URLs should point to the same Neon branch.

## Development

```bash
npm install
npm run dev
```

If you need to generate Prisma client manually:

```bash
npm run prisma:generate
```

## Production Build and Deploy

The Vercel build command is defined in [vercel.json](/C:/Users/USER/OneDrive/Desktop/projects/banter%20copy/banter/vercel.json):

```json
{
  "buildCommand": "npm run build:deploy"
}
```

`build:deploy` runs:

1. `prisma generate`
2. `node scripts/prepareMigrations.js`
3. `prisma migrate deploy`
4. `next build`

This means Vercel deploys can execute migration-related Prisma steps before building. Keep that behavior in mind before adding new migrations or migration-prep scripts.

## Deployment Status

The app is currently deployed on Vercel and uses Neon Postgres in production.

## Repo Guidance

- Keep business logic in `services/`
- Keep DB access out of UI components
- Use existing API routes and service functions before adding new ones
- Treat docs as current-state references, not planning scratchpads
