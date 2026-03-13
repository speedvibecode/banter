# BANTER — Component Design Document (MVP)

## Purpose

Define the **core reusable UI components** for the Banter MVP.

The product experience will largely be determined by three components:

1. Poll Card (feed unit)
2. Conviction Voting Slider (core interaction)
3. Result Card (viral share object)

These components must be:

* simple
* fast
* visually clear
* mobile friendly

---

# 1. Poll Card

## Purpose

The poll card is the **primary unit of the feed**.

Users should be able to understand an argument within **2 seconds**.

---

## Layout

Card sections:

Header
Poll Title
Option Split Bar
Metadata Row

---

## Example Layout

[Poll Title]

Option A label
████████████░░░░░░░

Option B label

A: 62%   B: 38%

Votes: 1482   2h left

---

## Interaction

Click card → opens poll page.

Hover state (desktop):

* slight elevation
* shadow increase

Mobile:

* full width card
* touch friendly padding

---

## Tailwind Structure

Container

rounded-xl
border
p-4
bg-zinc-900

---

# 2. Conviction Voting Slider

## Purpose

This is the **signature Banter interaction**.

It allows users to allocate **100 Banter Points** between two options.

Users should feel like they are expressing **confidence**, not just clicking a choice.

---

## Layout

Option A
[Slider]

Option B
[Slider]

Points Remaining: X

Submit Vote

---

## Behavior

Initial state:

A = 0
B = 0

User adjusts sliders.

Constraints enforced:

A + B ≤ 100

Remaining points dynamically shown.

---

## Example Interaction

User sets:

A = 70
B = 20

Display:

Remaining: 10

---

## UI Feedback

Slider colors:

Option A → blue
Option B → orange

Remaining points indicator changes color when near zero.

---

## Copilot Prompt

"Create a React component that allows users to allocate 100 points between two options using sliders. Enforce A+B<=100 and display remaining points dynamically."

---

# 3. Result Card

## Purpose

Result cards are the **viral share unit of Banter**.

They must look good when:

* screenshotted
* shared on social media
* embedded in chat

---

## Layout

Top Banner:

BANTER VERDICT

Poll Title

Winning Option

Percentage Split

Vote Count

---

## Example

BANTER VERDICT

"Is pineapple pizza good?"

YES — 63%
NO — 37%

Votes: 12,430

Banter has spoken.

---

## Visual Requirements

Large typography
High contrast
Minimal clutter

Winner must be visually dominant.

---

## Share Behavior

Buttons:

Copy Link
Share Image
Twitter
WhatsApp

---

# 4. Vote Distribution Bar

## Purpose

Provide a quick visual representation of poll results.

---

## Layout

Horizontal bar split into two colors.

Example:

[Blue 62% | Orange 38%]

---

## Animation

When votes change:

Bar smoothly transitions width.

---

# 5. Countdown Timer

## Purpose

Encourage urgency in voting.

---

## Display

Example:

2h 14m remaining

Last 10% of time:

Timer turns orange.

---

# 6. Reputation Badge

## Purpose

Display user credibility.

---

## Layout

Username
Reputation Score

Example:

Siddharth
Rep: 1243

---

# 7. Feed Navigation

Tabs:

Active
Closing Soon
Recent

---

# 8. Mobile Optimization

Important rules:

Large tap areas

Sliders must work with thumb gestures

Poll cards full width

---

# 9. Performance Rules

UI must remain responsive even with:

100+ polls in feed

Use:

React memo
Lazy loading

---

# 10. Final Design Principle

Every component should reinforce the idea:

"The crowd is deciding."
