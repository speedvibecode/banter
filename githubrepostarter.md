# BANTER — GitHub Repo Starter Template

This document defines the **initial repository scaffold** for the Banter MVP so developers (or Copilot) can immediately generate a working codebase.

Goal:

• clone repo
• install dependencies
• run dev server
• create polls
• vote
• resolve polls

---

# 1. Create Project

```bash
npx create-next-app@latest banter
```

Options

* App Router
* TypeScript
* Tailwind
* ESLint

---

# 2. Install Dependencies

```bash
npm install prisma @prisma/client
npm install next-auth
npm install zod
npm install lucide-react
npm install pino
npm install posthog-js
```

Dev dependencies

```bash
npm install -D ts-node
```

---

# 3. Repository Structure

```
banter

/app
/app/page.tsx
/app/create/page.tsx
/app/poll/[id]/page.tsx
/app/result/[id]/page.tsx
/app/profile/[id]/page.tsx

/app/api
/app/api/polls/create/route.ts
/app/api/polls/vote/route.ts
/app/api/polls/feed/route.ts
/app/api/polls/[id]/route.ts

/components
PollCard.tsx
VoteSlider.tsx
ResultCard.tsx
VoteBar.tsx
CountdownTimer.tsx

/lib
prisma.ts
pollLogic.ts
reputation.ts
resolvePolls.ts

/services
pollService.ts
voteService.ts
userService.ts

/prisma
schema.prisma

/scripts
resolvePolls.ts

/docs
(all design documents)
```

---

# 4. Prisma Schema

```
generator client {
 provider = "prisma-client-js"
}

datasource db {
 provider = "postgresql"
 url      = env("DATABASE_URL")
}

model User {
 id              String   @id @default(uuid())
 username        String   @unique
 email           String   @unique
 password_hash   String

 reputation      Int      @default(0)

 polls_created   Int      @default(0)
 polls_participated Int   @default(0)

 created_at      DateTime @default(now())

 votes           Vote[]
 polls           Poll[]
}

model Poll {
 id         String   @id @default(uuid())

 creator_id String
 creator    User     @relation(fields: [creator_id], references: [id])

 title      String
 description String?

 option_a   String
 option_b   String

 total_a    Int      @default(0)
 total_b    Int      @default(0)

 vote_count Int      @default(0)

 start_time DateTime
 end_time   DateTime

 status     String   @default("ACTIVE")

 winner     String?

 created_at DateTime @default(now())

 votes      Vote[]
}

model Vote {
 id        String   @id @default(uuid())

 user_id   String
 poll_id   String

 user      User     @relation(fields: [user_id], references: [id])
 poll      Poll     @relation(fields: [poll_id], references: [id])

 A_points  Int
 B_points  Int

 exposure  Int

 created_at DateTime @default(now())

 @@unique([user_id, poll_id])
}
```

---

# 5. Prisma Client

/lib/prisma.ts

```ts
import { PrismaClient } from "@prisma/client"

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
 globalForPrisma.prisma ||
 new PrismaClient({
  log: ["query"]
 })

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
```

---

# 6. Poll Service

/services/pollService.ts

Responsibilities:

• create poll
• fetch poll
• resolve poll

---

# 7. Vote Service

/services/voteService.ts

Responsibilities:

• validate vote
• store vote
• update poll totals

---

# 8. Reputation Service

/lib/reputation.ts

```
export function calculateExposure(A: number, B: number) {
 return A - B
}
```

```
export function reputationChange(exposure: number, winner: "A" | "B") {
 if (winner === "A") return exposure
 return -exposure
}
```

---

# 9. Poll Resolution Worker

/scripts/resolvePolls.ts

Logic

1. find expired polls
2. determine winner
3. update reputation
4. mark closed

---

# 10. Poll Resolution Logic

/lib/pollLogic.ts

```
export function determineWinner(totalA:number,totalB:number){

 if(totalA>totalB) return "A"
 if(totalB>totalA) return "B"

 return Math.random()>0.5 ? "A" : "B"

}
```

---

# 11. PollCard Component

/components/PollCard.tsx

Displays:

• poll title
• option labels
• vote distribution
• time remaining

---

# 12. VoteSlider Component

/components/VoteSlider.tsx

Allows allocating 100 points between two options.

Must enforce:

A + B ≤ 100

---

# 13. ResultCard Component

/components/ResultCard.tsx

Displays final verdict.

---

# 14. Feed Page

/app/page.tsx

Loads active polls.

Maps PollCard components.

---

# 15. Poll Page

/app/poll/[id]/page.tsx

Displays

• poll title
• voting interface
• current totals

---

# 16. Create Poll Page

/app/create/page.tsx

Form

Title
Option A
Option B
Duration

---

# 17. Environment Variables

```
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
```

---

# 18. Run Project

```
npm install
npx prisma migrate dev
npm run dev
```

Open

```
http://localhost:3000
```

---

# 19. First Feature Tests

1 create poll

2 vote on poll

3 poll resolves

4 result page visible

---

# 20. Next Steps After Template

Add

• realtime updates
• leaderboards
• notifications
• share cards

---

# Final Goal

A developer cloning this repo should be able to:

create arguments
vote with conviction
see the final verdict

within the first hour of development.
