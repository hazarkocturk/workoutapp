import { config } from 'dotenv';
config({ path: '.env' });

import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle({ client: sql, schema });

const exerciseData = [
  // Göğüs (Chest)
  { name: 'Bench Press', muscleGroup: 'Chest', description: 'Flat barbell bench press' },
  { name: 'Incline Bench Press', muscleGroup: 'Chest', description: 'Incline barbell bench press' },
  { name: 'Dumbbell Fly', muscleGroup: 'Chest', description: 'Flat dumbbell fly' },
  { name: 'Push Up', muscleGroup: 'Chest', description: 'Bodyweight push up' },
  { name: 'Cable Crossover', muscleGroup: 'Chest', description: 'Cable crossover fly' },

  // Sırt (Back)
  { name: 'Deadlift', muscleGroup: 'Back', description: 'Conventional barbell deadlift' },
  { name: 'Pull Up', muscleGroup: 'Back', description: 'Bodyweight pull up' },
  { name: 'Barbell Row', muscleGroup: 'Back', description: 'Bent-over barbell row' },
  { name: 'Lat Pulldown', muscleGroup: 'Back', description: 'Cable lat pulldown' },
  { name: 'Seated Cable Row', muscleGroup: 'Back', description: 'Seated cable row' },
  { name: 'Dumbbell Row', muscleGroup: 'Back', description: 'Single-arm dumbbell row' },

  // Bacak (Legs)
  { name: 'Squat', muscleGroup: 'Legs', description: 'Barbell back squat' },
  { name: 'Leg Press', muscleGroup: 'Legs', description: 'Machine leg press' },
  { name: 'Romanian Deadlift', muscleGroup: 'Legs', description: 'Romanian deadlift for hamstrings' },
  { name: 'Lunge', muscleGroup: 'Legs', description: 'Dumbbell walking lunge' },
  { name: 'Leg Curl', muscleGroup: 'Legs', description: 'Machine hamstring curl' },
  { name: 'Leg Extension', muscleGroup: 'Legs', description: 'Machine quad extension' },
  { name: 'Calf Raise', muscleGroup: 'Legs', description: 'Standing calf raise' },

  // Omuz (Shoulders)
  { name: 'Overhead Press', muscleGroup: 'Shoulders', description: 'Barbell overhead press' },
  { name: 'Dumbbell Lateral Raise', muscleGroup: 'Shoulders', description: 'Dumbbell lateral raise' },
  { name: 'Front Raise', muscleGroup: 'Shoulders', description: 'Dumbbell front raise' },
  { name: 'Face Pull', muscleGroup: 'Shoulders', description: 'Cable face pull for rear delts' },

  // Bicep
  { name: 'Barbell Curl', muscleGroup: 'Biceps', description: 'Standing barbell curl' },
  { name: 'Dumbbell Curl', muscleGroup: 'Biceps', description: 'Alternating dumbbell curl' },
  { name: 'Hammer Curl', muscleGroup: 'Biceps', description: 'Neutral grip dumbbell curl' },
  { name: 'Preacher Curl', muscleGroup: 'Biceps', description: 'EZ bar preacher curl' },

  // Tricep
  { name: 'Tricep Pushdown', muscleGroup: 'Triceps', description: 'Cable tricep pushdown' },
  { name: 'Skull Crusher', muscleGroup: 'Triceps', description: 'EZ bar skull crusher' },
  { name: 'Tricep Dip', muscleGroup: 'Triceps', description: 'Bodyweight or weighted dip' },
  { name: 'Overhead Tricep Extension', muscleGroup: 'Triceps', description: 'Dumbbell overhead tricep extension' },
];

// Clerk'ten alınan gerçek kullanıcı ID'leri
const USER_1 = 'user_3BTyfcv0TYJxsZdJV0UE3RfzxpZ'; // hazarkocturkbxl@gmail.com
const USER_2 = 'user_3BTwvpmq6PV9IWAnhBkVYhj13IH'; // av.hazarkocturk@gmail.com

function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

async function seedWorkouts(exerciseIds: Record<string, string>) {
  console.log('Seeding workouts...');

  // ── Kullanıcı 1: Push/Pull/Legs split, son 3 hafta ──────────────────────────

  // Workout 1: Chest + Triceps (18 gün önce)
  const [w1] = await db.insert(schema.workouts)
    .values({ userId: USER_1, title: 'Push A', date: daysAgo(18) })
    .returning();

  const [we1a] = await db.insert(schema.workoutExercises)
    .values({ workoutId: w1.id, exerciseId: exerciseIds['Bench Press'], order: 1 })
    .returning();
  await db.insert(schema.sets).values([
    { workoutExerciseId: we1a.id, setNumber: 1, weightKg: '80', reps: 8 },
    { workoutExerciseId: we1a.id, setNumber: 2, weightKg: '80', reps: 7 },
    { workoutExerciseId: we1a.id, setNumber: 3, weightKg: '75', reps: 8 },
  ]);

  const [we1b] = await db.insert(schema.workoutExercises)
    .values({ workoutId: w1.id, exerciseId: exerciseIds['Incline Bench Press'], order: 2 })
    .returning();
  await db.insert(schema.sets).values([
    { workoutExerciseId: we1b.id, setNumber: 1, weightKg: '60', reps: 10 },
    { workoutExerciseId: we1b.id, setNumber: 2, weightKg: '60', reps: 9 },
    { workoutExerciseId: we1b.id, setNumber: 3, weightKg: '60', reps: 8 },
  ]);

  const [we1c] = await db.insert(schema.workoutExercises)
    .values({ workoutId: w1.id, exerciseId: exerciseIds['Tricep Pushdown'], order: 3 })
    .returning();
  await db.insert(schema.sets).values([
    { workoutExerciseId: we1c.id, setNumber: 1, weightKg: '35', reps: 12 },
    { workoutExerciseId: we1c.id, setNumber: 2, weightKg: '35', reps: 11 },
    { workoutExerciseId: we1c.id, setNumber: 3, weightKg: '32.5', reps: 12 },
  ]);

  // Workout 2: Back + Biceps (15 gün önce)
  const [w2] = await db.insert(schema.workouts)
    .values({ userId: USER_1, title: 'Pull A', date: daysAgo(15) })
    .returning();

  const [we2a] = await db.insert(schema.workoutExercises)
    .values({ workoutId: w2.id, exerciseId: exerciseIds['Deadlift'], order: 1 })
    .returning();
  await db.insert(schema.sets).values([
    { workoutExerciseId: we2a.id, setNumber: 1, weightKg: '120', reps: 5 },
    { workoutExerciseId: we2a.id, setNumber: 2, weightKg: '120', reps: 5 },
    { workoutExerciseId: we2a.id, setNumber: 3, weightKg: '120', reps: 4 },
  ]);

  const [we2b] = await db.insert(schema.workoutExercises)
    .values({ workoutId: w2.id, exerciseId: exerciseIds['Pull Up'], order: 2 })
    .returning();
  await db.insert(schema.sets).values([
    { workoutExerciseId: we2b.id, setNumber: 1, weightKg: '0', reps: 10 },
    { workoutExerciseId: we2b.id, setNumber: 2, weightKg: '0', reps: 9 },
    { workoutExerciseId: we2b.id, setNumber: 3, weightKg: '0', reps: 8 },
  ]);

  const [we2c] = await db.insert(schema.workoutExercises)
    .values({ workoutId: w2.id, exerciseId: exerciseIds['Barbell Curl'], order: 3 })
    .returning();
  await db.insert(schema.sets).values([
    { workoutExerciseId: we2c.id, setNumber: 1, weightKg: '40', reps: 10 },
    { workoutExerciseId: we2c.id, setNumber: 2, weightKg: '40', reps: 9 },
    { workoutExerciseId: we2c.id, setNumber: 3, weightKg: '37.5', reps: 10 },
  ]);

  // Workout 3: Legs (11 gün önce)
  const [w3] = await db.insert(schema.workouts)
    .values({ userId: USER_1, title: 'Leg Day', date: daysAgo(11) })
    .returning();

  const [we3a] = await db.insert(schema.workoutExercises)
    .values({ workoutId: w3.id, exerciseId: exerciseIds['Squat'], order: 1 })
    .returning();
  await db.insert(schema.sets).values([
    { workoutExerciseId: we3a.id, setNumber: 1, weightKg: '100', reps: 6 },
    { workoutExerciseId: we3a.id, setNumber: 2, weightKg: '100', reps: 6 },
    { workoutExerciseId: we3a.id, setNumber: 3, weightKg: '95', reps: 7 },
  ]);

  const [we3b] = await db.insert(schema.workoutExercises)
    .values({ workoutId: w3.id, exerciseId: exerciseIds['Leg Press'], order: 2 })
    .returning();
  await db.insert(schema.sets).values([
    { workoutExerciseId: we3b.id, setNumber: 1, weightKg: '150', reps: 12 },
    { workoutExerciseId: we3b.id, setNumber: 2, weightKg: '150', reps: 10 },
    { workoutExerciseId: we3b.id, setNumber: 3, weightKg: '140', reps: 12 },
  ]);

  // Workout 4: Shoulders (7 gün önce)
  const [w4] = await db.insert(schema.workouts)
    .values({ userId: USER_1, title: 'Shoulders', date: daysAgo(7) })
    .returning();

  const [we4a] = await db.insert(schema.workoutExercises)
    .values({ workoutId: w4.id, exerciseId: exerciseIds['Overhead Press'], order: 1 })
    .returning();
  await db.insert(schema.sets).values([
    { workoutExerciseId: we4a.id, setNumber: 1, weightKg: '60', reps: 8 },
    { workoutExerciseId: we4a.id, setNumber: 2, weightKg: '60', reps: 7 },
    { workoutExerciseId: we4a.id, setNumber: 3, weightKg: '57.5', reps: 8 },
  ]);

  const [we4b] = await db.insert(schema.workoutExercises)
    .values({ workoutId: w4.id, exerciseId: exerciseIds['Dumbbell Lateral Raise'], order: 2 })
    .returning();
  await db.insert(schema.sets).values([
    { workoutExerciseId: we4b.id, setNumber: 1, weightKg: '14', reps: 15 },
    { workoutExerciseId: we4b.id, setNumber: 2, weightKg: '14', reps: 14 },
    { workoutExerciseId: we4b.id, setNumber: 3, weightKg: '12', reps: 15 },
  ]);

  // Workout 5: Chest + Triceps (3 gün önce)
  const [w5] = await db.insert(schema.workouts)
    .values({ userId: USER_1, title: 'Push B', date: daysAgo(3) })
    .returning();

  const [we5a] = await db.insert(schema.workoutExercises)
    .values({ workoutId: w5.id, exerciseId: exerciseIds['Bench Press'], order: 1 })
    .returning();
  await db.insert(schema.sets).values([
    { workoutExerciseId: we5a.id, setNumber: 1, weightKg: '82.5', reps: 8 },
    { workoutExerciseId: we5a.id, setNumber: 2, weightKg: '82.5', reps: 7 },
    { workoutExerciseId: we5a.id, setNumber: 3, weightKg: '80', reps: 8 },
  ]);

  const [we5b] = await db.insert(schema.workoutExercises)
    .values({ workoutId: w5.id, exerciseId: exerciseIds['Skull Crusher'], order: 2 })
    .returning();
  await db.insert(schema.sets).values([
    { workoutExerciseId: we5b.id, setNumber: 1, weightKg: '30', reps: 10 },
    { workoutExerciseId: we5b.id, setNumber: 2, weightKg: '30', reps: 10 },
    { workoutExerciseId: we5b.id, setNumber: 3, weightKg: '27.5', reps: 11 },
  ]);

  // ── Kullanıcı 2: Full body, son 2 hafta ─────────────────────────────────────

  // Workout 6: Full Body A (13 gün önce)
  const [w6] = await db.insert(schema.workouts)
    .values({ userId: USER_2, title: 'Full Body A', date: daysAgo(13) })
    .returning();

  const [we6a] = await db.insert(schema.workoutExercises)
    .values({ workoutId: w6.id, exerciseId: exerciseIds['Squat'], order: 1 })
    .returning();
  await db.insert(schema.sets).values([
    { workoutExerciseId: we6a.id, setNumber: 1, weightKg: '70', reps: 8 },
    { workoutExerciseId: we6a.id, setNumber: 2, weightKg: '70', reps: 8 },
    { workoutExerciseId: we6a.id, setNumber: 3, weightKg: '70', reps: 7 },
  ]);

  const [we6b] = await db.insert(schema.workoutExercises)
    .values({ workoutId: w6.id, exerciseId: exerciseIds['Bench Press'], order: 2 })
    .returning();
  await db.insert(schema.sets).values([
    { workoutExerciseId: we6b.id, setNumber: 1, weightKg: '55', reps: 10 },
    { workoutExerciseId: we6b.id, setNumber: 2, weightKg: '55', reps: 9 },
    { workoutExerciseId: we6b.id, setNumber: 3, weightKg: '52.5', reps: 10 },
  ]);

  const [we6c] = await db.insert(schema.workoutExercises)
    .values({ workoutId: w6.id, exerciseId: exerciseIds['Barbell Row'], order: 3 })
    .returning();
  await db.insert(schema.sets).values([
    { workoutExerciseId: we6c.id, setNumber: 1, weightKg: '60', reps: 10 },
    { workoutExerciseId: we6c.id, setNumber: 2, weightKg: '60', reps: 9 },
    { workoutExerciseId: we6c.id, setNumber: 3, weightKg: '60', reps: 9 },
  ]);

  // Workout 7: Full Body B (9 gün önce)
  const [w7] = await db.insert(schema.workouts)
    .values({ userId: USER_2, title: 'Full Body B', date: daysAgo(9) })
    .returning();

  const [we7a] = await db.insert(schema.workoutExercises)
    .values({ workoutId: w7.id, exerciseId: exerciseIds['Deadlift'], order: 1 })
    .returning();
  await db.insert(schema.sets).values([
    { workoutExerciseId: we7a.id, setNumber: 1, weightKg: '90', reps: 5 },
    { workoutExerciseId: we7a.id, setNumber: 2, weightKg: '90', reps: 5 },
    { workoutExerciseId: we7a.id, setNumber: 3, weightKg: '90', reps: 5 },
  ]);

  const [we7b] = await db.insert(schema.workoutExercises)
    .values({ workoutId: w7.id, exerciseId: exerciseIds['Overhead Press'], order: 2 })
    .returning();
  await db.insert(schema.sets).values([
    { workoutExerciseId: we7b.id, setNumber: 1, weightKg: '45', reps: 8 },
    { workoutExerciseId: we7b.id, setNumber: 2, weightKg: '45', reps: 8 },
    { workoutExerciseId: we7b.id, setNumber: 3, weightKg: '42.5', reps: 9 },
  ]);

  // Workout 8: Full Body A (5 gün önce)
  const [w8] = await db.insert(schema.workouts)
    .values({ userId: USER_2, title: 'Full Body A', date: daysAgo(5) })
    .returning();

  const [we8a] = await db.insert(schema.workoutExercises)
    .values({ workoutId: w8.id, exerciseId: exerciseIds['Squat'], order: 1 })
    .returning();
  await db.insert(schema.sets).values([
    { workoutExerciseId: we8a.id, setNumber: 1, weightKg: '72.5', reps: 8 },
    { workoutExerciseId: we8a.id, setNumber: 2, weightKg: '72.5', reps: 8 },
    { workoutExerciseId: we8a.id, setNumber: 3, weightKg: '72.5', reps: 7 },
  ]);

  const [we8b] = await db.insert(schema.workoutExercises)
    .values({ workoutId: w8.id, exerciseId: exerciseIds['Lat Pulldown'], order: 2 })
    .returning();
  await db.insert(schema.sets).values([
    { workoutExerciseId: we8b.id, setNumber: 1, weightKg: '55', reps: 12 },
    { workoutExerciseId: we8b.id, setNumber: 2, weightKg: '55', reps: 11 },
    { workoutExerciseId: we8b.id, setNumber: 3, weightKg: '52.5', reps: 12 },
  ]);

  const [we8c] = await db.insert(schema.workoutExercises)
    .values({ workoutId: w8.id, exerciseId: exerciseIds['Dumbbell Curl'], order: 3 })
    .returning();
  await db.insert(schema.sets).values([
    { workoutExerciseId: we8c.id, setNumber: 1, weightKg: '14', reps: 12 },
    { workoutExerciseId: we8c.id, setNumber: 2, weightKg: '14', reps: 11 },
    { workoutExerciseId: we8c.id, setNumber: 3, weightKg: '12', reps: 12 },
  ]);

  console.log('✓ 8 workout, egzersiz ve set seeded.');
}

async function seed() {
  console.log('Seeding exercises...');
  await db.insert(schema.exercises).values(exerciseData).onConflictDoNothing();
  console.log(`✓ ${exerciseData.length} exercises seeded.`);

  // Mevcut exercise ID'lerini çek
  const allExercises = await db.select().from(schema.exercises);
  const exerciseIds: Record<string, string> = {};
  for (const ex of allExercises) {
    exerciseIds[ex.name] = ex.id;
  }

  await seedWorkouts(exerciseIds);
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
