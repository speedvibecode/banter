# BANTER — `rules.md`

This document defines the **core engineering rules for the Banter codebase**.

These rules must be followed by **all developers and AI coding agents (Copilot)** when contributing to the project.

The purpose of this document is to ensure:

• predictable architecture
• consistent code quality
• maintainable systems
• safe development practices

If any change violates these rules, it must be **rejected or refactored**.

---

# 1. Core Development Philosophy

The Banter MVP must prioritize:

1. **Simplicity**
2. **Clarity**
3. **Reliability**

The goal is **a working product**, not architectural perfection.

Every decision must favor:

* readable code
* predictable behavior
* minimal complexity

---

# 2. Architecture Rule

The architecture is **monolithic for MVP**.

Allowed structure:

Client (Next.js UI)
→ API Routes
→ Service Layer
→ Database

All application logic must respect this flow.

---

# 3. Layer Responsibilities

## UI Layer

Location:

```
/app
/components
```

Responsibilities:

* rendering UI
* collecting user input
* calling API routes

The UI **must not contain business logic**.

---

## API Layer

Location:

```
/app/api
```

Responsibilities:

* input validation
* request parsing
* calling services
* returning responses

API routes should remain **thin**.

---

## Service Layer

Location:

```
/services
```

Responsibilities:

* business logic
* orchestration
* database interaction

Examples:

* pollService
* voteService
* userService
* reportService

All business logic must exist here.

---

## Library Layer

Location:

```
/lib
```

Responsibilities:

* reusable utilities
* algorithms
* calculations

Examples:

* reputation calculations
* poll resolution logic

---

# 4. Database Rules

Database access must always follow this rule:

Service
→ Prisma
→ PostgreSQL

Database queries must **never appear in UI components**.

---

# 5. Data Integrity Rules

Votes are **append-only records**.

Votes must never be edited after submission.

Poll history must remain intact.

Critical data must not be permanently deleted.

Use status fields instead:

```
ACTIVE
CLOSED
REMOVED
```

---

# 6. Validation Rules

All input must be validated on the **server** using Zod.

Validation must exist for:

* poll creation
* vote submission
* report submission
* authentication

Client validation is optional and only for UX.

---

# 7. Type Safety Rules

The codebase must remain **strict TypeScript**.

All functions must define:

* input types
* return types

API responses must use **explicit types**.

---

# 8. Service Design Rules

Each service must follow **single responsibility**.

Example:

```
pollService → poll lifecycle
voteService → vote handling
userService → user operations
reportService → moderation reports
```

Services must expose **clear functions**.

Example:

```
createPoll()
submitVote()
resolvePoll()
createReport()
```

---

# 9. API Design Rules

Every API route must:

1. Validate input
2. Call a service
3. Return structured output

API routes must **not contain business logic**.

---

# 10. File Organization

All code must follow the repository structure.

```
/app
/components
/services
/lib
/prisma
/scripts
```

New code must be placed in the **correct layer**.

---

# 11. Naming Conventions

Use clear names.

Good examples:

```
createPoll
submitVote
calculateExposure
resolvePoll
```

Avoid vague names such as:

```
handleData
processStuff
doThing
```

---

# 12. Function Design Rules

Functions must:

* do one thing
* be easy to read
* avoid hidden side effects

If a function grows complex, split it into smaller functions.

---

# 13. Error Handling Rules

All critical operations must handle errors.

Examples:

* database failures
* validation failures
* authentication failures

Errors must return **clear responses**.

---

# 14. Logging Rules

Important system events must be logged.

Events include:

* poll creation
* vote submission
* poll resolution
* report submission

Logs must be structured.

---

# 15. Moderation Rules

All polls must allow reporting.

Reported polls must appear in the moderation dashboard.

Moderators must be able to:

* review reports
* remove polls
* ban abusive users

Moderation actions must be logged.

---

# 16. Testing Rules

Before completing a feature, verify:

1. API works
2. UI renders correctly
3. data updates correctly
4. edge cases handled

Testing can be manual during MVP.

---

# 17. Refactoring Rules

If a file exceeds **~300 lines**, it should be refactored.

Refactor by:

* extracting services
* creating utilities
* splitting components

---

# 18. Feature Development Order

Features must be implemented in the order defined by the **MVP TODO document**.

Do not skip phases.

Skipping phases leads to unstable architecture.

---

# 19. Security Rules

Security practices must include:

* server-side validation
* authentication checks
* rate limiting
* safe database migrations

Never trust client inputs.

---

# 20. Deployment Rules

Before deployment verify:

* migrations run successfully
* environment variables configured
* database connectivity works
* poll resolution worker runs correctly

---

# 21. Copilot Behavior Rules

AI coding agents must:

* follow the TODO list order
* reuse existing services
* avoid duplicating logic
* avoid unnecessary abstraction

If uncertain, choose **the simplest solution**.

---

# Final Principle

The Banter system exists to guarantee one outcome:

**Every argument ends with a verdict.**

All code must support this principle.
