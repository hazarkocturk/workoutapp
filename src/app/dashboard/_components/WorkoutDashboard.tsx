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

type Workout = {
  id: string;
  title: string | null;
  date: Date;
  exercises: string[];
};

export default function WorkoutDashboard({ workouts }: { workouts: Workout[] }) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [open, setOpen] = useState(false);

  const workoutsForDate = workouts.filter((w) =>
    isSameDay(new Date(w.date), selectedDate)
  );

  return (
    <div className="space-y-8">
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
                  <CardTitle className="text-lg">
                    {workout.title
                      ? `${workout.title} - ${format(new Date(workout.date), "do MMM yyyy")}`
                      : format(new Date(workout.date), "do MMM yyyy")}
                  </CardTitle>
                  <div className="flex items-center gap-1 text-white/40 text-sm">
                    <Clock className="h-3.5 w-3.5" />
                    {workout.exercises.length} egzersiz
                  </div>
                </div>
                <CardDescription className="text-white/40">
                  {format(new Date(workout.date), "do MMM yyyy")}
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
  );
}
