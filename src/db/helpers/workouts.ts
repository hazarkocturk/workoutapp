import { db } from "@/db";
import { workouts, workoutExercises, exercises } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export async function createWorkout(data: {
  title: string;
  date: Date;
  userId: string;
}) {
  return db.insert(workouts).values(data).returning();
}

export async function deleteWorkout(workoutId: string, userId: string) {
  return db
    .delete(workouts)
    .where(and(eq(workouts.id, workoutId), eq(workouts.userId, userId)));
}

export async function getWorkoutsByUser(userId: string) {
  const rows = await db
    .select({
      workoutId: workouts.id,
      workoutTitle: workouts.title,
      workoutDate: workouts.date,
      exerciseName: exercises.name,
      exerciseOrder: workoutExercises.order,
    })
    .from(workouts)
    .leftJoin(workoutExercises, eq(workoutExercises.workoutId, workouts.id))
    .leftJoin(exercises, eq(exercises.id, workoutExercises.exerciseId))
    .where(eq(workouts.userId, userId))
    .orderBy(workouts.date, workoutExercises.order);

  // Satırları workout başına grupla
  const map = new Map<
    string,
    { id: string; title: string | null; date: Date; exercises: string[] }
  >();

  for (const row of rows) {
    if (!map.has(row.workoutId)) {
      map.set(row.workoutId, {
        id: row.workoutId,
        title: row.workoutTitle,
        date: row.workoutDate,
        exercises: [],
      });
    }
    if (row.exerciseName) {
      map.get(row.workoutId)!.exercises.push(row.exerciseName);
    }
  }

  return Array.from(map.values());
}

