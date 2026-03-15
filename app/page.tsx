"use client";

import { useMemo, useState } from "react";
import { DailyQuote } from "@/src/components/home/daily-quote";
import { DateHeader } from "@/src/components/home/date-header";
import { ProgressSummary } from "@/src/components/home/progress-summary";
import { TodayHabitRow } from "@/src/components/home/today-habit-row";
import { HabitDialog } from "@/src/components/habits/habit-dialog";
import { useTodayHabits } from "@/src/hooks/useTodayHabits";
import type { HabitWithStreak } from "@/src/lib/types";

export default function TodayPage() {
  const { habits, loading, createHabit, updateHabit, toggleHabit } = useTodayHabits();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<HabitWithStreak | null>(null);

  const completedCount = useMemo(
    () => habits.filter((habit) => habit.completedToday).length,
    [habits],
  );

  async function handleSave(values: {
    name: string;
    scheduleType: "daily" | "custom";
    scheduleDays: ("Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun")[];
  }) {
    if (editingHabit) {
      await updateHabit(editingHabit.id, values);
    } else {
      await createHabit(values);
    }

    setEditingHabit(null);
    setIsDialogOpen(false);
  }

  function handleEdit(habit: HabitWithStreak) {
    setEditingHabit(habit);
    setIsDialogOpen(true);
  }

  return (
    <div className="page">
      <DateHeader />
      <DailyQuote />
      <ProgressSummary completed={completedCount} total={habits.length} />
      <div className="page-intro">
        <span className="section-label">Habits</span>
      </div>

      {loading ? (
        <section className="empty-state">
          <p className="empty-state__title">Loading</p>
          <p className="empty-copy">Reading your local habit data.</p>
        </section>
      ) : habits.length === 0 ? (
        <section className="empty-state">
          <div className="dot-grid" aria-hidden="true">
            {Array.from({ length: 48 }, (_, index) => (
              <span key={index} />
            ))}
          </div>
          <p className="empty-state__title">No habits yet</p>
          <p className="empty-copy">Create your first ritual to start tracking today.</p>
        </section>
      ) : (
        <section className="list">
          {habits.map((habit) => (
            <TodayHabitRow
              key={habit.id}
              habit={habit}
              onEdit={handleEdit}
              onToggle={toggleHabit}
            />
          ))}
        </section>
      )}

      <button
        aria-label="Add habit"
        className="floating-button"
        type="button"
        onClick={() => {
          setEditingHabit(null);
          setIsDialogOpen(true);
        }}
      >
        +
      </button>

      <HabitDialog
        habit={editingHabit}
        isOpen={isDialogOpen}
        onClose={() => {
          setEditingHabit(null);
          setIsDialogOpen(false);
        }}
        onSave={handleSave}
      />
    </div>
  );
}
