"use client";

import { useState } from "react";
import { HabitDialog } from "@/src/components/habits/habit-dialog";
import { LibraryHabitRow } from "@/src/components/habits/library-habit-row";
import { useHabitsLibrary } from "@/src/hooks/useHabitsLibrary";
import type { Habit } from "@/src/lib/types";

export default function HabitsPage() {
  const { habits, completionMap, grid, loading, createHabit, updateHabit, removeHabit } =
    useHabitsLibrary();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

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

  return (
    <div className="page">
      <header className="page-intro">
        <span className="section-label">Collection</span>
        <h1 className="page-title">Habits</h1>
        <p className="page-copy">
          See every ritual in one place, edit the schedule, and scan your recent completion
          history.
        </p>
      </header>

      {loading ? (
        <section className="empty-state">
          <p className="empty-state__title">Loading</p>
          <p className="empty-copy">Rebuilding your habit library.</p>
        </section>
      ) : habits.length === 0 ? (
        <section className="empty-state">
          <p className="empty-state__title">No habits yet</p>
          <p className="empty-copy">Add a habit to start building a streak map.</p>
        </section>
      ) : (
        <section className="list">
          {habits.map((habit) => (
            <LibraryHabitRow
              key={habit.id}
              habit={habit}
              completedDates={completionMap.get(habit.id) ?? new Set<string>()}
              grid={grid}
              onDelete={removeHabit}
              onEdit={(nextHabit) => {
                setEditingHabit(nextHabit);
                setIsDialogOpen(true);
              }}
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
