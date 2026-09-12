# Waypoint

Get through the semester with people who've already done it.

## What it is

Waypoint is a course-scoped hub for two things freshmen actually need mid-
semester and rarely have a good place to get:

- **Ask a senior** — post a question tied to a course. Students who've
  taken it (or anyone, really) can answer; a senior's answer marks the
  question resolved.
- **Share resources** — notes, past papers, and repo links, organized by
  course instead of scattered across group chats nobody can search.

## Why

Most of what actually helps a freshman survive a hard course already
exists — it's just trapped in a graduated senior's Google Drive, or three
scroll-years deep in a WhatsApp group. Waypoint doesn't try to replace
office hours or Discord. It just gives both of those things a permanent,
searchable, course-shaped home.

## Screenshots
<img width="1844" height="904" alt="92c1813f17023c06ff55004cf24c4924" src="https://github.com/user-attachments/assets/ea115be7-da7e-40fd-8781-952bef7f3f5b" />
<img width="1844" height="906" alt="e731233a5d97137029af487259aa26b8" src="https://github.com/user-attachments/assets/2cda8dfd-dbab-4bfb-aa7f-4c0f55de174c" />
<img width="1849" height="903" alt="c77fff0d64941906392e245d3cf4d29c" src="https://github.com/user-attachments/assets/4680c2c4-ed49-45ed-b497-8a172e1c2848" />
<img width="1849" height="909" alt="25e136c8dc9f657f46cdf6bc8fbb6b65" src="https://github.com/user-attachments/assets/ce0dd938-b865-4cb6-a683-df9dcd048bba" />
<img width="1850" height="906" alt="2a90893fa3910566447215761884fff6" src="https://github.com/user-attachments/assets/c3e27dcb-d167-4ffb-bd90-5638166fbf4a" />
<img width="1849" height="903" alt="1fece16681cdc7e8d87affd0a0ec15ee" src="https://github.com/user-attachments/assets/d95be3ca-6e36-462c-b068-368516cba1fa" />
<img width="1848" height="903" alt="c75d77372ca0044e4d67158066fda893" src="https://github.com/user-attachments/assets/2c83d43d-d0b3-469b-af06-723ab89d493d" />
<img width="1850" height="903" alt="6d800239592d8d6d77451f23b206e833" src="https://github.com/user-attachments/assets/f0b7b7f0-aec0-4c90-a2f9-813bce03cd59" />

Put the screenshots here

| Home | Course hub | Ask a senior |
|---|---|---|
| `assets/home.png` | `assets/course-hub.png` | `assets/ask-thread.png` |

See `assets/README.md` for the exact shots worth taking.

## Setup

Requires Node 20+ (uses Node's built-in test runner + native TypeScript
support — Node 22+ recommended).

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The first request
seeds `data/db.json` from `src/lib/seed.ts` automatically — nothing else
to configure, no database, no accounts.

```bash
npm test         # runs the unit tests in tests/
npm run build    # production build, also type-checks everything
```

## Try it in under a minute

1. Open the app, set a name in the header, and pick a role (**Freshman** or
   **Senior**) — this is just a display label, not a real account.
2. Go to a course hub, e.g. `/courses/MATH100` (Pre-Calculus).
3. As a freshman: ask a question, or drop a link under "Add a resource."
4. Switch your role to **Senior** (click *edit* in the header) and answer
   the question you just asked — watch it flip to "Answered by a senior."

## Architecture

The short version: **Ask a senior** and **Share resources** are the same
underlying shape — content scoped to a course — so they share one data
model instead of being built as two separate mini-apps. See
[`docs/architecture.md`](docs/architecture.md) for the full breakdown and
[`docs/decisions.md`](docs/decisions.md) for what we deliberately scoped
out and why (no login system, no database, no file uploads — all
intentional, all explained).

## Project structure

```
waypoint/
├── README.md              ← this file
├── docs/
│   ├── architecture.md    ← components, data flow, the why
│   └── decisions.md       ← what we chose, what we rejected
├── src/
│   ├── app/                ← pages + API routes (Next.js App Router)
│   │   ├── page.tsx           landing page
│   │   ├── courses/[code]/    course hub: resources + questions together
│   │   ├── resources/         all resources, filterable by course
│   │   ├── ask/                all questions, + /ask/[id] thread view
│   │   └── api/                POST endpoints the forms call
│   ├── components/         ← what shows: cards, forms, badges
│   └── lib/                 ← what thinks: types, data layer, pure helpers
├── tests/                  ← unit tests for the pure helpers
├── data/                   ← generated JSON store (gitignored)
└── assets/                 ← screenshots for this README
```

## Where the seed data comes from

The resources in `src/lib/seed.ts` link directly into the real
[HITSZCS](https://github.com/elalamiimed/HITSZCS) repository — an
existing, community-maintained archive of HITSZ CS freshman course
materials. The two seed questions are real questions a freshman actually
has, left unanswered on purpose (a fabricated "senior answer" to "I failed
my placement exam, what do I do" would be actively bad advice — that
needs a real senior). Add courses or resources by extending the arrays in
`seed.ts`; the shape of each entry is documented by `src/lib/types.ts`.
