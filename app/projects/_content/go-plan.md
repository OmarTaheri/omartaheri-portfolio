## Why I built it

Registering at Al Akhawayn means filling a paper form by hand, walking it to your advisor's office, and coming back later if there is a queue. The walking is not the problem. The problem is making choices without being able to see whether a prerequisite is done, a course is offered, or a graduation plan still works.

goPlan replaces that guesswork with a plan that knows the student's record. It checks requirements against the transcript, flags problems while the semester is still being planned, and puts the result directly in an advisor's queue.

## What it changes

- Students can see degree progress, plan semesters, and try different paths before committing.
- Prerequisites and credit-load problems appear while courses are being chosen, not weeks later.
- Advisors review plans with the student's transcript and an auditable history beside them.
- Administrators manage courses, requirements, offerings, semesters, users, and roles.
- The AI advisor answers from the student's own record and proposes changes that the student can preview.

## Keeping AI in its place

AI output is a proposal, never the source of truth. Before anything is applied, the server checks ownership, protected semesters, duplicates, credit limits, prerequisites, and course offerings again. Selected changes are applied together in one transaction, with a saved snapshot for safe undo.

## Built with

- Next.js 16 and React 19
- TypeScript
- MySQL 8
- DeepSeek API
- Tailwind CSS and shadcn/ui
- Zod, bcrypt, and JSON Web Tokens

## Current status

goPlan is in active development. The student, advisor, and administrator experiences are working; broader end-to-end coverage and a sanitized public demo are still on the roadmap.
