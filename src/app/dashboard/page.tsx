import { auth } from "@clerk/nextjs/server";
import { getWorkoutsByUser } from "@/db/helpers/workouts";
import { getAllExercises } from "@/db/helpers/exercises";
import WorkoutDashboard from "./_components/WorkoutDashboard";

export default async function DashboardPage() {
  const { userId } = await auth();

  const [allWorkouts, allExercises] = await Promise.all([
    getWorkoutsByUser(userId!),
    getAllExercises(),
  ]);

  return (
    <main className="flex-1 overflow-y-auto bg-[#030303] p-6 md:p-10">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white">Antrenmanlar</h1>
          <p className="text-white/40 mt-1">Günlük antrenman geçmişini görüntüle</p>
        </div>

        <WorkoutDashboard workouts={allWorkouts} allExercises={allExercises} />
      </div>
    </main>
  );
}
