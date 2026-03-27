# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server (http://localhost:3000)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
npx tsx src/db/seed.ts   # Seed database (exercises + dummy workouts)
npx drizzle-kit generate # Generate migration files
npx drizzle-kit push     # Push schema to database
```

## Stack

- **Next.js 16** with App Router
- **React 19**
- **TypeScript**
- **Tailwind CSS v4**
- **Drizzle ORM** with Neon Serverless Postgres
- **Clerk** for authentication

## Project Structure

- `src/app/` — App Router pages and layouts
- `src/app/layout.tsx` — Root layout
- `src/app/page.tsx` — Home page
- `src/app/globals.css` — Global styles (Tailwind entry point)
- `src/db/schema.ts` — Drizzle schema (exercises, workouts, workout_exercises, sets)
- `src/db/index.ts` — Drizzle client (Neon HTTP)
- `src/db/seed.ts` — Seed script with dummy workout data
- `drizzle/` — Generated migration files
- `public/` — Static assets

## Database

- **Provider**: Neon Serverless Postgres (Neon project: `falling-king-14439354`)
- **ORM**: Drizzle ORM
- **All primary keys are UUID** (`gen_random_uuid()`) — never use integer IDs
- **Schema tables**: `exercises`, `workouts`, `workout_exercises`, `sets`
- User IDs come from Clerk (`varchar(255)`) — no separate users table

## Schema Notes

- `exercises` — global exercise library, unique by name
- `workouts` — belongs to a Clerk user via `userId`
- `workout_exercises` — pivot table linking workouts ↔ exercises, has `order` and `notes`
- `sets` — belongs to `workout_exercises`, stores `weightKg`, `reps`, `durationSeconds`
- Cascade deletes: workout deleted → workout_exercises deleted → sets deleted

## Migration Strategy

`drizzle-kit push` does not handle type changes (e.g. integer → uuid). For breaking schema changes, use Neon MCP (`mcp__neon__run_sql_transaction`) to DROP and recreate tables manually, then re-run the seed script.

## UI & Styling Rules

See [`docs/ui.md`](docs/ui.md) for full guidelines. Summary:

- **ALWAYS** use **shadcn/ui** components — never create custom components from scratch
- Add new components via `npx shadcn@latest add <component>`
- **ALWAYS** use **date-fns** for date formatting with the `"do MMM yyyy"` format (e.g. `1st Sep 2025`)
