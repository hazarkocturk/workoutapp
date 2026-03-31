"use server";

import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { createWorkout, deleteWorkout } from "@/db/helpers/workouts";
import {
  addExerciseToWorkout,
  removeExerciseFromWorkout,
  getWorkoutWithExercisesAndSets,
} from "@/db/helpers/workoutExercises";
import { addSet, updateSet, deleteSet } from "@/db/helpers/sets";

const CreateWorkoutSchema = z.object({
  title: z.string().min(1, "Antrenman adı zorunludur"),
  date: z.string().datetime(),
});

const DeleteWorkOutSchema = z.object({
  workoutId: z.string().uuid()
})

type CreateWorkoutInput = z.infer<typeof CreateWorkoutSchema>;

export async function createWorkoutAction(input: CreateWorkoutInput) {
  const { userId } = await auth();
  if (!userId) return { error: "Yetkisiz erişim" };

  const parsed = CreateWorkoutSchema.safeParse(input);
  if (!parsed.success) return { error: "Geçersiz veri" };

  await createWorkout({
    title: parsed.data.title,
    date: new Date(parsed.data.date),
    userId,
  });

  revalidatePath("/dashboard");
  return { success: true };
}

export async function deleteWorkoutAction(workoutId: string) {
  const { userId } = await auth();
  if (!userId) return { error: "Yetkisiz erişim" };

  const parsed = DeleteWorkOutSchema.safeParse({workoutId});
  if(!parsed.success) return {error: "Gecersiz veri"}

  await deleteWorkout(parsed.data.workoutId, userId);
  revalidatePath("/dashboard");
  return { success: true };
}

// ─── WORKOUT DETAIL ────────────────────────────────────────────────────────────

export async function getWorkoutDetailAction(workoutId: string) {
  const { userId } = await auth();
  if (!userId) return { error: "Yetkisiz erişim" };

  const data = await getWorkoutWithExercisesAndSets(workoutId);
  return { success: true, data };
}

// ─── EXERCISE ─────────────────────────────────────────────────────────────────

const AddExerciseSchema = z.object({
  workoutId: z.string().uuid(),
  exerciseId: z.string().uuid(),
  order: z.number().int().min(0),
});

export async function addExerciseToWorkoutAction(
  input: z.infer<typeof AddExerciseSchema>
) {
  const { userId } = await auth();
  if (!userId) return { error: "Yetkisiz erişim" };

  const parsed = AddExerciseSchema.safeParse(input);
  if (!parsed.success) return { error: "Geçersiz veri" };

  const result = await addExerciseToWorkout(parsed.data);
  revalidatePath("/dashboard");
  return { success: true, data: result[0] };
}

export async function removeExerciseFromWorkoutAction(workoutExerciseId: string) {
  const { userId } = await auth();
  if (!userId) return { error: "Yetkisiz erişim" };

  await removeExerciseFromWorkout(workoutExerciseId);
  revalidatePath("/dashboard");
  return { success: true };
}

// ─── SETS ─────────────────────────────────────────────────────────────────────

const AddSetSchema = z.object({
  workoutExerciseId: z.string().uuid(),
  setNumber: z.number().int().min(1),
  weightKg: z.string().optional(),
  reps: z.number().int().min(0).optional(),
  durationSeconds: z.number().int().min(0).optional(),
});

export async function addSetAction(input: z.infer<typeof AddSetSchema>) {
  const { userId } = await auth();
  if (!userId) return { error: "Yetkisiz erişim" };

  const parsed = AddSetSchema.safeParse(input);
  if (!parsed.success) return { error: "Geçersiz veri" };

  const result = await addSet(parsed.data);
  return { success: true, data: result[0] };
}

const UpdateSetSchema = z.object({
  setId: z.string().uuid(),
  weightKg: z.string().optional(),
  reps: z.number().int().min(0).optional(),
  durationSeconds: z.number().int().min(0).optional(),
});

export async function updateSetAction(input: z.infer<typeof UpdateSetSchema>) {
  const { userId } = await auth();
  if (!userId) return { error: "Yetkisiz erişim" };

  const parsed = UpdateSetSchema.safeParse(input);
  if (!parsed.success) return { error: "Geçersiz veri" };

  const { setId, ...data } = parsed.data;
  const result = await updateSet(setId, data);
  return { success: true, data: result[0] };
}

export async function deleteSetAction(setId: string) {
  const { userId } = await auth();
  if (!userId) return { error: "Yetkisiz erişim" };

  await deleteSet(setId);
  return { success: true };
}
