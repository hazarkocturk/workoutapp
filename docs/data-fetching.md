# Data Fetching Guidelines

## Core Principles

1. **Always use Server Components** — data fetching MUST happen in Server Components only. Never fetch data in Client Components.
2. **No Route Handlers for data fetching** — do not use `app/api/` route handlers to serve data to the frontend. Call helper functions directly from Server Components.
3. **Always use Drizzle ORM** — never write raw SQL strings or use any other query method. All queries go through the Drizzle client from `src/db/index.ts`.
4. **Centralize helpers in `src/db/helpers/`** — all data fetching functions must be defined in `src/db/helpers/`. Create one file per domain (e.g. `workouts.ts`, `exercises.ts`).

## File Structure

```
src/db/
├── index.ts          # Drizzle client
├── schema.ts         # Table definitions
├── seed.ts           # Seed script
└── helpers/
    ├── workouts.ts   # getWorkouts, getWorkoutById, etc.
    └── exercises.ts  # getExercises, getExerciseById, etc.
```

## Helper Function Rules

- Functions must be `async` and return typed results using Drizzle's inferred types.
- Accept only the parameters needed — do not over-generalize.
- Keep business logic out of helpers — they are query functions only.
- Always scope queries to the current user via `userId` from Clerk where applicable.

## Example

```ts
// src/db/helpers/workouts.ts
import { db } from "@/db";
import { workouts } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getWorkoutsByUser(userId: string) {
  return db.select().from(workouts).where(eq(workouts.userId, userId));
}
```

```tsx
// src/app/dashboard/page.tsx  (Server Component)
import { auth } from "@clerk/nextjs/server";
import { getWorkoutsByUser } from "@/db/helpers/workouts";

export default async function DashboardPage() {
  const { userId } = await auth();
  const userWorkouts = await getWorkoutsByUser(userId!);
  // ...
}
```

## What NOT to Do

```ts
// ❌ Never fetch in a Client Component
"use client";
useEffect(() => {
  fetch("/api/workouts").then(...); // wrong
}, []);

// ❌ Never use route handlers for internal data fetching
// app/api/workouts/route.ts — do not create this

// ❌ Never write raw SQL
db.execute(sql`SELECT * FROM workouts`); // wrong

// ❌ Never define helpers inline in page files
// src/app/dashboard/page.tsx — do not query db directly here
```
