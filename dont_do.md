# BANTER — `dont_do.md`

This document defines **explicit prohibitions for developers and AI coding agents (Copilot)** when working on the Banter MVP.

The purpose of this file is to **prevent overengineering, architectural drift, and unnecessary complexity** during development.

The Banter MVP must remain **simple, stable, and understandable**.

If a change violates anything in this document, **do not implement it**.

---

# 1. Do NOT Change the Core Architecture

The MVP architecture is intentionally simple.

Allowed architecture:

Client (Next.js)
→ API Routes
→ Service Layer
→ PostgreSQL

Do NOT introduce:

* microservices
* event buses
* distributed systems
* message brokers
* multiple backend services

Those belong to **future scaling phases**, not the MVP.

---

# 2. Do NOT Add New Frameworks

The stack is fixed for MVP.

Allowed stack:

* Next.js
* TypeScript
* Tailwind
* Prisma
* PostgreSQL
* Zod
* NextAuth

Do NOT introduce:

* Redux
* GraphQL
* tRPC
* NestJS
* Express
* MobX
* React Query
* additional UI frameworks

If something can be done with **plain React + API routes**, do that.

---

# 3. Do NOT Move Logic into UI Components

UI components must **never contain business logic**.

Forbidden examples:

* database queries in UI
* reputation calculations in UI
* vote validation in UI

All logic belongs in:

```
/services
/lib
```

The UI should **only call APIs and render data**.

---

# 4. Do NOT Duplicate Logic

If logic already exists in a service or utility:

Reuse it.

Do NOT create:

* multiple vote validation functions
* multiple reputation calculations
* duplicate poll resolution logic

Always search the codebase first.

---

# 5. Do NOT Bypass the Service Layer

All backend operations must go through services.

Correct flow:

API Route
→ Service
→ Database

Forbidden flow:

API Route
→ Database

Services are the **single source of business logic**.

---

# 6. Do NOT Modify the Database Directly

All database changes must use:

```
Prisma migrations
```

Never:

* edit production schema manually
* run ad-hoc SQL schema changes
* change table structures without migrations

---

# 7. Do NOT Hard Delete Critical Data

Critical records must **never be hard deleted**.

Do NOT delete:

* polls
* votes
* reports

Instead use **status flags**:

```
status = REMOVED
status = CLOSED
status = ACTIVE
```

This preserves system history.

---

# 8. Do NOT Skip Server Validation

All input must be validated on the server.

Validation must include:

* poll creation inputs
* vote constraints
* report submission
* authentication checks

Never trust client inputs.

---

# 9. Do NOT Build Features Outside the TODO Order

Development must follow the **MVP TODO document**.

Do NOT build:

* notifications
* leaderboards
* groups
* messaging
* AI analysis
* prediction markets
* advanced analytics

These are **post-MVP features**.

---

# 10. Do NOT Optimize Prematurely

The MVP must prioritize:

clarity
correctness
speed of development

Do NOT add:

* caching layers
* complex performance tricks
* distributed scaling systems

The system will scale later.

---

# 11. Do NOT Create Massive Files

File size limits:

* preferred: <200 lines
* hard limit: ~300 lines

If a file becomes large, **split it into modules**.

---

# 12. Do NOT Use Magic Numbers

Constants must be declared clearly.

Example:

```
MAX_VOTE_POINTS = 100
```

Do NOT scatter unexplained numbers in logic.

---

# 13. Do NOT Introduce Unreviewed Dependencies

Every dependency increases risk.

Before adding a package ask:

* Can this be implemented with existing tools?
* Is this necessary for MVP?

If not essential → **do not install it**.

---

# 14. Do NOT Ignore Errors

Never write code that silently fails.

Always:

* handle errors
* log failures
* return clear responses

---

# 15. Do NOT Break Type Safety

All code must remain **strict TypeScript**.

Do NOT use:

```
any
```

unless absolutely necessary.

Types must exist for:

* API responses
* database models
* service functions

---

# 16. Do NOT Introduce Complex Patterns

Avoid:

* factories
* dependency injection frameworks
* elaborate class hierarchies
* design patterns that increase cognitive load

Simple functions are preferred.

---

# 17. Do NOT Implement Hidden Side Effects

Functions must behave predictably.

Avoid:

* hidden database writes
* implicit mutations
* unpredictable behavior

Functions should clearly state what they do.

---

# 18. Do NOT Break the Deterministic Outcome Rule

Every poll must produce **one final winner**.

Never create logic that allows:

* unresolved polls
* ambiguous results
* multiple winners

The system principle remains:

**Every argument ends with a verdict.**

---

# Final Rule

If a change makes the system:

* harder to understand
* harder to maintain
* more complex without necessity

**Do not implement it.**
