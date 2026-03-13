# BANTER — Design System & Tailwind Specification

## Purpose

This document defines the **visual design system** for the Banter MVP.

The goal is to ensure:

• consistent UI across components
• fast development with Tailwind
• Copilot generates predictable layouts
• the interface feels like a **verdict engine**, not a form tool

This system should be used for **all components and screens**.

---

# 1. Core Design Principles

### 1. Arguments First

The UI must prioritize **debates and outcomes**.

Poll titles and verdicts should dominate the screen.

---

### 2. Clarity Over Decoration

Avoid:

• heavy gradients
• decorative graphics
• complex layouts

Prefer:

• strong typography
• clean spacing
• clear contrast

---

### 3. Fast Interaction

Users should be able to:

• understand a poll in 2 seconds
• vote in 3 seconds

---

### 4. Mobile First

Most usage will be mobile.

Design for:

• thumb interactions
• full-width cards

---

# 2. Color System

## Background

Primary Background

zinc-950

Secondary Background

zinc-900

Card Background

zinc-900

---

## Primary Accent

Electric Blue

blue-500

Used for:

• Option A
• interactive elements

---

## Secondary Accent

Orange

orange-500

Used for:

• Option B
• conflict indicators

---

## Success Color

Green

green-500

Used for:

• winning option
• positive reputation

---

## Loss Color

Red

red-500

Used for:

• losing option
• negative reputation

---

# 3. Typography

Use system fonts or Inter.

---

## Headline

text-3xl
font-bold

Used for:

Poll titles

---

## Section Title

text-xl
font-semibold

---

## Body Text

text-base

---

## Metadata

text-sm
text-zinc-400

Used for:

Vote counts
Time remaining
User stats

---

# 4. Spacing System

Use Tailwind spacing scale.

Primary spacing:

p-4
p-6

Component spacing:

space-y-4
space-y-6

---

# 5. Card System

All cards use:

rounded-xl
border border-zinc-800
bg-zinc-900
p-4

Hover state:

hover:border-zinc-700
hover:bg-zinc-850

---

# 6. Buttons

Primary Button

bg-blue-500
text-white
rounded-lg
px-4
py-2

Hover

hover:bg-blue-600

---

Secondary Button

bg-zinc-800
text-white

---

# 7. Poll Card Layout

Structure

Card

Poll Title

Vote Distribution Bar

Option Labels

Metadata Row

Example spacing

space-y-3

---

# 8. Vote Distribution Bar

Height

h-3

Rounded

rounded-full

Colors

blue-500
orange-500

---

# 9. Voting Slider

Width

w-full

Thumb size

large

Colors

Option A

blue-500

Option B

orange-500

---

# 10. Result Card

Result cards must feel **authoritative**.

Structure

Verdict Header

Poll Title

Winning Option

Percentage Split

Vote Count

Winner text:

text-2xl
font-bold

---

# 11. Layout Grid

Main container

max-w-2xl
mx-auto

Padding

px-4

---

# 12. Feed Layout

Vertical feed

space-y-4

Each poll card full width.

---

# 13. Animation Guidelines

Keep animations subtle.

Allowed:

• vote bar transition
• result reveal
• hover elevation

Avoid:

• long animations
• complex motion

---

# 14. Icon System

Use Lucide icons.

Examples:

Clock → timer
Share → result share
Plus → create poll

---

# 15. Mobile Rules

Poll cards full width

Minimum tap target:

44px

Voting sliders must work with thumb drag.

---

# 16. Accessibility

Ensure:

• sufficient color contrast
• readable font sizes
• clear labels for sliders

---

# 17. Tailwind Component Classes

PollCard

rounded-xl border border-zinc-800 bg-zinc-900 p-4

VoteBar

h-3 rounded-full

PrimaryButton

bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-4 py-2

---

# 18. UI Consistency Rules

Every screen must follow:

same card style
same spacing scale
same typography

---

# 19. MVP Simplicity Rule

Do not introduce new colors or styles unless defined here.

Consistency is more important than visual variety.

---

# 20. Final Design Goal

When users open Banter they should feel:

"The internet is about to deliver a verdict."
