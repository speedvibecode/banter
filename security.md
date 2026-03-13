# BANTER — Security, Data Protection & Moderation Document

## Purpose

This document defines **security rules, data protection mechanisms, and moderation workflows** for the Banter MVP.

Goals:

1. Prevent accidental **data loss**.
2. Prevent **abuse and malicious polls**.
3. Allow **manual moderation during early stages**.
4. Provide clear **verification instructions for AI coding agents (Copilot)** so the system remains simple and correct.

This document should guide both **development and operations**.

---

# 1. Core Security Principles

The Banter MVP must follow four security rules.

### 1. Data Must Never Be Lost

Polls, votes, and users represent the **core system history**.

The system must ensure:

• database backups
• safe migrations
• append-only vote records

---

### 2. Server Validation Is Mandatory

The server must validate:

• vote constraints
• authentication
• poll creation inputs

Client validation is **not sufficient**.

---

### 3. Moderation Must Exist From Day One

Even at small scale, some polls will be:

• abusive
• illegal
• spam

The system must include:

• report button
• moderation dashboard

---

### 4. Simplicity Reduces Security Risk

Avoid complex architecture in MVP.

Simpler systems are easier to secure and audit.

---

# 2. Data Protection Strategy

## Primary Database

PostgreSQL

Recommended hosting:

Neon or Supabase

These services provide:

• automated backups
• point-in-time recovery

---

## Backup Rules

Database backups must include:

• Users
• Polls
• Votes

Backup schedule:

Daily automatic backups

Retention:

7–14 days minimum

---

## Migration Safety

All schema changes must be done through:

Prisma migrations

Never modify production schema manually.

---

## Vote Data Integrity

Votes should behave like **append-only records**.

Votes should never be deleted unless:

• moderation action
• legal requirement

---

# 3. Input Validation

All API endpoints must validate input using **Zod schemas**.

---

## Poll Creation Validation

Constraints:

Title length: 5–200 characters

Option text length: 1–100 characters

Duration must be from allowed set

---

## Voting Validation

Vote constraints:

A_points >= 0

B_points >= 0

A_points + B_points <= 100

User must not have voted before.

---

# 4. Authentication Security

Use **NextAuth** for authentication.

Minimum MVP requirements:

• email verification
• secure password hashing

Passwords must be hashed using:

bcrypt

---

# 5. Rate Limiting

To prevent abuse.

Recommended limits:

Poll creation

5 per hour

Voting

30 per minute

Use middleware-based rate limiting.

---

# 6. Report Button System

Users must be able to report polls.

---

## Report Button UI

Every poll page includes:

"Report Poll" button

Click → opens modal.

User selects reason:

• spam
• harassment
• illegal content
• misinformation
• other

---

## Report Database Table

```
Report

id UUID

poll_id UUID

reporter_id UUID

reason TEXT

notes TEXT

status TEXT

created_at TIMESTAMP
```

Status values:

OPEN

REVIEWED

RESOLVED

---

# 7. Moderation Dashboard (Early Stage)

Admins need a simple moderation page.

Route

/admin/moderation

Displays:

• reported polls
• report count
• poll title
• creator

---

## Moderator Actions

Moderators can:

• ignore report
• delete poll
• ban user

---

## Poll Deletion Rule

If poll removed:

• mark status = REMOVED

Do NOT hard delete initially.

---

# 8. Abuse Prevention

Initial protections:

Phone verification (later)

Device fingerprinting (later)

Rate limits (immediate)

---

# 9. Logging

Use structured logging.

Log events:

poll creation

vote submission

poll resolution

report submission

---

# 10. Error Monitoring

Use Sentry.

Capture:

API failures

DB failures

Unhandled exceptions

---

# 11. AI Development Verification Rules

These rules instruct **Copilot or AI agents** how to verify code.

The goal is to avoid:

• tangled logic
• duplicated functionality
• unnecessary complexity

---

# 12. Copilot Development Discipline

When implementing features, AI must follow this sequence.

Step 1

Check if a service already exists.

Example:

pollService

voteService

userService

---

Step 2

If logic exists, reuse it.

Do NOT duplicate logic.

---

Step 3

Ensure logic remains inside service layer.

Never place database queries directly in UI components.

---

Step 4

Verify type safety.

All functions must use TypeScript types.

---

# 13. Feature Verification Workflow

Every feature must pass this verification order.

1. Database schema verified

2. Service layer implemented

3. API route implemented

4. UI component implemented

5. End-to-end test performed

Only then move to next feature.

---

# 14. Complexity Guardrails

Copilot must avoid:

• unnecessary abstraction

• premature optimization

• complex patterns

The MVP goal is:

working product

not perfect architecture.

---

# 15. Code Quality Rules

All code must satisfy:

• clear naming

• single responsibility per function

• small files

---

# 16. Refactor Rule

If a file grows beyond ~300 lines:

Split into modules.

---

# 17. Verification Checklist

Before merging code:

Check:

• no duplicate logic

• validation exists

• services used correctly

• UI separated from backend logic

---

# 18. MVP Security Goal

Even at small scale the system must ensure:

• no data loss

• basic moderation

• safe vote processing

---

# 19. Long-Term Security Expansion

Later improvements include:

• phone verification

• device fingerprinting

• automated abuse detection

• AI moderation assistance

---

# Final Principle

Security for Banter should follow this rule:

Protect the data.

Keep the system simple.

Moderate the platform responsibly.

Everything else can evolve later.
