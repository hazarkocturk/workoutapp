"use client";

import { useState } from "react";
import { Plus, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { createWorkoutAction } from "../actions";

type Props = {
  selectedDate: Date;
};

export default function CreateWorkoutModal({ selectedDate }: Props) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState<Date>(selectedDate);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!title.trim()) {
      setError("Antrenman adı zorunludur");
      return;
    }

    setLoading(true);
    setError(null);

    const result = await createWorkoutAction({
      title,
      date: date.toISOString(),
    });

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      setTitle("");
      setError(null);
      setLoading(false);
      setOpen(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (isOpen) setDate(selectedDate);
      }}
    >
      <DialogTrigger
        render={
          <Button
            variant="outline"
            size="icon"
            className="h-12 w-12 border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-white shrink-0"
          />
        }
      >
        <Plus className="h-5 w-5" />
      </DialogTrigger>
      <DialogContent className="bg-[#111111] border-white/10 text-white">
        <DialogHeader>
          <DialogTitle>Yeni Antrenman</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <Input
            placeholder="Antrenman adı (örn: Sabah Kol)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            className="bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-white/20"
          />
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger
              render={
                <button className="w-full flex items-center gap-2 justify-start bg-white/5 border border-white/10 text-white hover:bg-white/10 h-10 px-3 rounded-md text-sm" />
              }
            >
              <CalendarIcon className="h-4 w-4 text-white/40" />
              {format(date, "do MMM yyyy")}
            </PopoverTrigger>
            <PopoverContent
              className="w-auto p-0 bg-[#111111] border-white/10"
              align="start"
            >
              <Calendar
                mode="single"
                selected={date}
                onSelect={(d) => {
                  if (d) {
                    setDate(d);
                    setCalendarOpen(false);
                  }
                }}
                className="text-white"
              />
            </PopoverContent>
          </Popover>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              onClick={() => setOpen(false)}
              className="text-white/60 hover:text-white hover:bg-white/5"
            >
              İptal
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-white text-black hover:bg-white/90"
            >
              {loading ? "Oluşturuluyor..." : "Oluştur"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
