"use client";

import { useState, useCallback } from "react";
import { Dumbbell, Plus, Trash2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  getWorkoutDetailAction,
  addExerciseToWorkoutAction,
  removeExerciseFromWorkoutAction,
  addSetAction,
  deleteSetAction,
  updateSetAction,
} from "../actions";
import type { WorkoutExerciseRow, SetRow } from "@/db/helpers/workoutExercises";

type Exercise = { id: string; name: string };

type Props = {
  workoutId: string;
  allExercises: Exercise[];
};

export default function WorkoutDetailModal({ workoutId, allExercises }: Props) {
  const [open, setOpen] = useState(false);
  const [workoutExercises, setWorkoutExercises] = useState<WorkoutExerciseRow[]>([]);
  const [loading, setLoading] = useState(false);

  // Egzersiz ekleme
  const [exerciseSearch, setExerciseSearch] = useState("");
  const [showExerciseDropdown, setShowExerciseDropdown] = useState(false);

  // Set ekleme — her workout_exercise için ayrı input state
  const [newSetInputs, setNewSetInputs] = useState<
    Record<string, { weightKg: string; reps: string }>
  >({});

  const loadDetail = useCallback(async () => {
    setLoading(true);
    const result = await getWorkoutDetailAction(workoutId);
    if (result.success && result.data) {
      setWorkoutExercises(result.data);
      const inputs: Record<string, { weightKg: string; reps: string }> = {};
      result.data.forEach((we) => {
        inputs[we.id] = { weightKg: "", reps: "" };
      });
      setNewSetInputs(inputs);
    }
    setLoading(false);
  }, [workoutId]);


  async function handleAddExercise(exercise: Exercise) {
    setExerciseSearch("");
    setShowExerciseDropdown(false);
    const result = await addExerciseToWorkoutAction({
      workoutId,
      exerciseId: exercise.id,
      order: workoutExercises.length,
    });
    if (result.success) {
      await loadDetail();
    }
  }

  async function handleRemoveExercise(workoutExerciseId: string) {
    await removeExerciseFromWorkoutAction(workoutExerciseId);
    setWorkoutExercises((prev) => prev.filter((we) => we.id !== workoutExerciseId));
  }

  async function handleAddSet(workoutExerciseId: string) {
    const inputs = newSetInputs[workoutExerciseId];
    if (!inputs?.reps && !inputs?.weightKg) return;

    const we = workoutExercises.find((w) => w.id === workoutExerciseId);
    const nextSetNumber = (we?.sets.length ?? 0) + 1;

    const result = await addSetAction({
      workoutExerciseId,
      setNumber: nextSetNumber,
      weightKg: inputs.weightKg || undefined,
      reps: inputs.reps ? parseInt(inputs.reps) : undefined,
    });

    if (result.success && result.data) {
      setWorkoutExercises((prev) =>
        prev.map((we) =>
          we.id === workoutExerciseId
            ? { ...we, sets: [...we.sets, result.data as SetRow] }
            : we
        )
      );
      setNewSetInputs((prev) => ({
        ...prev,
        [workoutExerciseId]: { weightKg: "", reps: "" },
      }));
    }
  }

  async function handleDeleteSet(workoutExerciseId: string, setId: string) {
    await deleteSetAction(setId);
    setWorkoutExercises((prev) =>
      prev.map((we) =>
        we.id === workoutExerciseId
          ? { ...we, sets: we.sets.filter((s) => s.id !== setId) }
          : we
      )
    );
  }

  async function handleSetFieldChange(
    workoutExerciseId: string,
    setId: string,
    field: "weightKg" | "reps",
    value: string
  ) {
    // TODO(human): Inline set güncelleme için bu fonksiyonu implement et.
    // setWorkoutExercises ile ilgili egzersizin set listesindeki doğru set'i güncelle (optimistic).
    // Ardından updateSetAction'ı çağır: field "reps" ise reps: parseInt(value), "weightKg" ise weightKg: value geç.
    // İpucu: setWorkoutExercises((prev) => prev.map(...)) pattern'ini kullan.
    setWorkoutExercises((prev) =>
      prev.map((we) =>
        we.id === workoutExerciseId
          ? { ...we, sets: we.sets.map((s) => (s.id === setId ? { ...s, [field]: value } : s)) }
          : we
      )
    );
    await updateSetAction({
      setId,
      weightKg: field === "weightKg" ? value : undefined,
      reps: field === "reps" ? parseInt(value) : undefined,
    });
  }

  const filteredExercises = allExercises.filter(
    (e) =>
      e.name.toLowerCase().includes(exerciseSearch.toLowerCase()) &&
      !workoutExercises.find((we) => we.exerciseId === e.id)
  );

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (isOpen) void loadDetail();
      }}
    >
      <DialogTrigger
        render={
          <Button
            variant="ghost"
            size="sm"
            className="text-white/50 hover:text-white hover:bg-white/5 text-xs"
          />
        }
      >
        <Dumbbell className="h-3.5 w-3.5 mr-1" />
        Düzenle
      </DialogTrigger>

      <DialogContent className="bg-[#111111] border-white/10 text-white max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Egzersizler & Setler</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="py-8 text-center text-white/30 text-sm">Yükleniyor...</div>
        ) : (
          <div className="space-y-6 pt-2">

            {/* Egzersiz Listesi */}
            {workoutExercises.length === 0 ? (
              <p className="text-white/30 text-sm text-center py-4">
                Henüz egzersiz eklenmedi.
              </p>
            ) : (
              workoutExercises.map((we) => (
                <div key={we.id} className="space-y-2">
                  {/* Egzersiz Başlığı */}
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{we.exerciseName}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveExercise(we.id)}
                      className="h-6 w-6 text-white/30 hover:text-red-400 hover:bg-transparent"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>

                  {/* Set Listesi */}
                  {we.sets.length > 0 && (
                    <div className="space-y-1">
                      <div className="grid grid-cols-[2rem_1fr_1fr_2rem] gap-2 text-xs text-white/30 px-1">
                        <span>#</span>
                        <span>Ağırlık (kg)</span>
                        <span>Tekrar</span>
                        <span />
                      </div>
                      {we.sets.map((s) => (
                        <div
                          key={s.id}
                          className="grid grid-cols-[2rem_1fr_1fr_2rem] gap-2 items-center"
                        >
                          <span className="text-xs text-white/40 pl-1">{s.setNumber}</span>
                          <Input
                            type="number"
                            defaultValue={s.weightKg ?? ""}
                            onBlur={(e) =>
                              handleSetFieldChange(we.id, s.id, "weightKg", e.target.value)
                            }
                            placeholder="—"
                            className="h-7 text-xs bg-white/5 border-white/10 text-white"
                          />
                          <Input
                            type="number"
                            defaultValue={s.reps ?? ""}
                            onBlur={(e) =>
                              handleSetFieldChange(we.id, s.id, "reps", e.target.value)
                            }
                            placeholder="—"
                            className="h-7 text-xs bg-white/5 border-white/10 text-white"
                          />
                          <button
                            onClick={() => handleDeleteSet(we.id, s.id)}
                            className="text-white/20 hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Yeni Set Ekle */}
                  <div className="grid grid-cols-[1fr_1fr_auto] gap-2 pt-1">
                    <Input
                      type="number"
                      placeholder="kg"
                      value={newSetInputs[we.id]?.weightKg ?? ""}
                      onChange={(e) =>
                        setNewSetInputs((prev) => ({
                          ...prev,
                          [we.id]: { ...prev[we.id], weightKg: e.target.value },
                        }))
                      }
                      className="h-7 text-xs bg-white/5 border-white/10 text-white placeholder:text-white/20"
                    />
                    <Input
                      type="number"
                      placeholder="tekrar"
                      value={newSetInputs[we.id]?.reps ?? ""}
                      onChange={(e) =>
                        setNewSetInputs((prev) => ({
                          ...prev,
                          [we.id]: { ...prev[we.id], reps: e.target.value },
                        }))
                      }
                      onKeyDown={(e) => e.key === "Enter" && handleAddSet(we.id)}
                      className="h-7 text-xs bg-white/5 border-white/10 text-white placeholder:text-white/20"
                    />
                    <Button
                      size="icon"
                      onClick={() => handleAddSet(we.id)}
                      className="h-7 w-7 bg-white/10 hover:bg-white/20 text-white"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </Button>
                  </div>

                  <div className="border-b border-white/5" />
                </div>
              ))
            )}

            {/* Egzersiz Ekle */}
            <div className="relative">
              <button
                onClick={() => setShowExerciseDropdown((v) => !v)}
                className="w-full flex items-center justify-between gap-2 bg-white/5 border border-dashed border-white/10 hover:border-white/20 text-white/40 hover:text-white/60 h-9 px-3 rounded-md text-sm transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Egzersiz ekle
                </span>
                <ChevronDown className="h-4 w-4" />
              </button>

              {showExerciseDropdown && (
                <div className="absolute top-full mt-1 w-full z-10 bg-[#1a1a1a] border border-white/10 rounded-md shadow-xl overflow-hidden">
                  <div className="p-2">
                    <Input
                      autoFocus
                      placeholder="Ara..."
                      value={exerciseSearch}
                      onChange={(e) => setExerciseSearch(e.target.value)}
                      className="h-7 text-xs bg-white/5 border-white/10 text-white placeholder:text-white/30"
                    />
                  </div>
                  <div className="max-h-48 overflow-y-auto">
                    {filteredExercises.length === 0 ? (
                      <p className="text-white/30 text-xs text-center py-4">
                        Egzersiz bulunamadı.
                      </p>
                    ) : (
                      filteredExercises.map((ex) => (
                        <button
                          key={ex.id}
                          onClick={() => handleAddExercise(ex)}
                          className="w-full text-left px-3 py-2 text-sm text-white/70 hover:bg-white/5 hover:text-white transition-colors"
                        >
                          {ex.name}
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
