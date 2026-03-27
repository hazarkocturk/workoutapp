import {
  integer,
  pgTable,
  varchar,
  text,
  numeric,
  timestamp,
  index,
  uuid,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ─── EXERCISES (Global Kütüphane) ─────────────────────────────────────────────

export const exercises = pgTable("exercises", {
  id: uuid().primaryKey().defaultRandom(),
  name: varchar({ length: 255 }).notNull().unique(),
  description: text(),
  muscleGroup: varchar("muscle_group", { length: 100 }),
  createdByUserId: varchar("created_by_user_id", { length: 255 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ─── WORKOUTS ─────────────────────────────────────────────────────────────────

export const workouts = pgTable(
  "workouts",
  {
    id: uuid().primaryKey().defaultRandom(),
    userId: varchar("user_id", { length: 255 }).notNull(),
    date: timestamp().notNull().defaultNow(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [index("workouts_user_id_idx").on(table.userId)]
);

// ─── WORKOUT_EXERCISES (Pivot) ────────────────────────────────────────────────

export const workoutExercises = pgTable(
  "workout_exercises",
  {
    id: uuid().primaryKey().defaultRandom(),
    workoutId: uuid("workout_id")
      .notNull()
      .references(() => workouts.id, { onDelete: "cascade" }),
    exerciseId: uuid("exercise_id")
      .notNull()
      .references(() => exercises.id),
    order: integer(),
    notes: text(),
  },
  (table) => [
    index("we_workout_id_idx").on(table.workoutId),
    index("we_exercise_id_idx").on(table.exerciseId),
  ]
);

// ─── SETS ─────────────────────────────────────────────────────────────────────

export const sets = pgTable("sets", {
  id: uuid().primaryKey().defaultRandom(),
  workoutExerciseId: uuid("workout_exercise_id")
    .notNull()
    .references(() => workoutExercises.id, { onDelete: "cascade" }),
  setNumber: integer("set_number").notNull(),
  weightKg: numeric("weight_kg", { precision: 6, scale: 2 }),
  reps: integer(),
  durationSeconds: integer("duration_seconds"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ─── RELATIONS ────────────────────────────────────────────────────────────────

export const exercisesRelations = relations(exercises, ({ many }) => ({
  workoutExercises: many(workoutExercises),
}));

export const workoutsRelations = relations(workouts, ({ many }) => ({
  workoutExercises: many(workoutExercises),
}));

export const workoutExercisesRelations = relations(
  workoutExercises,
  ({ one, many }) => ({
    workout: one(workouts, {
      fields: [workoutExercises.workoutId],
      references: [workouts.id],
    }),
    exercise: one(exercises, {
      fields: [workoutExercises.exerciseId],
      references: [exercises.id],
    }),
    sets: many(sets),
  })
);

export const setsRelations = relations(sets, ({ one }) => ({
  workoutExercise: one(workoutExercises, {
    fields: [sets.workoutExerciseId],
    references: [workoutExercises.id],
  }),
}));
