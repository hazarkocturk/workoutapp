"use client";

import { useState } from "react";
import { format, isSameDay } from "date-fns";
import { CalendarIcon, Dumbbell, Clock } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Mock data — gerçek fetch ile değiştirilecek
const mockWorkouts = [
  {
    id: "1",
    name: "Push Day",
    date: new Date(2026, 2, 27), // 27 Mart 2026
    durationMinutes: 55,
    exercises: ["Bench Press", "Overhead Press", "Tricep Pushdown"],
  },
  {
    id: "2",
    name: "Pull Day",
    date: new Date(2026, 2, 25), // 25 Mart 2026
    durationMinutes: 60,
    exercises: ["Pull-up", "Barbell Row", "Face Pull"],
  },
  {
    id: "3",
    name: "Leg Day",
    date: new Date(2026, 2, 27), // 27 Mart 2026 — aynı günde 2. antrenman
    durationMinutes: 70,
    exercises: ["Squat", "Romanian Deadlift", "Leg Press"],
  },
];

export default function DashboardPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [open, setOpen] = useState(false);

  const workoutsForDate = mockWorkouts.filter((w) =>
    isSameDay(w.date, selectedDate)
  );

  return (
    <main className="min-h-screen bg-[#030303] p-6 md:p-10">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white">Antrenmanlar</h1>
          <p className="text-white/40 mt-1">Günlük antrenman geçmişini görüntüle</p>
        </div>

        {/* DatePicker */}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger className="w-full flex items-center gap-2 justify-start bg-white/5 border border-white/10 text-white hover:bg-white/10 h-12 px-4 rounded-md text-sm">
            <CalendarIcon className="h-4 w-4 text-white/40" />
            {format(selectedDate, "do MMM yyyy")}
          </PopoverTrigger>
          <PopoverContent
            className="w-auto p-0 bg-[#111111] border-white/10"
            align="start"
          >
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                if (date) {
                  setSelectedDate(date);
                  setOpen(false);
                }
              }}
              className="text-white"
            />
          </PopoverContent>
        </Popover>

        {/* Workout List */}
        {workoutsForDate.length === 0 ? (
          <div className="text-center py-16 text-white/30">
            <Dumbbell className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p>Bu tarihte antrenman yok.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-white/50 text-sm">
              {workoutsForDate.length} antrenman bulundu
            </p>
            {workoutsForDate.map((workout) => (
              <Card
                key={workout.id}
                className="bg-white/5 border-white/10 text-white"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{workout.name}</CardTitle>
                    <div className="flex items-center gap-1 text-white/40 text-sm">
                      <Clock className="h-3.5 w-3.5" />
                      {workout.durationMinutes} dk
                    </div>
                  </div>
                  <CardDescription className="text-white/40">
                    {format(workout.date, "do MMM yyyy")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {workout.exercises.map((ex) => (
                      <span
                        key={ex}
                        className="text-xs bg-white/10 text-white/70 px-2.5 py-1 rounded-full"
                      >
                        {ex}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
