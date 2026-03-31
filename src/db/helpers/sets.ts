import { db } from "@/db";
import { sets } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function addSet(data: {
  workoutExerciseId: string;
  setNumber: number;
  weightKg?: string;
  reps?: number;
  durationSeconds?: number;
}) {
  return db.insert(sets).values(data).returning();
}

export async function updateSet(
  setId: string,
  data: {
    weightKg?: string;
    reps?: number;
    durationSeconds?: number;
  }
) {
  return db.update(sets).set(data).where(eq(sets.id, setId)).returning();
}

export async function deleteSet(setId: string) {
  return db.delete(sets).where(eq(sets.id, setId));
}
