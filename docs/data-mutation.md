# Data Mutation Guidelines

## Core Principles

1. **Always use Server Actions** — all data mutations (create, update, delete) MUST use Next.js Server Actions. Never use Route Handlers (`app/api/`) for mutations.
2. **Always use Drizzle ORM** — never write raw SQL strings. All database interactions go through the Drizzle client from `src/db/index.ts`.
3. **Centralize DB helpers in `src/db/helpers/`** — all database write functions (insert, update, delete) must be defined in `src/db/helpers/`. Create one file per domain (e.g. `workouts.ts`, `exercises.ts`). These helpers are called from Server Actions — never directly from Client Components.
4. **Always validate with Zod** — validate all input in Server Actions using Zod before touching the database.
5. **Never use `FormData` as action params** — Server Action parameters must be typed objects, not `FormData`. Define a Zod schema and derive the TypeScript type from it.

## File Structure

```
src/
├── app/
│   └── (feature)/
│       └── actions.ts    # Server Actions for that feature/route
└── db/
    └── helpers/
        ├── workouts.ts   # createWorkout, updateWorkout, deleteWorkout, etc.
        └── exercises.ts  # createExercise, etc.
```

- Server Action files are named `actions.ts` and live next to the page/route they belong to.
- DB helper files live in `src/db/helpers/` — one file per domain, shared across actions.

## Server Action Rules

- Always add `"use server"` at the top of `actions.ts`.
- Always import and call the Zod schema to parse and validate input before any DB call.
- Always scope mutations to the current user via `userId` from Clerk where applicable.
- Return a typed result object (e.g. `{ success: true }` or `{ error: string }`) — never throw unhandled errors to the client.
- Never import Server Actions into other Server Actions — keep them flat and co-located.

## DB Helper Rules

- Helper functions handle only the database operation — no validation, no auth logic.
- Accept only the parameters needed — do not over-generalize.
- Return the result of the Drizzle operation (inserted/updated row or void for deletes).

## Zod Schema Convention

Define the Zod schema in the same `actions.ts` file (or a co-located `schema.ts` if shared). Derive the TypeScript input type from the schema using `z.infer`.

```ts
import { z } from "zod";

const CreateWorkoutSchema = z.object({
  title: z.string().min(1),
  date: z.string().datetime(),
});

type CreateWorkoutInput = z.infer<typeof CreateWorkoutSchema>;
```

## Example

```ts
// src/app/dashboard/actions.ts
"use server";

import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { createWorkout } from "@/db/helpers/workouts";

const CreateWorkoutSchema = z.object({
  title: z.string().min(1),
  date: z.string().datetime(),
});

type CreateWorkoutInput = z.infer<typeof CreateWorkoutSchema>;

export async function createWorkoutAction(input: CreateWorkoutInput) {
  const { userId } = await auth();
  if (!userId) return { error: "Unauthorized" };

  const parsed = CreateWorkoutSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.flatten() };

  await createWorkout({ ...parsed.data, userId });
  return { success: true };
}
```

```ts
// src/db/helpers/workouts.ts
import { db } from "@/db";
import { workouts } from "@/db/schema";

export async function createWorkout(data: {
  title: string;
  date: string;
  userId: string;
}) {
  return db.insert(workouts).values(data).returning();
}
```

## What NOT to Do

```ts
// ❌ Never use FormData as action parameter type
export async function createWorkoutAction(formData: FormData) { ... }

// ❌ Never mutate data in a Client Component via fetch/api route
"use client";
const res = await fetch("/api/workouts", { method: "POST", ... }); // wrong

// ❌ Never write raw SQL in helpers
db.execute(sql`INSERT INTO workouts ...`); // wrong

// ❌ Never skip Zod validation
export async function createWorkoutAction(input: { title: string }) {
  await createWorkout(input); // wrong — no validation
}

// ❌ Never call DB directly inside a Server Action — always go through helpers
export async function createWorkoutAction(input: CreateWorkoutInput) {
  await db.insert(workouts).values(input); // wrong — bypass helpers
}
```
