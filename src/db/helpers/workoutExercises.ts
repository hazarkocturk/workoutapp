import { db } from "@/db";
import { workoutExercises, exercises, sets } from "@/db/schema";
import { eq, asc } from "drizzle-orm";

export type SetRow = {
  id: string;
  setNumber: number;
  weightKg: string | null;
  reps: number | null;
  durationSeconds: number | null;
};

export type WorkoutExerciseRow = {
  id: string;
  exerciseId: string;
  exerciseName: string;
  order: number | null;
  notes: string | null;
  sets: SetRow[];
};

export async function getWorkoutWithExercisesAndSets(workoutId: string): Promise<WorkoutExerciseRow[]> {
  const rows = await db
    .select({
      weId: workoutExercises.id,
      exerciseId: exercises.id,
      exerciseName: exercises.name,
      order: workoutExercises.order,
      notes: workoutExercises.notes,
      setId: sets.id,
      setNumber: sets.setNumber,
      weightKg: sets.weightKg,
      reps: sets.reps,
      durationSeconds: sets.durationSeconds,
    })
    .from(workoutExercises)
    .innerJoin(exercises, eq(exercises.id, workoutExercises.exerciseId))
    .leftJoin(sets, eq(sets.workoutExerciseId, workoutExercises.id))
    .where(eq(workoutExercises.workoutId, workoutId))
    .orderBy(asc(workoutExercises.order), asc(sets.setNumber));

  const map = new Map<string, WorkoutExerciseRow>();

  for (const row of rows) {
    if (!map.has(row.weId)) {
      map.set(row.weId, {
        id: row.weId,
        exerciseId: row.exerciseId,
        exerciseName: row.exerciseName,
        order: row.order,
        notes: row.notes,
        sets: [],
      });
    }
    if (row.setId) {
      map.get(row.weId)!.sets.push({
        id: row.setId,
        setNumber: row.setNumber!,
        weightKg: row.weightKg,
        reps: row.reps,
        durationSeconds: row.durationSeconds,
      });
    }
  }

  return Array.from(map.values());
}

export async function addExerciseToWorkout(data: {
  workoutId: string;
  exerciseId: string;
  order: number;
}) {
  return db.insert(workoutExercises).values(data).returning();
}

export async function removeExerciseFromWorkout(workoutExerciseId: string) {
  return db.delete(workoutExercises).where(eq(workoutExercises.id, workoutExerciseId));
}
