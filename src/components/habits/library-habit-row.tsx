import { formatDateKey } from "@/src/lib/date";
import type { Habit } from "@/src/lib/types";
import { HeatmapGrid } from "@/src/components/habits/heatmap-grid";

type Props = {
  habit: Habit;
  completedDates: Set<string>;
  grid: string[][];
  onDelete: (habitId: number) => Promise<void>;
  onEdit: (habit: Habit) => void;
};

function formatSchedule(habit: Habit) {
  if (habit.scheduleType === "daily") {
    return "DAILY";
  }

  return habit.scheduleDays
    .split(",")
    .filter(Boolean)
    .map((day) => day.slice(0, 1).toUpperCase())
    .join(" · ");
}

export function LibraryHabitRow({ habit, completedDates, grid, onDelete, onEdit }: Props) {
  return (
    <article className="library-row">
      <div className="library-row__header">
        <div className="library-row__summary">
          <div className="library-row__title-row">
            <p className="library-row__name">{habit.name.toUpperCase()}</p>
            <div className="library-row__actions">
              <button className="row-action-button" type="button" onClick={() => onEdit(habit)}>
                Edit
              </button>
              <button
                className="row-action-button row-action-button--danger"
                type="button"
                onClick={() => void onDelete(habit.id)}
              >
                Delete
              </button>
            </div>
          </div>
          <span className="schedule-chip">{formatSchedule(habit)}</span>
        </div>
      </div>
      <HeatmapGrid completedDates={completedDates} grid={grid} today={formatDateKey(new Date())} />
    </article>
  );
}
